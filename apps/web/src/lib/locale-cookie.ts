/**
 * Cookie configuration and helper utilities for locale preference persistence.
 */

export const LOCALE_COOKIE_NAME = "preferred_locale";

/**
 * 1 year in seconds (60s * 60m * 24h * 365d)
 */
export const LOCALE_COOKIE_MAX_AGE = 31536000;

/**
 * Reads the preferred locale from document.cookie.
 * Returns null if running in SSR or cookie is not set.
 */
export function getLocaleCookie(name: string = LOCALE_COOKIE_NAME): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Sets the preferred locale in document.cookie.
 */
export function setLocaleCookie(
  locale: string,
  name: string = LOCALE_COOKIE_NAME,
  maxAge: number = LOCALE_COOKIE_MAX_AGE
): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(
    locale
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
