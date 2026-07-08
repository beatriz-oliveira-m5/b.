import { anthropic, CAPTION_MODEL } from "./anthropic";
import { NETWORK_LABELS, type ContentNetwork } from "@/lib/types/database";

export interface NetworkSummary {
  network: ContentNetwork;
  reach: number;
  engagement_rate: number;
  benchmark_engagement_rate: number | null;
}

export async function generatePerformanceInsight(
  clientName: string,
  summaries: NetworkSummary[]
): Promise<string> {
  if (summaries.length === 0) {
    return "Ainda não há métricas suficientes para gerar um insight. Sincronize os dados em Redes sociais primeiro.";
  }

  const lines = summaries
    .map((s) => {
      const bench =
        s.benchmark_engagement_rate != null
          ? `benchmark de mercado ${s.benchmark_engagement_rate}%`
          : "sem benchmark disponível";
      return `- ${NETWORK_LABELS[s.network]}: alcance de ${s.reach.toLocaleString("pt-BR")}, taxa de engajamento ${s.engagement_rate.toFixed(2)}% (${bench})`;
    })
    .join("\n");

  const response = await anthropic.messages.create({
    model: CAPTION_MODEL,
    max_tokens: 700,
    system:
      "Você é analista de social media de uma agência brasileira. Escreve insights curtos, " +
      "diretos e práticos para a dona da agência tomar decisão — sem jargão técnico, sem enrolação.",
    messages: [
      {
        role: "user",
        content:
          `Cliente: ${clientName}\nDados dos últimos 30 dias por rede:\n${lines}\n\n` +
          "Escreva um resumo curto (4-6 frases) comparando a performance de cada rede com o " +
          "benchmark de mercado, destacando o que está indo bem, o que está abaixo da média, e " +
          "uma sugestão prática de próximo passo. Não use markdown, apenas texto corrido.",
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}
