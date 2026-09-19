# ts-intl-astro

[English](./README.md) | [简体中文](./README.zh-Hans.md) | [日本語](./README.ja-JP.md)

[`ts-intl`](https://github.com/aaakul/ts-intl) をベースにした、軽量・ゼロ設定・厳格な型安全性を備えた Astro 向け国際化（i18n）インテグレーションです。Astro において `next-intl` に近い開発体験を提供します。

## インストール

```bash
pnpm add ts-intl-astro
# または
npm install ts-intl-astro
# または
yarn add ts-intl-astro
```

## クイック設定

### i18n インスタンスの初期化

プロジェクト内に `src/i18n/index.ts` を作成します：

```ts
import { createAstroI18n } from "ts-intl-astro";
import enUS from "./messages/en-US";
import zhHans from "./messages/zh-Hans";

export const {
  useTranslations,
  useLocale,
  useFormatter,
  languages,
  defaultLanguage,
} = createAstroI18n({
  defaultLanguage: "en-US",
  messages: {
    "en-US": enUS,
    "zh-Hans": zhHans,
  },
});

export type SupportedLanguage = (typeof languages)[number];
```

### Astro インテグレーションの登録

`astro.config.mjs` に `tsIntl` インテグレーションを追加します：

```js
import { defineConfig } from "astro/config";
import tsIntl from "ts-intl-astro";

export default defineConfig({
  integrations: [tsIntl()],
});
```

## 使い方

### コンポーネント内での利用

任意の Astro コンポーネント内で、`useTranslations` と `useLocale` を直接呼び出します。

```astro
---
import { useTranslations, useLocale } from "@/i18n";

const t = useTranslations("hero");
const currentLang = useLocale();
---

<section>
  <h1>{t("title")}</h1>
  <p>{t("badge")}</p>
  <a href={`/${currentLang}/docs`}>{t("getStarted")}</a>
</section>
```

### ルートセグメントとページ設定（Route Segments）

動的ルートディレクトリ構造（例：`src/pages/[lang]/index.astro` や `src/pages/[locale]/about.astro`）を用いて多言語ページを管理します。

静的サイト生成（SSG）では、エクスポートされた `languages` と組み合わせて `getStaticPaths` を設定します：

```astro
---
// src/pages/[lang]/index.astro
import { languages, useTranslations, useLocale } from "@/i18n";

export function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

const t = useTranslations("hero");
const lang = useLocale();
---

<section>
  <h1>{t("title")}</h1>
  <a href={`/${lang}/docs`}>{t("getStarted")}</a>
</section>
```

> **ルートセグメントに関する説明**：
>
> - `ts-intl-astro` は、デフォルトで `[lang]` および `[locale]` 動的ルートセグメントを自動認識します。
> - ミドルウェアがページ実行前にルートセグメントから言語を自動抽出し、コンテキストに書き込みます。ページ内の任意の子コンポーネントから直接 `useTranslations()` / `useLocale()` で現在の言語を取得できるため、`lang` 属性を手動でバケツリレー（Props Drilling）する必要はありません。
> - カスタムパラメータ名（例：`[localeCode]`）を使用する場合は、`createAstroI18n({ paramNames: ["localeCode"] })` で設定できます。

## よく使う API

| API                               | 説明                                                       | 例                                             |
| :-------------------------------- | :--------------------------------------------------------- | :--------------------------------------------- |
| `useTranslations(namespace?)`     | 現在の言語にバインドされた翻訳関数を取得します             | `const t = useTranslations("common")`          |
| `useTranslations(ns, { locale })` | 現在のコンポーネントの言語を明示的に上書きします           | `useTranslations("hero", { locale: "ja-JP" })` |
| `useLocale()`                     | 現在のリクエストコンテキストの言語識別子文字列を取得します | `const lang = useLocale()`                     |
| `useFormatter()`                  | 現在の言語の `Intl` フォーマッターを取得します             | `const fmt = useFormatter()`                   |

## ライセンス

[MIT](./LICENSE)
