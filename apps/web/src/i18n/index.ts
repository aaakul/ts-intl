import { createAstroI18n } from "ts-intl-astro";

const enUS = (await import("./messages/en-US.ts")).default;
const zhHans = (await import("./messages/zh-Hans.ts")).default;
const jaJP = (await import("./messages/ja-JP.ts")).default;
const zhHant = (await import("./messages/zh-Hant.ts")).default;
const koKR = (await import("./messages/ko-KR.ts")).default;
const esES = (await import("./messages/es-ES.ts")).default;
const deDE = (await import("./messages/de-DE.ts")).default;
const frFR = (await import("./messages/fr-FR.ts")).default;
const ruRU = (await import("./messages/ru-RU.ts")).default;
const itIT = (await import("./messages/it-IT.ts")).default;

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
    "zh-Hant": zhHant,
    "ko-KR": koKR,
    "es-ES": esES,
    "de-DE": deDE,
    "fr-FR": frFR,
    "ru-RU": ruRU,
    "it-IT": itIT,
  },
});

export type SupportedLanguage = (typeof languages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  "en-US": "English",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
  "es-ES": "Español",
  "de-DE": "Deutsch",
  "fr-FR": "Français",
  "ru-RU": "Русский",
  "it-IT": "Italiano",
};
