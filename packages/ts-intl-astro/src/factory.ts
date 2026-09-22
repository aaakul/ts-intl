/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createI18n,
  type I18nConfig,
  type NamespaceKeys,
  type ValueAtPath,
  type Translator,
  type FlatTranslator,
} from "@aaakul/ts-intl";
import { getActiveLocale, setGlobalFallbackLanguage } from "./context";
import { createI18nMiddleware, setGlobalMiddlewareOptions } from "./middleware";
import type { AstroI18nInstance, UseTranslationsOptions } from "./types";

export interface CreateAstroI18nOptions<
  TDefaultLanguage extends string,
  TLanguages extends Record<TDefaultLanguage, Record<string, any>>,
> extends I18nConfig<TDefaultLanguage, TLanguages> {
  /**
   * Route parameter names to search for locale (default: ['lang', 'locale']).
   */
  paramNames?: string[];
}

/**
 * Creates a ts-intl instance configured for Astro, providing context-aware helpers and middleware.
 */
export function createAstroI18n<
  TDefaultLanguage extends string,
  TLanguages extends Record<TDefaultLanguage, Record<string, any>>,
>(
  config: CreateAstroI18nOptions<TDefaultLanguage, TLanguages>,
): AstroI18nInstance<TDefaultLanguage, TLanguages> {
  type TBase = TLanguages[TDefaultLanguage];
  type SupportedLanguage = keyof TLanguages & string;

  const core = createI18n(config);

  const defaultLanguage = config.defaultLanguage;
  setGlobalFallbackLanguage(defaultLanguage);

  const resolverOptions = {
    supportedLanguages: core.languages,
    defaultLanguage,
    paramNames: config.paramNames,
  };

  setGlobalMiddlewareOptions(resolverOptions);

  const i18nMiddleware = createI18nMiddleware(resolverOptions);

  const translationsCache = new Map<string, any>();
  const getTranslations = (lang: string, namespace?: string) => {
    const cacheKey = namespace ? `${lang}:${namespace}` : lang;
    let t = translationsCache.get(cacheKey);
    if (!t) {
      t = (core.getTranslations as any)(lang, namespace);
      translationsCache.set(cacheKey, t);
    }
    return t;
  };

  function useTranslations<N extends NamespaceKeys<TBase>>(
    namespace: N,
    options?: UseTranslationsOptions<SupportedLanguage>,
  ): Translator<ValueAtPath<TBase, N>>;
  function useTranslations(
    options?: UseTranslationsOptions<SupportedLanguage>,
  ): FlatTranslator<TBase>;
  function useTranslations(arg1?: any, arg2?: any): any {
    const isNs = typeof arg1 === "string";
    const namespace = isNs ? arg1 : undefined;
    const options: UseTranslationsOptions<SupportedLanguage> | undefined = isNs
      ? arg2
      : arg1;
    const activeLocale = options?.locale || getActiveLocale(defaultLanguage);
    return getTranslations(activeLocale, namespace);
  }

  function useLocale(): SupportedLanguage {
    return getActiveLocale(defaultLanguage) as SupportedLanguage;
  }

  function useFormatter(options?: UseTranslationsOptions<SupportedLanguage>) {
    const activeLocale = options?.locale || getActiveLocale(defaultLanguage);
    return core.getFormatter(activeLocale);
  }

  return {
    languages: core.languages,
    defaultLanguage,
    isSupportedLanguage: core.isSupportedLanguage,
    useTranslations: useTranslations as any,
    useLocale,
    useFormatter,
    i18nMiddleware,
    getTranslations: getTranslations as any,
    getFormatter: core.getFormatter,
  };
}
