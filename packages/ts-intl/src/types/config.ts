/* eslint-disable @typescript-eslint/no-explicit-any */
import type { I18nError } from "../core/errors";
import type { ValidateLanguages } from "./validation";

export interface Formats {
  dateTime?: Record<string, Intl.DateTimeFormatOptions> | undefined;
  number?: Record<string, Intl.NumberFormatOptions> | undefined;
  list?: Record<string, Intl.ListFormatOptions> | undefined;
  displayName?: Record<string, Intl.DisplayNamesOptions> | undefined;
}

export interface I18nConfig<
  TDefaultLanguage extends string,
  TLanguages extends Record<TDefaultLanguage, Record<string, any>>,
> {
  /**
   * Reference language for schema inference.
   * Other language dictionaries are validated against its keys and ICU placeholders.
   */
  defaultLanguage: TDefaultLanguage;

  /**
   * Translation dictionaries. Key names must not contain '.' as dots are
   * reserved for nested namespace path traversal.
   */
  messages: ValidateLanguages<TDefaultLanguage, TLanguages>;

  /**
   * Predefined format presets referenced by name within ICU expressions
   * (e.g. {val, number, currency}).
   */
  formats?: Formats | undefined;

  /**
   * IANA time zone identifier (e.g. "UTC", "Asia/Tokyo") applied when
   * format options do not provide an explicit timeZone.
   */
  timeZone?: string | undefined;

  /**
   * Invoked when message resolution, key validation, or formatting fails.
   * When omitted, warnings are logged via console.warn.
   */
  onError?: ((error: I18nError) => void) | undefined;

  /**
   * Overrides the string returned when key resolution fails.
   * Defaults to 'Missing translation: ${key}'.
   */
  getMessageFallback?:
    | ((info: {
        error: I18nError;
        key: string;
        lang: string;
        namespace?: string | undefined;
      }) => string)
    | undefined;
}
