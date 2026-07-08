import { anthropic, CAPTION_MODEL } from "./anthropic";
import { NETWORK_LABELS, type ContentNetwork } from "@/lib/types/database";

const CAPTION_LENGTH_HINT: Record<ContentNetwork, string> = {
  instagram: "legenda envolvente, pode usar quebras de linha e até 3-5 hashtags relevantes no fim",
  facebook: "texto um pouco mais descritivo, tom de conversa, sem excesso de hashtags",
  tiktok: "texto curto e direto, linguagem informal, 1-3 hashtags",
  linkedin: "tom profissional, sem hashtags em excesso, pode ter 1 pergunta de engajamento no fim",
  youtube: "texto para descrição de vídeo: 1-2 frases de gancho + contexto",
};

const captionsSchema = {
  type: "object",
  properties: {
    captions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          network: { type: "string" },
          text: { type: "string" },
        },
        required: ["network", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["captions"],
  additionalProperties: false,
} as const;

export interface GeneratedCaption {
  network: ContentNetwork;
  text: string;
}

export async function generateCaptions(params: {
  topic: string;
  tone: string;
  networks: ContentNetwork[];
}): Promise<GeneratedCaption[]> {
  const { topic, tone, networks } = params;
  if (networks.length === 0) throw new Error("Selecione ao menos uma rede.");

  const networkBriefs = networks
    .map((n) => `- ${NETWORK_LABELS[n]} (network: "${n}"): ${CAPTION_LENGTH_HINT[n]}`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: CAPTION_MODEL,
    max_tokens: 1024,
    system:
      "Você é redator(a) de social media de uma agência brasileira. Escreve legendas naturais, " +
      "sem clichê de IA (nada de 'no mundo de hoje', excesso de emojis ou frases genéricas). " +
      "Sempre em português do Brasil.",
    messages: [
      {
        role: "user",
        content:
          `Tema do post: ${topic}\n` +
          `Tom de voz desejado: ${tone}\n\n` +
          `Escreva uma legenda adaptada para cada uma destas redes:\n${networkBriefs}\n\n` +
          `Retorne um item por rede, usando exatamente o valor de "network" indicado acima.`,
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: captionsSchema },
    },
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("A IA não retornou texto.");
  }

  const parsed = JSON.parse(textBlock.text) as { captions: GeneratedCaption[] };
  return parsed.captions;
}
