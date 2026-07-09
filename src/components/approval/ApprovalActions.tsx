"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, MessageSquareWarning } from "lucide-react";
import { approveViaShareLink, requestChangesViaShareLink } from "@/lib/actions/approval";

export function ApprovalActions({ token }: { token: string }) {
  const [mode, setMode] = useState<"idle" | "changes" | "done">("idle");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (mode === "done") {
    return (
      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
        Obrigado! Sua resposta foi registrada.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mode === "idle" && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  await approveViaShareLink(token);
                  setMode("done");
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Erro ao aprovar.");
                }
              });
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle2 size={17} /> Aprovar
          </button>
          <button
            disabled={isPending}
            onClick={() => setMode("changes")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            <MessageSquareWarning size={17} /> Pedir ajustes
          </button>
        </div>
      )}

      {mode === "changes" && (
        <div className="flex flex-col gap-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="O que precisa ajustar?"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <div className="flex gap-2">
            <button
              disabled={isPending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  try {
                    await requestChangesViaShareLink(token, feedback);
                    setMode("done");
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Erro ao enviar.");
                  }
                });
              }}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending ? "Enviando..." : "Enviar pedido de ajuste"}
            </button>
            <button
              onClick={() => setMode("idle")}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-100"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
