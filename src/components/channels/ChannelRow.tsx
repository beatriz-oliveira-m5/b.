"use client";

import { useState, useTransition } from "react";
import { connectMockChannel, disconnectChannel } from "@/lib/actions/channels";
import { NETWORK_LABELS, type ContentNetwork, type SocialChannel } from "@/lib/types/database";

export function ChannelRow({
  clientId,
  network,
  channel,
}: {
  clientId: string;
  network: ContentNetwork;
  channel?: SocialChannel;
}) {
  const [handle, setHandle] = useState(channel?.handle ?? "");
  const [isPending, startTransition] = useTransition();
  const [showMockForm, setShowMockForm] = useState(false);

  const statusLabel = !channel
    ? "Não conectado"
    : channel.mode === "real"
      ? "Conectado (API real)"
      : "Conectado (dados de teste)";

  const statusColor = !channel
    ? "text-neutral-400"
    : channel.mode === "real"
      ? "text-emerald-600"
      : "text-amber-600";

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 py-3 last:border-0">
      <span className="w-24 text-sm font-medium text-neutral-800">{NETWORK_LABELS[network]}</span>
      <span className={`w-48 text-xs font-medium ${statusColor}`}>{statusLabel}</span>

      {channel && (
        <span className="text-xs text-neutral-400">{channel.handle}</span>
      )}

      <div className="ml-auto flex items-center gap-2">
        {!channel && !showMockForm && (
          <>
            <button
              onClick={() => setShowMockForm(true)}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
            >
              Conectar com dados de teste
            </button>
            <a
              href={`/api/integrations/${network}/connect?client_id=${clientId}`}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Conectar de verdade
            </a>
          </>
        )}

        {!channel && showMockForm && (
          <div className="flex items-center gap-2">
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@usuario"
              className="w-32 rounded-lg border border-neutral-300 px-2 py-1.5 text-xs"
            />
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await connectMockChannel(clientId, network, handle);
                  setShowMockForm(false);
                })
              }
              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 disabled:opacity-50"
            >
              Salvar
            </button>
            <button
              onClick={() => setShowMockForm(false)}
              className="text-xs text-neutral-400 hover:text-neutral-600"
            >
              cancelar
            </button>
          </div>
        )}

        {channel && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => disconnectChannel(channel.id))}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Desconectar
          </button>
        )}
      </div>
    </div>
  );
}
