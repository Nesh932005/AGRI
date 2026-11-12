-- ==========================================================
-- AGRI - Agriculture Office Management Database Schema
-- Compatible with Supabase PostgreSQL & Row Level Security
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Staff and Admin user profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text check (role in ('admin', 'staff')) default 'staff',
  phone text,
  department text default 'Municipal Agriculture Office',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. FARMERS
create table if not exists public.farmers (
  id uuid default gen_random_uuid() primary key,
  farmer_code text unique not null,
  name text not null,
  contact text not null,
  barangay text not null,
  farm_size_ha numeric(8, 2) not null check (farm_size_ha > 0),
  primary_crops text[] not null default '{}',
  status text check (status in ('active', 'inactive')) default 'active',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CROPS & GROWTH TRACKING (Rice, Corn, Vegetables, Fruits)
create table if not exists public.crops (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references public.farmers(id) on delete cascade not null,
  category text not null check (category in ('Rice', 'Corn', 'Vegetables', 'Fruits')),
  variety text not null,
  area_ha numeric(8, 2) not null check (area_ha > 0),
  planting_date date not null,
  expected_harvest_date date not null,
  growth_stage text not null check (growth_stage in (
    'Land Preparation', 
    'Seedling', 
    'Vegetative', 
    'Flowering', 
    'Ripening', 
    'Harvest Ready', 
    'Harvested'
  )),
  estimated_yield_kg numeric(10, 2) default 0,
  actual_yield_kg numeric(10, 2) default 0,
  health_status text check (health_status in ('Healthy', 'Needs Water', 'Pest Warning', 'Damaged')) default 'Healthy',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. INVENTORY (Aggregated & Batch Crop Storage)
create table if not exists public.inventory (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('Rice', 'Corn', 'Vegetables', 'Fruits')),
  variety text not null,
  current_stock_kg numeric(12, 2) not null default 0 check (current_stock_kg >= 0),
  min_stock_alert_kg numeric(10, 2) default 500,
  avg_unit_cost numeric(10, 2) default 0,
  suggested_selling_price numeric(10, 2) default 0,
  storage_location text not null default 'Central Warehouse Silo A',
  last_restocked_at timestamp with time zone default timezone('utc'::text, now()),
  unique(category, variety, storage_location)
);

-- 5. PURCHASES (Buying harvest from farmers)
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  reference_no text unique not null,
  farmer_id uuid references public.farmers(id) on delete set null,
  crop_id uuid references public.crops(id) on delete set null,
  category text not null check (category in ('Rice', 'Corn', 'Vegetables', 'Fruits')),
  variety text not null,
  quantity_kg numeric(10, 2) not null check (quantity_kg > 0),
  price_per_kg numeric(10, 2) not null check (price_per_kg > 0),
  total_amount numeric(12, 2) not null,
  payment_status text check (payment_status in ('Paid', 'Pending')) default 'Paid',
  payment_method text check (payment_method in ('Cash', 'Bank Transfer', 'Check', 'LandBank')) default 'Cash',
  storage_location text not null default 'Central Warehouse Silo A',
  notes text,
  recorded_by uuid references public.profiles(id) on delete set null,
  purchase_date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SALES (Selling to buyers, markets, cooperatives)
create table if not exists public.sales (
  id uuid default gen_random_uuid() primary key,
  reference_no text unique not null,
  buyer_name text not null,
  buyer_type text check (buyer_type in ('Wholesaler', 'Retailer', 'Government Agency', 'Cooperative', 'Public Market')) default 'Wholesaler',
  buyer_contact text,
  category text not null check (category in ('Rice', 'Corn', 'Vegetables', 'Fruits')),
  variety text not null,
  quantity_kg numeric(10, 2) not null check (quantity_kg > 0),
  price_per_kg numeric(10, 2) not null check (price_per_kg > 0),
  total_amount numeric(12, 2) not null,
  payment_status text check (payment_status in ('Paid', 'Pending', 'Partial')) default 'Paid',
  payment_method text check (payment_method in ('Cash', 'Bank Transfer', 'Check', 'Credit')) default 'Cash',
  storage_location text not null default 'Central Warehouse Silo A',
  notes text,
  recorded_by uuid references public.profiles(id) on delete set null,
  sale_date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
alter table public.profiles enable row level security;
alter table public.farmers enable row level security;
alter table public.crops enable row level security;
alter table public.inventory enable row level security;
alter table public.purchases enable row level security;
alter table public.sales enable row level security;

-- Profiles: Authenticated users can view profiles, users can update their own
create policy "Authenticated users can view profiles" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Staff & Admin read/write policies
create policy "Staff & Admin can read farmers" on public.farmers for select using (auth.role() = 'authenticated');
create policy "Staff & Admin can insert farmers" on public.farmers for insert with check (auth.role() = 'authenticated');
create policy "Staff & Admin can update farmers" on public.farmers for update using (auth.role() = 'authenticated');

create policy "Staff & Admin can read crops" on public.crops for select using (auth.role() = 'authenticated');
create policy "Staff & Admin can manage crops" on public.crops for all using (auth.role() = 'authenticated');

create policy "Staff & Admin can read inventory" on public.inventory for select using (auth.role() = 'authenticated');
create policy "Staff & Admin can manage inventory" on public.inventory for all using (auth.role() = 'authenticated');

create policy "Staff & Admin can read purchases" on public.purchases for select using (auth.role() = 'authenticated');
create policy "Staff & Admin can manage purchases" on public.purchases for all using (auth.role() = 'authenticated');

create policy "Staff & Admin can read sales" on public.sales for select using (auth.role() = 'authenticated');
create policy "Staff & Admin can manage sales" on public.sales for all using (auth.role() = 'authenticated');

-- ==========================================================
-- AUTOMATIC INVENTORY TRIGGERS
-- ==========================================================

-- Function to handle purchase -> auto increase inventory
create or replace function public.handle_new_purchase()
returns trigger as $$
begin
  insert into public.inventory (category, variety, current_stock_kg, storage_location, avg_unit_cost, suggested_selling_price, last_restocked_at)
  values (
    new.category,
    new.variety,
    new.quantity_kg,
    new.storage_location,
    new.price_per_kg,
    new.price_per_kg * 1.25,
    now()
  )
  on conflict (category, variety, storage_location)
  do update set
    avg_unit_cost = (
      (inventory.current_stock_kg * inventory.avg_unit_cost + new.quantity_kg * new.price_per_kg)
      / nullif(inventory.current_stock_kg + new.quantity_kg, 0)
    ),
    current_stock_kg = inventory.current_stock_kg + new.quantity_kg,
    last_restocked_at = now();
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger trg_after_purchase_inventory
after insert on public.purchases
for each row execute function public.handle_new_purchase();

-- Function to handle sales -> auto decrease inventory
create or replace function public.handle_new_sale()
returns trigger as $$
begin
  update public.inventory
  set current_stock_kg = greatest(0, current_stock_kg - new.quantity_kg)
  where category = new.category
    and variety = new.variety
    and storage_location = new.storage_location;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger trg_after_sale_inventory
after insert on public.sales
for each row execute function public.handle_new_sale();

