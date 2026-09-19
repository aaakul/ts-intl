# ts-intl-astro

[English](./README.md) | [简体中文](./README.zh-Hans.md) | [日本語](./README.ja-JP.md)

A lightweight, zero-config, strictly type-safe Astro integration for internationalization (i18n), powered by [`ts-intl`](https://github.com/aaakul/ts-intl). Delivers a developer experience similar to `next-intl` in Astro.

## Installation

```bash
pnpm add ts-intl-astro
# or
npm install ts-intl-astro
# or
yarn add ts-intl-astro
```

## Quick Setup

### Initialize the i18n Instance

Create `src/i18n/index.ts` in your project:

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

### Register the Astro Integration

Add the `tsIntl` integration to `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import tsIntl from "ts-intl-astro";

export default defineConfig({
  integrations: [tsIntl()],
});
```

## Usage

### In Components

In any Astro component, call `useTranslations` and `useLocale` directly.

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

### Route Segments and Page Configuration (Route Segments)

Manage multilingual pages using dynamic route directory structures (e.g. `src/pages/[lang]/index.astro` or `src/pages/[locale]/about.astro`).

For Static Site Generation (SSG), configure `getStaticPaths` with the exported `languages`:

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

> **Route Segments Note**:
>
> - `ts-intl-astro` automatically recognizes `[lang]` and `[locale]` dynamic route segments by default.
> - The middleware automatically extracts the locale from the route segment before page execution and writes it into the context. Any child components within the page can directly access the current locale via `useTranslations()` / `useLocale()`, with no need to drill the `lang` prop down manually.
> - If you use custom parameter names (e.g. `[localeCode]`), configure them via `createAstroI18n({ paramNames: ["localeCode"] })`.

## Common APIs

| API                               | Description                                              | Example                                        |
| :-------------------------------- | :------------------------------------------------------- | :--------------------------------------------- |
| `useTranslations(namespace?)`     | Get the translation function bound to the active locale  | `const t = useTranslations("common")`          |
| `useTranslations(ns, { locale })` | Explicitly override the locale for the current component | `useTranslations("hero", { locale: "ja-JP" })` |
| `useLocale()`                     | Get the locale string from the current request context   | `const lang = useLocale()`                     |
| `useFormatter()`                  | Get the `Intl` formatter for the current locale          | `const fmt = useFormatter()`                   |

## License

[MIT](./LICENSE)
