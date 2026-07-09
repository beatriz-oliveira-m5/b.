import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaYoutube } from "react-icons/fa6";
import type { ContentNetwork } from "@/lib/types/database";
import type { IconType } from "react-icons";

export const NETWORK_ICON: Record<ContentNetwork, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
};

/** Fundo (gradiente ou sólido) fiel à identidade de cada rede — usado nos
 * cards de conta em destaque, não na UI de apoio (que segue o marrom/bege). */
export const NETWORK_CARD_BG: Record<ContentNetwork, string> = {
  instagram: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400",
  facebook: "bg-blue-600",
  tiktok: "bg-stone-900",
  linkedin: "bg-sky-700",
  youtube: "bg-red-600",
};
