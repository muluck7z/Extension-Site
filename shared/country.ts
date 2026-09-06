const displayNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

export function formatCountry(code: string | null): string {
  const normalized = code?.trim().toUpperCase() ?? "";

  if (!/^[A-Z]{2}$/.test(normalized)) {
    return "🌐 País desconhecido";
  }

  const name = displayNames.of(normalized) ?? "País desconhecido";
  const flag = String.fromCodePoint(
    ...normalized.split("").map((letter) => 127397 + letter.charCodeAt(0)),
  );

  return `${flag} ${name}`;
}
