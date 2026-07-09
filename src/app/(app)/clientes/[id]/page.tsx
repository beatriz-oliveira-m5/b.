import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditClientForm } from "@/components/clients/EditClientForm";

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const [{ count: pendingTodos }, { count: upcomingPosts }] = await Promise.all([
    supabase
      .from("todos")
      .select("*", { count: "exact", head: true })
      .eq("client_id", id)
      .eq("done", false),
    supabase
      .from("content_items")
      .select("*", { count: "exact", head: true })
      .eq("client_id", id)
      .neq("status", "published"),
  ]);

  return (
    <div className="max-w-2xl">
      <Link href="/clientes" className="mb-4 inline-block text-sm text-stone-500 hover:underline">
        ← Voltar para clientes
      </Link>

      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-stone-900">{client.name}</h1>
      <p className="mb-6 text-sm text-stone-500">
        {pendingTodos ?? 0} tarefa(s) pendente(s) · {upcomingPosts ?? 0} post(s) em andamento
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/calendario?cliente=${id}`}
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
        >
          Ver calendário
        </Link>
        <Link
          href={`/dashboard?cliente=${id}`}
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
        >
          Ver relatórios
        </Link>
        <Link
          href={`/conteudo/novo?cliente=${id}`}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Novo post
        </Link>
      </div>

      <EditClientForm client={client} />
    </div>
  );
}
