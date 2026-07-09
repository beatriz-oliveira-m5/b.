"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        const url = `${window.location.origin}/aprovar/${token}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
    >
      {copied ? <Check size={14} className="text-emerald-600" /> : <Link2 size={14} />}
      {copied ? "Link copiado!" : "Copiar link de aprovação do cliente"}
    </button>
  );
}
