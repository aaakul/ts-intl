import type { AstroCompatibleContext } from "./types";

export interface ResolveLocaleOptions {
  supportedLanguages: readonly string[];
  defaultLanguage: string;
  paramNames?: string[];
}

/**
 * Resolves the request locale from context.currentLocale, route params, or URL path segments.
 */
export function resolveRequestLocale(
  context: AstroCompatibleContext,
  options: ResolveLocaleOptions,
): string {
  const {
    supportedLanguages,
    defaultLanguage,
    paramNames = ["lang", "locale"],
  } = options;

  if (
    context.currentLocale &&
    supportedLanguages.includes(context.currentLocale)
  ) {
    return context.currentLocale;
  }

  if (context.params) {
    for (const name of paramNames) {
      const paramVal = context.params[name];
      if (paramVal && supportedLanguages.includes(paramVal)) {
        return paramVal;
      }
    }
  }

  if (context.url && context.url.pathname) {
    const segments = context.url.pathname.split("/").filter(Boolean);
    for (const segment of segments) {
      if (supportedLanguages.includes(segment)) {
        return segment;
      }
    }
  }

  return defaultLanguage;
}
