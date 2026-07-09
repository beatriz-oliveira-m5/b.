import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NewClientForm } from "./NewClientForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("archived", false)
    .order("name");

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Clientes"
        description="Os clientes ativos da agência."
        action={<NewClientForm />}
      />

      {clients?.length === 0 && (
        <EmptyState
          icon={<Users size={24} strokeWidth={1.75} />}
          title="Nenhum cliente cadastrado ainda"
          description="Cadastre o primeiro cliente da agência para começar a organizar o calendário, as tarefas e os relatórios."
        />
      )}

      <ul className="flex flex-col gap-2">
        {clients?.map((client) => (
          <li key={client.id}>
            <Link
              href={`/clientes/${client.id}`}
              className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition hover:border-brand-300 hover:shadow-md"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                style={{ backgroundColor: client.color }}
              />
              <span className="font-medium text-stone-900">{client.name}</span>
              {client.notes && (
                <span className="ml-auto truncate text-sm text-stone-400">{client.notes}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
