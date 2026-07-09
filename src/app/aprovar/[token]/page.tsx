import { notFound } from "next/navigation";
import { getContentByShareToken } from "@/lib/actions/approval";
import { ApprovalActions } from "@/components/approval/ApprovalActions";
import { NetworkBadge } from "@/components/ui/NetworkBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AprovarPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getContentByShareToken(token);
  if (!result) notFound();

  const { content, clientName } = result;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-sm font-bold text-brand-800">
            B
          </div>
          <p className="text-sm font-semibold text-sand-50">Agência B — aprovação de post</p>
        </div>

        <div className="rounded-2xl border border-brand-600/40 bg-white p-6 shadow-2xl">
          <p className="text-xs font-medium text-stone-400">{clientName}</p>
          <h1 className="mb-2 text-xl font-semibold tracking-tight text-stone-900">{content.title}</h1>

          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {content.networks.map((n) => (
              <NetworkBadge key={n} network={n} />
            ))}
            <StatusBadge status={content.status} />
          </div>

          {content.scheduled_at && (
            <p className="mb-4 text-xs text-stone-500">
              Previsto para{" "}
              {format(new Date(content.scheduled_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          )}

          {content.caption ? (
            <p className="mb-6 whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-sm text-stone-700">
              {content.caption}
            </p>
          ) : (
            <p className="mb-6 text-sm italic text-stone-400">Sem legenda ainda.</p>
          )}

          {content.status === "in_review" ? (
            <ApprovalActions token={token} />
          ) : (
            <p className="rounded-xl bg-stone-100 px-4 py-3 text-center text-sm text-stone-600">
              {content.status === "approved" && "Este post já foi aprovado."}
              {content.status === "published" && "Este post já foi publicado."}
              {content.status === "draft" && "Este post ainda está em preparação — volte em breve."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
