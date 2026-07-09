import type { SocialChannel } from "@/lib/types/database";

const GRAPH_VERSION = "v21.0";
const GRAPH_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;

/**
 * Criação de campanha via Meta Marketing API (Instagram/Facebook Ads).
 *
 * Pré-requisitos (fora do código, feitos pelo usuário):
 * 1. Ter uma Conta de Anúncios (Ad Account) da Meta associada à Página/perfil
 *    profissional do cliente.
 * 2. No app criado em developers.facebook.com, adicionar o produto "Marketing API".
 * 3. Passar pelo App Review da Meta solicitando a permissão `ads_management`
 *    — esta é uma das permissões mais restritas da Meta: exige demonstrar o
 *    caso de uso em vídeo e costuma ser o processo mais demorado de todos
 *    (semanas). Sem ela, só é possível criar anúncios manualmente no Gerenciador
 *    de Anúncios da Meta, não pela nossa plataforma.
 * 4. Guardar o `ad_account_id` (formato `act_XXXXXXXXXX`) — hoje não temos
 *    campo próprio pra isso; para uso em produção, adicionar uma coluna
 *    `ad_account_id` em `social_channels` ou pedir no momento da criação da campanha.
 *
 * Uma campanha completa na Marketing API precisa de 3 objetos encadeados:
 * Campaign -> Ad Set (segmentação + orçamento) -> Ad (criativo). Este adapter
 * cria hoje só a Campaign; Ad Set e Ad ficam para quando o acesso real estiver
 * liberado e puder ser testado contra a API de verdade.
 */
export async function createMetaCampaign(
  channel: SocialChannel,
  adAccountId: string,
  params: { name: string; objective: string; dailyBudgetCents: number }
): Promise<{ externalCampaignId: string }> {
  if (!channel.access_token) {
    throw new Error("Canal sem token de acesso — conecte a conta Meta em Redes sociais.");
  }

  const res = await fetch(`${GRAPH_URL}/${adAccountId}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: params.name,
      objective: params.objective,
      status: "PAUSED",
      special_ad_categories: [],
      access_token: channel.access_token,
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao criar campanha na Meta: ${await res.text()}`);
  }

  const data = (await res.json()) as { id: string };
  return { externalCampaignId: data.id };
}

/** Busca os resultados (spend/impressions/clicks) de uma campanha real na
 * Meta Marketing API, via o endpoint de insights. */
export async function fetchMetaCampaignInsights(
  channel: SocialChannel,
  externalCampaignId: string
): Promise<{ spend_cents: number; impressions: number; clicks: number; results: number }> {
  if (!channel.access_token) {
    throw new Error("Canal sem token de acesso — conecte a conta Meta em Redes sociais.");
  }

  const params = new URLSearchParams({
    fields: "spend,impressions,clicks,actions",
    access_token: channel.access_token,
  });
  const res = await fetch(`${GRAPH_URL}/${externalCampaignId}/insights?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Falha ao buscar resultados da campanha na Meta: ${await res.text()}`);
  }

  const json = (await res.json()) as {
    data: { spend?: string; impressions?: string; clicks?: string; actions?: { value: string }[] }[];
  };
  const row = json.data?.[0];
  const results = row?.actions?.reduce((sum, a) => sum + Number(a.value ?? 0), 0) ?? 0;

  return {
    spend_cents: Math.round(Number(row?.spend ?? 0) * 100),
    impressions: Number(row?.impressions ?? 0),
    clicks: Number(row?.clicks ?? 0),
    results,
  };
}
