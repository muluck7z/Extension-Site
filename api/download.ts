export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { Allow: "POST", "Content-Type": "application/json" },
    });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: "Analytics webhook is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const timestamp = new Date().toISOString();
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? "Desconhecido";

  try {
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Portal Verde — Analytics",
        embeds: [
          {
            title: "Extensão baixada",
            color: 0x2f80ed,
            fields: [
              { name: "País", value: country, inline: true },
              { name: "Horário (UTC)", value: timestamp, inline: true },
            ],
          },
        ],
      }),
    });

    if (!discordResponse.ok) {
      return new Response(JSON.stringify({ error: "Analytics delivery failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, { status: 204 });
  } catch {
    return new Response(JSON.stringify({ error: "Analytics delivery failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
