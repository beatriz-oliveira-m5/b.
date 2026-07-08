"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createContentItem } from "@/lib/actions/content";
import { NETWORK_LABELS, type ContentNetwork, type Client } from "@/lib/types/database";

const ALL_NETWORKS = Object.keys(NETWORK_LABELS) as ContentNetwork[];

export function NewContentForm({
  clients,
  defaultClientId,
}: {
  clients: Client[];
  defaultClientId?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            const { id } = await createContentItem(formData);
            router.push(`/conteudo/${id}`);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao criar o post.");
          }
        });
      }}
      className="flex max-w-xl flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Cliente</label>
        <select
          name="client_id"
          required
          defaultValue={defaultClientId ?? ""}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Selecione um cliente
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Título</label>
        <input
          name="title"
          required
          placeholder="Ex: Reels de bastidores"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Redes</label>
        <div className="flex flex-wrap gap-3">
          {ALL_NETWORKS.map((n) => (
            <label key={n} className="flex items-center gap-1.5 text-sm text-stone-700">
              <input type="checkbox" name="networks" value={n} />
              {NETWORK_LABELS[n]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Data e hora de publicação
        </label>
        <input
          type="datetime-local"
          name="scheduled_at"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Legenda (opcional agora — pode gerar com IA depois)
        </label>
        <textarea
          name="caption"
          rows={4}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {isPending ? "Criando..." : "Criar rascunho"}
      </button>
    </form>
  );
}
