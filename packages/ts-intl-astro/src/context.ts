import { AsyncLocalStorage } from "node:async_hooks";
import type { I18nContextStore } from "./types";

const STORAGE_KEY = Symbol.for("ts-intl-astro/storage");
const FALLBACK_LANG_KEY = Symbol.for("ts-intl-astro/fallbackLang");

type GlobalThisWithStorage = typeof globalThis & {
  [STORAGE_KEY]?: AsyncLocalStorage<I18nContextStore>;
  [FALLBACK_LANG_KEY]?: string;
};

const g = globalThis as GlobalThisWithStorage;

export const i18nStorage: AsyncLocalStorage<I18nContextStore> =
  g[STORAGE_KEY] ||
  (g[STORAGE_KEY] = new AsyncLocalStorage<I18nContextStore>());

/**
 * Sets a global fallback language when no active context is found.
 */
export function setGlobalFallbackLanguage(lang: string): void {
  g[FALLBACK_LANG_KEY] = lang;
}

export function getGlobalFallbackLanguage(): string {
  return g[FALLBACK_LANG_KEY] || "en";
}

/**
 * Gets the current active locale from AsyncLocalStorage.
 * Falls back to globalFallbackLanguage if no context has been established.
 */
export function getActiveLocale(fallback?: string): string {
  const store = i18nStorage.getStore();
  if (store?.locale) {
    return store.locale;
  }
  return fallback || getGlobalFallbackLanguage();
}

/**
 * Executes a callback within an isolated i18n context for the specified locale.
 */
export function runWithLocale<T>(locale: string, fn: () => T): T {
  return i18nStorage.run({ locale }, fn);
}
