-- ============================================
-- LiveRegister schema: clients + services
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

create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  type text not null,
  description text,
  date date not null,
  time time,
  technician text,
  status text default 'Pendente',
  photos text[],
  notes text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.clients enable row level security;
alter table public.services enable row level security;

-- Simple auth policy: any authenticated user can CRUD (adjust later for multi-tenant)
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
