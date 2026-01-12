import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.CARBON_API_BASE_URL ?? "http://localhost:3001";
  const url = new URL("/analytics/carbon-reports/timeseries", baseUrl);

  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const upstream = await fetch(url, { method: "GET" });
  const body = await upstream.text();

  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

