-- HormoIQ Supabase Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  birth_year integer not null,
  gender text not null check (gender in ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')),
  goals text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tests table (hormone test results)
create table public.tests (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  hormone_type text not null check (hormone_type in ('CORTISOL', 'TESTOSTERONE', 'DHEA')),
  value numeric not null check (value > 0),
  timestamp timestamp with time zone not null,
  sleep_quality integer not null check (sleep_quality between 1 and 5),
  exercised boolean not null default false,
  stress_level integer not null check (stress_level between 1 and 5),
  supplements text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index tests_user_id_idx on public.tests(user_id);
create index tests_timestamp_idx on public.tests(timestamp desc);
create index tests_hormone_type_idx on public.tests(hormone_type);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tests enable row level security;

-- Profiles policies: Users can only read/write their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Tests policies: Users can only read/write their own tests
create policy "Users can view own tests"
  on public.tests for select
  using (auth.uid() = user_id);

create policy "Users can insert own tests"
  on public.tests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tests"
  on public.tests for update
  using (auth.uid() = user_id);

create policy "Users can delete own tests"
  on public.tests for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at on profiles
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Create a profile automatically when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, birth_year, gender, goals)
  values (new.id, 1990, 'MALE', ARRAY['GENERAL_HEALTH']);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

