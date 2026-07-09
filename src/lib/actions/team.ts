"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentTeamMember } from "@/lib/auth";
import type { TeamRole } from "@/lib/types/database";

async function requireAdmin() {
  const me = await getCurrentTeamMember();
  if (!me || me.role !== "admin") {
    throw new Error("Só administradores podem gerenciar a equipe.");
  }
  return me;
}

export async function inviteTeamMember(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "editor") as TeamRole;

  if (!name) throw new Error("Nome é obrigatório.");
  if (!email) throw new Error("Email é obrigatório.");

  const serviceClient = createServiceRoleClient();
  const { data, error } = await serviceClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  });
  if (error) throw new Error(`Falha ao convidar: ${error.message}`);

  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from("team_members")
    .insert({ user_id: data.user.id, name, email, role });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/equipe");
}

export async function updateTeamMemberRole(memberId: string, role: TeamRole) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").update({ role }).eq("id", memberId);
  if (error) throw new Error(error.message);

  revalidatePath("/equipe");
}

export async function removeTeamMember(memberId: string) {
  const me = await requireAdmin();
  if (me.id === memberId) throw new Error("Você não pode remover a si mesma.");

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", memberId);
  if (error) throw new Error(error.message);

  revalidatePath("/equipe");
}
