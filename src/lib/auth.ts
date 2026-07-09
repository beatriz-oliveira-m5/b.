import { createClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/types/database";

/** Membro da equipe correspondente ao usuário logado nesta requisição. */
export async function getCurrentTeamMember(): Promise<TeamMember | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("team_members").select("*").eq("user_id", user.id).single();
  return data ?? null;
}
