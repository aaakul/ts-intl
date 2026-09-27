export default {
  nav: {
    docs: "文件",
    github: "GitHub",
    themeToggle: "切換主題",
    switchLanguage: "語言",
  },
  hero: {
    badge: "零依賴 · 型別安全 · 框架無關",
    title: "現代 TypeScript 國際化解決方案",
    getStarted: "開始使用",
    github: "GitHub",
    astroBadge: "Astro 整合已推出",
    astroIntegration: "Astro 整合指南",
    tabAstro: "Component.astro",
    tabMessages: "zh-Hant.ts",
    tabConfig: "i18n.ts",
    tabOutput: "輸出 HTML",
  },
  features: {
    typeSafetyTitle: "型別安全",
    typeSafetyDesc:
      "支援翻譯鍵名、命名空間及插值參數的 TypeScript 型別推導，並即時驗證跨語言詞典結構的一致性。",
    zeroDepTitle: "零執行階段依賴",
    zeroDepDesc:
      "基於 TypeScript 與 Web 標準 Intl API 建構，完全無需額外的程式碼生成建置步驟。",
    icuTitle: "ICU Message Format 支援",
    icuDesc:
      "支援複數規則、序數詞、條件分支（select）與富文字標籤對應，無需引入任何外部解析器。",
    frameworkTitle: "框架無關",
    frameworkDesc:
      "適用於 Astro、Next.js、React、Vue、Svelte、Node.js、Bun 及 Cloudflare Workers 等多種環境。",
  },
  docs: {
    onThisPage: "本頁目錄",
    previousChapter: "上一章",
    nextChapter: "下一章",
    chapters: "章節導覽",
  },
  footer: {
    license: "基於 MIT 授權條款開源",
    tagline: "零依賴、型別安全的 TypeScript 國際化解決方案。",
  },
  playground: {
    title: "互動演練場",
    reset: "重設",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "即時預覽",
    loading: "正在載入演練場...",
  },
  benchmark: {
    badge: "基準測試",
    title: "網路傳輸大小基準測試",
    desc: "模擬多語言 Web 應用程式在首頁預先渲染與客戶端水合（Hydration）時，瀏覽器實際下載的全部國際化資源網路傳輸大小。",
    viewFullDocs: "查看完整基準測試報告",
    scenario1Title: "10 種語言 · 500 條詞條",
    scenario2Title: "5 種語言 · 100 條詞條",
    totalTransferSize: "首頁網路傳輸大小 (KB)",
    modeLocaleSplitting: "隨需分割",
    modeBundled: "預設全量",
    modeMiddleware: "中介軟體分割",
    modeHttp: "HTTP 動態載入",
    takeaway1Title: "執行階段大小與依賴考量",
    takeaway1Desc:
      "i18next 包含獨立解析器與外掛程式執行階段，帶來固定的基本大小開銷；ts-intl 零第三方依賴，核心執行階段僅約 2 KB，在隨需分割模式下僅傳輸當前語言的字典分塊。",
    takeaway2Title: "編譯型與執行階段方案機制差異",
    takeaway2Desc:
      "Paraglide 將每條訊息編譯為獨立函式並支援 Tree-shaking 未使用的詞條；ts-intl 作為輕量執行階段方案無需程式碼生成，透過標準動態 import 避免多語言字典合併打包。",
  },
} as const;
