# ts-intl-astro

[English](./README.md) | [简体中文](./README.zh-Hans.md) | [日本語](./README.ja-JP.md)

轻量、零配置、严格类型安全的国际化（i18n） Astro 集成，基于 [`ts-intl`](https://github.com/aaakul/ts-intl)。在 Astro 中提供与 `next-intl` 相似的使用体验。

## 安装

```bash
pnpm add ts-intl-astro
# 或
npm install ts-intl-astro
# 或
yarn add ts-intl-astro
```

## 快速配置

### 初始化 i18n 实例

在项目中创建 `src/i18n/index.ts`：

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

### 注册 Astro 集成

在 `astro.config.mjs` 中添加 `tsIntl` 集成：

```js
import { defineConfig } from "astro/config";
import tsIntl from "ts-intl-astro";

export default defineConfig({
  integrations: [tsIntl()],
});
```

## 使用

### 组件内使用

在任何 Astro 组件中，直接调用 `useTranslations` 与 `useLocale`。

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

### 路由段与页面配置（Route Segments）

通过动态路由目录结构管理多语言页面（如 `src/pages/[lang]/index.astro` 或 `src/pages/[locale]/about.astro`）。

在静态生成（SSG）中，配合导出的 `languages` 配置 `getStaticPaths`：

```astro
---
// src/pages/[lang]/index.astro
import { languages, useTranslations, useLocale} from "@/i18n";

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

> **路由段说明**：
>
> - `ts-intl-astro` 默认自动识别 `[lang]` 与 `[locale]` 动态路由段。
> - 中间件会在页面执行前自动提取路由段中的语言并写入上下文，页面内部的任意子组件均可直接通过 `useTranslations()` / `useLocale()` 获取当前语言，无需手动逐层传递 `lang` 属性。
> - 若使用自定义参数名（如 `[localeCode]`），可在 `createAstroI18n({ paramNames: ["localeCode"] })` 中配置。

## 常用 API

| API                               | 说明                               | 示例                                           |
| :-------------------------------- | :--------------------------------- | :--------------------------------------------- |
| `useTranslations(namespace?)`     | 获取当前语言绑定的翻译函数         | `const t = useTranslations("common")`          |
| `useTranslations(ns, { locale })` | 显式覆盖当前组件的语言             | `useTranslations("hero", { locale: "ja-JP" })` |
| `useLocale()`                     | 获取当前请求上下文的语言标识字符串 | `const lang = useLocale()`                     |
| `useFormatter()`                  | 获取当前语言的 `Intl` 格式化器     | `const fmt = useFormatter()`                   |

## 开源协议

[MIT](./LICENSE)
