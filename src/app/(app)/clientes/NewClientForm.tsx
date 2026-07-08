"use client";

import { useRef, useState, useTransition } from "react";
import { createClientRecord } from "@/lib/actions/clients";

const COLOR_OPTIONS = ["#7C5231", "#B5651D", "#8A9A5B", "#C99A3A", "#9C4A4A", "#7A6C5D"];

export function NewClientForm() {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        + Novo cliente
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await createClientRecord(formData);
            formRef.current?.reset();
            setColor(COLOR_OPTIONS[0]);
            setOpen(false);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao criar cliente.");
          }
        });
      }}
      className="mb-6 rounded-2xl border border-stone-200 bg-white p-5"
    >
      <input type="hidden" name="color" value={color} />
      <div className="mb-3 flex gap-3">
        <input
          name="name"
          required
          placeholder="Nome do cliente"
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>
      <div className="mb-3 flex gap-2">
        {COLOR_OPTIONS.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setColor(c)}
            className={`h-6 w-6 rounded-full border-2 ${
              color === c ? "border-stone-900" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Cor ${c}`}
          />
        ))}
      </div>
      <textarea
        name="notes"
        placeholder="Notas (opcional)"
        rows={2}
        className="mb-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar cliente"}
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
