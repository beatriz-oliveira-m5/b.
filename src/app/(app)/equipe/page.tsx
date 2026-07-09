import { Users2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTeamMember } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { TeamMemberRow } from "@/components/team/TeamMemberRow";
import { InviteMemberForm } from "@/components/team/InviteMemberForm";

export default async function EquipePage() {
  const supabase = await createClient();
  const [me, { data: members }] = await Promise.all([
    getCurrentTeamMember(),
    supabase.from("team_members").select("*").order("created_at"),
  ]);

  const isAdmin = me?.role === "admin";

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Equipe"
        description="Quem tem acesso à plataforma e com qual nível de permissão."
        action={isAdmin ? <InviteMemberForm /> : undefined}
      />

      {!members || members.length === 0 ? (
        <EmptyState
          icon={<Users2 size={24} strokeWidth={1.75} />}
          title="Nenhum membro cadastrado"
          description="Convide as pessoas que vão usar a plataforma com você."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              isSelf={member.id === me?.id}
              canManage={isAdmin}
            />
          ))}
        </ul>
      )}

      {!isAdmin && (
        <p className="mt-4 text-xs text-stone-400">
          Só administradoras podem convidar ou remover membros da equipe.
        </p>
      )}
    </div>
  );
}
