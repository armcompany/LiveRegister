-- ============================================
-- LiveRegister schema: clients + services + units + equipment
-- ============================================
create extension if not exists "uuid-ossp";

create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  email text,
  address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de unidades (locais/filiais do cliente)
create table if not exists public.units (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade not null,
  name text not null,
  address jsonb,
  responsible_name text,
  responsible_phone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de equipamentos de ar condicionado
create table if not exists public.equipment (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid references public.units(id) on delete cascade not null,
  tag text not null,
  location text,
  brand text,
  model text,
  type text,
  capacity_btu integer,
  serial_number text,
  installation_date date,
  warranty_expiry date,
  last_maintenance date,
  maintenance_interval_days integer default 90,
  refrigerant_type text,
  voltage text,
  photos text[],
  status text default 'Ativo',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  unit_id uuid references public.units(id),
  equipment_id uuid references public.equipment(id),
  type text not null,
  description text,
  date date not null,
  time time,
  technician text,
  status text default 'Pendente',
  photos text[],
  notes text,
  technical_details jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.clients enable row level security;
alter table public.units enable row level security;
alter table public.equipment enable row level security;
alter table public.services enable row level security;

-- Simple auth policy: any authenticated user can CRUD
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.polname = 'lr_clients_authenticated_rw'
      AND n.nspname = 'public'
      AND c.relname = 'clients'
  ) THEN
    CREATE POLICY "lr_clients_authenticated_rw"
      ON public.clients
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.polname = 'lr_units_authenticated_rw'
      AND n.nspname = 'public'
      AND c.relname = 'units'
  ) THEN
    CREATE POLICY "lr_units_authenticated_rw"
      ON public.units
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.polname = 'lr_equipment_authenticated_rw'
      AND n.nspname = 'public'
      AND c.relname = 'equipment'
  ) THEN
    CREATE POLICY "lr_equipment_authenticated_rw"
      ON public.equipment
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.polname = 'lr_services_authenticated_rw'
      AND n.nspname = 'public'
      AND c.relname = 'services'
  ) THEN
    CREATE POLICY "lr_services_authenticated_rw"
      ON public.services
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

-- Configurar bucket de imagens
insert into storage.buckets (id, name, public)
values ('image', 'image', true)
on conflict do nothing;

-- Políticas para upload de imagens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'image');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view images'
  ) THEN
    CREATE POLICY "Public can view images"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'image');
  END IF;
END
$$;

-- Seed example
insert into public.clients (name, phone, email, address)
values
  ('Maria Silva','+55 11 99999-1111','maria@example.com','{"street":"Rua A","number":"100","city":"São Paulo","state":"SP","zip":"01000-000"}'::jsonb),
  ('João Souza','+55 21 98888-2222','joao@example.com','{"street":"Av. B","number":"200","city":"Rio de Janeiro","state":"RJ","zip":"20000-000"}'::jsonb)
on conflict do nothing;

insert into public.services (client_id, type, description, date, time, technician, status)
select id, 'Manutenção', 'Limpeza de filtro e verificação de gás', current_date, '10:00', 'Técnico A', 'Pendente'
from public.clients
order by created_at
limit 1;
