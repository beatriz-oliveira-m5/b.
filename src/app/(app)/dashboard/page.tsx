import { createClient } from "@/lib/supabase/server";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { InsightPanel } from "@/components/dashboard/InsightPanel";
import { ClientSelector } from "@/components/dashboard/ClientSelector";
import { isoDateDaysAgo } from "@/lib/dates";
import type { ContentNetwork, IntegrationMode } from "@/lib/types/database";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string }>;
}) {
  const { cliente } = await searchParams;
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("archived", false)
    .order("name");

  const activeClientId = cliente ?? clients?.[0]?.id;

  if (!activeClientId) {
    return (
      <div>
        <h1 className="mb-2 text-xl font-semibold text-stone-900">Relatórios</h1>
        <p className="text-sm text-stone-500">Cadastre um cliente primeiro na aba Clientes.</p>
      </div>
    );
  }

  const since = isoDateDaysAgo(30);

  const [{ data: metrics }, { data: benchmarks }] = await Promise.all([
    supabase
      .from("performance_metrics")
      .select("*")
      .eq("client_id", activeClientId)
      .gte("metric_date", since),
    supabase.from("benchmarks").select("*").eq("metric_name", "engagement_rate"),
  ]);

  const byNetwork = new Map<
    ContentNetwork,
    { reach: number; engagementSum: number; days: number; source: IntegrationMode }
  >();
  for (const m of metrics ?? []) {
    const entry = byNetwork.get(m.network) ?? {
      reach: 0,
      engagementSum: 0,
      days: 0,
      source: m.source,
    };
    entry.reach += m.reach;
    entry.engagementSum += m.engagement_rate ?? 0;
    entry.days += 1;
    entry.source = m.source;
    byNetwork.set(m.network, entry);
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">Relatórios</h1>
          <p className="text-sm text-stone-500">Performance dos últimos 30 dias, por rede.</p>
        </div>
        <ClientSelector clients={clients ?? []} activeClientId={activeClientId} />
      </div>

      {byNetwork.size === 0 ? (
        <p className="mb-6 text-sm text-stone-500">
          Nenhuma métrica ainda. Vá em Redes sociais e clique em &quot;Sincronizar métricas
          agora&quot; para este cliente.
        </p>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from(byNetwork.entries()).map(([network, v]) => (
            <MetricsCard
              key={network}
              network={network}
              reach={v.reach}
              engagementRate={v.days > 0 ? v.engagementSum / v.days : 0}
              benchmarkRate={benchmarks?.find((b) => b.network === network)?.benchmark_value ?? null}
              source={v.source}
            />
          ))}
        </div>
      )}

      <InsightPanel clientId={activeClientId} />
    </div>
  );
}
