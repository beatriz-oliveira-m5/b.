"use client";

import { useState, useTransition } from "react";
import { createAdCampaign } from "@/lib/actions/ads";
import type { Client, ContentItem } from "@/lib/types/database";

export function NewCampaignForm({
  clients,
  contentItems,
}: {
  clients: Client[];
  contentItems: ContentItem[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        + Nova campanha
      </button>
    );
  }

  const clientContentItems = contentItems.filter((c) => c.client_id === selectedClient);

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await createAdCampaign(formData);
            setOpen(false);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao criar campanha.");
          }
        });
      }}
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Cliente</label>
        <select
          name="client_id"
          required
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Selecione
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Rede</label>
        <select name="network" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
        </select>
      </div>

      {clientContentItems.length > 0 && (
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">
            Post para impulsionar (opcional)
          </label>
          <select
            name="content_item_id"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">Nenhum — campanha avulsa</option>
            {clientContentItems.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Objetivo</label>
        <input
          name="objective"
          placeholder="Ex: mais seguidores, tráfego pro site..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Orçamento (R$)</label>
        <input
          type="number"
          name="budget"
          min="1"
          step="0.01"
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Criar rascunho"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
