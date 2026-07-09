"use client";

import { useTransition } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { removeCompetitor, refreshCompetitorSnapshot } from "@/lib/actions/competitors";
import { NetworkBadge } from "@/components/ui/NetworkBadge";
import type { Competitor, CompetitorMetric } from "@/lib/types/database";

export function CompetitorCard({
  competitor,
  latest,
  ownEngagementRate,
}: {
  competitor: Competitor;
  latest: CompetitorMetric | undefined;
  ownEngagementRate: number | null;
}) {
  const [isPending, startTransition] = useTransition();

  const aheadOfOwn =
    ownEngagementRate != null && latest?.avg_engagement_rate != null
      ? latest.avg_engagement_rate > ownEngagementRate
      : null;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-900">{competitor.handle}</p>
          <NetworkBadge network={competitor.network} />
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => refreshCompetitorSnapshot(competitor.id, competitor.handle))
            }
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCw size={14} />
          </button>
          <button
            disabled={isPending}
            onClick={() => {
              if (!confirm(`Remover ${competitor.handle} da comparação?`)) return;
              startTransition(() => removeCompetitor(competitor.id));
            }}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            title="Remover"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {latest ? (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-semibold text-stone-900">
              {latest.followers_count?.toLocaleString("pt-BR")}
            </p>
            <p className="text-[11px] text-stone-400">seguidores</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">{latest.posts_count}</p>
            <p className="text-[11px] text-stone-400">posts</p>
          </div>
          <div>
            <p
              className={`text-sm font-semibold ${aheadOfOwn ? "text-red-500" : "text-emerald-600"}`}
            >
              {latest.avg_engagement_rate}%
            </p>
            <p className="text-[11px] text-stone-400">engajamento</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-stone-400">Sem dados ainda.</p>
      )}
      <p className="mt-2 text-center text-[10px] text-stone-300">dados estimados</p>
    </div>
  );
}
