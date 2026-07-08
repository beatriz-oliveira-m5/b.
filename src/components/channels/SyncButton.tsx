"use client";

import { useState, useTransition } from "react";
import { syncClientMetrics } from "@/lib/actions/channels";

export function SyncButton({ clientId }: { clientId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await syncClientMetrics(clientId);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erro ao sincronizar.");
            }
          });
        }}
        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50"
      >
        {isPending ? "Sincronizando..." : "Sincronizar métricas agora"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
