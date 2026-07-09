"use client";

import { useState, useTransition } from "react";
import { boostCampaign, updateAdCampaignStatus, deleteAdCampaign } from "@/lib/actions/ads";
import { NetworkBadge } from "@/components/ui/NetworkBadge";
import type { AdsCampaign } from "@/lib/types/database";

const STATUS_LABELS: Record<AdsCampaign["status"], string> = {
  draft: "Rascunho",
  scheduled: "Agendada",
  active: "Ativa",
  paused: "Pausada",
  completed: "Concluída",
};

export function CampaignRow({ campaign }: { campaign: AdsCampaign }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
      <NetworkBadge network={campaign.network} />
      <span className="text-sm font-medium text-stone-800">
        {campaign.objective ?? "Campanha sem objetivo definido"}
      </span>
      <span className="text-xs text-stone-400">
        R$ {((campaign.budget_cents ?? 0) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </span>
      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
        {STATUS_LABELS[campaign.status]}
      </span>
      {campaign.source === "mock" && (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
          dados de teste
        </span>
      )}

      <div className="ml-auto flex items-center gap-2">
        {campaign.status === "draft" && (
          <button
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  await boostCampaign(campaign.id);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Erro ao impulsionar.");
                }
              });
            }}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            Impulsionar
          </button>
        )}
        {campaign.status === "active" && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => updateAdCampaignStatus(campaign.id, "paused"))}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium hover:bg-stone-50 disabled:opacity-50"
          >
            Pausar
          </button>
        )}
        {campaign.status === "paused" && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => updateAdCampaignStatus(campaign.id, "active"))}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium hover:bg-stone-50 disabled:opacity-50"
          >
            Reativar
          </button>
        )}
        <button
          disabled={isPending}
          onClick={() => startTransition(() => deleteAdCampaign(campaign.id))}
          className="text-xs text-stone-400 hover:text-red-600"
        >
          excluir
        </button>
      </div>

      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </div>
  );
}
