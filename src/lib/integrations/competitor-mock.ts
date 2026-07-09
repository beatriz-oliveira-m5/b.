function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h >>> 0;
}

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

export interface CompetitorSnapshot {
  followers_count: number;
  posts_count: number;
  avg_engagement_rate: number;
}

/** Gera um retrato "de mercado" plausível pra um concorrente — não é dado
 * real (ver docs/APP_REVIEW.md: benchmarking de concorrentes normalmente
 * exige um provedor de dados terceiro, não é liberado por app review comum). */
export function generateCompetitorSnapshot(competitorId: string, handle: string): CompetitorSnapshot {
  const rand = mulberry32(hashSeed(competitorId + handle));
  const followers_count = Math.round(2000 + rand() * 30000);
  const posts_count = Math.round(20 + rand() * 200);
  const avg_engagement_rate = Number((0.8 + rand() * 4).toFixed(2));
  return { followers_count, posts_count, avg_engagement_rate };
}
