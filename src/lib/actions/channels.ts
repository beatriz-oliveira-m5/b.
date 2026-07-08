"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdapter } from "@/lib/integrations/registry";
import type { ContentNetwork } from "@/lib/types/database";

/** Cria/atualiza um canal em modo mock — não depende de nenhuma aprovação externa. */
export async function connectMockChannel(clientId: string, network: ContentNetwork, handle: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_channels").upsert(
    {
      client_id: clientId,
      network,
      handle: handle || null,
      mode: "mock",
      connected_at: new Date().toISOString(),
    },
    { onConflict: "client_id,network" }
  );
  if (error) throw new Error(error.message);

  revalidatePath("/redes");
}

export async function disconnectChannel(channelId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_channels").delete().eq("id", channelId);
  if (error) throw new Error(error.message);

  revalidatePath("/redes");
}

/** Puxa métricas (mock ou reais, dependendo do modo do canal) e grava em performance_metrics. */
export async function syncClientMetrics(clientId: string) {
  const supabase = await createClient();
  const { data: channels } = await supabase
    .from("social_channels")
    .select("*")
    .eq("client_id", clientId);

  if (!channels || channels.length === 0) return;

  const days = 30;
  const sinceDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  for (const channel of channels) {
    const adapter = getAdapter(channel.network, channel.mode);
    const points = await adapter.fetchInsights(channel, days);
    if (points.length === 0) continue;

    await supabase
      .from("performance_metrics")
      .delete()
      .eq("client_id", clientId)
      .eq("network", channel.network)
      .gte("metric_date", sinceDate);

    const { error } = await supabase.from("performance_metrics").insert(
      points.map((p) => ({
        client_id: clientId,
        network: channel.network,
        metric_date: p.date,
        impressions: p.impressions,
        reach: p.reach,
        likes: p.likes,
        comments: p.comments,
        shares: p.shares,
        saves: p.saves,
        followers_count: p.followers_count,
        engagement_rate: p.engagement_rate,
        source: channel.mode,
      }))
    );
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
