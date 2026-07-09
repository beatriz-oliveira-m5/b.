# Passos de aprovação por rede social (fora do código)

Este documento lista, rede por rede, exatamente o que precisa ser feito **fora
do código** — nos painéis de desenvolvedor de cada plataforma — para trocar um
canal de "dados de teste" (mock) para "conectado de verdade" (real) na aba
**Redes sociais** do sistema.

O código já está pronto para os dois modos: `lib/integrations/mock-adapter.ts`
gera dados fictícios (usado hoje), e `lib/integrations/real/*.ts` chama a API
de verdade de cada rede (usado assim que a aprovação sair e as credenciais
forem preenchidas no `.env.local` / variáveis de ambiente da Vercel).

Nenhuma dessas aprovações bloqueia o uso do sistema — o calendário, o
workflow, as tarefas, os lembretes e a geração de legendas por IA já
funcionam hoje, sem depender de nada disso.

---

## Instagram + Facebook (Meta Graph API + Marketing API)

**Onde**: [developers.facebook.com](https://developers.facebook.com)

1. Criar um app Meta (tipo "Business").
2. Adicionar o produto **Facebook Login for Business**.
3. Conectar a conta do Instagram do cliente como conta profissional, associada
   a uma Página do Facebook (pré-requisito técnico da própria Meta — sem isso
   não existe insights de Instagram via API, independente da nossa plataforma).
4. Passar pela **Verificação de Negócio** (Business Verification) da Meta —
   exige CNPJ e documentos da agência.
5. Solicitar via **App Review** as permissões:
   - `instagram_basic`, `instagram_manage_insights`, `pages_show_list`,
     `pages_read_engagement` (para os relatórios do Instagram)
   - `pages_read_engagement`, `pages_read_user_content` (para os relatórios do
     Facebook)
   - `ads_management` (só se for usar o módulo de **Ads** de verdade — é a
     permissão mais restrita da Meta, o processo mais demorado de todos)
6. Preencher no ambiente: `META_APP_ID`, `META_APP_SECRET`.

**Tempo típico**: dias a poucas semanas para as permissões básicas; a
Verificação de Negócio e o `ads_management` costumam ser os gargalos.

---

## TikTok (TikTok for Developers)

**Onde**: [developers.tiktok.com](https://developers.tiktok.com)

1. Criar um app e adicionar os produtos **Login Kit** e **Display API**.
2. Solicitar App Review pedindo os escopos `user.info.basic` e `video.list`.
3. Dependendo do volume de uso, pode ser exigida verificação adicional da
   empresa.
4. Preencher: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`.

**Observação técnica**: o TikTok não tem um endpoint único de "insights
diários" como a Meta — as métricas vêm por vídeo (like/comment/share/view
count). O adapter real soma os vídeos por dia de publicação; é uma
aproximação razoável, não uma métrica oficial "diária" da conta.

---

## LinkedIn (Marketing Developer Platform)

**Onde**: [linkedin.com/developers](https://www.linkedin.com/developers)

1. Criar um app LinkedIn associado à Company Page do cliente.
2. Solicitar acesso ao **Marketing Developer Platform** — exige preencher um
   formulário de caso de uso e passar por revisão manual da LinkedIn. Este é
   historicamente o processo mais lento e menos previsível dos quatro (pode
   levar 1-2 semanas ou mais, e pode ser negado sem justificativa detalhada).
3. Depois de aprovado, solicitar os escopos `r_organization_social` e
   `rw_organization_admin`.
4. Preencher: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`.

---

## YouTube (YouTube Data API v3 + YouTube Analytics API)

**Onde**: [Google Cloud Console](https://console.cloud.google.com)

1. Criar um projeto no Google Cloud e ativar as APIs **YouTube Data API v3**
   e **YouTube Analytics API**.
2. Configurar a tela de consentimento OAuth (OAuth consent screen).
3. Para sair do modo "Testing" (limitado a poucos usuários de teste
   cadastrados manualmente) e liberar o uso normal, passar pela **Verificação
   do Google** — exige demonstrar o uso do escopo sensível de Analytics
   (costuma pedir um vídeo curto mostrando o fluxo).
4. Preencher: `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`.

---

## Enquanto isso: como o sistema se comporta

- Cada cliente pode ser conectado em modo **"dados de teste"** na aba Redes
  sociais a qualquer momento — sem depender de nenhuma aprovação. Isso já
  alimenta o Dashboard e os Insights de IA com números fictícios (mas
  plausíveis), para a Beatriz já testar o fluxo completo.
- Assim que uma aprovação específica sair, é só clicar em "Conectar de
  verdade" naquela rede — o botão já existe na tela, só depende das
  variáveis de ambiente estarem preenchidas.
- Cada rede é independente: dá pra ter Instagram "real" e TikTok "mock" ao
  mesmo tempo, por exemplo.

---

## Análise de concorrentes — limitação diferente das outras

Ao contrário do resto do sistema, a aba **Concorrência** não tem um caminho
de "app review" pra virar real. As APIs oficiais (Graph API, etc.) só dão
insights de contas que **você mesma gerencia** — não existe endpoint padrão
pra puxar métricas de um perfil de terceiros só com o app aprovado.

Pra ter dado de concorrente de verdade, o caminho normal do mercado é
contratar um provedor de dados de social listening (ex: Social Blade API,
Phyllo, ou similares) — é uma assinatura paga à parte, fora do escopo de
"aprovação gratuita" que documentei nas outras redes. Por enquanto a aba
gera números plausíveis (mesma lógica mock do resto do sistema) — dá pra
trocar por um provedor real no futuro se fizer sentido pro negócio.
