-- ================================================
-- 1. Create or replace profiles table
-- ================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  company_name text,
  address text,
  city text,
  state text,
  postal_code text,
  country text default 'US',
  user_type text not null default 'client' check (user_type in ('client', 'admin', 'guest')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ================================================
-- 2. Enable Row-Level Security
-- ================================================
alter table public.profiles enable row level security;

-- ================================================
-- 3. Create helper function to check admin status
-- ================================================
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and user_type = 'admin'
  );
$$;

-- Ensure function owner has privileges to bypass RLS
alter function public.is_admin(uuid) owner to postgres;

-- ================================================
-- 4. Define RLS policies
-- ================================================

-- Allow users to view their own profile
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Allow users to insert their own profile
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Allow users to delete their own profile
create policy "profiles_delete_own"
  on public.profiles
  for delete
  using (auth.uid() = id);

-- Allow admins to view all profiles
create policy "profiles_admin_select_all"
  on public.profiles
  for select
  using (public.is_admin(auth.uid()));

-- ================================================
-- 5. Trigger function to handle new user signups
-- ================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    company_name,
    user_type
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'company_name', ''),
    coalesce(new.raw_user_meta_data ->> 'user_type', 'client')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

alter function public.handle_new_user() owner to postgres;

-- ================================================
-- 6. Trigger for new user creation
-- ================================================
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ================================================
-- 7. Updated_at auto-update trigger
-- ================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();








-- -- Create profiles table that extends auth.users
-- create table if not exists public.profiles (
--   id uuid primary key references auth.users(id) on delete cascade,
--   email text not null,
--   full_name text,
--   phone text,
--   company_name text,
--   address text,
--   city text,
--   state text,
--   postal_code text,
--   country text default 'US',
--   user_type text not null default 'client' check (user_type in ('client', 'admin', 'guest')),
--   is_active boolean default true,
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
--   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
-- );

-- -- Enable RLS
-- alter table public.profiles enable row level security;

-- -- RLS policies for profiles
-- create policy "profiles_select_own"
--   on public.profiles for select
--   using (auth.uid() = id);

-- create policy "profiles_insert_own"
--   on public.profiles for insert
--   with check (auth.uid() = id);

-- create policy "profiles_update_own"
--   on public.profiles for update
--   using (auth.uid() = id);

-- create policy "profiles_delete_own"
--   on public.profiles for delete
--   using (auth.uid() = id);

-- -- Allow admins to view all profiles
-- create policy "profiles_admin_select_all"
--   on public.profiles for select
--   using (
--     exists (
--       select 1 from public.profiles
--       where id = auth.uid() and user_type = 'admin'
--     )
--   );

-- -- Create function to handle new user signup
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = public
-- as $$
-- begin
--   insert into public.profiles (id, email, full_name, user_type)
--   values (
--     new.id,
--     new.email,
--     coalesce(new.raw_user_meta_data ->> 'full_name', ''),
--     coalesce(new.raw_user_meta_data ->> 'user_type', 'client')
--   )
--   on conflict (id) do nothing;

--   return new;
-- end;
-- $$;

-- -- Create trigger for new user signup
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row
--   execute function public.handle_new_user();

-- -- Create updated_at trigger function
-- create or replace function public.handle_updated_at()
-- returns trigger
-- language plpgsql
-- as $$
-- begin
--   new.updated_at = timezone('utc'::text, now());
--   return new;
-- end;
-- $$;

-- -- Add updated_at trigger to profiles
-- create trigger profiles_updated_at
--   before update on public.profiles
--   for each row
--   execute function public.handle_updated_at();
