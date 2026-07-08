import { subDays, format } from "date-fns";
import type { ContentNetwork, SocialChannel } from "@/lib/types/database";
import type { DailyInsight, SocialAdapter } from "./types";

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h >>> 0;
}

/** PRNG determinístico (mulberry32) — mesma seed sempre gera a mesma sequência,
 * então os números "mock" ficam estáveis entre atualizações da tela. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_FOLLOWERS: Record<ContentNetwork, number> = {
  instagram: 4200,
  facebook: 2600,
  tiktok: 6100,
  linkedin: 900,
  youtube: 1500,
};

export function createMockAdapter(network: ContentNetwork): SocialAdapter {
  return {
    network,
    isReal: false,

    getAuthorizationUrl() {
      throw new Error(
        `${network}: conexão mock não usa OAuth. Troque o modo do canal para "real" após o app review.`
      );
    },

    async exchangeCodeForToken() {
      throw new Error(`${network}: conexão mock não troca token — nada a fazer.`);
    },

    async fetchInsights(channel: SocialChannel, days: number): Promise<DailyInsight[]> {
      const seedBase = hashSeed(channel.id + network);
      const baseFollowers = BASE_FOLLOWERS[network];
      const points: DailyInsight[] = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateKey = format(date, "yyyy-MM-dd");
        const rand = mulberry32(seedBase + i);

        const reach = Math.round(baseFollowers * (0.15 + rand() * 0.35));
        const impressions = Math.round(reach * (1.1 + rand() * 0.6));
        const likes = Math.round(reach * (0.03 + rand() * 0.05));
        const comments = Math.round(likes * (0.05 + rand() * 0.1));
        const shares = Math.round(likes * (0.02 + rand() * 0.06));
        const saves = Math.round(likes * (0.03 + rand() * 0.08));
        const engagement = likes + comments + shares + saves;
        const engagement_rate = reach > 0 ? Number(((engagement / reach) * 100).toFixed(2)) : 0;

        points.push({
          date: dateKey,
          impressions,
          reach,
          likes,
          comments,
          shares,
          saves,
          followers_count: Math.round(baseFollowers + i * -2 + rand() * 20),
          engagement_rate,
        });
      }

      return points;
    },
  };
}
