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
    astroBadge: "Astro 集成已推出",
    astroIntegration: "Astro 集成指南",
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
  benchmark: {
    badge: "基准测试",
    title: "网络传输体积基准测试",
    desc: "模拟多语言 Web 应用在首屏预渲染与客户端水合（Hydration）时，浏览器实际下载的全部国际化资源网络传输体积。",
    viewFullDocs: "查看完整基准测试报告",
    scenario1Title: "10 语言 · 500 词条",
    scenario2Title: "5 语言 · 100 词条",
    totalTransferSize: "首屏网络传输体积 (KB)",
    modeLocaleSplitting: "按需拆包",
    modeBundled: "默认全量",
    modeMiddleware: "中间件拆包",
    modeHttp: "HTTP 动态加载",
    takeaway1Title: "运行时体积与依赖考量",
    takeaway1Desc:
      "i18next 包含独立解析器与插件运行时，存在固定体积开销；ts-intl 无第三方依赖，核心运行时约 2 KB，在按需拆包模式下仅传输当前语言的字典分块。",
    takeaway2Title: "编译型与运行时方案机制差异",
    takeaway2Desc:
      "Paraglide 编译每条消息为独立函数并支持 Tree-shaking 未使用词条；ts-intl 作为轻量运行时方案无需代码生成，通过标准动态 import 避免多语言字典合并打包。",
  },
} as const;
