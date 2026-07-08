import type { ContentNetwork, SocialChannel } from "@/lib/types/database";

export interface DailyInsight {
  date: string; // yyyy-MM-dd
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followers_count: number | null;
  engagement_rate: number | null;
}

export interface OAuthExchangeResult {
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  external_account_id: string;
  handle: string;
}

/**
 * Contrato comum para as integrações de rede social. Cada rede tem um adapter
 * "mock" (dados fictícios, funciona sem nenhuma aprovação) e um adapter "real"
 * (chama a API de verdade — só funciona depois do app review daquela plataforma
 * estar aprovado e o token OAuth salvo em social_channels).
 */
export interface SocialAdapter {
  network: ContentNetwork;
  /** true quando o adapter chama a API real; false quando devolve dados mock */
  isReal: boolean;
  getAuthorizationUrl(state: string): string;
  exchangeCodeForToken(code: string): Promise<OAuthExchangeResult>;
  fetchInsights(channel: SocialChannel, days: number): Promise<DailyInsight[]>;
}
