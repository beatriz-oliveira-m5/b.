import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sand-300 bg-white/60 px-6 py-16 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-stone-900">{title}</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-stone-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
