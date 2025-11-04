-- Ensure unique constraint
alter table public.service_areas
add constraint if not exists unique_area_name unique (area_name);

-- Insert service areas (safe)
insert into public.service_areas (area_name, country, state_province)
values 
  ('US Domestic', 'US', null),
  ('Canada', 'CA', null),
  ('International', 'INTL', null)
on conflict (area_name) do nothing;

-- Insert basic pricing rules
insert into public.pricing_rules (
  service_type, 
  origin_area_id, 
  destination_area_id, 
  min_weight_kg, 
  max_weight_kg, 
  base_rate, 
  per_kg_rate, 
  estimated_delivery_days
)
select 
  'standard', sa1.id, sa2.id, 0, 50, 15.99, 2.50, 5
from public.service_areas sa1, public.service_areas sa2
where sa1.area_name = 'US Domestic' and sa2.area_name = 'US Domestic'
on conflict do nothing;

insert into public.pricing_rules (
  service_type, 
  origin_area_id, 
  destination_area_id, 
  min_weight_kg, 
  max_weight_kg, 
  base_rate, 
  per_kg_rate, 
  estimated_delivery_days
)
select 
  'express', sa1.id, sa2.id, 0, 50, 25.99, 4.50, 2
from public.service_areas sa1, public.service_areas sa2
where sa1.area_name = 'US Domestic' and sa2.area_name = 'US Domestic'
on conflict do nothing;

insert into public.pricing_rules (
  service_type, 
  origin_area_id, 
  destination_area_id, 
  min_weight_kg, 
  max_weight_kg, 
  base_rate, 
  per_kg_rate, 
  estimated_delivery_days
)
select 
  'overnight', sa1.id, sa2.id, 0, 25, 45.99, 8.50, 1
from public.service_areas sa1, public.service_areas sa2
where sa1.area_name = 'US Domestic' and sa2.area_name = 'US Domestic'
on conflict do nothing;




-- -- Create service areas table
-- create table if not exists public.service_areas (
--   id uuid primary key default gen_random_uuid(),
--   area_name text not null,
--   country text not null,
--   state_province text,
--   postal_code_pattern text,
--   is_active boolean default true,
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null
-- );

-- -- Create pricing rules table
-- create table if not exists public.pricing_rules (
--   id uuid primary key default gen_random_uuid(),
--   service_type text not null check (service_type in ('standard', 'express', 'overnight', 'international')),
--   origin_area_id uuid references public.service_areas(id),
--   destination_area_id uuid references public.service_areas(id),
  
--   -- Weight-based pricing
--   min_weight_kg decimal(10,2) not null default 0,
--   max_weight_kg decimal(10,2),
--   base_rate decimal(10,2) not null,
--   per_kg_rate decimal(10,2) not null default 0,
  
--   -- Dimensional pricing
--   dimensional_factor decimal(10,4) default 0.0001, -- kg per cubic cm
  
--   -- Service features
--   estimated_delivery_days integer not null,
--   signature_available boolean default true,
--   insurance_available boolean default true,
--   insurance_rate_percent decimal(5,4) default 0.01, -- 1% of declared value
  
--   -- Metadata
--   is_active boolean default true,
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
--   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
-- );

-- -- Enable RLS (read-only for most users, admin-only for modifications)
-- alter table public.service_areas enable row level security;
-- alter table public.pricing_rules enable row level security;

-- -- Allow everyone to read service areas and pricing
-- create policy "service_areas_select_all"
--   on public.service_areas for select
--   using (true);

-- create policy "pricing_rules_select_all"
--   on public.pricing_rules for select
--   using (true);

-- -- Only admins can modify
-- create policy "service_areas_admin_all"
--   on public.service_areas for all
--   using (
--     exists (
--       select 1 from public.profiles
--       where id = auth.uid() and user_type = 'admin'
--     )
--   );

-- create policy "pricing_rules_admin_all"
--   on public.pricing_rules for all
--   using (
--     exists (
--       select 1 from public.profiles
--       where id = auth.uid() and user_type = 'admin'
--     )
--   );

-- -- Add updated_at trigger
-- create trigger pricing_rules_updated_at
--   before update on public.pricing_rules
--   for each row
--   execute function public.handle_updated_at();

-- -- Insert some basic service areas
-- insert into public.service_areas (area_name, country, state_province) values
--   ('US Domestic', 'US', null),
--   ('Canada', 'CA', null),
--   ('International', 'INTL', null);

-- -- Insert basic pricing rules
-- insert into public.pricing_rules (
--   service_type, 
--   origin_area_id, 
--   destination_area_id, 
--   min_weight_kg, 
--   max_weight_kg, 
--   base_rate, 
--   per_kg_rate, 
--   estimated_delivery_days
-- ) 
-- select 
--   'standard',
--   sa1.id,
--   sa2.id,
--   0,
--   50,
--   15.99,
--   2.50,
--   5
-- from public.service_areas sa1, public.service_areas sa2
-- where sa1.area_name = 'US Domestic' and sa2.area_name = 'US Domestic';

-- insert into public.pricing_rules (
--   service_type, 
--   origin_area_id, 
--   destination_area_id, 
--   min_weight_kg, 
--   max_weight_kg, 
--   base_rate, 
--   per_kg_rate, 
--   estimated_delivery_days
-- ) 
-- select 
--   'express',
--   sa1.id,
--   sa2.id,
--   0,
--   50,
--   25.99,
--   4.50,
--   2
-- from public.service_areas sa1, public.service_areas sa2
-- where sa1.area_name = 'US Domestic' and sa2.area_name = 'US Domestic';

-- insert into public.pricing_rules (
--   service_type, 
--   origin_area_id, 
--   destination_area_id, 
--   min_weight_kg, 
--   max_weight_kg, 
--   base_rate, 
--   per_kg_rate, 
--   estimated_delivery_days
-- ) 
-- select 
--   'overnight',
--   sa1.id,
--   sa2.id,
--   0,
--   25,
--   45.99,
--   8.50,
--   1
-- from public.service_areas sa1, public.service_areas sa2
-- where sa1.area_name = 'US Domestic' and sa2.area_name = 'US Domestic';
