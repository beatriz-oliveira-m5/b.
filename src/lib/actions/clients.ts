"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClientRecord(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#6366f1");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) throw new Error("Nome do cliente é obrigatório.");

  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert({ name, color, notes });
  if (error) throw new Error(error.message);

  revalidatePath("/clientes");
}

export async function archiveClientRecord(clientId: string, archived: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").update({ archived }).eq("id", clientId);
  if (error) throw new Error(error.message);

  revalidatePath("/clientes");
}

export async function updateClientRecord(clientId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#6366f1");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) throw new Error("Nome do cliente é obrigatório.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({ name, color, notes })
    .eq("id", clientId);
  if (error) throw new Error(error.message);

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clientId}`);
}
