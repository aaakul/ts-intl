/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TsIntlIntegrationOptions {
  /**
   * Custom middleware entrypoint if a custom middleware file is provided.
   * Defaults to 'ts-intl-astro/middleware'.
   */
  middlewareEntrypoint?: string;
}

/**
 * Astro integration for ts-intl.
 * Injects pre-middleware into the Astro rendering pipeline.
 */
export function tsIntlAstro(options: TsIntlIntegrationOptions = {}): {
  name: string;
  hooks: Record<string, any>;
} {
  const middlewareEntrypoint =
    options.middlewareEntrypoint || "ts-intl-astro/middleware";

  return {
    name: "ts-intl-astro",
    hooks: {
      "astro:config:setup": (params: any) => {
        const { addMiddleware, logger } = params;

        if (typeof addMiddleware === "function") {
          addMiddleware({
            entrypoint: middlewareEntrypoint,
            order: "pre",
          });
        } else if (logger && typeof logger.warn === "function") {
          logger.warn(
            "Current Astro version does not support `addMiddleware`. " +
              "Please export `onRequest = i18nMiddleware` in `src/middleware.ts` manually.",
          );
        }
      },
    },
  };
}

export default tsIntlAstro;
