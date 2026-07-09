"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { boostCampaign, updateAdCampaignStatus, deleteAdCampaign, syncAdMetrics } from "@/lib/actions/ads";
import { NetworkBadge } from "@/components/ui/NetworkBadge";
import type { AdMetric, AdsCampaign } from "@/lib/types/database";

const STATUS_LABELS: Record<AdsCampaign["status"], string> = {
  draft: "Rascunho",
  scheduled: "Agendada",
  active: "Ativa",
  paused: "Pausada",
  completed: "Concluída",
};

export function CampaignRow({
  campaign,
  latestMetric,
}: {
  campaign: AdsCampaign;
  latestMetric?: AdMetric;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
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
          {["active", "paused", "completed"].includes(campaign.status) && (
            <button
              disabled={isPending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  try {
                    await syncAdMetrics(campaign.id);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Erro ao sincronizar.");
                  }
                });
              }}
              className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium hover:bg-stone-50 disabled:opacity-50"
            >
              <RefreshCw size={13} /> Sincronizar resultados
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
      </div>

      {latestMetric && (
        <div className="mt-3 grid grid-cols-4 gap-2 border-t border-stone-100 pt-3 text-center">
          <div>
            <p className="text-sm font-semibold text-stone-900">
              R$ {(latestMetric.spend_cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-stone-400">investido</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">
              {latestMetric.impressions.toLocaleString("pt-BR")}
            </p>
            <p className="text-[11px] text-stone-400">impressões</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">
              {latestMetric.clicks.toLocaleString("pt-BR")}
            </p>
            <p className="text-[11px] text-stone-400">cliques</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">{latestMetric.results}</p>
            <p className="text-[11px] text-stone-400">resultados</p>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
