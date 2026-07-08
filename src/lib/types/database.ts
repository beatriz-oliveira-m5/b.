// Tipos manuais espelhando supabase/migrations/20260708000001_init.sql.
// Se o schema mudar, atualize aqui junto (ou rode `supabase gen types typescript`
// contra o projeto real e substitua este arquivo).

export type ContentNetwork = "instagram" | "facebook" | "tiktok" | "linkedin" | "youtube";
export type ContentStatus = "draft" | "in_review" | "approved" | "published";
export type IntegrationMode = "mock" | "real";

export interface Client {
  id: string;
  name: string;
  color: string;
  notes: string | null;
  archived: boolean;
  created_at: string;
}

export interface SocialChannel {
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
}

export interface ContentItem {
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
}

export interface ContentStatusHistory {
  id: string;
  content_item_id: string;
  from_status: ContentStatus | null;
  to_status: ContentStatus;
  note: string | null;
  changed_at: string;
}

export interface Todo {
  id: string;
  client_id: string;
  content_item_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  done: boolean;
  created_at: string;
}

export interface AiCaption {
  id: string;
  content_item_id: string | null;
  network: ContentNetwork;
  topic: string | null;
  tone: string | null;
  generated_text: string;
  selected: boolean;
  created_at: string;
}

export interface PerformanceMetric {
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
}

export interface AdsCampaign {
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
}

export interface Benchmark {
  id: string;
  network: ContentNetwork;
  metric_name: string;
  segment: string;
  benchmark_value: number;
  unit: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      clients: { Row: Client; Insert: Partial<Client>; Update: Partial<Client> };
      social_channels: {
        Row: SocialChannel;
        Insert: Partial<SocialChannel>;
        Update: Partial<SocialChannel>;
      };
      content_items: {
        Row: ContentItem;
        Insert: Partial<ContentItem>;
        Update: Partial<ContentItem>;
      };
      content_status_history: {
        Row: ContentStatusHistory;
        Insert: Partial<ContentStatusHistory>;
        Update: Partial<ContentStatusHistory>;
      };
      todos: { Row: Todo; Insert: Partial<Todo>; Update: Partial<Todo> };
      ai_captions: { Row: AiCaption; Insert: Partial<AiCaption>; Update: Partial<AiCaption> };
      performance_metrics: {
        Row: PerformanceMetric;
        Insert: Partial<PerformanceMetric>;
        Update: Partial<PerformanceMetric>;
      };
      ads_campaigns: {
        Row: AdsCampaign;
        Insert: Partial<AdsCampaign>;
        Update: Partial<AdsCampaign>;
      };
      benchmarks: { Row: Benchmark; Insert: Partial<Benchmark>; Update: Partial<Benchmark> };
    };
  };
}

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
