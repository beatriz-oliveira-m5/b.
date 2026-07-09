"use client";

import { useState, useTransition } from "react";
import { connectMockChannel, disconnectChannel } from "@/lib/actions/channels";
import { NETWORK_ICON, NETWORK_CARD_BG } from "@/lib/networkStyle";
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
    ? "text-stone-400"
    : channel.mode === "real"
      ? "text-emerald-600"
      : "text-amber-600";

  const Icon = NETWORK_ICON[network];

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 py-3 last:border-0">
      <span className="flex w-32 shrink-0 items-center gap-2">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${NETWORK_CARD_BG[network]}`}
        >
          <Icon size={12} />
        </span>
        <span className="text-sm font-medium text-stone-700">{NETWORK_LABELS[network]}</span>
      </span>
      <span className={`w-48 text-xs font-medium ${statusColor}`}>{statusLabel}</span>

      {channel && <span className="text-xs text-stone-400">{channel.handle}</span>}

      <div className="ml-auto flex items-center gap-2">
        {!channel && !showMockForm && (
          <>
            <button
              onClick={() => setShowMockForm(true)}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
            >
              Conectar com dados de teste
            </button>
            <a
              href={`/api/integrations/${network}/connect?client_id=${clientId}`}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
              title="Só funciona depois do app review dessa rede ser aprovado"
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
              className="w-32 rounded-lg border border-stone-300 px-2 py-1.5 text-xs outline-none focus:border-brand-400"
            />
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await connectMockChannel(clientId, network, handle);
                  setShowMockForm(false);
                })
              }
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Salvar
            </button>
            <button
              onClick={() => setShowMockForm(false)}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              cancelar
            </button>
          </div>
        )}

        {channel && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => disconnectChannel(channel.id))}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Desconectar
          </button>
        )}
      </div>
    </div>
  );
}
