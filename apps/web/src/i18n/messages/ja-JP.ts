export default {
  nav: {
    docs: "ドキュメント",
    github: "GitHub",
    themeToggle: "テーマ切り替え",
    switchLanguage: "言語",
  },
  hero: {
    badge: "ゼロ依存 · 型安全性 · フレームワーク非依存",
    title: "モダン TypeScript 向け国際化ライブラリ",
    getStarted: "利用を開始",
    github: "GitHub",
    astroBadge: "Astro 統合に対応",
    astroIntegration: "Astro 統合ガイド",
    tabAstro: "Component.astro",
    tabMessages: "ja-JP.ts",
    tabConfig: "i18n.ts",
    tabOutput: "出力 HTML",
  },
  features: {
    typeSafetyTitle: "型安全性",
    typeSafetyDesc:
      "翻訳キー、名前空間、パラメータの TypeScript 型推論を提供し、多言語辞書構造の一致性を検証します。",
    zeroDepTitle: "ランタイム依存関係ゼロ",
    zeroDepDesc:
      "TypeScript と Web 標準 Intl API で実装。コード生成プロセスを必要としません。",
    icuTitle: "ICU Message Format 対応",
    icuDesc:
      "複数形、序数、条件分岐、およびリッチテキストタグのマッピングに対応。外部パーサーを必要としません。",
    frameworkTitle: "フレームワーク非依存",
    frameworkDesc:
      "Astro、Next.js、React、Vue、Svelte、Node.js、Bun、Cloudflare Workers などの各種環境に対応します。",
  },
  docs: {
    onThisPage: "目次",
    previousChapter: "前の章",
    nextChapter: "次の章",
    chapters: "チャプター",
  },
  footer: {
    license: "MIT ライセンスで提供",
    tagline: "TypeScript 向けのゼロ依存・型安全な国際化ライブラリ。",
  },
  playground: {
    title: "プレイグラウンド",
    reset: "リセット",
    tabMessages: "messages.ts",
    tabApp: "App.tsx",
    previewTitle: "プレビュー",
    loading: "プレイグラウンドを読み込み中...",
  },
  benchmark: {
    badge: "ベンチマーク",
    title: "ネットワーク転送サイズベンチマーク",
    desc: "事前レンダリングとクライアント側のハイドレーションを伴う多言語アプリにおいて、ブラウザが実際にダウンロードする全 i18n リソースの転送サイズを測定。",
    viewFullDocs: "ベンチマーク詳細レポートを見る",
    scenario1Title: "10 言語 · 500 辞書項目",
    scenario2Title: "5 言語 · 100 辞書項目",
    totalTransferSize: "ネットワーク転送サイズ (KB)",
    modeLocaleSplitting: "ロケール分割",
    modeBundled: "デフォルト一括",
    modeMiddleware: "ミドルウェア分割",
    modeHttp: "HTTP 動的取得",
    takeaway1Title: "ランタイム依存関係とオーバーヘッド",
    takeaway1Desc:
      "i18next はパーサーやプラグイン機構による固有のランタイムサイズを伴います。ts-intl は外部依存ゼロ（コア約 2 KB）で、ロケール分割時はアクティブな言語の辞書のみを取得します。",
    takeaway2Title: "コンパイラ方式と動的分割の特性",
    takeaway2Desc:
      "Paraglide は関数へコンパイルすることで未使用キーを Tree-shaking します。ts-intl はコード生成不要のランタイム設計で、動的インポートにより複数言語の一括肥大化を防ぎます。",
  },
} as const;
