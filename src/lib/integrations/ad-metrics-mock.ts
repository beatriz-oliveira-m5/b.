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

export function generateMockAdMetrics(campaignId: string, budgetCents: number) {
  const rand = mulberry32(hashSeed(campaignId + Date.now()));
  const spend_cents = Math.round(budgetCents * (0.4 + rand() * 0.5));
  const impressions = Math.round((spend_cents / 100) * (80 + rand() * 60));
  const clicks = Math.round(impressions * (0.01 + rand() * 0.03));
  const results = Math.round(clicks * (0.1 + rand() * 0.25));
  return { spend_cents, impressions, clicks, results };
}
