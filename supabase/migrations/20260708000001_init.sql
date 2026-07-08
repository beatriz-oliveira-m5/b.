-- Agencia B — schema inicial
-- Ferramenta interna de uso exclusivo da Beatriz. Sem multi-tenancy:
-- qualquer usuário autenticado (ela e o marido) tem acesso total aos dados.

create extension if not exists "pgcrypto";

create type content_network as enum ('instagram', 'facebook', 'tiktok', 'linkedin', 'youtube');
create type content_status as enum ('draft', 'in_review', 'approved', 'published');
create type integration_mode as enum ('mock', 'real');

-- ---------------------------------------------------------------------
-- Clientes da agência
-- ---------------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#6366f1',
  notes text,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Contas sociais por cliente (uma por rede). Guarda tokens OAuth quando a
-- integração real estiver ativa; enquanto isso, mode = 'mock'.
-- ---------------------------------------------------------------------
create table social_channels (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  network content_network not null,
  handle text,
  mode integration_mode not null default 'mock',
  external_account_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  unique (client_id, network)
);

-- ---------------------------------------------------------------------
-- Itens de conteúdo (posts planejados) — calendário + workflow
-- ---------------------------------------------------------------------
create table content_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  caption text,
  networks content_network[] not null default '{}',
  media_urls text[] not null default '{}',
  status content_status not null default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table content_status_history (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  from_status content_status,
  to_status content_status not null,
  note text,
  changed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- To-dos por cliente (podem ou não estar ligados a um post)
-- ---------------------------------------------------------------------
create table todos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Legendas geradas por IA (histórico de variações por rede)
-- ---------------------------------------------------------------------
create table ai_captions (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid references content_items(id) on delete cascade,
  network content_network not null,
  topic text,
  tone text,
  generated_text text not null,
  selected boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Métricas de performance por post/rede (mock até a API real ser aprovada)
-- ---------------------------------------------------------------------
create table performance_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete set null,
  network content_network not null,
  metric_date date not null,
  impressions integer not null default 0,
  reach integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  saves integer not null default 0,
  followers_count integer,
  engagement_rate numeric(6,3),
  source integration_mode not null default 'mock',
  fetched_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Campanhas de Ads (Meta Marketing API) — mock até a conta de anúncios
-- estar aprovada
-- ---------------------------------------------------------------------
create table ads_campaigns (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete set null,
  network content_network not null default 'instagram',
  objective text,
  budget_cents integer,
  status text not null default 'draft',
  external_campaign_id text,
  starts_at timestamptz,
  ends_at timestamptz,
  source integration_mode not null default 'mock',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Benchmarks de mercado (referência para os insights de IA)
-- ---------------------------------------------------------------------
create table benchmarks (
  id uuid primary key default gen_random_uuid(),
  network content_network not null,
  metric_name text not null,
  segment text not null default 'geral',
  benchmark_value numeric not null,
  unit text not null default '%',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Trigger: manter updated_at de content_items em dia
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger content_items_set_updated_at
  before update on content_items
  for each row
  execute function set_updated_at();

-- Trigger: registrar toda mudança de status no histórico
create or replace function log_content_status_change()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into content_status_history (content_item_id, from_status, to_status)
    values (new.id, null, new.status);
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into content_status_history (content_item_id, from_status, to_status)
    values (new.id, old.status, new.status);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger content_items_log_status
  after insert or update on content_items
  for each row
  execute function log_content_status_change();

-- ---------------------------------------------------------------------
-- RLS: ferramenta interna, qualquer usuário autenticado tem acesso total
-- ---------------------------------------------------------------------
alter table clients enable row level security;
alter table social_channels enable row level security;
alter table content_items enable row level security;
alter table content_status_history enable row level security;
alter table todos enable row level security;
alter table ai_captions enable row level security;
alter table performance_metrics enable row level security;
alter table ads_campaigns enable row level security;
alter table benchmarks enable row level security;

create policy "authenticated full access" on clients for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on social_channels for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on content_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on content_status_history for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on todos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on ai_captions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on performance_metrics for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on ads_campaigns for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on benchmarks for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- benchmarks: leitura liberada mesmo sem login (referência pública, sem dado sensível)
create policy "public read" on benchmarks for select using (true);
