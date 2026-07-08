-- Benchmarks de mercado (valores gerais de referência, ajustáveis depois
-- direto na tabela conforme a Beatriz for validando com a realidade dos
-- clientes dela). Usados pelo módulo de insights de IA para comparação.
insert into benchmarks (network, metric_name, segment, benchmark_value, unit) values
  ('instagram', 'engagement_rate', 'geral', 1.8, '%'),
  ('facebook',  'engagement_rate', 'geral', 0.9, '%'),
  ('tiktok',    'engagement_rate', 'geral', 5.5, '%'),
  ('linkedin',  'engagement_rate', 'geral', 2.0, '%'),
  ('youtube',   'engagement_rate', 'geral', 3.5, '%');
