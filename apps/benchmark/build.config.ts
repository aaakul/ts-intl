import { type UserConfig } from "vite";

export type BuildConfig = {
  locales: number;
  messages: number;
  percentDynamic: number;
  library: "paraglide" | "i18next" | "ts-intl";
  /**
   * The mode for the specific library (e.g., "default", "locale-splitting", "http-backend")
   */
  libraryMode: string;
  /**
   * Mainly useful for testing routing.
   */
  generateAboutPage: boolean;
  /**
   * The total number of messages in the namespace.
   * This can be larger than the number of messages rendered on the page.
   * If not specified, it defaults to the same value as messages.
   */
  namespaceSize?: number;
};

const isQuick = process.env.BENCHMARK_PRESET === "quick";

export const builds: BuildConfig[] = isQuick
  ? [
      ...createBuildMatrix({
        libraries: {
          "ts-intl": ["default", "locale-splitting"],
          paraglide: ["default", "experimental-middleware-locale-splitting"],
          i18next: ["default", "http-backend"],
        },
        locales: [5, 10],
        messages: [100],
        percentDynamic: 20,
        namespaceSizes: [100, 500],
      }),
    ]
  : [
      // For m=100
      ...createBuildMatrix({
        libraries: {
          "ts-intl": ["default", "locale-splitting"],
          paraglide: ["default", "experimental-middleware-locale-splitting"],
          i18next: ["default", "http-backend"],
        },
        locales: [5, 10, 20],
        messages: [100],
        percentDynamic: 20,
        namespaceSizes: [100, 200, 500, 1000],
      }),
      // For m=200
      ...createBuildMatrix({
        libraries: {
          "ts-intl": ["default", "locale-splitting"],
          paraglide: ["default", "experimental-middleware-locale-splitting"],
          i18next: ["default", "http-backend"],
        },
        locales: [5, 10, 20],
        messages: [200],
        percentDynamic: 20,
        namespaceSizes: [200, 500, 1000],
      }),
    ];

export function createViteConfig(args: {
  outdir: string;
  mode: string;
  library: string;
  libraryMode: string;
  base: string;
  buildName: string;
  generateAboutPage: boolean;
}): UserConfig {
  return {
    logLevel: "error",
    base: args.base,
    build: {
      outDir: args.outdir,
      minify: true,
      target: "es2024",
      modulePreload: false,
    },
    define: {
      "process.env.BASE": JSON.stringify(args.base),
      "process.env.MODE": JSON.stringify(args.mode),
      "process.env.BUILD_NAME": JSON.stringify(args.buildName),
      "process.env.LIBRARY": JSON.stringify(args.library),
      "process.env.LIBRARY_MODE": JSON.stringify(args.libraryMode),
      "process.env.GENERATE_ABOUT_PAGE": JSON.stringify(args.generateAboutPage),
      "process.env.IS_CLIENT": JSON.stringify("true"),
    },
  };
}

export function createBuildMatrix(config: {
  libraries: Record<string, string[]>;
  locales: Array<number>;
  messages: Array<number>;
  percentDynamic: number;
  generateAboutPage?: boolean;
  namespaceSizes?: Array<number>;
}): BuildConfig[] {
  const matrix: BuildConfig[] = [];
  const nsList =
    config.namespaceSizes && config.namespaceSizes.length > 0
      ? config.namespaceSizes
      : [undefined];

  for (const [library, modes] of Object.entries(config.libraries)) {
    for (const mode of modes) {
      for (const locale of config.locales) {
        for (const message of config.messages) {
          for (const namespaceSize of nsList) {
            if (namespaceSize !== undefined && namespaceSize < message) {
              throw new Error(
                `Namespace size (${namespaceSize}) cannot be lower than message count (${message})`,
              );
            }

            matrix.push({
              library: library as BuildConfig["library"],
              libraryMode: mode,
              locales: locale,
              messages: message,
              ...(namespaceSize !== undefined ? { namespaceSize } : {}),
              percentDynamic: config.percentDynamic,
              generateAboutPage: config.generateAboutPage ?? true,
            });
          }
        }
      }
    }
  }
  return matrix;
}

export function buildConfigToString(config: BuildConfig): string {
  return `l${config.locales}-m${config.messages}-ns${config.namespaceSize}-d${config.percentDynamic}-${config.library}-${config.libraryMode}`;
}
