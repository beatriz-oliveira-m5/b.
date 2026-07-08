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
                ? "bg-indigo-600 text-white"
                : done
                  ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        );
      })}
    </div>
  );
}
