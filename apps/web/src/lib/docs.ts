import type { SupportedLanguage } from "@/i18n";

export interface DocChapter {
  slug: string;
  order: number;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
}

export const docChapters: DocChapter[] = [
  {
    slug: "overview-and-installation",
    order: 1,
    title: {
      "en-US": "Overview & Installation",
      "zh-Hans": "概述与安装",
      "ja-JP": "概要とインストール",
    },
    description: {
      "en-US":
        "Introduction to ts-intl, core design principles, and setup instructions.",
      "zh-Hans": "ts-intl 简介、设计原则与安装配置指南。",
      "ja-JP": "ts-intl の紹介、設計原則、および導入ガイド。",
    },
  },
  {
    slug: "type-safety-and-validation",
    order: 2,
    title: {
      "en-US": "Type Inference & Validation",
      "zh-Hans": "类型推断与校验",
      "ja-JP": "型推論とバリデーション",
    },
    description: {
      "en-US":
        "Compile-time strict type checking, parameter constraints, and cross-language dictionary structure alignment validation.",
      "zh-Hans": "编译期严格类型检查、参数约束与多语言词典结构对齐校验。",
      "ja-JP":
        "コンパイル時の厳格な型チェック、パラメータ制約、多言語辞書の構造整合性検証。",
    },
  },
  {
    slug: "namespaces",
    order: 3,
    title: {
      "en-US": "Namespaces & Scoping",
      "zh-Hans": "命名空间与作用域",
      "ja-JP": "名前空間とスコープ",
    },
    description: {
      "en-US":
        "Organizing translation dictionaries using namespaces and data extraction methods.",
      "zh-Hans": "通过命名空间组织翻译字典与数据提取方式。",
      "ja-JP": "名前空間による翻訳辞書の整理とデータ抽出方法。",
    },
  },
  {
    slug: "icu-syntax",
    order: 4,
    title: {
      "en-US": "ICU Syntax & Rich Text Rendering",
      "zh-Hans": "ICU 语法与富文本渲染",
      "ja-JP": "ICU 構文とリッチテキスト描画",
    },
    description: {
      "en-US":
        "Plural rules, ordinals, conditional branches, and rich text component rendering syntax.",
      "zh-Hans": "复数规则、序数词、条件分支与富文本组件渲染语法。",
      "ja-JP":
        "複数形ルール、序数詞、条件分岐、およびリッチテキストコンポーネント描画構文。",
    },
  },
  {
    slug: "formatters",
    order: 5,
    title: {
      "en-US": "Web Intl Formatters",
      "zh-Hans": "Web Intl 格式化器",
      "ja-JP": "Web Intl フォーマッター",
    },
    description: {
      "en-US":
        "Type-safe wrappers and instance-cached formatters based on Web Intl APIs.",
      "zh-Hans": "基于 Web Intl API 的类型安全封装与实例缓存格式化器。",
      "ja-JP":
        "Web Intl API に基づく型安全なラッパーとインスタンスキャッシュフォーマッター。",
    },
  },
  {
    slug: "framework-integration",
    order: 6,
    title: {
      "en-US": "Error Handling & Fallback",
      "zh-Hans": "错误处理与回退",
      "ja-JP": "エラー処理とフォールバック",
    },
    description: {
      "en-US": "Configure error handling and fallback.",
      "zh-Hans": "配置错误处理与回退。",
      "ja-JP": "エラー処理とフォールバックの設定。",
    },
  },
  {
    slug: "astro-integration",
    order: 7,
    title: {
      "en-US": "Astro Integration",
      "zh-Hans": "Astro 集成",
      "ja-JP": "Astro 統合",
    },
    description: {
      "en-US":
        "Context-based and middleware-driven internationalization for Astro using ts-intl-astro, eliminating prop drilling across components.",
      "zh-Hans":
        "使用 ts-intl-astro 为 Astro 项目提供基于上下文与中间件的国际化支持，避免组件层级中的属性透传。",
      "ja-JP":
        "ts-intl-astro によるコンポーネント階層の Props バケツリレー回避、コンテキストとミドルウェアに基づく Astro 向け国際化対応。",
    },
  },
];
