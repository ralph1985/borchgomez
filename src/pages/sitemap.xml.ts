import type { APIRoute } from "astro";

const siteUrl = "https://borchgomez.es";
const routes = ["/", "/aviso-legal", "/politica-privacidad", "/politica-cookies"];

export const GET: APIRoute = () =>
  new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...routes.flatMap((route) => ["  <url>", `    <loc>${new URL(route, siteUrl).toString()}</loc>`, "  </url>"]),
      "</urlset>",
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
