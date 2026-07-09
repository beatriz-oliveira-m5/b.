"use client";

import { useTransition } from "react";
import { updateTeamMemberRole, removeTeamMember } from "@/lib/actions/team";
import type { TeamMember } from "@/lib/types/database";

export function TeamMemberRow({
  member,
  isSelf,
  canManage,
}: {
  member: TeamMember;
  isSelf: boolean;
  canManage: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
        {member.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-900">
          {member.name} {isSelf && <span className="text-stone-400">(você)</span>}
        </p>
        <p className="text-xs text-stone-500">{member.email}</p>
      </div>

      {canManage ? (
        <select
          value={member.role}
          disabled={isPending || isSelf}
          onChange={(e) =>
            startTransition(() => updateTeamMemberRole(member.id, e.target.value as "admin" | "editor"))
          }
          className="rounded-lg border border-stone-300 px-2 py-1.5 text-xs outline-none focus:border-brand-400 disabled:opacity-50"
        >
          <option value="admin">Administradora</option>
          <option value="editor">Editora</option>
        </select>
      ) : (
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
          {member.role === "admin" ? "Administradora" : "Editora"}
        </span>
      )}

      {canManage && !isSelf && (
        <button
          disabled={isPending}
          onClick={() => {
            if (!confirm(`Remover ${member.name} da equipe?`)) return;
            startTransition(() => removeTeamMember(member.id));
          }}
          className="text-xs text-stone-400 hover:text-red-600"
        >
          remover
        </button>
      )}
    </li>
  );
}
