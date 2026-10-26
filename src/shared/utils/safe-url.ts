const siteOrigin = "https://borchgomez.es";
const allowedProtocols = new Set(["https:", "mailto:", "tel:"]);

export function readSafeHref(
  value: unknown,
  fallback?: string,
): string | undefined {
  if (typeof value !== "string") {
    return fallback;
  }

  const href = value.trim();

  if (!href || href.startsWith("//") || href.startsWith("\\")) {
    return fallback;
  }

  try {
    const url = new URL(href, siteOrigin);

    return allowedProtocols.has(url.protocol) ? href : fallback;
  } catch {
    return fallback;
  }
}
