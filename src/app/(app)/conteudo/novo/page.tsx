import { createClient } from "@/lib/supabase/server";
import { NewContentForm } from "./NewContentForm";

export default async function NovoConteudoPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string }>;
}) {
  const { cliente } = await searchParams;
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("archived", false)
    .order("name");

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Novo post</h1>
      <NewContentForm clients={clients ?? []} defaultClientId={cliente} />
    </div>
  );
}
