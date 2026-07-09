import { NETWORK_ICON } from "@/lib/networkStyle";
import { NETWORK_LABELS, type ContentNetwork } from "@/lib/types/database";

const NETWORK_STYLES: Record<ContentNetwork, string> = {
  instagram: "bg-pink-50 text-pink-700",
  facebook: "bg-blue-50 text-blue-700",
  tiktok: "bg-stone-100 text-stone-800",
  linkedin: "bg-sky-50 text-sky-700",
  youtube: "bg-red-50 text-red-700",
};

export function NetworkBadge({ network }: { network: ContentNetwork }) {
  const Icon = NETWORK_ICON[network];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${NETWORK_STYLES[network]}`}
    >
      <Icon size={11} />
      {NETWORK_LABELS[network]}
    </span>
  );
}
