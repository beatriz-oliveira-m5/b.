"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createMetaCampaign } from "@/lib/integrations/real/meta-ads";
import type { ContentNetwork } from "@/lib/types/database";

export async function createAdCampaign(formData: FormData) {
  const client_id = String(formData.get("client_id") ?? "");
  const network = String(formData.get("network") ?? "instagram") as ContentNetwork;
  const objective = String(formData.get("objective") ?? "").trim();
  const budgetReais = Number(formData.get("budget") ?? 0);
  const content_item_id = String(formData.get("content_item_id") ?? "") || null;

  if (!client_id) throw new Error("Selecione um cliente.");
  if (budgetReais <= 0) throw new Error("Informe um orçamento válido.");

  const supabase = await createClient();
  const { error } = await supabase.from("ads_campaigns").insert({
    client_id,
    content_item_id,
    network,
    objective: objective || null,
    budget_cents: Math.round(budgetReais * 100),
    status: "draft",
    source: "mock",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/ads");
}

/** "Impulsiona" a campanha: chama a Meta Marketing API se o canal estiver
 * em modo real, senão simula (marca como ativa com um ID fictício). */
export async function boostCampaign(campaignId: string) {
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("ads_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();
  if (!campaign) throw new Error("Campanha não encontrada.");

  const { data: channel } = await supabase
    .from("social_channels")
    .select("*")
    .eq("client_id", campaign.client_id)
    .eq("network", campaign.network)
    .single();

  if (channel?.mode === "real") {
    // Requer ad_account_id salvo — ver comentário em lib/integrations/real/meta-ads.ts
    const adAccountId = channel.external_account_id;
    if (!adAccountId) {
      throw new Error(
        "Canal conectado, mas sem ad_account_id configurado — impulsionamento real ainda não disponível."
      );
    }
    const { externalCampaignId } = await createMetaCampaign(channel, adAccountId, {
      name: campaign.objective ?? "Campanha Agência B",
      objective: "OUTCOME_ENGAGEMENT",
      dailyBudgetCents: campaign.budget_cents ?? 0,
    });

    const { error } = await supabase
      .from("ads_campaigns")
      .update({ status: "active", external_campaign_id: externalCampaignId, source: "real" })
      .eq("id", campaignId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("ads_campaigns")
      .update({
        status: "active",
        external_campaign_id: `mock_${campaignId.slice(0, 8)}`,
        source: "mock",
      })
      .eq("id", campaignId);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/ads");
}

export async function updateAdCampaignStatus(
  campaignId: string,
  status: "draft" | "scheduled" | "active" | "paused" | "completed"
) {
  const supabase = await createClient();
  const { error } = await supabase.from("ads_campaigns").update({ status }).eq("id", campaignId);
  if (error) throw new Error(error.message);

  revalidatePath("/ads");
}

export async function deleteAdCampaign(campaignId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("ads_campaigns").delete().eq("id", campaignId);
  if (error) throw new Error(error.message);

  revalidatePath("/ads");
}
