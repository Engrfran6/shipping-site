-- ============================================
-- Function: Generate unique tracking numbers
-- ============================================
create or replace function public.generate_tracking_number()
returns text
language plpgsql
as $$
declare
  tracking_num text;
  exists_check boolean;
begin
  loop
    -- Generate a tracking number: 2 letters + 8 digits + 2 letters
    tracking_num := 
      chr(65 + floor(random() * 26)::int) ||
      chr(65 + floor(random() * 26)::int) ||
      lpad(floor(random() * 100000000)::text, 8, '0') ||
      chr(65 + floor(random() * 26)::int) ||
      chr(65 + floor(random() * 26)::int);

    -- Check uniqueness
    select exists(select 1 from public.shipments where tracking_number = tracking_num)
    into exists_check;

    exit when not exists_check;
  end loop;

  return tracking_num;
end;
$$;

-- ============================================
-- Function: Calculate shipping cost
-- ============================================
create or replace function public.calculate_shipping_cost(
  p_service_type text,
  p_weight_kg decimal,
  p_length_cm decimal default null,
  p_width_cm decimal default null,
  p_height_cm decimal default null,
  p_declared_value decimal default 0,
  p_signature_required boolean default false,
  p_insurance_required boolean default false
)
returns json
language plpgsql
as $$
declare
  base_cost decimal := 0;
  weight_cost decimal := 0;
  insurance_cost decimal := 0;
  total_cost decimal := 0;
  dimensional_weight decimal := 0;
  billable_weight decimal := 0;
  pricing_rule record;
begin
  select * into pricing_rule
  from public.pricing_rules pr
  where pr.service_type = p_service_type
    and pr.is_active = true
    and p_weight_kg >= pr.min_weight_kg
    and (pr.max_weight_kg is null or p_weight_kg <= pr.max_weight_kg)
  limit 1;

  if pricing_rule is null then
    return json_build_object(
      'error', 'No pricing rule found for this service/weight',
      'total_cost', 0
    );
  end if;

  base_cost := pricing_rule.base_rate;

  if p_length_cm is not null and p_width_cm is not null and p_height_cm is not null then
    dimensional_weight := (p_length_cm * p_width_cm * p_height_cm) * pricing_rule.dimensional_factor;
  end if;

  billable_weight := greatest(p_weight_kg, coalesce(dimensional_weight, 0));
  weight_cost := billable_weight * pricing_rule.per_kg_rate;

  if p_insurance_required and pricing_rule.insurance_available then
    insurance_cost := p_declared_value * pricing_rule.insurance_rate_percent;
  end if;

  total_cost := base_cost + weight_cost + insurance_cost;

  return json_build_object(
    'base_cost', base_cost,
    'weight_cost', weight_cost,
    'insurance_cost', insurance_cost,
    'total_cost', total_cost,
    'billable_weight_kg', billable_weight,
    'estimated_delivery_days', pricing_rule.estimated_delivery_days
  );
end;
$$;

-- ============================================
-- Auto-create initial tracking event
-- ============================================
create or replace function public.add_initial_tracking_event()
returns trigger
language plpgsql
as $$
begin
  insert into public.tracking_events (
    shipment_id,
    event_type,
    event_description,
    location,
    created_by
  )
  values (
    new.id,
    'created',
    'Shipment created',
    concat(new.sender_city, ', ', new.sender_state),
    auth.uid()
  );
  return new;
end;
$$;

drop trigger if exists trg_add_initial_tracking_event on public.shipments;

create trigger trg_add_initial_tracking_event
after insert on public.shipments
for each row
execute function public.add_initial_tracking_event();


-- ============================================
-- Function: Create tracking event (FIXED)
-- ============================================
create or replace function public.create_tracking_event(
  p_shipment_id uuid,
  p_event_type text,
  p_event_description text default null,
  p_location text default null,
  p_payment_amount numeric default null,
  p_payment_methods text[] default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  event_id uuid;
  existing_event record;
  current_status text;
  existing_payment record;
  allowed_transitions jsonb := jsonb_build_object(
    'created',          array['in_transit', 'exception'],
    'in_transit',       array['out_for_delivery', 'exception'],
    'out_for_delivery', array['delivered', 'exception'],
    'delivered',        array[]::text[], -- no new events after delivered
    'exception',        array['in_transit', 'out_for_delivery', 'delivered']
  );
  valid_next text[];
begin
  -- Validate event type
  if p_event_type not in ('created','in_transit','out_for_delivery','delivered','exception') then
    raise exception 'Invalid event_type for shipment status: %', p_event_type;
  end if;

  -- Get current shipment status
  select status into current_status
  from public.shipments
  where id = p_shipment_id;

  if current_status is null then
    raise exception 'Shipment not found for ID: %', p_shipment_id;
  end if;

  -- Check if event already exists
  select * into existing_event
  from public.tracking_events
  where shipment_id = p_shipment_id
    and event_type = p_event_type
  limit 1;

  -- If event exists → update it
  if existing_event.id is not null then
    update public.tracking_events
    set 
      event_description = coalesce(p_event_description, existing_event.event_description),
      location = coalesce(p_location, existing_event.location)
    where id = existing_event.id
    returning id into event_id;

  else
    -- Validate transitions for new events
    valid_next := array(select jsonb_array_elements_text(allowed_transitions -> current_status));

    if p_event_type <> 'exception' and not (p_event_type = any(valid_next)) then
      raise exception 
        'Invalid status transition: cannot move from "%" to "%"', 
        current_status, p_event_type;
    end if;

    -- Insert new event
    insert into public.tracking_events (
      shipment_id, event_type, event_description, location, created_by
    )
    values (
      p_shipment_id, p_event_type, p_event_description, p_location, auth.uid()
    )
    returning id into event_id;
  end if;

  -- ==============================
  -- Handle payments properly
  -- ==============================
  if p_payment_amount is not null and p_payment_methods is not null then
    -- Check if payment already exists for this event
    select * into existing_payment
    from public.tracking_event_payments
    where tracking_event_id = event_id
    limit 1;

    if existing_payment.id is not null then
      -- Update existing record: merge arrays and update amount
      update public.tracking_event_payments
      set 
        amount = p_payment_amount,
        payment_method = (
          select array_agg(distinct e)
          from unnest(existing_payment.payment_method || p_payment_methods) as e
        )
      where id = existing_payment.id;

    else
      -- Create new payment row
      insert into public.tracking_event_payments (
        tracking_event_id, amount, payment_method
      )
      values (
        event_id, p_payment_amount, p_payment_methods
      );
    end if;
  end if;

  -- ==============================
  -- Update shipment status
  -- ==============================
  if p_event_type = 'exception' then
    update public.shipments
    set status = 'exception',
        updated_at = timezone('utc', now())
    where id = p_shipment_id;

  elsif current_status = 'exception' and p_event_type in ('in_transit', 'out_for_delivery', 'delivered') then
    update public.shipments
    set status = p_event_type,
        updated_at = timezone('utc', now())
    where id = p_shipment_id;

  elsif p_event_type <> current_status then
    update public.shipments
    set status = p_event_type,
        updated_at = timezone('utc', now())
    where id = p_shipment_id;
  end if;

  return event_id;
end;
$$;






-- -- ============================================
-- -- Function: Generate unique tracking numbers
-- -- ============================================
-- create or replace function public.generate_tracking_number()
-- returns text
-- language plpgsql
-- as $$
-- declare
--   tracking_num text;
--   exists_check boolean;
-- begin
--   loop
--     -- Generate a tracking number: 2 letters + 8 digits + 2 letters
--     tracking_num := 
--       chr(65 + floor(random() * 26)::int) ||
--       chr(65 + floor(random() * 26)::int) ||
--       lpad(floor(random() * 100000000)::text, 8, '0') ||
--       chr(65 + floor(random() * 26)::int) ||
--       chr(65 + floor(random() * 26)::int);

--     -- Check uniqueness
--     select exists(select 1 from public.shipments where tracking_number = tracking_num)
--     into exists_check;

--     exit when not exists_check;
--   end loop;

--   return tracking_num;
-- end;
-- $$;

-- -- ============================================
-- -- Function: Calculate shipping cost
-- -- ============================================
-- create or replace function public.calculate_shipping_cost(
--   p_service_type text,
--   p_weight_kg decimal,
--   p_length_cm decimal default null,
--   p_width_cm decimal default null,
--   p_height_cm decimal default null,
--   p_declared_value decimal default 0,
--   p_signature_required boolean default false,
--   p_insurance_required boolean default false
-- )
-- returns json
-- language plpgsql
-- as $$
-- declare
--   base_cost decimal := 0;
--   weight_cost decimal := 0;
--   insurance_cost decimal := 0;
--   total_cost decimal := 0;
--   dimensional_weight decimal := 0;
--   billable_weight decimal := 0;
--   pricing_rule record;
-- begin
--   select * into pricing_rule
--   from public.pricing_rules pr
--   where pr.service_type = p_service_type
--     and pr.is_active = true
--     and p_weight_kg >= pr.min_weight_kg
--     and (pr.max_weight_kg is null or p_weight_kg <= pr.max_weight_kg)
--   limit 1;

--   if pricing_rule is null then
--     return json_build_object(
--       'error', 'No pricing rule found for this service/weight',
--       'total_cost', 0
--     );
--   end if;

--   base_cost := pricing_rule.base_rate;

--   if p_length_cm is not null and p_width_cm is not null and p_height_cm is not null then
--     dimensional_weight := (p_length_cm * p_width_cm * p_height_cm) * pricing_rule.dimensional_factor;
--   end if;

--   billable_weight := greatest(p_weight_kg, coalesce(dimensional_weight, 0));
--   weight_cost := billable_weight * pricing_rule.per_kg_rate;

--   if p_insurance_required and pricing_rule.insurance_available then
--     insurance_cost := p_declared_value * pricing_rule.insurance_rate_percent;
--   end if;

--   total_cost := base_cost + weight_cost + insurance_cost;

--   return json_build_object(
--     'base_cost', base_cost,
--     'weight_cost', weight_cost,
--     'insurance_cost', insurance_cost,
--     'total_cost', total_cost,
--     'billable_weight_kg', billable_weight,
--     'estimated_delivery_days', pricing_rule.estimated_delivery_days
--   );
-- end;
-- $$;



-- -- Auto-create tracking event after a new shipment is inserted
-- create or replace function public.add_initial_tracking_event()
-- returns trigger
-- language plpgsql
-- as $$
-- begin
--   insert into public.tracking_events (
--     shipment_id,
--     event_type,
--     event_description,
--     location,
--     created_by
--   )
--   values (
--     new.id,
--     'created',
--     'Shipment created',
--     concat(new.sender_city, ', ', new.sender_state),
--     auth.uid()
--   );
--   return new;
-- end;
-- $$;

-- drop trigger if exists trg_add_initial_tracking_event on public.shipments;

-- create trigger trg_add_initial_tracking_event
-- after insert on public.shipments
-- for each row
-- execute function public.add_initial_tracking_event();



-- -- ============================================
-- -- Function: Create tracking event
-- -- ============================================
-- create or replace function public.create_tracking_event(
--   p_shipment_id uuid,
--   p_event_type text,
--   p_event_description text default null,
--   p_location text default null
-- )
-- returns uuid
-- language plpgsql
-- security definer
-- set search_path = public
-- as $$
-- declare
--   event_id uuid;
--   existing_event record;
--   current_status text;
--   allowed_transitions jsonb := jsonb_build_object(
--     'created',          array['in_transit', 'exception'],
--     'in_transit',       array['out_for_delivery', 'exception'],
--     'out_for_delivery', array['delivered', 'exception'],
--     'delivered',        array[]::text[], -- no new events after delivered
--     'exception',        array['in_transit', 'out_for_delivery', 'delivered'] -- resume after exception
--   );
--   valid_next text[];
-- begin
--   -- ✅ Validate event type
--   if p_event_type not in ('created','in_transit','out_for_delivery','delivered','exception') then
--     raise exception 'Invalid event_type for shipment status: %', p_event_type;
--   end if;

--   -- ✅ Get current shipment status
--   select status into current_status
--   from public.shipments
--   where id = p_shipment_id;

--   if current_status is null then
--     raise exception 'Shipment not found for ID: %', p_shipment_id;
--   end if;

--   -- ✅ If shipment is delivered — only allow updates, no new inserts
--   if current_status = 'delivered' then
--     select * into existing_event
--     from public.tracking_events
--     where shipment_id = p_shipment_id
--       and event_type = p_event_type
--     limit 1;

--     if existing_event.id is not null then
--       update public.tracking_events
--       set 
--         event_description = coalesce(p_event_description, existing_event.event_description),
--         location = coalesce(p_location, existing_event.location)
--       where id = existing_event.id
--       returning id into event_id;

--       return event_id;
--     else
--       raise exception 'Shipment already delivered — no new events can be added.';
--     end if;
--   end if;

--   -- ✅ Check if event already exists
--   select * into existing_event
--   from public.tracking_events
--   where shipment_id = p_shipment_id
--     and event_type = p_event_type
--   limit 1;

--   -- ✅ If event exists → update it (skip transition validation)
--   if existing_event.id is not null then
--     update public.tracking_events
--     set 
--       event_description = coalesce(p_event_description, existing_event.event_description),
--       location = coalesce(p_location, existing_event.location)
--     where id = existing_event.id
--     returning id into event_id;

--   else
--     -- ✅ Only validate transitions when inserting new events
--     valid_next := array(select jsonb_array_elements_text(allowed_transitions -> current_status));

--     if p_event_type <> 'exception' and not (p_event_type = any(valid_next)) then
--       raise exception 
--         'Invalid status transition: cannot move from "%" to "%"', 
--         current_status, p_event_type;
--     end if;

--     insert into public.tracking_events (
--       shipment_id, event_type, event_description, location, created_by
--     )
--     values (
--       p_shipment_id, p_event_type, p_event_description, p_location, auth.uid()
--     )
--     returning id into event_id;
--   end if;

--   -- ✅ Update shipment status if necessary
--   if p_event_type = 'exception' then
--     -- always set status to exception
--     update public.shipments
--     set status = 'exception',
--         updated_at = timezone('utc'::text, now())
--     where id = p_shipment_id;
--   elsif current_status = 'exception' and p_event_type in ('in_transit', 'out_for_delivery', 'delivered') then
--     -- recover from exception
--     update public.shipments
--     set status = p_event_type,
--         updated_at = timezone('utc'::text, now())
--     where id = p_shipment_id;
--   elsif p_event_type <> current_status then
--     -- normal status change
--     update public.shipments
--     set status = p_event_type,
--         updated_at = timezone('utc'::text, now())
--     where id = p_shipment_id;
--   end if;

--   return event_id;
-- end;
-- $$;
