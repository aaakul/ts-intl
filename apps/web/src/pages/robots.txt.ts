import type { APIRoute } from "astro";
import { SITE_CONFIG } from "@/config/site";

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ?? SITE_CONFIG.url;
  const sitemapURL = new URL("sitemap-index.xml", baseUrl).href;
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
