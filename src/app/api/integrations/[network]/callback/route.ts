import { NextResponse, type NextRequest } from "next/server";
import { getAdapter } from "@/lib/integrations/registry";
import { createClient } from "@/lib/supabase/server";
import type { ContentNetwork } from "@/lib/types/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ network: string }> }
) {
  const { network } = await params;
  const code = request.nextUrl.searchParams.get("code");
  const clientId = request.nextUrl.searchParams.get("state");

  if (!code || !clientId) {
    return NextResponse.json({ error: "code e state são obrigatórios" }, { status: 400 });
  }

  const adapter = getAdapter(network as ContentNetwork, "real");

  try {
    const result = await adapter.exchangeCodeForToken(code);

    const supabase = await createClient();
    const { error } = await supabase.from("social_channels").upsert(
      {
        client_id: clientId,
        network: network as ContentNetwork,
        mode: "real",
        handle: result.handle || null,
        external_account_id: result.external_account_id || null,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        token_expires_at: result.expires_at,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "client_id,network" }
    );
    if (error) throw new Error(error.message);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.redirect(
      new URL(`/redes?erro=${encodeURIComponent(message)}`, request.nextUrl.origin)
    );
  }

  return NextResponse.redirect(new URL("/redes", request.nextUrl.origin));
}
