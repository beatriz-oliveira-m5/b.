"use client";

import { useRouter } from "next/navigation";
import type { Client } from "@/lib/types/database";

export function ClientSelector({ clients, activeClientId }: { clients: Client[]; activeClientId: string }) {
  const router = useRouter();

  return (
    <select
      defaultValue={activeClientId}
      onChange={(e) => router.push(`/dashboard?cliente=${e.target.value}`)}
      className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
    >
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
