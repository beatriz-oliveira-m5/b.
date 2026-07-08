"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateCaptionsForContent, selectCaption } from "@/lib/actions/captions";
import { NETWORK_LABELS, type AiCaption, type ContentNetwork } from "@/lib/types/database";

const TONE_SUGGESTIONS = ["descontraído", "profissional", "inspirador", "divertido", "urgente/promocional"];

export function CaptionGenerator({
  contentId,
  networks,
  previousCaptions,
}: {
  contentId: string;
  networks: ContentNetwork[];
  previousCaptions: AiCaption[];
}) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(TONE_SUGGESTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [captions, setCaptions] = useState<AiCaption[]>(previousCaptions);
  const router = useRouter();

  if (networks.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Selecione ao menos uma rede social acima e salve para poder gerar legendas com IA.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Tema do post</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex: promoção de dia das mães, bastidores da produção..."
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Tom de voz</label>
        <div className="flex flex-wrap gap-2">
          {TONE_SUGGESTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                tone === t ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        disabled={isPending || !topic.trim()}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await generateCaptionsForContent({ contentId, topic, tone, networks });
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erro ao gerar legendas.");
            }
          });
        }}
        className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isPending ? "Gerando..." : "Gerar legendas com IA"}
      </button>

      {captions.length > 0 && (
        <div className="flex flex-col gap-3">
          {captions.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border p-3 ${
                c.selected ? "border-indigo-400 bg-indigo-50" : "border-neutral-200"
              }`}
            >
              <p className="mb-1 text-xs font-medium text-neutral-500">
                {NETWORK_LABELS[c.network]}
              </p>
              <p className="mb-2 whitespace-pre-wrap text-sm text-neutral-800">
                {c.generated_text}
              </p>
              <button
                type="button"
                onClick={() => {
                  startTransition(async () => {
                    await selectCaption(contentId, c.id, c.generated_text);
                    setCaptions((prev) =>
                      prev.map((p) => ({ ...p, selected: p.id === c.id }))
                    );
                    router.refresh();
                  });
                }}
                className="text-xs font-medium text-indigo-600 hover:underline"
              >
                Usar esta legenda
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
