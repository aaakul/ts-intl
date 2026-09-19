import { createAstroI18n } from "ts-intl-astro";
import enUS from "./messages/en-US";
import zhHans from "./messages/zh-Hans";
import jaJP from "./messages/ja-JP";

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
