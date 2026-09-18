import { defineConfig } from "astro/config";
import UnoCSS from "@unocss/astro";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: process.env.SITE_URL || "https://ts-intl.pages.dev",
  trailingSlash: "never",
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "en-US",
        locales: {
          "en-US": "en-US",
          "zh-Hans": "zh-Hans",
          "ja-JP": "ja-JP",
        },
      },
      filter: (page) => {
        const url = new URL(page);
        return url.pathname !== "/" && !url.pathname.endsWith("/docs");
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  vite: {
    ...(process.env.NODE_ENV === "development"
      ? {
          server: {
            allowedHosts: [".trycloudflare.com"],
            hmr: {
              clientPort: 443,
            },
          },
        }
      : {}),
  },
});
