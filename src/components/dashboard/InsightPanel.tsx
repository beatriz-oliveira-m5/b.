"use client";

import { useState, useTransition } from "react";
import { generateClientInsight } from "@/lib/actions/insights";

export function InsightPanel({ clientId }: { clientId: string }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-900">Insights de IA</h2>
        <button
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              try {
                const text = await generateClientInsight(clientId);
                setInsight(text);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Erro ao gerar insight.");
              }
            });
          }}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isPending ? "Analisando..." : "Gerar insight"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {insight && <p className="whitespace-pre-wrap text-sm text-stone-700">{insight}</p>}
      {!insight && !error && (
        <p className="text-sm text-stone-400">
          Clique em &quot;Gerar insight&quot; para comparar a performance com benchmarks de mercado.
        </p>
      )}
    </div>
  );
}
