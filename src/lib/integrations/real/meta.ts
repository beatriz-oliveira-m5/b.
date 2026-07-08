import { format, subDays } from "date-fns";
import type { ContentNetwork, SocialChannel } from "@/lib/types/database";
import type { DailyInsight, OAuthExchangeResult, SocialAdapter } from "../types";

const GRAPH_VERSION = "v21.0";
const GRAPH_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;

/**
 * Adapter real para Instagram e Facebook via Meta Graph API.
 *
 * Pré-requisitos (fora do código, feitos pelo usuário no developers.facebook.com):
 * 1. Criar um app Meta e adicionar o produto "Facebook Login for Business".
 * 2. Passar pelo App Review solicitando as permissões:
 *    - instagram_basic, instagram_manage_insights, pages_show_list,
 *      pages_read_engagement (Instagram)
 *    - pages_read_engagement, pages_read_user_content (Facebook)
 * 3. Completar a Verificação de Negócio (Business Verification) da Meta —
 *    obrigatória para liberar essas permissões em modo "Live".
 * 4. A conta do Instagram do cliente precisa ser uma conta profissional
 *    conectada a uma Página do Facebook.
 * Isso costuma levar de alguns dias a algumas semanas, fora do controle do dev.
 */
function metaAdapter(network: Extract<ContentNetwork, "instagram" | "facebook">): SocialAdapter {
  return {
    network,
    isReal: true,

    getAuthorizationUrl(state: string) {
      const params = new URLSearchParams({
        client_id: process.env.META_APP_ID ?? "",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/${network}/callback`,
        state,
        scope:
          network === "instagram"
            ? "instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement"
            : "pages_read_engagement,pages_read_user_content",
      });
      return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params.toString()}`;
    },

    async exchangeCodeForToken(code: string): Promise<OAuthExchangeResult> {
      const params = new URLSearchParams({
        client_id: process.env.META_APP_ID ?? "",
        client_secret: process.env.META_APP_SECRET ?? "",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/${network}/callback`,
        code,
      });
      const res = await fetch(`${GRAPH_URL}/oauth/access_token?${params.toString()}`);
      if (!res.ok) throw new Error(`Falha ao trocar código por token (${network}): ${await res.text()}`);
      const data = (await res.json()) as { access_token: string; expires_in?: number };

      // Para uso em produção: trocar por long-lived token e resolver o
      // Instagram Business Account ID / Page ID correspondente.
      return {
        access_token: data.access_token,
        refresh_token: null,
        expires_at: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000).toISOString()
          : null,
        external_account_id: "",
        handle: "",
      };
    },

    async fetchInsights(channel: SocialChannel, days: number): Promise<DailyInsight[]> {
      if (!channel.access_token || !channel.external_account_id) {
        throw new Error(`Canal ${network} sem token/ID salvo — reconecte em Redes sociais.`);
      }

      const metricSet =
        network === "instagram"
          ? "impressions,reach,likes,comments,shares,saved"
          : "page_impressions,page_engaged_users";

      const since = Math.floor(subDays(new Date(), days).getTime() / 1000);
      const until = Math.floor(Date.now() / 1000);

      const params = new URLSearchParams({
        metric: metricSet,
        period: "day",
        since: String(since),
        until: String(until),
        access_token: channel.access_token,
      });

      const res = await fetch(
        `${GRAPH_URL}/${channel.external_account_id}/insights?${params.toString()}`
      );
      if (!res.ok) throw new Error(`Falha ao buscar insights (${network}): ${await res.text()}`);

      const json = (await res.json()) as {
        data: { name: string; values: { value: number; end_time: string }[] }[];
      };

      const byDate = new Map<string, Partial<DailyInsight>>();
      for (const metric of json.data ?? []) {
        for (const point of metric.values) {
          const dateKey = format(new Date(point.end_time), "yyyy-MM-dd");
          const entry = byDate.get(dateKey) ?? {};
          (entry as Record<string, number>)[metric.name] = point.value;
          byDate.set(dateKey, entry);
        }
      }

      return Array.from(byDate.entries()).map(([date, v]) => ({
        date,
        impressions: v.impressions ?? 0,
        reach: v.reach ?? 0,
        likes: v.likes ?? 0,
        comments: v.comments ?? 0,
        shares: v.shares ?? 0,
        saves: v.saves ?? 0,
        followers_count: null,
        engagement_rate: null,
      }));
    },
  };
}

export const instagramRealAdapter = metaAdapter("instagram");
export const facebookRealAdapter = metaAdapter("facebook");
