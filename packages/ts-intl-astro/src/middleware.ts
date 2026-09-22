import { getGlobalFallbackLanguage, runWithLocale } from "./context";
import { resolveRequestLocale, type ResolveLocaleOptions } from "./resolver";
import type {
  AstroCompatibleContext,
  AstroMiddlewareFn,
  AstroMiddlewareNext,
} from "./types";

const OPTIONS_KEY = Symbol.for("ts-intl-astro/middlewareOptions");
const SAFE_LOCALE_PATTERN = /^[a-zA-Z0-9_-]{2,16}$/;

type GlobalThisWithOptions = typeof globalThis & {
  [OPTIONS_KEY]?: ResolveLocaleOptions;
};

const g = globalThis as GlobalThisWithOptions;

/**
 * Registers global options for the standalone middleware entry point.
 */
export function setGlobalMiddlewareOptions(
  options: ResolveLocaleOptions,
): void {
  g[OPTIONS_KEY] = options;
}

export function getGlobalMiddlewareOptions(): ResolveLocaleOptions | undefined {
  return g[OPTIONS_KEY];
}

function attachLocaleAndRun(
  context: AstroCompatibleContext,
  locale: string,
  next: AstroMiddlewareNext,
): Promise<Response> {
  const locals = (context.locals ||= {});
  locals.locale = locals.lang = locale;
  return runWithLocale(locale, next);
}

/**
 * Factory that creates an Astro-compatible middleware function.
 */
export function createI18nMiddleware(
  options: ResolveLocaleOptions,
): AstroMiddlewareFn {
  return (context: AstroCompatibleContext, next: AstroMiddlewareNext) =>
    attachLocaleAndRun(context, resolveRequestLocale(context, options), next);
}

/**
 * Standalone Astro middleware handler.
 * Uses options registered via setGlobalMiddlewareOptions or defaults.
 */
export const onRequest: AstroMiddlewareFn = (
  context: AstroCompatibleContext,
  next: AstroMiddlewareNext,
) => {
  const options = g[OPTIONS_KEY];
  let locale: string;

  if (options) {
    locale = resolveRequestLocale(context, options);
  } else {
    const candidate =
      context.currentLocale || context.params?.lang || context.params?.locale;
    locale =
      candidate && SAFE_LOCALE_PATTERN.test(candidate)
        ? candidate
        : getGlobalFallbackLanguage();
  }

  return attachLocaleAndRun(context, locale, next);
};
