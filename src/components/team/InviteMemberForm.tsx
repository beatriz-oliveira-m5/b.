"use client";

import { useRef, useState, useTransition } from "react";
import { UserPlus } from "lucide-react";
import { inviteTeamMember } from "@/lib/actions/team";

export function InviteMemberForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        <UserPlus size={16} /> Convidar
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
            await inviteTeamMember(formData);
            formRef.current?.reset();
            setOpen(false);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao convidar.");
          }
        });
      }}
      className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Nome</label>
        <input
          name="name"
          required
          placeholder="Nome da pessoa"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="email@exemplo.com"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Nível</label>
        <select
          name="role"
          defaultValue="editor"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-400"
        >
          <option value="editor">Editora</option>
          <option value="admin">Administradora</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar convite"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded-lg px-4 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
      >
        Cancelar
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
