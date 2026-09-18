export default {
  nav: {
    docs: "文档",
    github: "GitHub",
    themeToggle: "切换主题",
    switchLanguage: "语言",
  },
  hero: {
    badge: "零依赖 · 类型安全 · 框架无关",
    title: "现代 TypeScript 国际化方案",
    getStarted: "开始使用",
    github: "GitHub",
    tabAstro: "Component.astro",
    tabMessages: "zh-Hans.ts",
    tabConfig: "i18n.ts",
    tabOutput: "输出 HTML",
  },
  features: {
    typeSafetyTitle: "类型安全",
    typeSafetyDesc:
      "支持翻译键名、命名空间及插值参数的 TypeScript 类型推导，并校验跨语言词典结构的一致性。",
    zeroDepTitle: "零运行时依赖",
    zeroDepDesc:
      "基于 TypeScript 与 Web 标准 Intl API 构建，无需代码生成步骤。",
    icuTitle: "ICU Message Format 支持",
    icuDesc:
      "支持复数规则、序数词、条件分支（select）与富文本标签映射，无需引入外部解析器。",
    frameworkTitle: "框架无关",
    frameworkDesc:
      "适用于 Astro、Next.js、React、Vue、Svelte、Node.js、Bun 及 Cloudflare Workers 等多种环境。",
  },
  docs: {
    onThisPage: "本页目录",
    previousChapter: "上一章",
    nextChapter: "下一章",
    chapters: "章节导航",
  },
  footer: {
    license: "基于 MIT 协议开源",
    tagline: "零依赖、类型安全的 TypeScript 国际化方案。",
  },
  playground: {
    title: "交互演练场",
    reset: "重置",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "实时预览",
    loading: "正在加载演练场...",
  },
} as const;
