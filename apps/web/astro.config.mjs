import { defineConfig } from "astro/config";
import UnoCSS from "@unocss/astro";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tsIntl from "ts-intl-astro";

export default defineConfig({
  output: "static",
  site: process.env.SITE_URL || "https://ts-intl.pages.dev",
  trailingSlash: "never",
  integrations: [
    tsIntl(),
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
          "zh-Hant": "zh-Hant",
          "ko-KR": "ko-KR",
          "es-ES": "es-ES",
          "de-DE": "de-DE",
          "fr-FR": "fr-FR",
          "ru-RU": "ru-RU",
          "it-IT": "it-IT",
        },
      },
      filter: (page) => {
        const url = new URL(page);
        return url.pathname !== "/" && !url.pathname.endsWith("/docs");
      },
      serialize: (item) => {
        if (item.links && item.links.length > 0) {
          const enLink = item.links.find((l) => l.lang === "en-US");
          if (enLink && !item.links.some((l) => l.lang === "x-default")) {
            item.links.push({
              lang: "x-default",
              url: enLink.url,
            });
          }
        }
        return item;
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
});
