"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
    >
      <LogOut size={15} /> Sair
    </button>
  );
}
