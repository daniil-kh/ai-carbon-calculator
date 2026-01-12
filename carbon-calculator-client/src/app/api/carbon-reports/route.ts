export async function POST(req: Request) {
  const baseUrl = process.env.CARBON_API_BASE_URL ?? "http://localhost:3001";
  const url = new URL("/carbon-reports", baseUrl);

  const body = await req.text();
  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") ?? "application/json",
    },
    body,
  });

  const responseBody = await upstream.text();

  return new Response(responseBody, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

