-- Create quotes table for guest and user quote requests
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  
  -- Contact information (for guests)
  contact_name text,
  contact_email text,
  contact_phone text,
  
  -- Shipping details
  origin_address text not null,
  origin_city text not null,
  origin_state text not null,
  origin_postal_code text not null,
  origin_country text default 'US',
  
  destination_address text not null,
  destination_city text not null,
  destination_state text not null,
  destination_postal_code text not null,
  destination_country text default 'US',
  
  -- Package information
  package_type text not null check (package_type in ('envelope', 'box', 'tube', 'custom')),
  weight_kg decimal(10,2) not null,
  length_cm decimal(10,2),
  width_cm decimal(10,2),
  height_cm decimal(10,2),
  declared_value decimal(10,2) default 0,
  
  -- Service preferences
  service_type text not null check (service_type in ('standard', 'express', 'overnight', 'international')),
  signature_required boolean default false,
  insurance_required boolean default false,
  
  -- Quote details
  estimated_cost decimal(10,2),
  estimated_delivery_days integer,
  quote_expires_at timestamp with time zone,
  status text not null default 'pending' check (status in ('pending', 'quoted', 'accepted', 'expired', 'cancelled')),
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.quotes enable row level security;

-- RLS policies for quotes
create policy "quotes_select_own"
  on public.quotes for select
  using (auth.uid() = user_id or user_id is null);

create policy "quotes_insert_own"
  on public.quotes for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "quotes_update_own"
  on public.quotes for update
  using (auth.uid() = user_id or user_id is null);

-- Allow admins to view and manage all quotes
create policy "quotes_admin_all"
  on public.quotes for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'admin'
    )
  );

-- Add updated_at trigger
create trigger quotes_updated_at
  before update on public.quotes
  for each row
  execute function public.handle_updated_at();

-- Create indexes
create index if not exists idx_quotes_user_id on public.quotes(user_id);
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_quotes_created_at on public.quotes(created_at);
