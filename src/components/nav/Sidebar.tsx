"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/calendario", label: "Calendário", icon: "📅" },
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
          <p className="text-sm font-semibold text-sand-50">Agência B</p>
          <p className="text-[11px] text-brand-300">painel interno</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-brand-700 text-white"
                  : "text-brand-200 hover:bg-brand-800 hover:text-sand-50"
              }`}
            >
              <span className="text-xs opacity-80">{item.icon}</span>
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
