import { STATUS_LABELS, type ContentStatus } from "@/lib/types/database";

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: "bg-stone-100 text-stone-600",
  in_review: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  published: "bg-brand-50 text-brand-700",
};

const STATUS_DOT: Record<ContentStatus, string> = {
  draft: "bg-stone-400",
  in_review: "bg-amber-500",
  approved: "bg-emerald-500",
  published: "bg-brand-600",
};

export function StatusBadge({
  status,
  compact = false,
}: {
  status: ContentStatus;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${STATUS_STYLES[status]} ${
        compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
