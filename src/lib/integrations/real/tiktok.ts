import { format } from "date-fns";
import type { SocialChannel } from "@/lib/types/database";
import type { DailyInsight, OAuthExchangeResult, SocialAdapter } from "../types";

/**
 * Adapter real para TikTok via TikTok for Developers (Login Kit + Display API).
 *
 * Pré-requisitos (fora do código, feitos pelo usuário em developers.tiktok.com):
 * 1. Criar um app e solicitar os produtos "Login Kit" e "Display API".
 * 2. Passar pelo App Review do TikTok pedindo os escopos:
 *    - user.info.basic, video.list (leitura de métricas dos vídeos)
 * 3. Verificação da empresa/app pode ser exigida dependendo do volume de uso.
 * A API do TikTok não tem um endpoint único de "insights diários" como a Meta —
 * as métricas (like_count, comment_count, share_count, view_count) vêm por
 * vídeo, então este adapter soma os vídeos publicados em cada dia.
 */
export const tiktokRealAdapter: SocialAdapter = {
  network: "tiktok",
  isReal: true,

  getAuthorizationUrl(state: string) {
    const params = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY ?? "",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/tiktok/callback`,
      state,
      scope: "user.info.basic,video.list",
      response_type: "code",
    });
    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string): Promise<OAuthExchangeResult> {
    const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY ?? "",
        client_secret: process.env.TIKTOK_CLIENT_SECRET ?? "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/tiktok/callback`,
      }),
    });
    if (!res.ok) throw new Error(`Falha ao trocar código por token (tiktok): ${await res.text()}`);
    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      open_id: string;
    };

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      external_account_id: data.open_id,
      handle: "",
    };
  },

  async fetchInsights(channel: SocialChannel): Promise<DailyInsight[]> {
    if (!channel.access_token) {
      throw new Error("Canal tiktok sem token salvo — reconecte em Redes sociais.");
    }

    const res = await fetch(
      "https://open.tiktokapis.com/v2/video/list/?fields=create_time,like_count,comment_count,share_count,view_count",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${channel.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ max_count: 20 }),
      }
    );
    if (!res.ok) throw new Error(`Falha ao buscar vídeos (tiktok): ${await res.text()}`);

    const json = (await res.json()) as {
      data: {
        videos: {
          create_time: number;
          like_count: number;
          comment_count: number;
          share_count: number;
          view_count: number;
        }[];
      };
    };

    const byDate = new Map<string, DailyInsight>();
    for (const video of json.data?.videos ?? []) {
      const dateKey = format(new Date(video.create_time * 1000), "yyyy-MM-dd");
      const entry =
        byDate.get(dateKey) ??
        ({
          date: dateKey,
          impressions: 0,
          reach: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          followers_count: null,
          engagement_rate: null,
        } satisfies DailyInsight);

      entry.impressions += video.view_count;
      entry.reach += video.view_count;
      entry.likes += video.like_count;
      entry.comments += video.comment_count;
      entry.shares += video.share_count;
      byDate.set(dateKey, entry);
    }

    return Array.from(byDate.values());
  },
};
