"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/calendario", label: "Calendário", icon: "▦" },
  { href: "/tarefas", label: "Tarefas", icon: "✓" },
  { href: "/clientes", label: "Clientes", icon: "◆" },
  { href: "/redes", label: "Redes sociais", icon: "◎" },
  { href: "/dashboard", label: "Relatórios", icon: "▤" },
  { href: "/ads", label: "Ads", icon: "▲" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col bg-brand-900 px-3 py-5">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-base font-bold text-brand-800">
          B
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Agência B</p>
          <p className="text-[11px] text-brand-300">painel interno</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2.5 rounded-lg py-2 pl-3 pr-3 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-brand-100 hover:bg-brand-800 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-sand-100" />
              )}
              <span className="w-4 text-center text-xs">{item.icon}</span>
              {item.label}
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
