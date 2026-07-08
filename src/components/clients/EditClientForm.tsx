"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateClientRecord, archiveClientRecord } from "@/lib/actions/clients";
import type { Client } from "@/lib/types/database";

export function EditClientForm({ client }: { client: Client }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await updateClientRecord(client.id, formData);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao salvar.");
          }
        });
      }}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Nome</label>
        <input
          name="name"
          defaultValue={client.name}
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Cor no calendário</label>
        <input type="color" name="color" defaultValue={client.color} className="h-9 w-16" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Notas</label>
        <textarea
          name="notes"
          defaultValue={client.notes ?? ""}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirm("Arquivar este cliente? Ele deixa de aparecer nas listas ativas.")) return;
            startTransition(async () => {
              await archiveClientRecord(client.id, true);
              router.push("/clientes");
            });
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Arquivar cliente
        </button>
      </div>
    </form>
  );
}
