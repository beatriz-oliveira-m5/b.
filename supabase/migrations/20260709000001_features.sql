-- Agencia B — segunda leva de funcionalidades (inspiradas no mLabs):
-- permissoes por usuario, aprovacao externa via link, analise de
-- concorrentes e metricas de midia paga.

create type team_role as enum ('admin', 'editor');

-- ---------------------------------------------------------------------
-- Equipe (membros com login na plataforma e nivel de acesso)
-- ---------------------------------------------------------------------
create table team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role team_role not null default 'editor',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Aprovacao externa: cada post ja nasce com um token unico pra gerar um
-- link publico de aprovacao (o cliente aprova ou pede ajuste sem logar).
-- ---------------------------------------------------------------------
alter table content_items add column share_token uuid not null default gen_random_uuid() unique;

-- ---------------------------------------------------------------------
-- Analise de concorrentes (ate 5 perfis por cliente, limite aplicado na
-- camada de aplicacao)
-- ---------------------------------------------------------------------
create table competitors (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  network content_network not null,
  handle text not null,
  created_at timestamptz not null default now()
);

create table competitor_metrics (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references competitors(id) on delete cascade,
  metric_date date not null,
  followers_count integer,
  posts_count integer,
  avg_engagement_rate numeric(6,3),
  source integration_mode not null default 'mock',
  fetched_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Metricas de midia paga por campanha (resultado do investimento)
-- ---------------------------------------------------------------------
create table ad_metrics (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references ads_campaigns(id) on delete cascade,
  metric_date date not null,
  spend_cents integer not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  results integer not null default 0,
  source integration_mode not null default 'mock',
  fetched_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- RLS: mesmo padrao do resto do sistema — ferramenta interna, qualquer
-- usuario autenticado tem acesso total. Acoes restritas a admin (convidar/
-- remover membro da equipe) sao checadas na camada de aplicacao.
-- ---------------------------------------------------------------------
alter table team_members enable row level security;
alter table competitors enable row level security;
alter table competitor_metrics enable row level security;
alter table ad_metrics enable row level security;

create policy "authenticated full access" on team_members for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on competitors for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on competitor_metrics for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on ad_metrics for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- share_token dos posts precisa ser legivel sem login (pagina publica de
-- aprovacao) — mas so por quem ja tem o token exato, entao liberar select
-- publico na tabela toda seria excessivo. A leitura publica é feita via
-- service role numa rota dedicada, entao nenhuma policy publica é criada
-- aqui de proposito.
