import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusStepper } from "@/components/content/StatusStepper";
import { ContentEditForm } from "@/components/content/ContentEditForm";
import { CaptionGenerator } from "@/components/content/CaptionGenerator";
import { NetworkBadge } from "@/components/ui/NetworkBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function ConteudoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: item }, { data: captions }] = await Promise.all([
    supabase.from("content_items").select("*").eq("id", id).single(),
    supabase
      .from("ai_captions")
      .select("*")
      .eq("content_item_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!item) notFound();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", item.client_id)
    .single();

  return (
    <div className="max-w-3xl">
      <Link href="/calendario" className="mb-4 inline-block text-sm text-stone-500 hover:underline">
        ← Voltar para o calendário
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{client?.name}</p>
          <h1 className="text-xl font-semibold text-stone-900">{item.title}</h1>
          {item.scheduled_at && (
            <p className="text-sm text-stone-500">
              Publicar em {format(new Date(item.scheduled_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
          <div className="mt-1 flex gap-1">
            {item.networks.map((n) => (
              <NetworkBadge key={n} network={n} />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <StatusStepper contentId={item.id} status={item.status} />
      </div>

      <div className="mb-6">
        <ContentEditForm key={`${item.id}-${item.caption ?? ""}`} item={item} />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-stone-900">Gerar legenda com IA</h2>
        <CaptionGenerator
          contentId={item.id}
          networks={item.networks}
          previousCaptions={captions ?? []}
        />
      </div>
    </div>
  );
}
