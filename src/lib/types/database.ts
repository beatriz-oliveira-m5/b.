// Tipos manuais espelhando supabase/migrations/20260708000001_init.sql.
// Se o schema mudar, atualize aqui junto (ou rode `supabase gen types typescript`
// contra o projeto real e substitua este arquivo).
//
// Importante: usar `type` (não `interface`) nos shapes de linha — o
// postgrest-js exige que `Row extends Record<string, unknown>`, e uma
// `interface` não satisfaz esse constraint (vira `never` silenciosamente),
// enquanto um `type` alias satisfaz.

export type ContentNetwork = "instagram" | "facebook" | "tiktok" | "linkedin" | "youtube";
export type ContentStatus = "draft" | "in_review" | "approved" | "published";
export type IntegrationMode = "mock" | "real";

export type Client = {
  id: string;
  name: string;
  color: string;
  notes: string | null;
  archived: boolean;
  created_at: string;
};

export type SocialChannel = {
  id: string;
  client_id: string;
  network: ContentNetwork;
  handle: string | null;
  mode: IntegrationMode;
  external_account_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  connected_at: string | null;
  created_at: string;
};

export type ContentItem = {
  id: string;
  client_id: string;
  title: string;
  caption: string | null;
  networks: ContentNetwork[];
  media_urls: string[];
  status: ContentStatus;
  scheduled_at: string | null;
  published_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentStatusHistory = {
  id: string;
  content_item_id: string;
  from_status: ContentStatus | null;
  to_status: ContentStatus;
  note: string | null;
  changed_at: string;
};

export type Todo = {
  id: string;
  client_id: string;
  content_item_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  done: boolean;
  created_at: string;
};

export type AiCaption = {
  id: string;
  content_item_id: string | null;
  network: ContentNetwork;
  topic: string | null;
  tone: string | null;
  generated_text: string;
  selected: boolean;
  created_at: string;
};

export type PerformanceMetric = {
  id: string;
  client_id: string;
  content_item_id: string | null;
  network: ContentNetwork;
  metric_date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followers_count: number | null;
  engagement_rate: number | null;
  source: IntegrationMode;
  fetched_at: string;
};

export type AdsCampaign = {
  id: string;
  client_id: string;
  content_item_id: string | null;
  network: ContentNetwork;
  objective: string | null;
  budget_cents: number | null;
  status: "draft" | "scheduled" | "active" | "paused" | "completed";
  external_campaign_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  source: IntegrationMode;
  created_at: string;
};

export type Benchmark = {
  id: string;
  network: ContentNetwork;
  metric_name: string;
  segment: string;
  benchmark_value: number;
  unit: string;
  updated_at: string;
};

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      clients: Table<Client>;
      social_channels: Table<SocialChannel>;
      content_items: Table<ContentItem>;
      content_status_history: Table<ContentStatusHistory>;
      todos: Table<Todo>;
      ai_captions: Table<AiCaption>;
      performance_metrics: Table<PerformanceMetric>;
      ads_campaigns: Table<AdsCampaign>;
      benchmarks: Table<Benchmark>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

export const NETWORK_LABELS: Record<ContentNetwork, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Rascunho",
  in_review: "Em revisão",
  approved: "Aprovado",
  published: "Publicado",
};
