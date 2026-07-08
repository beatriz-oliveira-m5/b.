import { createClient } from "@/lib/supabase/server";
import { NewCampaignForm } from "@/components/ads/NewCampaignForm";
import { CampaignRow } from "@/components/ads/CampaignRow";

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

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Ads</h1>
          <p className="text-sm text-neutral-500">
            Campanhas via Meta Marketing API (Instagram/Facebook). Sem conta de anúncios aprovada,
            o impulsionamento fica em modo de teste.
          </p>
        </div>
        <NewCampaignForm clients={clients ?? []} contentItems={contentItems ?? []} />
      </div>

      <div className="flex flex-col gap-3">
        {campaigns?.map((campaign) => (
          <div key={campaign.id}>
            <p className="mb-1 text-xs text-neutral-400">{clientById.get(campaign.client_id)?.name}</p>
            <CampaignRow campaign={campaign} />
          </div>
        ))}
      </div>

      {(!campaigns || campaigns.length === 0) && (
        <p className="text-sm text-neutral-500">Nenhuma campanha ainda.</p>
      )}
    </div>
  );
}
