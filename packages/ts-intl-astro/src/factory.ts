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

  setGlobalFallbackLanguage(config.defaultLanguage);

  const resolverOptions = {
    supportedLanguages: core.languages,
    defaultLanguage: core.defaultLanguage,
    paramNames: config.paramNames,
  };

  setGlobalMiddlewareOptions(resolverOptions);

  const i18nMiddleware = createI18nMiddleware(resolverOptions);

  function useTranslations<N extends NamespaceKeys<TBase>>(
    namespace: N,
    options?: UseTranslationsOptions<SupportedLanguage>,
  ): Translator<ValueAtPath<TBase, N>>;
  function useTranslations(
    options?: UseTranslationsOptions<SupportedLanguage>,
  ): FlatTranslator<TBase>;
  function useTranslations(arg1?: any, arg2?: any): any {
    let namespace: string | undefined;
    let options: UseTranslationsOptions<SupportedLanguage> | undefined;

    if (typeof arg1 === "string") {
      namespace = arg1;
      options = arg2;
    } else if (typeof arg1 === "object" && arg1 !== null) {
      options = arg1;
    }

    const activeLocale =
      options?.locale || getActiveLocale(config.defaultLanguage);
    return (core.getTranslations as any)(activeLocale, namespace);
  }

  function useLocale(): SupportedLanguage {
    return getActiveLocale(config.defaultLanguage) as SupportedLanguage;
  }

  function useFormatter(options?: UseTranslationsOptions<SupportedLanguage>) {
    const activeLocale =
      options?.locale || getActiveLocale(config.defaultLanguage);
    return core.getFormatter(activeLocale);
  }

  return {
    languages: core.languages,
    defaultLanguage: core.defaultLanguage,
    isSupportedLanguage: core.isSupportedLanguage,
    useTranslations: useTranslations as any,
    useLocale,
    useFormatter,
    i18nMiddleware,
    getTranslations: core.getTranslations as any,
    getFormatter: core.getFormatter,
  };
}
