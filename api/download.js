const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

function formatCountry(code) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "🌐 País desconhecido";

  const name = regionNames.of(normalized) || "País desconhecido";
  const flag = String.fromCodePoint(
    ...normalized.split("").map((letter) => 127397 + letter.charCodeAt(0)),
  );
  return `${flag} ${name}`;
}

async function sendDiscordLog(country, timestamp) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Extension Tutorials — Analytics",
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

  if (!response.ok) {
    throw new Error(`Discord returned HTTP ${response.status}`);
  }
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.setHeader("Cache-Control", "no-store");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const country = formatCountry(request.headers["x-vercel-ip-country"]);
    await sendDiscordLog(country, new Date().toISOString());
    response.setHeader("Cache-Control", "no-store");
    response.redirect(302, "https://www.mediafire.com/file/fov3asmnqgzo2ic/Extension.zip/file");
  } catch (error) {
    console.error("Download analytics failed", error);
    response.status(500).json({ error: "Download analytics failed" });
  }
}
