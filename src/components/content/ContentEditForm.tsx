"use client";

import { useState, useTransition } from "react";
import { updateContentItem, deleteContentItem } from "@/lib/actions/content";
import { useRouter } from "next/navigation";
import { NETWORK_LABELS, type ContentItem, type ContentNetwork } from "@/lib/types/database";
import { format } from "date-fns";

const ALL_NETWORKS = Object.keys(NETWORK_LABELS) as ContentNetwork[];

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
}

export function ContentEditForm({ item }: { item: ContentItem }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [caption, setCaption] = useState(item.caption ?? "");
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await updateContentItem(item.id, formData);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao salvar.");
          }
        });
      }}
      className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Título</label>
        <input
          name="title"
          defaultValue={item.title}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Redes</label>
        <div className="flex flex-wrap gap-3">
          {ALL_NETWORKS.map((n) => (
            <label key={n} className="flex items-center gap-1.5 text-sm text-stone-700">
              <input
                type="checkbox"
                name="networks"
                value={n}
                defaultChecked={item.networks.includes(n)}
              />
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
          defaultValue={toLocalInputValue(item.scheduled_at)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Legenda</label>
        <textarea
          name="caption"
          rows={6}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
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
          {isPending ? "Salvando..." : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirm("Excluir este post?")) return;
            startTransition(async () => {
              await deleteContentItem(item.id);
              router.push("/calendario");
            });
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Excluir
        </button>
      </div>
    </form>
  );
}
