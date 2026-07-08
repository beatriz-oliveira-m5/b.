"use server";

import { createClient } from "@/lib/supabase/server";
import { generatePerformanceInsight, type NetworkSummary } from "@/lib/ai/insights";
import type { ContentNetwork } from "@/lib/types/database";

export async function generateClientInsight(clientId: string) {
  const supabase = await createClient();

  const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [{ data: client }, { data: metrics }, { data: benchmarks }] = await Promise.all([
    supabase.from("clients").select("name").eq("id", clientId).single(),
    supabase
      .from("performance_metrics")
      .select("*")
      .eq("client_id", clientId)
      .gte("metric_date", since),
    supabase.from("benchmarks").select("*").eq("metric_name", "engagement_rate"),
  ]);

  if (!client) throw new Error("Cliente não encontrado.");

  const byNetwork = new Map<ContentNetwork, { reach: number; engagementSum: number; days: number }>();
  for (const m of metrics ?? []) {
    const entry = byNetwork.get(m.network) ?? { reach: 0, engagementSum: 0, days: 0 };
    entry.reach += m.reach;
    entry.engagementSum += m.engagement_rate ?? 0;
    entry.days += 1;
    byNetwork.set(m.network, entry);
  }

  const summaries: NetworkSummary[] = Array.from(byNetwork.entries()).map(([network, v]) => ({
    network,
    reach: v.reach,
    engagement_rate: v.days > 0 ? v.engagementSum / v.days : 0,
    benchmark_engagement_rate:
      benchmarks?.find((b) => b.network === network)?.benchmark_value ?? null,
  }));

  return generatePerformanceInsight(client.name, summaries);
}
