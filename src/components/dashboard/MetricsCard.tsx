import { ArrowUp, ArrowDown } from "lucide-react";
import { NETWORK_ICON, NETWORK_CARD_BG } from "@/lib/networkStyle";
import { NETWORK_LABELS, type ContentNetwork } from "@/lib/types/database";

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
  const Icon = NETWORK_ICON[network];

  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-md ${NETWORK_CARD_BG[network]}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <Icon size={16} />
        </div>
        {source === "mock" && (
          <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-medium">
            dados de teste
          </span>
        )}
      </div>

      <p className="text-xs font-medium text-white/70">{NETWORK_LABELS[network]}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-2xl font-bold leading-tight">{reach.toLocaleString("pt-BR")}</p>
        {benchmarkRate != null &&
          (aboveBenchmark ? (
            <ArrowUp size={16} className="mb-1 text-emerald-300" />
          ) : (
            <ArrowDown size={16} className="mb-1 text-red-300" />
          ))}
      </div>
      <p className="mb-3 text-[11px] text-white/60">alcance nos últimos 30 dias</p>

      <div className="flex items-center gap-1.5 border-t border-white/15 pt-2 text-xs">
        <span className="font-semibold">{engagementRate.toFixed(2)}%</span>
        <span className="text-white/60">engajamento</span>
        {benchmarkRate != null && (
          <span className="ml-auto text-white/60">benchmark {benchmarkRate}%</span>
        )}
      </div>
    </div>
  );
}
