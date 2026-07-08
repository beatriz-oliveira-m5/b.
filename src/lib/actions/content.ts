"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ContentItem, ContentNetwork, ContentStatus } from "@/lib/types/database";

function parseNetworks(formData: FormData): ContentNetwork[] {
  return formData.getAll("networks") as ContentNetwork[];
}

export async function createContentItem(formData: FormData) {
  const client_id = String(formData.get("client_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const scheduledAtRaw = String(formData.get("scheduled_at") ?? "");
  const networks = parseNetworks(formData);

  if (!client_id) throw new Error("Selecione um cliente.");
  if (!title) throw new Error("Título é obrigatório.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .insert({
      client_id,
      title,
      caption,
      networks,
      scheduled_at: scheduledAtRaw ? new Date(scheduledAtRaw).toISOString() : null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/calendario");
  return { id: data.id as string };
}

export async function updateContentItem(contentId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const scheduledAtRaw = String(formData.get("scheduled_at") ?? "");
  const networks = parseNetworks(formData);

  if (!title) throw new Error("Título é obrigatório.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("content_items")
    .update({
      title,
      caption,
      networks,
      scheduled_at: scheduledAtRaw ? new Date(scheduledAtRaw).toISOString() : null,
    })
    .eq("id", contentId);

  if (error) throw new Error(error.message);

  revalidatePath("/calendario");
  revalidatePath(`/conteudo/${contentId}`);
}

export async function updateContentStatus(
  contentId: string,
  status: ContentStatus,
  reviewNotes?: string
) {
  const supabase = await createClient();
  const update: Partial<ContentItem> = { status };
  if (status === "published") update.published_at = new Date().toISOString();
  if (reviewNotes !== undefined) update.review_notes = reviewNotes || null;

  const { error } = await supabase.from("content_items").update(update).eq("id", contentId);
  if (error) throw new Error(error.message);

  revalidatePath("/calendario");
  revalidatePath(`/conteudo/${contentId}`);
  revalidatePath("/tarefas");
}

export async function deleteContentItem(contentId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("content_items").delete().eq("id", contentId);
  if (error) throw new Error(error.message);

  revalidatePath("/calendario");
}
