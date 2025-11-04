-- ============================================
-- Create tracking_events table for detailed shipment history
-- ============================================

drop table if exists public.tracking_events cascade;

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid references public.shipments(id) on delete cascade not null,

  -- Event details
  event_type text not null check (
    event_type in (
      'created',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'exception'
    )
  ),

  event_description text not null,
  location text,

  -- Metadata
  created_at timestamptz default timezone('utc'::text, now()) not null,
  created_by uuid references public.profiles(id)
);

if p_event_type not in ('created','in_transit','out_for_delivery','delivered','exception') then
    raise exception 'Invalid event_type for shipment status: %', p_event_type;
end if;


-- ============================================
-- Trigger function to auto-fill event_description
-- ============================================
create or replace function public.enforce_event_description_consistency()
returns trigger
language plpgsql
as $$
begin
  if new.event_type = 'created' then
    new.event_description := 'Shipment created';
  elsif new.event_type = 'in_transit' then
    new.event_description := 'Shipment is in transit';
  elsif new.event_type = 'out_for_delivery' then
    new.event_description := 'Shipment is out for delivery';
  elsif new.event_type = 'delivered' then
    new.event_description := 'Shipment delivered';
  elsif new.event_type = 'exception' then
    if new.event_description is null or trim(new.event_description) = '' then
      raise exception 'Exception events must include a custom event_description';
    end if;
  else
    raise exception 'Invalid event_type: %', new.event_type;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_event_description_consistency on public.tracking_events;

create trigger trg_enforce_event_description_consistency
before insert or update on public.tracking_events
for each row
execute function public.enforce_event_description_consistency();

-- ============================================
-- Row-Level Security (RLS)
-- ============================================
alter table public.tracking_events enable row level security;

-- Public read access (tracking history is visible to everyone)
create policy "tracking_events_public_select"
  on public.tracking_events
  for select
  using (true);

-- Admins can read all events (redundant but explicit)
create policy "tracking_events_admin_select_all"
  on public.tracking_events
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'admin'
    )
  );

-- Admins can insert tracking events (for manual updates or exceptions)
create policy "tracking_events_admin_insert"
  on public.tracking_events
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'admin'
    )
  );

-- ============================================
-- Indexes for efficient lookups
-- ============================================
create index if not exists idx_tracking_events_shipment_id on public.tracking_events(shipment_id);
create index if not exists idx_tracking_events_created_at on public.tracking_events(created_at);
