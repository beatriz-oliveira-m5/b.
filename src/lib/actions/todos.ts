"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTodo(formData: FormData) {
  const client_id = String(formData.get("client_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const due_date = String(formData.get("due_date") ?? "") || null;

  if (!client_id) throw new Error("Selecione um cliente.");
  if (!title) throw new Error("Descreva a tarefa.");

  const supabase = await createClient();
  const { error } = await supabase.from("todos").insert({ client_id, title, due_date });
  if (error) throw new Error(error.message);

  revalidatePath("/tarefas");
}

export async function toggleTodo(todoId: string, done: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("todos").update({ done }).eq("id", todoId);
  if (error) throw new Error(error.message);

  revalidatePath("/tarefas");
}

export async function deleteTodo(todoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("todos").delete().eq("id", todoId);
  if (error) throw new Error(error.message);

  revalidatePath("/tarefas");
}
