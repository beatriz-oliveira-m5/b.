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
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/calendario", label: "Calendário", Icon: CalendarDays },
  { href: "/tarefas", label: "Tarefas", Icon: CheckSquare },
  { href: "/clientes", label: "Clientes", Icon: Users },
  { href: "/redes", label: "Redes sociais", Icon: Share2 },
  { href: "/dashboard", label: "Relatórios", Icon: BarChart3 },
  { href: "/ads", label: "Ads", Icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-brand-900 px-3 py-5">
      <div className="mb-8 flex items-center gap-2.5 border-b border-brand-800/80 px-2 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sand-50 to-brand-200 text-base font-bold text-brand-800 shadow-sm">
          B
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Agência B</p>
          <p className="text-[11px] text-brand-300">painel interno</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-3 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-brand-100 hover:bg-brand-800 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-sand-100" />
              )}
              <Icon size={17} strokeWidth={2} className={active ? "text-white" : "text-brand-300"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-800 pt-2">
        <LogoutButton />
      </div>
    </aside>
  );
}
