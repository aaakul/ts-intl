import type { SupportedLanguage } from '@/i18n';

export interface DocChapter {
  slug: string;
  order: number;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
}

export const docChapters: DocChapter[] = [
  {
    slug: 'overview-and-installation',
    order: 1,
    title: {
      'en-US': 'Overview & Installation',
      'zh-Hans': '概述与安装',
      'ja-JP': '概要とインストール',
    },
    description: {
      'en-US': 'Introduction to ts-intl, core design principles, and setup instructions.',
      'zh-Hans': 'ts-intl 简介、设计哲学与安装配置快速上手指南。',
      'ja-JP': 'ts-intl の概要、設計原則、および導入方法。',
    },
  },
  {
    slug: 'type-safety-and-validation',
    order: 2,
    title: {
      'en-US': 'Type Safety & Validation',
      'zh-Hans': '类型推断与校验',
      'ja-JP': '型安全性とバリデーション',
    },
    description: {
      'en-US': 'Compile-time type checking, parameter constraints, and dictionary validation.',
      'zh-Hans': '编译期严格类型检查、参数约束与多语言词典结构对齐校验。',
      'ja-JP': 'コンパイル時キー検査、パラメータ制約、辞書スキーマ検証。',
    },
  },
  {
    slug: 'namespaces',
    order: 3,
    title: {
      'en-US': 'Namespaces & Scoping',
      'zh-Hans': '命名空间与作用域',
      'ja-JP': '名前空間とスコープ',
    },
    description: {
      'en-US': 'Organizing translation keys using scoped namespaces and path navigation.',
      'zh-Hans': '通过命名空间模块化组织翻译字典与安全的数据提取方式。',
      'ja-JP': '名前空間による辞書の構造化と、安全なデータ抽出方法。',
    },
  },
  {
    slug: 'icu-syntax',
    order: 4,
    title: {
      'en-US': 'ICU Syntax & Rich Text',
      'zh-Hans': 'ICU 语法与富文本渲染',
      'ja-JP': 'ICU 構文とリッチテキスト描画',
    },
    description: {
      'en-US': 'Pluralization, ordinals, conditional selection, and rich text markup.',
      'zh-Hans': '复数规则、序数词、条件分支与富文本组件渲染语法。',
      'ja-JP': '複数形、序数、条件分岐、およびリッチテキストタグのコンポーネント化。',
    },
  },
  {
    slug: 'formatters',
    order: 5,
    title: {
      'en-US': 'Web Intl Formatters',
      'zh-Hans': 'Web Intl 格式化器',
      'ja-JP': 'Web Intl フォーマッター',
    },
    description: {
      'en-US': 'High-performance singleton caching around standard browser Intl formatters.',
      'zh-Hans': '基于标准 Web Intl API 的高性能单例缓存与开箱即用格式化器。',
      'ja-JP': 'Web 標準 Intl API の型安全ラッパーとシングルトンキャッシュ機構。',
    },
  },
  {
    slug: 'framework-integration',
    order: 6,
    title: {
      'en-US': 'Framework Integration',
      'zh-Hans': '框架集成与最佳实践',
      'ja-JP': 'フレームワーク統合とベストプラクティス',
    },
    description: {
      'en-US': 'Recipes for integrating ts-intl into Astro, React, Vue, Svelte, and Node.js.',
      'zh-Hans': 'Astro、React、Vue、Svelte、Node.js 框架集成方案与统一错误监控。',
      'ja-JP': 'Astro、React、Vue、Svelte、Node.js への組み込みと統一エラー監視。',
    },
  },
];

