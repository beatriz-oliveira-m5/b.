import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { monthGrid, parseMonthParam, dayKey, monthParam, WEEKDAY_LABELS } from "@/lib/calendar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { addMonths, format, isSameMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; cliente?: string }>;
}) {
  const { month, cliente } = await searchParams;
  const reference = parseMonthParam(month);
  const days = monthGrid(reference);
  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];

  const supabase = await createClient();

  const [{ data: clients }, contentQuery] = await Promise.all([
    supabase.from("clients").select("*").eq("archived", false).order("name"),
    (async () => {
      let query = supabase
        .from("content_items")
        .select("id, title, status, scheduled_at, client_id, networks")
        .gte("scheduled_at", rangeStart.toISOString())
        .lte("scheduled_at", rangeEnd.toISOString())
        .order("scheduled_at");
      if (cliente) query = query.eq("client_id", cliente);
      return query;
    })(),
  ]);

  const { data: items } = contentQuery;
  const clientById = new Map((clients ?? []).map((c) => [c.id, c]));

  const itemsByDay = new Map<string, typeof items>();
  for (const item of items ?? []) {
    if (!item.scheduled_at) continue;
    const key = dayKey(new Date(item.scheduled_at));
    if (!itemsByDay.has(key)) itemsByDay.set(key, []);
    itemsByDay.get(key)!.push(item);
  }

  const prevMonth = monthParam(subMonths(reference, 1));
  const nextMonth = monthParam(addMonths(reference, 1));
  const qs = (m: string) => `?month=${m}${cliente ? `&cliente=${cliente}` : ""}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 capitalize">
            {format(reference, "MMMM yyyy", { locale: ptBR })}
          </h1>
          <p className="text-sm text-neutral-500">Calendário de conteúdo de todos os clientes.</p>
        </div>

        <div className="flex items-center gap-2">
          <form action="/calendario" className="flex items-center gap-2">
            <input type="hidden" name="month" value={monthParam(reference)} />
            <select
              name="cliente"
              defaultValue={cliente ?? ""}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
            >
              <option value="">Todos os clientes</option>
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
            >
              Filtrar
            </button>
          </form>

          <Link
            href={qs(prevMonth)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            ←
          </Link>
          <Link
            href={qs(nextMonth)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            →
          </Link>
          <Link
            href={`/conteudo/novo${cliente ? `?cliente=${cliente}` : ""}`}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Novo post
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-b border-neutral-200 bg-neutral-50 px-2 py-2 text-center text-xs font-medium text-neutral-500"
          >
            {label}
          </div>
        ))}

        {days.map((day) => {
          const key = dayKey(day);
          const dayItems = itemsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, reference);

          return (
            <div
              key={key}
              className={`min-h-28 border-b border-r border-neutral-100 p-1.5 last:border-r-0 ${
                inMonth ? "bg-white" : "bg-neutral-50/50"
              }`}
            >
              <p className={`mb-1 text-xs ${inMonth ? "text-neutral-500" : "text-neutral-300"}`}>
                {format(day, "d")}
              </p>
              <div className="flex flex-col gap-1">
                {dayItems.map((item) => {
                  const client = clientById.get(item.client_id);
                  return (
                    <Link
                      key={item.id}
                      href={`/conteudo/${item.id}`}
                      className="block rounded-md border border-neutral-200 px-1.5 py-1 text-xs hover:border-neutral-300 hover:shadow-sm"
                    >
                      <span className="flex items-center gap-1">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: client?.color ?? "#a3a3a3" }}
                        />
                        <span className="truncate font-medium text-neutral-800">
                          {item.title}
                        </span>
                      </span>
                      <StatusBadge status={item.status} />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
