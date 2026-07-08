import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewClientForm } from "./NewClientForm";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("archived", false)
    .order("name");

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Clientes</h1>
          <p className="text-sm text-neutral-500">Os clientes ativos da agência.</p>
        </div>
        <NewClientForm />
      </div>

      {clients?.length === 0 && (
        <p className="text-sm text-neutral-500">
          Nenhum cliente cadastrado ainda. Clique em &quot;Novo cliente&quot; para começar.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {clients?.map((client) => (
          <li key={client.id}>
            <Link
              href={`/clientes/${client.id}`}
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition hover:border-neutral-300 hover:shadow-sm"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: client.color }}
              />
              <span className="font-medium text-neutral-900">{client.name}</span>
              {client.notes && (
                <span className="ml-auto truncate text-sm text-neutral-400">{client.notes}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
