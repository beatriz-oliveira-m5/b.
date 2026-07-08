import type { SocialChannel } from "@/lib/types/database";
import type { DailyInsight, OAuthExchangeResult, SocialAdapter } from "../types";

/**
 * Adapter real para LinkedIn via LinkedIn Marketing Developer Platform.
 *
 * Pré-requisitos (fora do código, feitos pelo usuário em linkedin.com/developers):
 * 1. Criar um app LinkedIn associado a uma Company Page.
 * 2. Solicitar acesso ao "Marketing Developer Platform" — isso exige
 *    aprovação manual da LinkedIn (formulário + revisão do caso de uso),
 *    processo que costuma levar 1-2 semanas.
 * 3. Depois de aprovado, solicitar os escopos:
 *    - r_organization_social, rw_organization_admin (estatísticas da página)
 * Sem essa aprovação, a API só permite login básico — nenhuma métrica.
 */
export const linkedinRealAdapter: SocialAdapter = {
  network: "linkedin",
  isReal: true,

  getAuthorizationUrl(state: string) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/linkedin/callback`,
      state,
      scope: "r_organization_social,rw_organization_admin",
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string): Promise<OAuthExchangeResult> {
    const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
        client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      }),
    });
    if (!res.ok) throw new Error(`Falha ao trocar código por token (linkedin): ${await res.text()}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };

    return {
      access_token: data.access_token,
      refresh_token: null,
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      external_account_id: "",
      handle: "",
    };
  },

  async fetchInsights(channel: SocialChannel): Promise<DailyInsight[]> {
    if (!channel.access_token || !channel.external_account_id) {
      throw new Error("Canal linkedin sem token/ID salvo — reconecte em Redes sociais.");
    }

    const res = await fetch(
      `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:${channel.external_account_id}`,
      { headers: { Authorization: `Bearer ${channel.access_token}` } }
    );
    if (!res.ok) throw new Error(`Falha ao buscar estatísticas (linkedin): ${await res.text()}`);

    // A resposta da LinkedIn não é quebrada por dia por padrão — para uso em
    // produção, isso deve ser combinado com o histórico de posts publicados
    // via API para montar a série diária. Estrutura de retorno fica pronta
    // para essa implementação assim que o acesso for aprovado.
    return [];
  },
};
