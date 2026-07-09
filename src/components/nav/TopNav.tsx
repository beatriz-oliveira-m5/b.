"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  Users,
  Share2,
  BarChart3,
  Megaphone,
  Target,
  Users2,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/calendario", label: "Calendário", Icon: CalendarDays },
  { href: "/tarefas", label: "Tarefas", Icon: CheckSquare },
  { href: "/clientes", label: "Clientes", Icon: Users },
  { href: "/redes", label: "Redes", Icon: Share2 },
  { href: "/concorrencia", label: "Concorrentes", Icon: Target },
  { href: "/dashboard", label: "Relatórios", Icon: BarChart3 },
  { href: "/ads", label: "Ads", Icon: Megaphone },
  { href: "/equipe", label: "Equipe", Icon: Users2 },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
      <div className="flex items-center justify-between px-6 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
            B
          </div>
          <p className="text-sm font-semibold tracking-wide text-brand-900">Agência B</p>
        </div>
        <LogoutButton />
      </div>

      <nav className="flex items-center gap-0.5 overflow-x-auto border-t border-stone-100 px-4">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 flex-col items-center gap-1 border-b-2 px-4 py-2.5 transition ${
                active
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-stone-400 hover:border-stone-200 hover:text-stone-700"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
