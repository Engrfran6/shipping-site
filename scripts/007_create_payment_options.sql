alter table public.payment_options enable row level security;

-- Example: allow only service role (admin backend) to insert/delete
create policy "Allow service role" 
on public.payment_options
for all
to service_role
using (true)
with check (true);



-- Create the payment_options table
create table if not exists public.payment_options (
  id uuid primary key default uuid_generate_v4(),
  type text not null,                        -- e.g. paypal, zelle, crypto, etc.
  label text not null,                       -- Human-readable label, e.g. "PayPal" or "USDT (TRC20)"
  
  -- Common fields
  account text,                              -- For handles, tags, or account numbers
  bank text,                                 -- Bank name
  email text,                                -- For PayPal, Zelle, etc.
  note text,                                 -- Extra payment instructions

  -- Banking-specific fields
  routing_number text,                       -- For domestic transfers
  swift_code text,                           -- For international transfers
  bank_address text,                         -- Optional for both domestic & international

  created_at timestamptz default now()
);


create table if not exists public.tracking_event_payments (
  id uuid default gen_random_uuid() primary key,
  tracking_event_id uuid references public.tracking_events(id),
  amount numeric not null,
  payment_method text[] not null,
  created_at timestamp default timezone('utc'::text, now())
);


drop view if exists public.v_tracking_event_payment_details cascade;
create or replace view public.v_tracking_event_payment_details as
select
  tep.id                            as tracking_payment_id,
  tep.tracking_event_id,
  tep.amount,
  tep.payment_method,
  methods.method                    as resolved_method,  -- renamed to avoid name conflict
  po.id                             as payment_option_id,
  po.type,
  po.label,
  po.account,
  po.bank,
  po.email,
  po.note,
  po.routing_number,
  po.swift_code,
  po.bank_address,
  po.created_at                     as payment_option_created_at
from public.tracking_event_payments tep

-- LATERAL: normalize payment_method (array or messy string) → rows
join lateral (
  select trim(m) as method
  from regexp_split_to_table(
    case
      when pg_typeof(tep.payment_method)::text = 'text[]' then
        array_to_string(tep.payment_method, ',')
      else
        regexp_replace(tep.payment_method::text, '[\[\]\{\}\"]', '', 'g')
    end,
    ','
  ) as t(m)
) as methods on true

join public.payment_options po
  on trim(po.type) = methods.method;






-- Add helpful indexes
create index if not exists idx_payment_options_type on public.payment_options(type);
create index if not exists idx_payment_options_created_at on public.payment_options(created_at desc);


create policy "Admins can manage payment options"
on public.payment_options
for all
to authenticated
using (auth.role() = 'admin')
with check (auth.role() = 'admin');
