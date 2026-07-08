"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/calendario", label: "Calendário" },
  { href: "/tarefas", label: "Tarefas" },
  { href: "/clientes", label: "Clientes" },
  { href: "/redes", label: "Redes sociais" },
  { href: "/dashboard", label: "Relatórios" },
  { href: "/ads", label: "Ads" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-neutral-200 bg-white px-3 py-4">
      <div className="mb-6 px-2">
        <p className="text-lg font-semibold text-neutral-900">Agência B</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <LogoutButton />
    </aside>
  );
}
