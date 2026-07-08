import type { SocialChannel } from "@/lib/types/database";
import type { DailyInsight, OAuthExchangeResult, SocialAdapter } from "../types";

/**
 * Adapter real para YouTube via YouTube Data API v3 + YouTube Analytics API
 * (Google Cloud Console).
 *
 * Pré-requisitos (fora do código, feitos pelo usuário no Google Cloud Console):
 * 1. Criar um projeto no Google Cloud, ativar "YouTube Data API v3" e
 *    "YouTube Analytics API".
 * 2. Configurar a tela de consentimento OAuth (OAuth consent screen) e, para
 *    sair do modo "Testing" (limitado a poucos usuários de teste) e liberar
 *    para uso normal, passar pela Verificação do Google (Google verification) —
 *    exige demonstrar o uso do escopo sensível de Analytics.
 * 3. Escopos necessários:
 *    - https://www.googleapis.com/auth/youtube.readonly
 *    - https://www.googleapis.com/auth/yt-analytics.readonly
 */
export const youtubeRealAdapter: SocialAdapter = {
  network: "youtube",
  isReal: true,

  getAuthorizationUrl(state: string) {
    const params = new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID ?? "",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/youtube/callback`,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      state,
      scope:
        "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string): Promise<OAuthExchangeResult> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.YOUTUBE_CLIENT_ID ?? "",
        client_secret: process.env.YOUTUBE_CLIENT_SECRET ?? "",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/youtube/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!res.ok) throw new Error(`Falha ao trocar código por token (youtube): ${await res.text()}`);
    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? null,
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      external_account_id: "",
      handle: "",
    };
  },

  async fetchInsights(channel: SocialChannel, days: number): Promise<DailyInsight[]> {
    if (!channel.access_token || !channel.external_account_id) {
      throw new Error("Canal youtube sem token/ID salvo — reconecte em Redes sociais.");
    }

    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

    const params = new URLSearchParams({
      ids: `channel==${channel.external_account_id}`,
      startDate,
      endDate,
      metrics: "views,likes,comments,shares,subscribersGained",
      dimensions: "day",
    });

    const res = await fetch(`https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`, {
      headers: { Authorization: `Bearer ${channel.access_token}` },
    });
    if (!res.ok) throw new Error(`Falha ao buscar analytics (youtube): ${await res.text()}`);

    const json = (await res.json()) as { rows?: [string, number, number, number, number, number][] };

    return (json.rows ?? []).map(([date, views, likes, comments, shares]) => ({
      date,
      impressions: views,
      reach: views,
      likes,
      comments,
      shares,
      saves: 0,
      followers_count: null,
      engagement_rate: null,
    }));
  },
};
