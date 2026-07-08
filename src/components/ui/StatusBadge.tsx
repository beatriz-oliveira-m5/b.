import { STATUS_LABELS, type ContentStatus } from "@/lib/types/database";

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: "bg-stone-100 text-stone-600",
  in_review: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  published: "bg-brand-50 text-brand-700",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
