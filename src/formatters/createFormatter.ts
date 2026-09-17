import { I18nError, I18nErrorCode } from "../core/errors";
import type { Formats } from "../types/config";
import { createIntlFormatters, type IntlFormatters } from "./cache";

const SECOND = 1;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * (365 / 12);
const QUARTER = MONTH * 3;
const YEAR = DAY * 365;

const UNIT_SECONDS: Record<Intl.RelativeTimeFormatUnit, number> = {
  second: SECOND,
  seconds: SECOND,
  minute: MINUTE,
  minutes: MINUTE,
  hour: HOUR,
  hours: HOUR,
  day: DAY,
  days: DAY,
  week: WEEK,
  weeks: WEEK,
  month: MONTH,
  months: MONTH,
  quarter: QUARTER,
  quarters: QUARTER,
  year: YEAR,
  years: YEAR,
};

/**
 * Resolves the appropriate relative time unit based on elapsed seconds.
 */
export function resolveRelativeTimeUnit(
  seconds: number,
): Intl.RelativeTimeFormatUnit {
  const abs = Math.abs(seconds);
  if (abs < MINUTE) return "second";
  if (abs < HOUR) return "minute";
  if (abs < DAY) return "hour";
  if (abs < WEEK) return "day";
  if (abs < MONTH) return "week";
  if (abs < YEAR) return "month";
  return "year";
}

function calculateRelativeTimeValue(
  seconds: number,
  unit: Intl.RelativeTimeFormatUnit,
): number {
  return Math.round(seconds / UNIT_SECONDS[unit]);
}

export interface RelativeTimeOptions {
  now?: number | Date | undefined;
  unit?: Intl.RelativeTimeFormatUnit | undefined;
  style?: "long" | "short" | "narrow" | undefined;
  numeric?: "always" | "auto" | undefined;
  numberingSystem?: string | undefined;
}

export interface FormatterOptions {
  locale: string;
  formats?: Formats | undefined;
  timeZone?: string | undefined;
  onError?: ((error: I18nError) => void) | undefined;
  _formatters?: IntlFormatters | undefined;
}

export interface Formatter {
  /** Formats a date or timestamp with standard or named formatting options. */
  dateTime(
    value: Date | number,
    formatOrOptions?: string | Intl.DateTimeFormatOptions,
    overrides?: Intl.DateTimeFormatOptions,
  ): string;

  /** Formats a date range between start and end. */
  dateTimeRange(
    start: Date | number,
    end: Date | number,
    formatOrOptions?: string | Intl.DateTimeFormatOptions,
    overrides?: Intl.DateTimeFormatOptions,
  ): string;

  /** Formats a number or bigint (e.g. currencies, percentages, compact notation). */
  number(
    value: number | bigint,
    formatOrOptions?: string | Intl.NumberFormatOptions,
    overrides?: Intl.NumberFormatOptions,
  ): string;

  /** Formats a date relative to another point in time (e.g. '3 hours ago', 'tomorrow'). */
  relativeTime(
    date: number | Date,
    nowOrOptions?: number | Date | RelativeTimeOptions,
  ): string;

  /** Formats a list of items using language-sensitive list formatting (e.g. 'A, B, and C'). */
  list(
    items: Iterable<string>,
    formatOrOptions?: string | Intl.ListFormatOptions,
    overrides?: Intl.ListFormatOptions,
  ): string;

  /** Formats display names of language codes, region codes, or currency codes. */
  displayName(
    code: string,
    formatOrOptions: string | Intl.DisplayNamesOptions,
    overrides?: Intl.DisplayNamesOptions,
  ): string;
}

/**
 * Creates a zero-dependency formatter instance using Web standard Intl APIs.
 */
export function createFormatter(options: FormatterOptions): Formatter {
  const {
    locale,
    formats,
    timeZone: defaultTimeZone,
    onError,
    _formatters = createIntlFormatters(),
  } = options;

  function reportError(
    message: string,
    codeOrOriginalError?: I18nErrorCode | unknown,
  ): void {
    const code =
      typeof codeOrOriginalError === "string" &&
      Object.values(I18nErrorCode).includes(
        codeOrOriginalError as I18nErrorCode,
      )
        ? (codeOrOriginalError as I18nErrorCode)
        : I18nErrorCode.FORMATTING_ERROR;
    const originalError =
      typeof codeOrOriginalError === "string" ? undefined : codeOrOriginalError;
    const error = new I18nError(code, message, {
      lang: locale,
      originalError,
    });
    if (onError) {
      onError(error);
    } else {
      console.warn(`[ts-intl] ${message}`);
    }
  }

  function resolveFormat<T extends object>(
    formatDict: Record<string, T> | undefined,
    formatOrOptions?: string | T,
    overrides?: T,
  ): T | undefined {
    let resolved: T | undefined;
    if (typeof formatOrOptions === "string") {
      resolved = formatDict?.[formatOrOptions];
      if (!resolved) {
        reportError(
          `Named format "${formatOrOptions}" was not found in configuration formats.`,
          I18nErrorCode.MISSING_FORMAT,
        );
      }
    } else if (formatOrOptions && typeof formatOrOptions === "object") {
      resolved = formatOrOptions;
    }

    if (overrides) {
      resolved = { ...resolved, ...overrides } as T;
    }

    return resolved;
  }

  function dateTime(
    value: Date | number,
    formatOrOptions?: string | Intl.DateTimeFormatOptions,
    overrides?: Intl.DateTimeFormatOptions,
  ): string {
    try {
      let resolved = resolveFormat(
        formats?.dateTime,
        formatOrOptions,
        overrides,
      );
      if (defaultTimeZone && !resolved?.timeZone) {
        resolved = { ...resolved, timeZone: defaultTimeZone };
      }
      return _formatters.getDateTimeFormat(locale, resolved).format(value);
    } catch (err) {
      reportError(`Failed to format dateTime for value "${value}".`, err);
      return String(value);
    }
  }

  function dateTimeRange(
    start: Date | number,
    end: Date | number,
    formatOrOptions?: string | Intl.DateTimeFormatOptions,
    overrides?: Intl.DateTimeFormatOptions,
  ): string {
    try {
      let resolved = resolveFormat(
        formats?.dateTime,
        formatOrOptions,
        overrides,
      );
      if (defaultTimeZone && !resolved?.timeZone) {
        resolved = { ...resolved, timeZone: defaultTimeZone };
      }
      const formatter = _formatters.getDateTimeFormat(locale, resolved);
      if (typeof formatter.formatRange === "function") {
        return formatter.formatRange(start, end);
      }
      return `${dateTime(start, resolved)} – ${dateTime(end, resolved)}`;
    } catch (err) {
      reportError(
        `Failed to format dateTimeRange for range [${start}, ${end}].`,
        err,
      );
      return `${String(start)} – ${String(end)}`;
    }
  }

  function number(
    value: number | bigint,
    formatOrOptions?: string | Intl.NumberFormatOptions,
    overrides?: Intl.NumberFormatOptions,
  ): string {
    try {
      const resolved = resolveFormat(
        formats?.number,
        formatOrOptions,
        overrides,
      );
      return _formatters.getNumberFormat(locale, resolved).format(value);
    } catch (err) {
      reportError(`Failed to format number for value "${value}".`, err);
      return String(value);
    }
  }

  function relativeTime(
    date: number | Date,
    nowOrOptions?: number | Date | RelativeTimeOptions,
  ): string {
    try {
      let nowDate: Date = new Date();
      let explicitUnit: Intl.RelativeTimeFormatUnit | undefined;
      const opts: Intl.RelativeTimeFormatOptions = {};

      if (nowOrOptions instanceof Date || typeof nowOrOptions === "number") {
        nowDate = new Date(nowOrOptions);
      } else if (nowOrOptions && typeof nowOrOptions === "object") {
        if (nowOrOptions.now != null) {
          nowDate = new Date(nowOrOptions.now);
        }
        explicitUnit = nowOrOptions.unit;
        if (nowOrOptions.style) opts.style = nowOrOptions.style;
        if (nowOrOptions.numberingSystem) {
          (opts as any).numberingSystem = nowOrOptions.numberingSystem;
        }
        if (nowOrOptions.numeric) opts.numeric = nowOrOptions.numeric;
      }

      const targetDate = new Date(date);
      const diffSeconds = (targetDate.getTime() - nowDate.getTime()) / 1000;
      const unit = explicitUnit ?? resolveRelativeTimeUnit(diffSeconds);

      if (!opts.numeric) {
        opts.numeric = unit === "second" ? "auto" : "always";
      }

      const value = calculateRelativeTimeValue(diffSeconds, unit);
      return _formatters
        .getRelativeTimeFormat(locale, opts)
        .format(value, unit);
    } catch (err) {
      reportError(
        `Failed to format relativeTime for date "${String(date)}".`,
        err,
      );
      return String(date);
    }
  }

  function list(
    items: Iterable<string>,
    formatOrOptions?: string | Intl.ListFormatOptions,
    overrides?: Intl.ListFormatOptions,
  ): string {
    try {
      const array = Array.isArray(items) ? items : Array.from(items);
      const resolved = resolveFormat(formats?.list, formatOrOptions, overrides);
      return _formatters.getListFormat(locale, resolved).format(array);
    } catch (err) {
      reportError(`Failed to format list.`, err);
      return Array.from(items).join(", ");
    }
  }

  function displayName(
    code: string,
    formatOrOptions: string | Intl.DisplayNamesOptions,
    overrides?: Intl.DisplayNamesOptions,
  ): string {
    try {
      const resolved = resolveFormat(
        formats?.displayName,
        formatOrOptions,
        overrides,
      );
      if (!resolved || !resolved.type) {
        throw new Error(
          `Intl.DisplayNames requires an options object with a 'type' property (e.g. { type: 'language' }).`,
        );
      }
      const formatted = _formatters.getDisplayNames(locale, resolved).of(code);
      return formatted ?? code;
    } catch (err) {
      reportError(`Failed to format displayName for code "${code}".`, err);
      return code;
    }
  }

  return {
    dateTime,
    dateTimeRange,
    number,
    relativeTime,
    list,
    displayName,
  };
}
