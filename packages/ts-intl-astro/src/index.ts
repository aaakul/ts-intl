export { createAstroI18n, type CreateAstroI18nOptions } from "./factory";
export {
  default,
  tsIntlAstro,
  tsIntlAstro as tsIntl,
  type TsIntlIntegrationOptions,
} from "./integration";
export {
  i18nStorage,
  getActiveLocale,
  runWithLocale,
  setGlobalFallbackLanguage,
} from "./context";
export { resolveRequestLocale, type ResolveLocaleOptions } from "./resolver";
export {
  createI18nMiddleware,
  onRequest,
  setGlobalMiddlewareOptions,
} from "./middleware";
export type {
  AstroCompatibleContext,
  AstroI18nInstance,
  AstroMiddlewareFn,
  AstroMiddlewareNext,
  I18nContextStore,
  UseTranslationsOptions,
} from "./types";

export {
  I18nError,
  I18nErrorCode,
  createI18n,
  type Formats,
  type Formatter,
  type I18nConfig,
  type Translator,
  type FlatTranslator,
} from "@aaakul/ts-intl";
