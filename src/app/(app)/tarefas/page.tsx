import { CheckSquare, ListChecks } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TodoForm } from "@/components/todos/TodoForm";
import { TodoRow } from "@/components/todos/TodoRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function TarefasPage() {
  const supabase = await createClient();

  const [{ data: clients }, { data: todos }] = await Promise.all([
    supabase.from("clients").select("*").eq("archived", false).order("name"),
    supabase.from("todos").select("*").order("done").order("due_date", { nullsFirst: false }),
  ]);

  const clientList = clients ?? [];
  const todoList = todos ?? [];

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Tarefas"
        description="Pendências organizadas por cliente. Marque como feita quando concluir."
      />

      {clientList.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={24} strokeWidth={1.75} />}
          title="Cadastre um cliente para começar"
          description="As tarefas são organizadas por cliente — crie o primeiro cliente na aba Clientes antes de adicionar pendências."
        />
      ) : (
        <>
          <TodoForm clients={clientList} />

          {clientList.map((client) => {
            const clientTodos = todoList.filter((t) => t.client_id === client.id);
            if (clientTodos.length === 0) return null;

            return (
              <div key={client.id} className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: client.color }}
                  />
                  <h2 className="text-sm font-semibold text-stone-900">{client.name}</h2>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {clientTodos.map((todo) => (
                    <TodoRow key={todo.id} todo={todo} />
                  ))}
                </ul>
              </div>
            );
          })}

          {todoList.length === 0 && (
            <EmptyState
              icon={<ListChecks size={24} strokeWidth={1.75} />}
              title="Nenhuma tarefa por aqui ainda"
              description="Use o formulário acima para adicionar a primeira pendência de um cliente."
            />
          )}
        </>
      )}
    </div>
  );
}
