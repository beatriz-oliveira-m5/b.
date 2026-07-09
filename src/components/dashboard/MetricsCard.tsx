import { NetworkBadge } from "@/components/ui/NetworkBadge";
import type { ContentNetwork } from "@/lib/types/database";

export function MetricsCard({
  network,
  reach,
  engagementRate,
  benchmarkRate,
  source,
}: {
  network: ContentNetwork;
  reach: number;
  engagementRate: number;
  benchmarkRate: number | null;
  source: "mock" | "real";
}) {
  const aboveBenchmark = benchmarkRate != null && engagementRate >= benchmarkRate;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <NetworkBadge network={network} />
        {source === "mock" && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            dados de teste
          </span>
        )}
      </div>

      <p className="text-2xl font-semibold text-stone-900">{reach.toLocaleString("pt-BR")}</p>
      <p className="mb-3 text-xs text-stone-500">alcance nos últimos 30 dias</p>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-stone-800">{engagementRate.toFixed(2)}%</span>
        <span className="text-stone-400">engajamento</span>
        {benchmarkRate != null && (
          <span className={aboveBenchmark ? "text-emerald-600" : "text-red-500"}>
            {aboveBenchmark ? "▲" : "▼"} benchmark {benchmarkRate}%
          </span>
        )}
      </div>
    </div>
  );
}
