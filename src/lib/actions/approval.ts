"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** Busca um post pelo token público — usa service role porque quem acessa
 * o link de aprovação não está logado no sistema. */
export async function getContentByShareToken(token: string) {
  const supabase = createServiceRoleClient();
  const { data: content } = await supabase
    .from("content_items")
    .select("*")
    .eq("share_token", token)
    .single();
  if (!content) return null;

  const { data: client } = await supabase
    .from("clients")
    .select("name")
    .eq("id", content.client_id)
    .single();

  return { content, clientName: client?.name ?? "" };
}

export async function approveViaShareLink(token: string) {
  const supabase = createServiceRoleClient();
  const { data: content } = await supabase
    .from("content_items")
    .select("id, status")
    .eq("share_token", token)
    .single();
  if (!content) throw new Error("Link inválido.");
  if (content.status !== "in_review") {
    throw new Error("Este post não está mais aguardando aprovação.");
  }

  const { error } = await supabase
    .from("content_items")
    .update({ status: "approved", review_notes: null })
    .eq("share_token", token);
  if (error) throw new Error(error.message);

  revalidatePath(`/aprovar/${token}`);
}

export async function requestChangesViaShareLink(token: string, feedback: string) {
  const supabase = createServiceRoleClient();
  const { data: content } = await supabase
    .from("content_items")
    .select("id, status")
    .eq("share_token", token)
    .single();
  if (!content) throw new Error("Link inválido.");
  if (content.status !== "in_review") {
    throw new Error("Este post não está mais aguardando aprovação.");
  }
  if (!feedback.trim()) throw new Error("Descreva o que precisa ajustar.");

  const { error } = await supabase
    .from("content_items")
    .update({ status: "draft", review_notes: feedback.trim() })
    .eq("share_token", token);
  if (error) throw new Error(error.message);

  revalidatePath(`/aprovar/${token}`);
}
