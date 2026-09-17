/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IntlCache {
  dateTime: Map<string, Intl.DateTimeFormat>;
  number: Map<string, Intl.NumberFormat>;
  pluralRules: Map<string, Intl.PluralRules>;
  relativeTime: Map<string, Intl.RelativeTimeFormat>;
  list: Map<string, Intl.ListFormat>;
  displayName: Map<string, Intl.DisplayNames>;
}

export function createIntlCache(): IntlCache {
  return {
    dateTime: new Map(),
    number: new Map(),
    pluralRules: new Map(),
    relativeTime: new Map(),
    list: new Map(),
    displayName: new Map(),
  };
}

function serializeKey(locale: string, options?: any): string {
  if (!options) return locale;
  return `${locale}|${JSON.stringify(options)}`;
}

export interface IntlFormatters {
  getDateTimeFormat(
    locale: string,
    options?: Intl.DateTimeFormatOptions,
  ): Intl.DateTimeFormat;
  getNumberFormat(
    locale: string,
    options?: Intl.NumberFormatOptions,
  ): Intl.NumberFormat;
  getPluralRules(
    locale: string,
    options?: Intl.PluralRulesOptions,
  ): Intl.PluralRules;
  getRelativeTimeFormat(
    locale: string,
    options?: Intl.RelativeTimeFormatOptions,
  ): Intl.RelativeTimeFormat;
  getListFormat(
    locale: string,
    options?: Intl.ListFormatOptions,
  ): Intl.ListFormat;
  getDisplayNames(
    locale: string,
    options: Intl.DisplayNamesOptions,
  ): Intl.DisplayNames;
}

export function createIntlFormatters(
  cache: IntlCache = createIntlCache(),
): IntlFormatters {
  return {
    getDateTimeFormat(locale, options) {
      const key = serializeKey(locale, options);
      let formatter = cache.dateTime.get(key);
      if (!formatter) {
        formatter = new Intl.DateTimeFormat(locale, options);
        cache.dateTime.set(key, formatter);
      }
      return formatter;
    },

    getNumberFormat(locale, options) {
      const key = serializeKey(locale, options);
      let formatter = cache.number.get(key);
      if (!formatter) {
        formatter = new Intl.NumberFormat(locale, options);
        cache.number.set(key, formatter);
      }
      return formatter;
    },

    getPluralRules(locale, options) {
      const key = serializeKey(locale, options);
      let rules = cache.pluralRules.get(key);
      if (!rules) {
        rules = new Intl.PluralRules(locale, options);
        cache.pluralRules.set(key, rules);
      }
      return rules;
    },

    getRelativeTimeFormat(locale, options) {
      const key = serializeKey(locale, options);
      let formatter = cache.relativeTime.get(key);
      if (!formatter) {
        formatter = new Intl.RelativeTimeFormat(locale, options);
        cache.relativeTime.set(key, formatter);
      }
      return formatter;
    },

    getListFormat(locale, options) {
      const key = serializeKey(locale, options);
      let formatter = cache.list.get(key);
      if (!formatter) {
        formatter = new Intl.ListFormat(locale, options);
        cache.list.set(key, formatter);
      }
      return formatter;
    },

    getDisplayNames(locale, options) {
      const key = serializeKey(locale, options);
      let displayNames = cache.displayName.get(key);
      if (!displayNames) {
        displayNames = new Intl.DisplayNames(locale, options);
        cache.displayName.set(key, displayNames);
      }
      return displayNames;
    },
  };
}

