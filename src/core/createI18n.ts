/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIntlFormatters } from "../formatters/cache";
import { createFormatter, type Formatter } from "../formatters/createFormatter";
import type { Formats, I18nConfig } from "../types/config";
import type { NamespaceKeys, ValueAtPath } from "../types/paths";
import type { FlatTranslator, Translator } from "../types/translator";
import { I18nError, I18nErrorCode } from "./errors";
import { resolveIcu } from "./icu";
import { resolvePath } from "./resolvePath";
import { renderRichHierarchy } from "./rich";
import { validateMessages } from "./validate";

/**
 * Creates a lightweight, zero-dependency, pure-sync, type-safe i18n instance.
 */
export function createI18n<
  TDefaultLanguage extends string,
  TLanguages extends Record<TDefaultLanguage, Record<string, any>>,
>(config: I18nConfig<TDefaultLanguage, TLanguages>) {
  type TBase = TLanguages[TDefaultLanguage];
  type SupportedLanguage = keyof TLanguages & string;

  const { defaultLanguage, messages } = config;
  const languages = Object.freeze(
    Object.keys(messages),
  ) as readonly SupportedLanguage[];
  const defaultMessages = messages[defaultLanguage];

  const intlFormatters = createIntlFormatters();

  const defaultOnError = (error: I18nError) => {
    if (config.onMissingKey && error.code === I18nErrorCode.MISSING_MESSAGE) {
      config.onMissingKey(error.key ?? "", error.lang ?? "");
      return;
    }
    if (error.code === I18nErrorCode.MISSING_MESSAGE) {
      console.warn(
        `[ts-intl] Missing translation for key "${error.key}" in language "${error.lang}".`,
      );
    } else {
      console.warn(error.message);
    }
  };

  const defaultGetMessageFallback = (info: {
    error: I18nError;
    key: string;
    lang: string;
    namespace?: string | undefined;
  }) => {
    if (config.missingKeyHandler) {
      return config.missingKeyHandler(info.key, info.lang);
    }
    return `Missing translation: ${info.key}`;
  };

  const onError = config.onError ?? defaultOnError;
  const getMessageFallback =
    config.getMessageFallback ?? defaultGetMessageFallback;

  validateMessages(messages as Record<string, any>, onError);

  const formattersCache = new Map<string, Formatter>();
  const getFormatter = (
    lang: SupportedLanguage | (string & {}) = defaultLanguage,
  ): Formatter => {
    const langKey = lang as string;
    let formatter = formattersCache.get(langKey);
    if (!formatter) {
      formatter = createFormatter({
        locale: langKey,
        formats: config.formats,
        timeZone: config.timeZone,
        onError,
        _formatters: intlFormatters,
      });
      formattersCache.set(langKey, formatter);
    }
    return formatter;
  };

  /**
   * Returns a formatter that merges per-call format overrides on top of the global formats.
   * A new formatter is created each time (not cached) since overrides are call-specific.
   */
  const getFormatterWithOverrides = (
    lang: string,
    formatOverrides: Formats,
  ): Formatter => {
    return createFormatter({
      locale: lang,
      formats: {
        dateTime: { ...config.formats?.dateTime, ...formatOverrides.dateTime },
        number: { ...config.formats?.number, ...formatOverrides.number },
        list: { ...config.formats?.list, ...formatOverrides.list },
        displayName: {
          ...config.formats?.displayName,
          ...formatOverrides.displayName,
        },
      },
      timeZone: config.timeZone,
      onError,
      _formatters: intlFormatters,
    });
  };

  const getPluralCategory = (lang: string, count: number): string => {
    try {
      return intlFormatters.getPluralRules(lang).select(count);
    } catch {
      return count === 1 ? "one" : "other";
    }
  };

  const getOrdinalCategory = (lang: string, count: number): string => {
    try {
      return intlFormatters
        .getPluralRules(lang, { type: "ordinal" })
        .select(count);
    } catch {
      return "other";
    }
  };

  /** Interpolates placeholders and string tags, with optional per-call format overrides. */
  const interpolate = (
    template: string,
    params?: Record<string, any>,
    lang: string = defaultLanguage,
    formatOverrides?: Formats,
  ): string => {
    const formatter = formatOverrides
      ? getFormatterWithOverrides(lang, formatOverrides)
      : getFormatter(lang);
    let result = resolveIcu(template, params, lang, {
      getPluralCategory,
      getOrdinalCategory,
      formatter,
      onError,
    });
    if (result.includes("<")) {
      const tokens = renderRichHierarchy<string>(result, params);
      result = tokens
        .map((item) => (item == null ? "" : String(item)))
        .join("");
    }
    return result;
  };

  /** Interpolates rich text, returning an array of tokens, with optional per-call format overrides. */
  const renderRich = <R>(
    template: string,
    params?: Record<string, any>,
    lang: string = defaultLanguage,
    formatOverrides?: Formats,
  ): (string | R)[] => {
    const formatter = formatOverrides
      ? getFormatterWithOverrides(lang, formatOverrides)
      : getFormatter(lang);
    const templateWithVars = resolveIcu(template, params, lang, {
      getPluralCategory,
      getOrdinalCategory,
      formatter,
      onError,
    });
    return renderRichHierarchy<R>(templateWithVars, params);
  };

  /**
   * Type guard that checks if a string is a supported language code.
   */
  const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
    return Object.prototype.hasOwnProperty.call(messages, lang);
  };

  /**
   * Returns translator functions for a given language and optional namespace (pure synchronous and stateless).
   * @param lang Language code.
   * @param namespace Optional namespace path (e.g. 'common', 'search', 'qna.available').
   */
  function getTranslations<N extends NamespaceKeys<TBase>>(
    lang: SupportedLanguage | (string & {}),
    namespace: N,
  ): Translator<ValueAtPath<TBase, N>>;
  function getTranslations(
    lang: SupportedLanguage | (string & {}),
  ): FlatTranslator<TBase>;
  function getTranslations(
    lang: SupportedLanguage | (string & {}),
    namespace?: string,
  ): any {
    const currentMessages =
      (messages as Record<string, any>)[lang as string] || defaultMessages;

    function resolveMessage(
      fullKey: string,
      params?: Record<string, any>,
    ): { value: string; isMissing: boolean } {
      let resolved = resolvePath(currentMessages, fullKey);
      if (
        (resolved === undefined || resolved === "") &&
        currentMessages !== defaultMessages
      ) {
        resolved = resolvePath(defaultMessages, fullKey);
      }

      if (resolved === undefined) {
        const error = new I18nError(
          I18nErrorCode.MISSING_MESSAGE,
          `Missing translation for key "${fullKey}" in language "${lang}".`,
          { key: fullKey, lang: lang as string },
        );
        onError(error);
        return {
          value: getMessageFallback({
            error,
            key: fullKey,
            lang: lang as string,
            namespace,
          }),
          isMissing: true,
        };
      }

      if (
        resolved &&
        typeof resolved === "object" &&
        !Array.isArray(resolved) &&
        typeof resolved.other === "string"
      ) {
        const count = typeof params?.count === "number" ? params.count : 0;
        if (count === 0 && typeof resolved.zero === "string") {
          return { value: resolved.zero, isMissing: false };
        }
        const category = getPluralCategory(lang as string, count);
        if (typeof resolved[category] === "string") {
          return { value: resolved[category], isMissing: false };
        }
        return { value: resolved.other, isMissing: false };
      }

      if (typeof resolved === "string") {
        return { value: resolved, isMissing: false };
      }

      const error = new I18nError(
        I18nErrorCode.MISSING_MESSAGE,
        `Missing translation for key "${fullKey}" in language "${lang}".`,
        { key: fullKey, lang: lang as string },
      );
      onError(error);
      return {
        value: getMessageFallback({
          error,
          key: fullKey,
          lang: lang as string,
          namespace,
        }),
        isMissing: true,
      };
    }

    const t = function t(
      key: string,
      params?: Record<string, any>,
      formats?: Formats,
    ): string {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const { value, isMissing } = resolveMessage(fullKey, params);
      if (isMissing) {
        return value;
      }
      return interpolate(value, params, lang as string, formats);
    };

    t.has = function has(key: string): boolean {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      let val = resolvePath(currentMessages, fullKey);
      if (
        (val === undefined || val === "") &&
        currentMessages !== defaultMessages
      ) {
        val = resolvePath(defaultMessages, fullKey);
      }
      return val !== undefined;
    };

    t.rich = function rich<R = any>(
      key: string,
      params?: Record<string, any>,
      formats?: Formats,
    ): (string | R)[] {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const { value, isMissing } = resolveMessage(fullKey, params);
      if (isMissing) {
        return [value];
      }
      return renderRich<R>(value, params, lang as string, formats);
    };

    t.markup = function markup(
      key: string,
      params?: Record<string, any>,
      formats?: Formats,
    ): string {
      // Wrap function callbacks to detect non-string returns.
      let wrappedParams = params;
      if (params) {
        const wrapped: Record<string, any> = {};
        for (const [k, v] of Object.entries(params)) {
          if (typeof v === "function") {
            wrapped[k] = (children: string) => {
              const result = (v as (c: string) => unknown)(children);
              if (typeof result !== "string") {
                onError(
                  new I18nError(
                    I18nErrorCode.INVALID_MESSAGE,
                    "`t.markup` only accepts functions that receive and return strings.\n\n" +
                      `E.g. t.markup('key', {bold: (chunks) => \`<b>\${chunks}</b>\`})`,
                  ),
                );
                return String(result);
              }
              return result;
            };
          } else {
            wrapped[k] = v;
          }
        }
        wrappedParams = wrapped;
      }
      return t(key, wrappedParams, formats);
    };

    t.raw = function raw(key: string): any {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      let rawValue = resolvePath(currentMessages, fullKey);
      if (rawValue === undefined && currentMessages !== defaultMessages) {
        rawValue = resolvePath(defaultMessages, fullKey);
      }
      return rawValue;
    };

    return t;
  }

  return {
    languages,
    defaultLanguage,
    getTranslations,
    isSupportedLanguage,
    getFormatter,
  };
}
