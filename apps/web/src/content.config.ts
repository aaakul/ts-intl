import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    lang: z.enum([
      "en-US",
      "zh-Hans",
      "ja-JP",
      "zh-Hant",
      "ko-KR",
      "es-ES",
      "de-DE",
      "fr-FR",
      "ru-RU",
      "it-IT",
    ]),
  }),
});

export const collections = {
  docs,
};
