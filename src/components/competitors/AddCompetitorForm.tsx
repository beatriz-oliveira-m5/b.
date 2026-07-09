"use client";

import { useRef, useState, useTransition } from "react";
import { addCompetitor } from "@/lib/actions/competitors";
import { NETWORK_LABELS, type ContentNetwork } from "@/lib/types/database";

const ALL_NETWORKS = Object.keys(NETWORK_LABELS) as ContentNetwork[];

export function AddCompetitorForm({ clientId, disabled }: { clientId: string; disabled: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await addCompetitor(formData);
            formRef.current?.reset();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao adicionar concorrente.");
          }
        });
      }}
      className="mb-4 flex flex-wrap items-end gap-2"
    >
      <input type="hidden" name="client_id" value={clientId} />
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Rede</label>
        <select
          name="network"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-400"
        >
          {ALL_NETWORKS.map((n) => (
            <option key={n} value={n}>
              {NETWORK_LABELS[n]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">@ do concorrente</label>
        <input
          name="handle"
          required
          placeholder="@concorrente"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || disabled}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        title={disabled ? "Máximo de 5 concorrentes por cliente" : undefined}
      >
        {isPending ? "Adicionando..." : "+ Adicionar"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
