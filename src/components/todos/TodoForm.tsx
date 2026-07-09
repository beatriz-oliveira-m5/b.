"use client";

import { useRef, useState, useTransition } from "react";
import { createTodo } from "@/lib/actions/todos";
import type { Client } from "@/lib/types/database";

export function TodoForm({ clients, defaultClientId }: { clients: Client[]; defaultClientId?: string }) {
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
            await createTodo(formData);
            formRef.current?.reset();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao criar tarefa.");
          }
        });
      }}
      className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
    >
      <div className="flex-1 min-w-[160px]">
        <label className="mb-1 block text-xs font-medium text-stone-500">Cliente</label>
        <select
          name="client_id"
          required
          defaultValue={defaultClientId ?? ""}
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

      <div className="flex-[2] min-w-[220px]">
        <label className="mb-1 block text-xs font-medium text-stone-500">Tarefa</label>
        <input
          name="title"
          required
          placeholder="Ex: aprovar artes da campanha"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Prazo</label>
        <input
          type="date"
          name="due_date"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {isPending ? "Salvando..." : "+ Adicionar"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
