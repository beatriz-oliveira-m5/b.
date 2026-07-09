import { Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClientSelector } from "@/components/ui/ClientSelector";
import { AddCompetitorForm } from "@/components/competitors/AddCompetitorForm";
import { CompetitorCard } from "@/components/competitors/CompetitorCard";
import { isoDateDaysAgo } from "@/lib/dates";
import type { CompetitorMetric } from "@/lib/types/database";

export default async function ConcorrenciaPage({
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
      <div className="max-w-4xl">
        <PageHeader
          title="Concorrência"
          description="Compare o desempenho dos seus clientes com o de concorrentes do mesmo segmento."
        />
        <EmptyState
          icon={<Target size={24} strokeWidth={1.75} />}
          title="Cadastre um cliente para começar"
          description="Crie o primeiro cliente na aba Clientes para poder acompanhar concorrentes dele."
        />
      </div>
    );
  }

  const [{ data: competitors }, { data: ownMetrics }] = await Promise.all([
    supabase
      .from("competitors")
      .select("*")
      .eq("client_id", activeClientId)
      .order("created_at"),
    supabase
      .from("performance_metrics")
      .select("engagement_rate")
      .eq("client_id", activeClientId)
      .gte("metric_date", isoDateDaysAgo(30)),
  ]);

  const competitorIds = (competitors ?? []).map((c) => c.id);
  const { data: metrics } = competitorIds.length
    ? await supabase
        .from("competitor_metrics")
        .select("*")
        .in("competitor_id", competitorIds)
        .order("metric_date", { ascending: false })
    : { data: [] as CompetitorMetric[] };

  const latestByCompetitor = new Map<string, CompetitorMetric>();
  for (const m of metrics ?? []) {
    if (!latestByCompetitor.has(m.competitor_id)) latestByCompetitor.set(m.competitor_id, m);
  }

  const ownRates = (ownMetrics ?? []).map((m) => m.engagement_rate).filter((v): v is number => v != null);
  const ownAvgEngagement = ownRates.length
    ? Number((ownRates.reduce((a, b) => a + b, 0) / ownRates.length).toFixed(2))
    : null;

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Concorrência"
        description="Compare o desempenho dos seus clientes com o de concorrentes do mesmo segmento (até 5 por cliente)."
        action={
          <ClientSelector clients={clients ?? []} activeClientId={activeClientId} basePath="/concorrencia" />
        }
      />

      <AddCompetitorForm clientId={activeClientId} disabled={(competitors?.length ?? 0) >= 5} />

      {!competitors || competitors.length === 0 ? (
        <EmptyState
          icon={<Target size={24} strokeWidth={1.75} />}
          title="Nenhum concorrente cadastrado"
          description="Adicione até 5 perfis concorrentes acima pra comparar engajamento, alcance e crescimento."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((c) => (
            <CompetitorCard
              key={c.id}
              competitor={c}
              latest={latestByCompetitor.get(c.id)}
              ownEngagementRate={ownAvgEngagement}
            />
          ))}
        </div>
      )}

      {ownAvgEngagement != null && (
        <p className="mt-4 text-xs text-stone-400">
          Seu engajamento médio nos últimos 30 dias: {ownAvgEngagement}% — usado como referência nos
          cards acima.
        </p>
      )}
    </div>
  );
}
