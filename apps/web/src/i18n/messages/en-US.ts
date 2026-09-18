export default {
  nav: {
    docs: "Docs",
    github: "GitHub",
    themeToggle: "Toggle theme",
    switchLanguage: "Language",
  },
  hero: {
    badge: "Zero Dependencies · Type Safety · Framework Agnostic",
    title: "Internationalization for Modern TypeScript",
    getStarted: "Get Started",
    github: "GitHub",
    tabAstro: "Component.astro",
    tabMessages: "en-US.ts",
    tabConfig: "i18n.ts",
    tabOutput: "Output HTML",
  },
  features: {
    typeSafetyTitle: "Type Safety",
    typeSafetyDesc:
      "Provides TypeScript type inference for translation keys, namespaces, and parameters, while validating schema consistency across locales.",
    zeroDepTitle: "Zero Runtime Dependencies",
    zeroDepDesc:
      "Built on TypeScript and Web standard Intl APIs, requiring no code generation build steps.",
    icuTitle: "ICU Message Format Support",
    icuDesc:
      "Supports plurals, ordinals, select branches, and rich text tag interpolation without external parser dependencies.",
    frameworkTitle: "Framework Agnostic",
    frameworkDesc:
      "Runs in Astro, Next.js, React, Vue, Svelte, Node.js, Bun, and Cloudflare Workers.",
  },
  docs: {
    onThisPage: "On This Page",
    previousChapter: "Previous",
    nextChapter: "Next",
    chapters: "Chapters",
  },
  footer: {
    license: "MIT Licensed",
    tagline: "Zero-dependency, type-safe internationalization for TypeScript.",
  },
  playground: {
    title: "Playground",
    reset: "Reset",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "Live Preview",
    loading: "Loading playground...",
  },
} as const;
