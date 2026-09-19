/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FlatTranslator,
  Formatter,
  NamespaceKeys,
  Translator,
  ValueAtPath,
} from "@aaakul/ts-intl";

/**
 * Minimal interface to decouple from specific Astro versions (compatible with Astro 3.x, 4.x, 5.x).
 */
export interface AstroCompatibleContext {
  url: URL;
  params?: Record<string, string | undefined>;
  currentLocale?: string | undefined;
  preferredLocale?: string | undefined;
  locals?: Record<string, any>;
  [key: string]: any;
}

export type AstroMiddlewareNext = () => Promise<Response>;

export type AstroMiddlewareFn = (
  context: AstroCompatibleContext,
  next: AstroMiddlewareNext,
) => Promise<Response>;

export interface I18nContextStore {
  locale: string;
}

export interface UseTranslationsOptions<TLang extends string = string> {
  locale?: TLang | (string & {});
}

export interface AstroI18nInstance<
  TDefaultLanguage extends string,
  TLanguages extends Record<TDefaultLanguage, Record<string, any>>,
> {
  languages: readonly (keyof TLanguages & string)[];
  defaultLanguage: TDefaultLanguage;
  isSupportedLanguage: (lang: string) => lang is keyof TLanguages & string;

  /**
   * Returns a translator bound to the current rendering context or specified locale.
   */
  useTranslations: {
    <N extends NamespaceKeys<TLanguages[TDefaultLanguage]>>(
      namespace: N,
      options?: UseTranslationsOptions<keyof TLanguages & string>,
    ): Translator<ValueAtPath<TLanguages[TDefaultLanguage], N>>;
    (
      options?: UseTranslationsOptions<keyof TLanguages & string>,
    ): FlatTranslator<TLanguages[TDefaultLanguage]>;
  };

  /**
   * Returns the active locale in the current rendering context.
   */
  useLocale: () => keyof TLanguages & string;

  /**
   * Returns the cached Intl formatter bound to the active or specified locale.
   */
  useFormatter: (
    options?: UseTranslationsOptions<keyof TLanguages & string>,
  ) => Formatter;

  /**
   * Pre-configured Astro middleware for this i18n instance.
   */
  i18nMiddleware: AstroMiddlewareFn;

  /**
   * Translation accessor for a specified language.
   */
  getTranslations: {
    <N extends NamespaceKeys<TLanguages[TDefaultLanguage]>>(
      lang: (keyof TLanguages & string) | (string & {}),
      namespace: N,
    ): Translator<ValueAtPath<TLanguages[TDefaultLanguage], N>>;
    (
      lang: (keyof TLanguages & string) | (string & {}),
    ): FlatTranslator<TLanguages[TDefaultLanguage]>;
  };

  /**
   * Formatter accessor for a specified language.
   */
  getFormatter: (
    lang?: (keyof TLanguages & string) | (string & {}),
  ) => Formatter;
}
