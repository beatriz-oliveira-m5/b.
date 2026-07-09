"use client";

import { useTransition } from "react";
import { toggleTodo, deleteTodo } from "@/lib/actions/todos";
import type { Todo } from "@/lib/types/database";
import { format, parseISO } from "date-fns";

export function TodoRow({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm">
      <input
        type="checkbox"
        checked={todo.done}
        disabled={isPending}
        onChange={(e) => startTransition(() => toggleTodo(todo.id, e.target.checked))}
        className="h-4 w-4"
      />
      <span className={`flex-1 text-sm ${todo.done ? "text-stone-400 line-through" : "text-stone-800"}`}>
        {todo.title}
      </span>
      {todo.due_date && (
        <span className="text-xs text-stone-400">{format(parseISO(todo.due_date), "dd/MM")}</span>
      )}
      <button
        onClick={() => startTransition(() => deleteTodo(todo.id))}
        className="text-xs text-stone-400 hover:text-red-600"
      >
        remover
      </button>
    </li>
  );
}
