async function sendDownloadLog(request: Request): Promise<Response> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL is not configured");
    return new Response(JSON.stringify({ error: "Analytics webhook is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  const country = request.headers.get("x-vercel-ip-country") ?? "Desconhecido";
  const timestamp = new Date().toISOString();

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
      console.error(`Discord download webhook returned HTTP ${discordResponse.status}`);
      return new Response(JSON.stringify({ error: "Analytics delivery failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }

    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Discord download webhook request failed", error);
    return new Response(JSON.stringify({ error: "Analytics delivery failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  return sendDownloadLog(request);
}
