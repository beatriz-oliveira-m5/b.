import { NextResponse, type NextRequest } from "next/server";
import { getAdapter } from "@/lib/integrations/registry";
import type { ContentNetwork } from "@/lib/types/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ network: string }> }
) {
  const { network } = await params;
  const clientId = request.nextUrl.searchParams.get("client_id");
  if (!clientId) {
    return NextResponse.json({ error: "client_id é obrigatório" }, { status: 400 });
  }

  const adapter = getAdapter(network as ContentNetwork, "real");
  const url = adapter.getAuthorizationUrl(clientId);
  return NextResponse.redirect(url);
}
