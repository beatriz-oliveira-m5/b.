import { Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NewCampaignForm } from "@/components/ads/NewCampaignForm";
import { CampaignRow } from "@/components/ads/CampaignRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AdMetric } from "@/lib/types/database";

export default async function AdsPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("archived", false)
    .order("name");
  const { data: contentItems } = await supabase
    .from("content_items")
    .select("*")
    .order("scheduled_at", { ascending: false });
  const { data: campaigns } = await supabase
    .from("ads_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  const clientById = new Map((clients ?? []).map((c) => [c.id, c]));

  const campaignIds = (campaigns ?? []).map((c) => c.id);
  const { data: adMetrics } = campaignIds.length
    ? await supabase
        .from("ad_metrics")
        .select("*")
        .in("campaign_id", campaignIds)
        .order("metric_date", { ascending: false })
    : { data: [] as AdMetric[] };

  const latestMetricByCampaign = new Map<string, AdMetric>();
  for (const m of adMetrics ?? []) {
    if (!latestMetricByCampaign.has(m.campaign_id)) latestMetricByCampaign.set(m.campaign_id, m);
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Ads"
        description="Campanhas via Meta Marketing API (Instagram/Facebook). Sem conta de anúncios aprovada, o impulsionamento fica em modo de teste."
        action={<NewCampaignForm clients={clients ?? []} contentItems={contentItems ?? []} />}
      />

      <div className="flex flex-col gap-3">
        {campaigns?.map((campaign) => (
          <div key={campaign.id}>
            <p className="mb-1 text-xs text-stone-400">{clientById.get(campaign.client_id)?.name}</p>
            <CampaignRow campaign={campaign} latestMetric={latestMetricByCampaign.get(campaign.id)} />
          </div>
        ))}
      </div>

      {(!campaigns || campaigns.length === 0) && (
        <EmptyState
          icon={<Megaphone size={24} strokeWidth={1.75} />}
          title="Nenhuma campanha ainda"
          description={
            clients && clients.length > 0
              ? 'Clique em "+ Nova campanha" para criar a primeira campanha de impulsionamento.'
              : "Cadastre um cliente na aba Clientes antes de criar uma campanha."
          }
        />
      )}
    </div>
  );
}
