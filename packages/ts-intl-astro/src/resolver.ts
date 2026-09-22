import type { AstroCompatibleContext } from "./types";

export interface ResolveLocaleOptions {
  supportedLanguages: readonly string[];
  defaultLanguage: string;
  paramNames?: string[];
}

const DEFAULT_PARAM_NAMES: readonly string[] = Object.freeze([
  "lang",
  "locale",
]);

/**
 * Resolves the request locale from context.currentLocale, route params, or URL path segments.
 */
export function resolveRequestLocale(
  context: AstroCompatibleContext,
  options: ResolveLocaleOptions,
): string {
  const { supportedLanguages, defaultLanguage } = options;

  if (
    context.currentLocale &&
    supportedLanguages.includes(context.currentLocale)
  ) {
    return context.currentLocale;
  }

  if (context.params) {
    const paramNames = options.paramNames || DEFAULT_PARAM_NAMES;
    for (let i = 0; i < paramNames.length; i++) {
      const name = paramNames[i];
      if (name) {
        const paramVal = context.params[name];
        if (paramVal && supportedLanguages.includes(paramVal)) {
          return paramVal;
        }
      }
    }
  }

  const pathname = context.url?.pathname;
  if (pathname) {
    const len = pathname.length;
    let start = 0;
    while (start < len) {
      while (start < len && pathname.charCodeAt(start) === 47) {
        start++;
      }
      if (start >= len) break;
      let end = pathname.indexOf("/", start);
      if (end === -1) end = len;
      const segment = pathname.slice(start, end);
      if (supportedLanguages.includes(segment)) {
        return segment;
      }
      start = end + 1;
    }
  }

  return defaultLanguage;
}
