"use client";

import { useTransition } from "react";
import { updateContentStatus } from "@/lib/actions/content";
import { STATUS_LABELS, type ContentStatus } from "@/lib/types/database";

const ORDER: ContentStatus[] = ["draft", "in_review", "approved", "published"];

export function StatusStepper({
  contentId,
  status,
}: {
  contentId: string;
  status: ContentStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const currentIndex = ORDER.indexOf(status);

  function moveTo(next: ContentStatus) {
    startTransition(async () => {
      await updateContentStatus(contentId, next);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {ORDER.map((s, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        return (
          <button
            key={s}
            disabled={isPending}
            onClick={() => moveTo(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
              active
                ? "bg-brand-600 text-white"
                : done
                  ? "bg-brand-100 text-brand-700 hover:bg-brand-200"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        );
      })}
    </div>
  );
}
