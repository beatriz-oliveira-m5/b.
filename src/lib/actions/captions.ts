"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateCaptions } from "@/lib/ai/captions";
import type { ContentNetwork } from "@/lib/types/database";

export async function generateCaptionsForContent(params: {
  contentId: string;
  topic: string;
  tone: string;
  networks: ContentNetwork[];
}) {
  const { contentId, topic, tone, networks } = params;
  const captions = await generateCaptions({ topic, tone, networks });

  const supabase = await createClient();
  const { error } = await supabase.from("ai_captions").insert(
    captions.map((c) => ({
      content_item_id: contentId,
      network: c.network,
      topic,
      tone,
      generated_text: c.text,
    }))
  );
  if (error) throw new Error(error.message);

  revalidatePath(`/conteudo/${contentId}`);
  return captions;
}

export async function selectCaption(contentId: string, captionId: string, text: string) {
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("content_items")
    .update({ caption: text })
    .eq("id", contentId);
  if (updateError) throw new Error(updateError.message);

  await supabase.from("ai_captions").update({ selected: false }).eq("content_item_id", contentId);
  const { error: selectError } = await supabase
    .from("ai_captions")
    .update({ selected: true })
    .eq("id", captionId);
  if (selectError) throw new Error(selectError.message);

  revalidatePath(`/conteudo/${contentId}`);
}
