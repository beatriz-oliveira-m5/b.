"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateCompetitorSnapshot } from "@/lib/integrations/competitor-mock";
import type { ContentNetwork } from "@/lib/types/database";

const MAX_COMPETITORS_PER_CLIENT = 5;

export async function addCompetitor(formData: FormData) {
  const client_id = String(formData.get("client_id") ?? "");
  const network = String(formData.get("network") ?? "instagram") as ContentNetwork;
  const handle = String(formData.get("handle") ?? "").trim();

  if (!client_id) throw new Error("Selecione um cliente.");
  if (!handle) throw new Error("Informe o @ do concorrente.");

  const supabase = await createClient();
  const { count } = await supabase
    .from("competitors")
    .select("*", { count: "exact", head: true })
    .eq("client_id", client_id);

  if ((count ?? 0) >= MAX_COMPETITORS_PER_CLIENT) {
    throw new Error(`Máximo de ${MAX_COMPETITORS_PER_CLIENT} concorrentes por cliente.`);
  }

  const { data: competitor, error } = await supabase
    .from("competitors")
    .insert({ client_id, network, handle })
    .select()
    .single();
  if (error) throw new Error(error.message);

  const snapshot = generateCompetitorSnapshot(competitor.id, handle);
  await supabase.from("competitor_metrics").insert({
    competitor_id: competitor.id,
    metric_date: new Date().toISOString().slice(0, 10),
    ...snapshot,
    source: "mock",
  });

  revalidatePath("/concorrencia");
}

export async function removeCompetitor(competitorId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("competitors").delete().eq("id", competitorId);
  if (error) throw new Error(error.message);

  revalidatePath("/concorrencia");
}

export async function refreshCompetitorSnapshot(competitorId: string, handle: string) {
  const supabase = await createClient();
  const snapshot = generateCompetitorSnapshot(competitorId + Date.now(), handle);
  const { error } = await supabase.from("competitor_metrics").insert({
    competitor_id: competitorId,
    metric_date: new Date().toISOString().slice(0, 10),
    ...snapshot,
    source: "mock",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/concorrencia");
}
