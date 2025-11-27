-- Create shipments table
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text unique not null,
  user_id uuid references public.profiles(id) on delete cascade,
  
  -- Sender information
  sender_name text not null,
  sender_email text,
  sender_phone text not null,
  sender_address text,
  sender_city text,
  sender_state text not null,
  sender_postal_code text,
  sender_country text default not null 'US',
  
  -- Recipient information
  recipient_name text not null,
  recipient_email text,
  recipient_phone text,
  recipient_address text not null,
  recipient_city text not null,
  recipient_state text not null,
  recipient_postal_code text not null,
  recipient_country text default 'US',
  
  -- Package information
  package_type text not null check (package_type in ('envelope', 'box', 'tube', 'custom')),
  weight_kg decimal(10,2) not null,
  length_cm decimal(10,2),
  width_cm decimal(10,2),
  height_cm decimal(10,2),
  declared_value decimal(10,2) default 0,
  description text,
  
  -- Service information
  service_type text not null check (service_type in ('standard', 'express', 'overnight', 'international')),
  delivery_instructions text,
  signature_required boolean default false,
  insurance_required boolean default false,
  
  -- Status and tracking
  status text not null default 'created' check (status in ('created','in_transit','out_for_delivery','delivered','exception')),
  estimated_delivery_date timestamp with time zone,
  actual_delivery_date timestamp with time zone,
  
  -- Pricing
  base_cost decimal(10,2) not null default 0,
  insurance_cost decimal(10,2) default 0,
  tax_amount decimal(10,2) default 0,
  total_cost decimal(10,2) not null default 0,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.shipments enable row level security;

-- RLS policies for shipments
create policy "shipments_select_own"
  on public.shipments for select
  using (auth.uid() = user_id);


  -- Allow users to insert their own shipments
drop policy if exists "shipments_insert_own" on public.shipments;

create policy "shipments_insert_own"
  on public.shipments for insert
  with check (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'admin'
    )
  );


create policy "shipments_update_own"
  on public.shipments for update
  using (auth.uid() = user_id);

-- Allow admins to view and manage all shipments
create policy "shipments_admin_all"
  on public.shipments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'admin'
    )
  );

-- Allow guests to view shipments by tracking number (no user_id required)
create policy "shipments_guest_track"
  on public.shipments
  for select
  using (
    true  -- allow anyone to select (public tracking)
  );

-- delete tracking events when shipment is deleted
  alter table public.tracking_events
drop constraint tracking_events_shipment_id_fkey;

alter table public.tracking_events
add constraint tracking_events_shipment_id_fkey
foreign key (shipment_id)
references public.shipments(id)
on delete cascade;


-- Add updated_at trigger
create trigger shipments_updated_at
  before update on public.shipments
  for each row
  execute function public.handle_updated_at();

-- Create index for tracking number lookups
create index if not exists idx_shipments_tracking_number on public.shipments(tracking_number);
create index if not exists idx_shipments_user_id on public.shipments(user_id);
create index if not exists idx_shipments_status on public.shipments(status);
