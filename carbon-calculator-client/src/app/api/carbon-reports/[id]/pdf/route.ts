import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const baseUrl = process.env.CARBON_API_BASE_URL ?? "http://localhost:3001";
  const { id } = await ctx.params;

  const url = new URL(`/carbon-reports/${encodeURIComponent(id)}/pdf`, baseUrl);
  const upstream = await fetch(url, { method: "GET" });

  const body = await upstream.arrayBuffer();

  const headers = new Headers();
  headers.set("content-type", upstream.headers.get("content-type") ?? "application/pdf");

  const disposition =
    upstream.headers.get("content-disposition") ?? `attachment; filename="${id}.pdf"`;
  headers.set("content-disposition", disposition);

  const len = upstream.headers.get("content-length");
  if (len) headers.set("content-length", len);

  return new Response(body, {
    status: upstream.status,
    headers,
  });
}

