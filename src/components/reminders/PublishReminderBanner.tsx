import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function PublishReminderBanner() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: due } = await supabase
    .from("content_items")
    .select("id, title, scheduled_at, client_id")
    .eq("status", "approved")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", now)
    .order("scheduled_at");

  if (!due || due.length === 0) return null;

  const clientIds = Array.from(new Set(due.map((item) => item.client_id)));
  const { data: clients } = await supabase.from("clients").select("id, name").in("id", clientIds);
  const clientNameById = new Map((clients ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
      <p className="mb-2 text-sm font-semibold text-amber-900">
        {due.length === 1 ? "1 post está pronto para publicar" : `${due.length} posts estão prontos para publicar`}
      </p>
      <ul className="flex flex-col gap-1">
        {due.map((item) => (
          <li key={item.id} className="text-sm text-amber-800">
            <Link href={`/conteudo/${item.id}`} className="hover:underline">
              {clientNameById.get(item.client_id)} — {item.title}
            </Link>
            {item.scheduled_at && (
              <span className="text-amber-600">
                {" "}
                (previsto para {format(new Date(item.scheduled_at), "d 'de' MMM 'às' HH:mm", { locale: ptBR })})
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-amber-700">
        Lembrete: a publicação é manual — poste direto em cada rede e depois marque como &quot;Publicado&quot;.
      </p>
    </div>
  );
}
