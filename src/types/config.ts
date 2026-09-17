/* eslint-disable @typescript-eslint/no-explicit-any */
import type { I18nError } from "../core/errors";
import type { ValidateLanguages } from "./validation";

/** Reusable named formatting styles for numbers, dates, lists, and display names. */
export interface Formats {
  dateTime?: Record<string, Intl.DateTimeFormatOptions> | undefined;
  number?: Record<string, Intl.NumberFormatOptions> | undefined;
  list?: Record<string, Intl.ListFormatOptions> | undefined;
  displayName?: Record<string, Intl.DisplayNamesOptions> | undefined;
}

/**
 * Configuration options for creating an i18n instance:
 * - defaultLanguage: Default language code.
 * - messages: Map of translation dictionaries. 'defaultLanguage' is the base type reference; other languages must match its keys and placeholders.
 * - formats: Optional named format styles for numbers, dates, lists, and display names.
 * - timeZone: Optional default IANA time zone (e.g. "UTC", "America/New_York").
 * - onError: Unified callback when any error occurs (missing key, formatting, etc.).
 * - getMessageFallback: Unified generator for fallback strings on errors.
 * - onMissingKey: Callback when a translation key is missing. Defaults to logging via onError.
 * - missingKeyHandler: Fallback text generator when a key is missing. Defaults to 'Missing translation: ${key}'.
 */
export interface I18nConfig<
  TDefaultLanguage extends string,
  TLanguages extends Record<TDefaultLanguage, Record<string, any>>,
> {
  defaultLanguage: TDefaultLanguage;
  messages: ValidateLanguages<TDefaultLanguage, TLanguages>;
  /** Named format presets for dates, numbers, lists, and display names. */
  formats?: Formats | undefined;
  /** Global default time zone for date and time formatting (e.g. "UTC", "Asia/Tokyo"). */
  timeZone?: string | undefined;
  /**
   * Unified error handler for missing keys, invalid keys, or formatting errors.
   */
  onError?: ((error: I18nError) => void) | undefined;
  /**
   * Generates a fallback string when a message cannot be resolved or formatted.
   */
  getMessageFallback?:
    | ((info: {
        error: I18nError;
        key: string;
        lang: string;
        namespace?: string | undefined;
      }) => string)
    | undefined;
  /**
   * Callback when a translation key is missing (e.g. for error tracking like Sentry).
   * Default: logs a warning with console.warn or delegates to `onError`.
   */
  onMissingKey?: ((key: string, lang: string) => void) | undefined;
  /**
   * Fallback text generator when a key is missing.
   * Default: returns `Missing translation: ${key}` or delegates to `getMessageFallback`.
   */
  missingKeyHandler?: ((key: string, lang: string) => string) | undefined;
}
