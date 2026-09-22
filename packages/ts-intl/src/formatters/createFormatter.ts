import { I18nError, I18nErrorCode } from "../core/errors";
import type { Formats } from "../types/config";
import { createIntlFormatters, type IntlFormatters } from "./cache";

const UNIT_SECONDS: Record<string, number> = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2628000,
  quarter: 7884000,
  year: 31536000,
};

export function resolveRelativeTimeUnit(
  seconds: number,
): Intl.RelativeTimeFormatUnit {
  const abs = Math.abs(seconds);
  if (abs < 60) return "second";
  if (abs < 3600) return "minute";
  if (abs < 86400) return "hour";
  if (abs < 604800) return "day";
  if (abs < 2628000) return "week";
  if (abs < 31536000) return "month";
  return "year";
}

function calculateRelativeTimeValue(
  seconds: number,
  unit: Intl.RelativeTimeFormatUnit,
): number {
  const base = unit.endsWith("s") ? unit.slice(0, -1) : unit;
  return Math.round(seconds / (UNIT_SECONDS[base] || 1));
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
  dateTime(
    value: Date | number,
    formatOrOptions?: string | Intl.DateTimeFormatOptions,
    overrides?: Intl.DateTimeFormatOptions,
  ): string;

  /**
   * Falls back to start-end concatenation in environments where
   * Intl.DateTimeFormat.prototype.formatRange is not supported.
   */
  dateTimeRange(
    start: Date | number,
    end: Date | number,
    formatOrOptions?: string | Intl.DateTimeFormatOptions,
    overrides?: Intl.DateTimeFormatOptions,
  ): string;

  number(
    value: number | bigint,
    formatOrOptions?: string | Intl.NumberFormatOptions,
    overrides?: Intl.NumberFormatOptions,
  ): string;

  relativeTime(
    date: number | Date,
    nowOrOptions?: number | Date | RelativeTimeOptions,
  ): string;

  list(
    items: Iterable<string>,
    formatOrOptions?: string | Intl.ListFormatOptions,
    overrides?: Intl.ListFormatOptions,
  ): string;

  /**
   * Requires options to specify a 'type' property (e.g. { type: 'language' })
   * per the ECMAScript Intl.DisplayNames specification.
   */
  displayName(
    code: string,
    formatOrOptions: string | Intl.DisplayNamesOptions,
    overrides?: Intl.DisplayNamesOptions,
  ): string;
}

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
    const isCode =
      typeof codeOrOriginalError === "string" &&
      codeOrOriginalError in I18nErrorCode;
    const code = isCode
      ? (codeOrOriginalError as I18nErrorCode)
      : I18nErrorCode.FORMATTING_ERROR;
    const originalError = isCode ? undefined : codeOrOriginalError;
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
