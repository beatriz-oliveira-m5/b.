import { createClient } from "@/lib/supabase/server";
import { ChannelRow } from "@/components/channels/ChannelRow";
import { SyncButton } from "@/components/channels/SyncButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { NETWORK_LABELS, type ContentNetwork } from "@/lib/types/database";

const ALL_NETWORKS = Object.keys(NETWORK_LABELS) as ContentNetwork[];

export default async function RedesPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const supabase = await createClient();

  const [{ data: clients }, { data: channels }] = await Promise.all([
    supabase.from("clients").select("*").eq("archived", false).order("name"),
    supabase.from("social_channels").select("*"),
  ]);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Redes sociais"
        description='Status da conexão de cada cliente com cada rede. Enquanto o app review de uma rede não sai, conecte com "dados de teste" para o resto do sistema já funcionar.'
      />

      {erro && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
      )}

      {clients?.map((client) => {
        const clientChannels = (channels ?? []).filter((c) => c.client_id === client.id);
        return (
          <div key={client.id} className="mb-6 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: client.color }}
                />
                <h2 className="text-sm font-semibold text-stone-900">{client.name}</h2>
              </div>
              <SyncButton clientId={client.id} />
            </div>

            {ALL_NETWORKS.map((network) => (
              <ChannelRow
                key={network}
                clientId={client.id}
                network={network}
                channel={clientChannels.find((c) => c.network === network)}
              />
            ))}
          </div>
        );
      })}

      {(!clients || clients.length === 0) && (
        <EmptyState
          icon="◎"
          title="Cadastre um cliente para conectar as redes"
          description="Crie o primeiro cliente na aba Clientes — depois volte aqui para conectar Instagram, Facebook, TikTok, LinkedIn e YouTube."
        />
      )}
    </div>
  );
}
