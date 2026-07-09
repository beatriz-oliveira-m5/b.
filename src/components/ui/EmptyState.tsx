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
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sand-300 bg-sand-50/60 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">
        {icon}
      </div>
      <div>
        <p className="font-medium text-stone-900">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
