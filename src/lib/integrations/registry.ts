import type { ContentNetwork, IntegrationMode } from "@/lib/types/database";
import type { SocialAdapter } from "./types";
import { createMockAdapter } from "./mock-adapter";
import { instagramRealAdapter, facebookRealAdapter } from "./real/meta";
import { tiktokRealAdapter } from "./real/tiktok";
import { linkedinRealAdapter } from "./real/linkedin";
import { youtubeRealAdapter } from "./real/youtube";

const REAL_ADAPTERS: Record<ContentNetwork, SocialAdapter> = {
  instagram: instagramRealAdapter,
  facebook: facebookRealAdapter,
  tiktok: tiktokRealAdapter,
  linkedin: linkedinRealAdapter,
  youtube: youtubeRealAdapter,
};

const MOCK_ADAPTERS: Record<ContentNetwork, SocialAdapter> = {
  instagram: createMockAdapter("instagram"),
  facebook: createMockAdapter("facebook"),
  tiktok: createMockAdapter("tiktok"),
  linkedin: createMockAdapter("linkedin"),
  youtube: createMockAdapter("youtube"),
};

export function getAdapter(network: ContentNetwork, mode: IntegrationMode): SocialAdapter {
  return mode === "real" ? REAL_ADAPTERS[network] : MOCK_ADAPTERS[network];
}
