import { createAstroI18n } from "ts-intl-astro";

const enUS = (await import("./messages/en-US.ts")).default;
const zhHans = (await import("./messages/zh-Hans.ts")).default;
const jaJP = (await import("./messages/ja-JP.ts")).default;

export const {
  useTranslations,
  useLocale,
  useFormatter,
  i18nMiddleware,
  getTranslations,
  getFormatter,
  isSupportedLanguage,
  languages,
  defaultLanguage,
} = createAstroI18n({
  defaultLanguage: "en-US",
  messages: {
    "en-US": enUS,
    "zh-Hans": zhHans,
    "ja-JP": jaJP,
  },
});

export type SupportedLanguage = (typeof languages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  "en-US": "English",
  "zh-Hans": "简体中文",
  "ja-JP": "日本語",
};
