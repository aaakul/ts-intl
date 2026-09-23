# ts-intl

[English](./README.md) | [简体中文](./README.zh-Hans.md) | [日本語](./README.ja-JP.md)

![スクリーンショット](./screenshot.jpg)

`ts-intl` は、軽量・ゼロ依存・厳格な型安全性を備えた国際化（i18n）ライブラリです。

`next-intl` に似た直感的な使い心地を提供しながらも、Next.js への依存はなく、特定の UI フレームワークにも縛られません。

## 設計原則

- **ゼロ依存（Zero Dependencies）**: ランタイム依存関係ゼロ。コード生成ステップや追加のビルドツールチェーンも不要です。
- **フレームワーク非依存（Framework Agnostic）**: ブラウザ、Node.js、Bun など、あらゆる JavaScript / TypeScript 環境でシームレスに動作します。
- **厳格な型安全性（Strict Type Safety）**: 翻訳キー、パラメータ、名前空間のすべてにおいて、TypeScript の完全な型推論と自動補完を提供します。

## エコシステム・フレームワーク統合

- **Astro**: [`ts-intl-astro`](./packages/ts-intl-astro/README.ja-JP.md) - 軽量・ゼロ設定・厳格な型安全性を備えた公式 Astro インテグレーション。

## インストール

```bash
npm install @aaakul/ts-intl
# または
pnpm add @aaakul/ts-intl
# または
yarn add @aaakul/ts-intl
```

## クイックスタート

以下は、基本的な変数補間、名前空間、型推論を含むクイックスタートの例です：

```ts
// i18n/messages/ja-JP.ts
export default {
  common: {
    title: "システムダッシュボード",
    greeting: "こんにちは、{name: string}さん！",
    items: {
      one: "合計 1 件のデータ",
      other: "合計 {count} 件のデータ",
    },
  },
} as const;
```

```ts
// i18n/messages/en-US.ts
export default {
  common: {
    title: "System Dashboard",
    greeting: "Hello, {name: string}!",
    items: {
      one: "1 item in total",
      other: "{count} items in total",
    },
  },
} as const;
```

```ts
// i18n/index.ts
import { createI18n } from "@aaakul/ts-intl";

// 1. 翻訳辞書ファイルのインポート
import jaJP from "./messages/ja-JP.ts";
import enUS from "./messages/en-US.ts";

// 2. 初期化とエクスポートの分割代入
export const {
  getTranslations,
  getFormatter,
  isSupportedLanguage,
  languages, // readonly ("ja-JP" | "en-US")[]
  defaultLanguage,
} = createI18n({
  defaultLanguage: "ja-JP",
  messages: { "ja-JP": jaJP, "en-US": enUS },
});

// type Language = "ja-JP" | "en-US"
export type Language = (typeof languages)[number];
```

```ts
import { getTranslations } from "./i18n";

// 3. 指定した言語と名前空間の翻訳関数を取得
const t = getTranslations("ja-JP", "common");

// 4. 翻訳の実行
const title = t("title");
// IDE による推論型: (key: "title") => string
// 出力: "システムダッシュボード"

const greeting = t("greeting", { name: "開発者" });
// IDE による推論型: (key: "greeting", params: { name: string }) => string
// 出力: "こんにちは、開発者さん！"

const items = t("items", { count: 5 });
// IDE による推論型: (key: "items", params: { count: number }) => string
// 出力: "合計 5 件のデータ"
```

## サポートされる辞書ファイル形式

`ts-intl` は、TypeScript、JavaScript、および JSON 形式の辞書ファイルを直接読み込むことができます。

### TypeScript 静的定義（推奨）

TypeScript で辞書を定義し、`as const` を付与することで、キー名、変数プレースホルダー、リッチテキストタグの厳格な型が自動的に抽出されます：

```ts
export default {
  // ...
  auth: {
    login: "ログイン",
    welcome: "おかえりなさい、{username: string}さん！",
  },
} as const;
```

### JSON 辞書のサポート

`createI18n` は `.json` ファイルの直接インポートをネイティブでサポートしています。グローバルな型定義の結合（Declaration Merging）やビルドプラグインを必要とせず、すべての階層の名前空間とキーの型が自動推論され、完全な自動補完とタイポ検出を利用できます：

```ts
import { createI18n } from "@aaakul/ts-intl";
import jaJP from "./messages/ja-JP.json";
import enUS from "./messages/en-US.json";

export const {
  getTranslations,
  getFormatter,
  isSupportedLanguage,
  languages,
  defaultLanguage,
} = createI18n({
  defaultLanguage: "ja-JP",
  messages: { "ja-JP": jaJP, "en-US": enUS },
});

const t = getTranslations("ja-JP", "common");
t("title"); // IDE による高精度な補完: "title" | "greeting" | "items"
// @ts-expect-error キーのタイポを TypeScript が即座に検知してエラー
t("title_typo");
```

> **型推論の比較**：
>
> - **JSON 辞書**：すべての階層の名前空間とキー（Key）に対して 100% 厳格な型補完とエラー検知を提供します。ただし、JSON の仕様上 `as const` を付与できないため、テキスト内の変数パラメータ（例: `{name}`）は緩やかな型推論となります。
> - **TypeScript 辞書（`as const`）**：キー名の型補完に加えて、変数プレースホルダー（例: `{name: string}`, `{count: number}`）に対してもコンパイル時に完全な静的型チェックが行われます。

### 動的インポート（`await import`）

Top-Level Await をサポートするモダンな実行環境（Astro、Vite、Node 22+、Bun など）では、`await import(...)` を使用して辞書ファイルを動的に読み込むことができます：

```ts
import { createI18n } from "@aaakul/ts-intl";

const jaJP = (await import("./messages/ja-JP.ts")).default;
const enUS = (await import("./messages/en-US.ts")).default;

export const { getTranslations } = createI18n({
  defaultLanguage: "ja-JP",
  messages: { "ja-JP": jaJP, "en-US": enUS },
});
```

関数型ローダーマップ（Loader Map）と組み合わせることで、言語ごとのコード分割（Locale Splitting）を実現し、現在アクティブな言語のみをオンデマンドで読み込みつつ、静的型推論とキー補完を完全に維持できます：

```ts
import { createI18n } from "@aaakul/ts-intl";

const loaders = {
  "ja-JP": () => import("./messages/ja-JP.ts"),
  "en-US": () => import("./messages/en-US.ts"),
} as const;

export type SupportedLanguage = keyof typeof loaders;

export async function loadI18n<L extends SupportedLanguage>(lang: L) {
  const messages = (await loaders[lang]()).default;
  return createI18n({
    defaultLanguage: lang,
    messages: { [lang]: messages } as Record<L, typeof messages>,
  });
}
```

## 高度な翻訳機能

### 汎用リッチテキスト挿入 `t.rich()`

`t.rich()` は、文言内の `<tag>children</tag>` タグを解析し、カスタムコンポーネントや構造化ノードにマッピングします。React JSX、Vue VNode、Svelte などの各 UI フレームワークとスムーズに統合できます：

```ts
// const messages = {
//   ja: {
//     notice: "必ず<important>セキュリティガイドライン</important>および<link>利用規約</link>をご確認ください。",
//   },
// } as const;

const t = getTranslations("ja");

// 汎用データ構造へのパース
const tokens = t.rich("notice", {
  important: (children) => ({ type: "strong", text: children }),
  link: (children) => ({ type: "a", href: "/terms", text: children }),
});

// [
//   "必ず",
//   { type: "strong", text: "セキュリティガイドライン" },
//   "および",
//   { type: "a", href: "/terms", text: "利用規約" },
//   "をご確認ください。"
// ]
```

#### React

`t.rich()` を使用して直接 React 要素をレンダリングします：

```tsx
import React from "react";
import { getTranslations } from "./i18n";

export function WelcomeBanner({ lang }: { lang: "ja" | "en" }) {
  const t = getTranslations(lang, "home");

  return (
    <div>
      {t.rich("banner", {
        bold: (children) => <strong className="font-bold">{children}</strong>,
        link: (children) => (
          <a href="/docs" className="underline">
            {children}
          </a>
        ),
      })}
    </div>
  );
}
```

#### Vue

Vue 3 では、レンダリング関数 `h` や動的コンポーネント `<component :is>` と組み合わせてリッチテキストを描画できます：

```vue
<script setup lang="ts">
import { h } from "vue";
import { getTranslations } from "./i18n";

const props = defineProps<{ lang: "ja" | "en" }>();
const t = getTranslations(props.lang, "home");

const renderedContent = t.rich("banner", {
  bold: (children) => h("strong", { class: "font-bold" }, children),
  link: (children) => h("a", { href: "/docs" }, children),
});
</script>

<template>
  <div>
    <component :is="() => renderedContent" />
  </div>
</template>
```

### HTML 文字列レンダリング `t.markup()`

HTML タグを含むプレーンな文字列のみが必要な場合は、`t.markup()` を使用します。タグに対応するコールバック関数は必ず文字列を受け取って文字列を返す必要があります（文字列以外のオブジェクトを返した場合、`next-intl` と同様に `INVALID_MESSAGE` エラーがスローされます）：

```ts
// const messages = {
//   ja: {
//     notice: "必ず<important>セキュリティガイドライン</important>および<link>利用規約</link>をご確認ください。",
//   },
// };

const html = t.markup("notice", {
  important: (c) => `<strong>${c}</strong>`,
  link: (c) => `<a href="/terms">${c}</a>`,
});
// 出力: "必ず<strong>セキュリティガイドライン</strong>および<a href="/terms">利用規約</a>をご確認ください。"
```

### 生データの取得 `t.raw()`

変数補間や置換を行わず、辞書内のオブジェクトや配列データをそのまま取得します：

```ts
// const messages = {
//   ja: {
//     config: { theme: "dark", level: 1 },
//     features: ["軽量", "型安全"],
//   },
// } as const;

const t = getTranslations("ja");

const theme = t.raw("config");
// IDE による推論型: { readonly theme: "dark"; readonly level: 1 }

const list = t.raw("features");
// IDE による推論型: readonly ["軽量", "型安全"]
```

### キーの存在確認 `t.has()`

指定したキーが現在の言語（またはフォールバック言語）に存在するかどうかを、未翻訳の警告を発生させずに安全に判定します：

```ts
if (t.has("config")) {
  const cfg = t.raw("config");
}
```

## 型安全メカニズム

### 厳格なキー名チェックとパス補全

名前空間スコープとトップレベルのドット区切り（Dot Notation）アクセスの両方をサポートしています。無効なキー名を入力したり存在しない名前空間にアクセスした場合、TypeScript がコンパイル時にエラーを出して防ぎます：

```ts
// const ja = {
//   common: {
//     title: "システムダッシュボード",
//     greeting: "こんにちは、{name: string}さん！",
//     items: {
//       one: "合計 1 件のデータ",
//       other: "合計 {count} 件のデータ",
//     },
//   },
// } as const;

const tCommon = getTranslations("ja", "common");
tCommon("title");
// IDE 補全候補: "title" | "greeting" | "items"

const tRoot = getTranslations("ja");
tRoot("common.title");
// IDE 補全候補: "common.title" | "common.greeting" | "common.items"
```

### パラメータ制約チェック

```ts
const t = getTranslations("ja", "common");

// プレースホルダーなし：引数の指定は禁止
t("title");
// 関数シグネチャの推論: (key: "title") => string

// プレースホルダーあり：パラメータの指定が必須
t("greeting", { name: "太郎" });
// 関数シグネチャの推論: (key: "greeting", params: { name: string }) => string
```

### パラメータ型の明示的アノテーション

TypeScript 辞書内では、`{name:type}` 構文を使用してパラメータ型を明示できます。`string`、`number`、`Date` をサポートしています：

```ts
// const messages = {
//   en: {
//     status:
//       "User {name:string} logged in at {timestamp:Date}, total: {total:number}",
//   },
// } as const;

const t = getTranslations("en");

t("status", {
  name: "Alice",
  timestamp: new Date(),
  total: "100", // エラー: 型 'string' を型 'number' に割り当てることはできません
});
```

### 多言語辞書の構造整合性検証

`defaultLanguage` の辞書構造を基準として、`messages` に設定された他の言語も同一のキー階層とプレースホルダー変数名を保持する必要があります。他の言語にキーの欠落、余分なフィールド、変数名のタイポがある場合、TypeScript が初期化処理の段階で明確な型エラーを提示し、翻訳漏れを未然に防ぎます。

## 高度な機能と ICU 構文

`ts-intl` は ICU MessageFormat 1.x 仕様との互換性を備えており、複数形、序数詞、条件分岐（Select）、および数値・日付のフォーマットをサポートしています。

### 複数形処理（Pluralization）

#### 構造化複数形オブジェクト

CLDR 規格に準拠した `{ zero?, one, two?, few?, many?, other }` の各カテゴリキーを持つオブジェクトを定義でき、言語ごとに異なる複雑な単複規則に柔軟に対応できます：

```ts
// const en = {
//   cart: {
//     zero: "Cart is empty",
//     // 構造化複数形オブジェクトは型アノテーションなしで自動的に { count: number } を推論します
//     one: "{count} item in cart",
//     other: "{count} items in cart",
//   },
// } as const;

const t = getTranslations("en");

t("cart", { count: 0 }); // 出力: "Cart is empty"
t("cart", { count: 1 }); // 出力: "1 item in cart"
t("cart", { count: 5 }); // 出力: "5 items in cart"
```

#### ICU `plural` テンプレート構文

```ts
// const messages = {
//   en: {
//     inbox:
//       "You have {count, plural, =0 {no emails} one {# email} other {# emails}}.",
//   },
// } as const;

const t = getTranslations("en");

t("inbox", { count: 0 }); // 出力: "You have no emails."
t("inbox", { count: 1 }); // 出力: "You have 1 email."
t("inbox", { count: 12 }); // 出力: "You have 12 emails."
```

### 序数詞フォーマット（selectordinal）

`selectordinal` で序数ルールに一致させ、`#` を具体的な数値に自動置換します。完全一致（`=1`, `=2` など）にも対応しています：

```ts
// const messages = {
//   en: {
//     rank: "You finished {pos, selectordinal, =1 {first} =2 {second} =3 {third} other {#th}}!",
//     birthday: "It's your {year, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} birthday!",
//   },
// } as const;

const t = getTranslations("en");

// 1. 完全一致が優先（=value が汎用カテゴリルールより優先されます）
t("rank", { pos: 1 }); // 出力: "You finished first!"
t("rank", { pos: 4 }); // 出力: "You finished 4th!"
t("rank", { pos: 21 }); // 出力: "You finished 21th!" (テンプレートに one が未定義のため other にフォールバック)

// 2. 序数カテゴリルール一致（英語の one/two/few/other ルールに自動マッチ）
t("birthday", { year: 1 }); // 出力: "It's your 1st birthday!"
t("birthday", { year: 2 }); // 出力: "It's your 2nd birthday!"
t("birthday", { year: 3 }); // 出力: "It's your 3rd birthday!"
t("birthday", { year: 21 }); // 出力: "It's your 21st birthday!"
```

### 条件分岐（select）

入力された状態や列挙値に応じて、対応する文言を動的に切り替えます：

```ts
// const messages = {
//   en: {
//     memberStatus:
//       "{role, select, admin {Administrator} manager {Project Manager} other {General User}}",
//   },
// } as const;

const t = getTranslations("en");

t("memberStatus", { role: "admin" }); // 出力: "Administrator"
t("memberStatus", { role: "guest" }); // 出力: "General User"
```

### 名前付きフォーマットプリセットとテンプレート内蔵フォーマット

設定内で共通の数値、日付時刻、リスト形式のプリセットを宣言し、テンプレート内から直接参照できます：

```ts
const { getTranslations } = createI18n({
  defaultLanguage: "ja",
  formats: {
    number: {
      jpy: { style: "currency", currency: "JPY" },
    },
    dateTime: {
      shortDate: { dateStyle: "short", timeZone: "Asia/Tokyo" },
    },
  },
  messages: {
    ja: {
      invoice: "合計: {amount, number, jpy}, 期日: {dueDate, date, shortDate}",
    },
  },
});

const t = getTranslations("ja");
t("invoice", {
  amount: 2500,
  dueDate: new Date("2026-10-01T00:00:00Z"),
});
// 出力: "合計: ￥2,500, 期日: 2026/10/01"

// 翻訳関数呼び出し時に第3引数を渡すことで、一時的にプリセットを上書きすることも可能です（next-intl API と互換）：
t(
  "invoice",
  { amount: 2500, dueDate: new Date("2026-10-01T00:00:00Z") },
  { number: { jpy: { style: "currency", currency: "USD" } } },
);
// 出力: "合計: $2,500.00, 期日: 2026/10/01"
```

## 国際化フォーマッター（Formatter）

`ts-intl` は Web 標準の `Intl` API を型安全にラップし、インスタンスキャッシュを内蔵しています。数値、通貨、日付時刻、相対時間、ローカライズされたリスト、表示名などのフォーマットを高速に行えます。

2 つの呼び出し方法が提供されています：

1. **`getFormatter(lang?)`**（推奨）：`createI18n` インスタンスから分割代入で取得します。グローバルの `formats` プリセット、`timeZone`、統一エラーハンドリングを自動的に継承し、言語ごとにシングルトンとしてキャッシュされます。
2. **`createFormatter(options)`**：完全な i18n インスタンスを作成することなく利用できる独立したフォーマッターファクトリ関数です。軽量な単体利用やユーティリティ関数内での使用に適しています。

### 方法 1: `createI18n` インスタンスから `getFormatter()` を取得（推奨）

グローバル設定と連携したフォーマッターを簡単に取得できます：

```ts
import { createI18n } from "@aaakul/ts-intl";

export const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "ja-JP",
  formats: {
    number: {
      jpy: { style: "currency", currency: "JPY" },
      compact: { notation: "compact" },
    },
    dateTime: {
      shortDate: { dateStyle: "short" },
    },
  },
  timeZone: "Asia/Tokyo",
  messages: {
    "ja-JP": {
      /* ... */
    },
    "en-US": {
      /* ... */
    },
  },
});

// 1. 指定した言語のフォーマッターを取得（シングルトンキャッシュにより重複生成コストゼロ）
const formatter = getFormatter("ja-JP");

// 2. 引数を省略した場合、defaultLanguage ("ja-JP") が使用されます
const defaultFormatter = getFormatter();

// 3. 他のサポート言語のフォーマッターも同様にグローバルプリセットを継承します
const formatterEn = getFormatter("en-US");

// 使用例：
formatter.number(888.8, "jpy");
// 出力: "￥889"

formatterEn.number(1200000, "compact");
// 出力: "1.2M"
```

### 方法 2: `createFormatter(options)` の単体利用

`createI18n` を呼び出していない場合や、特定モジュールで個別の設定が必要な場合に適しています：

```ts
import { createFormatter } from "@aaakul/ts-intl";

const formatter = createFormatter({
  locale: "ja-JP",
  formats: {
    number: {
      jpy: { style: "currency", currency: "JPY" },
    },
  },
  timeZone: "Asia/Tokyo", // 任意のデフォルトタイムゾーン
});
```

### フォーマッター API 機能一覧

`getFormatter()` と `createFormatter()` のどちらから取得したフォーマッターでも、完全に同一の API を利用できます：

```ts
// 1. 数値と通貨（標準 Intl オプションまたは名前付きプリセットをサポート）
formatter.number(1234567.89);
// 出力: "1,234,567.89"

formatter.number(888.8, "jpy");
// 出力: "￥889"（名前付きプリセットを使用）

formatter.number(888.8, "jpy", { maximumFractionDigits: 1 });
// 出力: "￥888.8"（プリセットオプションの上書きに対応）

// 2. 日付と時刻
formatter.dateTime(new Date("2026-09-11T12:00:00Z"), { dateStyle: "full" });
// 出力: "2026年9月11日金曜日"

// 3. 日付の範囲
formatter.dateTimeRange(new Date("2026-05-01"), new Date("2026-05-05"));
// 出力: "2026/05/01～2026/05/05"

// 4. 相対時間（時間差に基づいて最適な単位を自動計算）
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
formatter.relativeTime(twoHoursAgo);
// 出力: "2時間前"

// 基準時間および numeric オプションのカスタマイズに対応（"auto" で「昨日」「明日」などの自然な表現が可能）
formatter.relativeTime(new Date("2026-06-02"), {
  now: new Date("2026-06-01"),
  numeric: "auto",
});
// 出力: "明日"

// 5. ロケールに応じたリスト結合（ListFormat）
formatter.list(["りんご", "バナナ", "オレンジ"]);
// 出力: "りんご、バナナ、オレンジ"

// 6. 表示名のローカライズ（DisplayNames）
formatter.displayName("en-US", { type: "language" });
// 出力: "アメリカ英語"

formatter.displayName("US", { type: "region" });
// 出力: "アメリカ合衆国"
```

## エラーハンドリングとフォールバック

統一されたランタイム監視とカスタムフォールバック処理をサポートしています：

```ts
import { createI18n, I18nError, I18nErrorCode } from "@aaakul/ts-intl";

export const i18n = createI18n({
  defaultLanguage: "ja-JP",
  messages: { "ja-JP": { hello: "こんにちは" } },

  // 統一エラーコールバック
  onError(error: I18nError) {
    if (error.code === I18nErrorCode.MISSING_MESSAGE) {
      console.warn(
        `[監視アラート] 翻訳文言の欠落: ${error.key} (言語: ${error.lang})`,
      );
    } else if (error.code === I18nErrorCode.INVALID_KEY) {
      console.warn(`[辞書検証] 不正なキー名: ${error.message}`);
    } else if (error.code === I18nErrorCode.INVALID_MESSAGE) {
      console.warn(
        `[メッセージ形式] コールバックの戻り値型エラー: ${error.message}`,
      );
    } else if (error.code === I18nErrorCode.MISSING_FORMAT) {
      console.warn(
        `[フォーマットプリセット] 指定の名前付き形式が見つかりません: ${error.message}`,
      );
    } else if (error.code === I18nErrorCode.FORMATTING_ERROR) {
      console.warn(`[フォーマットエラー] ${error.message}`);
    }
  },

  // 未翻訳文言のカスタムフォールバック戦略
  getMessageFallback({ error, key, lang, namespace }) {
    return `[未翻訳: ${key}]`;
  },
});
```

非本番環境（開発時）では、`createI18n` の初期化時に辞書オブジェクトが自動検証され、キー名に誤ってドットが含まれていないか（例: `{"foo.bar": "value"}` のような深いパス解決での曖昧さ）を検出し、`onError` 経由で警告します。本番環境ではこのチェックは自動的にスキップされ、ランタイムオーバーヘッドは発生しません。

### API リファレンス

#### `createI18n` の戻り値（プロパティ・メソッド）

| プロパティ / メソッド               | 型                             | 説明                                                                                         |
| :---------------------------------- | :----------------------------- | :------------------------------------------------------------------------------------------- |
| `getTranslations(lang, namespace?)` | `Function`                     | 指定した言語（および任意で名前空間）の翻訳関数 `t` を取得します（完全同期・ステートレス）。  |
| `getFormatter(lang?)`               | `(lang?: string) => Formatter` | 指定した言語のフォーマッターを取得します（省略時は `defaultLanguage`、言語別シングルトン）。 |
| `isSupportedLanguage(lang)`         | `(lang: string) => boolean`    | 指定の言語コードが `messages` に存在するか判定するランタイム型ガード（Type Guard）。         |
| `languages`                         | `readonly string[]`            | サポートされているすべての言語コードの読み取り専用配列。                                     |
| `defaultLanguage`                   | `string`                       | 設定されたデフォルトの基準言語コード。                                                       |

#### 翻訳関数のメソッド（`t`）

| メソッド                           | 戻り値の型        | 説明                                                                                                     |
| :--------------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------- |
| `t(key, params?, formats?)`        | `string`          | プレーンテキストの整形。変数置換や複数形に対応し、呼び出しごとのフォーマット上書きも可能。               |
| `t.rich(key, params?, formats?)`   | `(string \| R)[]` | リッチテキストの整形。コールバックから任意のコンポーネントやノードを返却可能。フォーマット上書きに対応。 |
| `t.markup(key, params?, formats?)` | `string`          | HTML タグを含む文字列の出力。コールバックは文字列を返す必要があります。フォーマット上書きに対応。        |
| `t.raw(key)`                       | `厳密な型 / any`  | 指定パスの生オブジェクトまたは配列を取得（キーが存在する場合は厳密な型推論を提供）。                     |
| `t.has(key)`                       | `boolean`         | 指定キーが存在するか判定（未翻訳警告は発生しません）。                                                   |

#### フォーマッターのメソッド（`formatter`）

| メソッド                                                            | 説明                                                                                 |
| :------------------------------------------------------------------ | :----------------------------------------------------------------------------------- |
| `formatter.number(value, formatOrOptions?, overrides?)`             | 数値、通貨、パーセントのフォーマット（プリセットまたは標準 Intl オプションに対応）。 |
| `formatter.dateTime(date, formatOrOptions?, overrides?)`            | 単一の日付と時刻のフォーマット（プリセットまたは標準 Intl オプションに対応）。       |
| `formatter.dateTimeRange(start, end, formatOrOptions?, overrides?)` | 日時範囲のフォーマット。                                                             |
| `formatter.relativeTime(date, nowOrOptions?)`                       | 相対時間のフォーマット（例:「3日前」「昨日」「2時間前」、最適な単位を自動計算）。    |
| `formatter.list(items, formatOrOptions?, overrides?)`               | ロケールの慣習に応じたリスト項目の結合（例:「りんご、バナナ、オレンジ」）。          |
| `formatter.displayName(code, formatOrOptions, overrides?)`          | 言語、国・地域、通貨記号などのローカライズされた表示名を取得。                       |

## ライセンス (License)

[MIT](./LICENSE)
