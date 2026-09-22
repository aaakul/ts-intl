/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IntlCache {
  dateTime: Map<string, Intl.DateTimeFormat>;
  number: Map<string, Intl.NumberFormat>;
  pluralRules: Map<string, Intl.PluralRules>;
  relativeTime: Map<string, Intl.RelativeTimeFormat>;
  list: Map<string, Intl.ListFormat>;
  displayName: Map<string, Intl.DisplayNames>;
}

export class LruMap<K, V> extends Map<K, V> {
  readonly maxSize: number;

  constructor(maxSize = 200) {
    super();
    this.maxSize = maxSize;
  }

  override set(key: K, value: V): this {
    if (super.has(key)) {
      super.delete(key);
    } else if (super.size >= this.maxSize) {
      const oldestKey = super.keys().next().value;
      if (oldestKey !== undefined) {
        super.delete(oldestKey);
      }
    }
    return super.set(key, value);
  }
}

export function createIntlCache(maxSize = 200): IntlCache {
  return {
    dateTime: new LruMap(maxSize),
    number: new LruMap(maxSize),
    pluralRules: new LruMap(maxSize),
    relativeTime: new LruMap(maxSize),
    list: new LruMap(maxSize),
    displayName: new LruMap(maxSize),
  };
}

function serializeKey(locale: string, options?: any): string {
  if (!options) return locale;
  if (typeof options === "object" && options !== null) {
    const keys = Object.keys(options).sort();
    return `${locale}|${JSON.stringify(options, keys)}`;
  }
  return `${locale}|${String(options)}`;
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
  const getOrCreate = <T>(
    map: Map<string, T>,
    ctor: new (loc: string, opt?: any) => T,
    locale: string,
    options?: any,
  ): T => {
    const key = serializeKey(locale, options);
    let inst = map.get(key);
    if (!inst) {
      inst = new ctor(locale, options);
      map.set(key, inst);
    }
    return inst;
  };

  return {
    getDateTimeFormat: (l, o) =>
      getOrCreate(cache.dateTime, Intl.DateTimeFormat, l, o),
    getNumberFormat: (l, o) =>
      getOrCreate(cache.number, Intl.NumberFormat, l, o),
    getPluralRules: (l, o) =>
      getOrCreate(cache.pluralRules, Intl.PluralRules, l, o),
    getRelativeTimeFormat: (l, o) =>
      getOrCreate(cache.relativeTime, Intl.RelativeTimeFormat, l, o),
    getListFormat: (l, o) => getOrCreate(cache.list, Intl.ListFormat, l, o),
    getDisplayNames: (l, o) =>
      getOrCreate(cache.displayName, Intl.DisplayNames, l, o),
  };
}
