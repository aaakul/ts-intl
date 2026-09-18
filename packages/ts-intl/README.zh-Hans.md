# ts-intl

[English](./README.md) | [简体中文](./README.zh-Hans.md) | [日本語](./README.ja-JP.md)

![屏幕截图](./screenshot.jpg)

`ts-intl` 是一个轻量、零依赖、严格类型安全的国际化（i18n）库。

它提供与 `next-intl` 相似的使用体验，但不依赖 Next.js，也不绑定任何特定框架。

## 设计原则

- 零依赖：零运行时依赖，无代码生成步骤，无需额外工具链。

- 框架无关：可运行于浏览器、Node.js、Bun 等各种 JavaScript / TypeScript 环境。

- 严格类型安全：翻译键、参数和命名空间均具备完整的 TypeScript 类型推导。

## 安装

```bash
npm install @aaakul/ts-intl
# 或
pnpm add @aaakul/ts-intl
# 或
yarn add @aaakul/ts-intl
```

## 快速上手

以下是一个包含基本插值、命名空间与类型推导的快速示例：

```ts
// i18n/messages/zh-Hans.ts
export default {
  common: {
    title: "系统仪表盘",
    greeting: "你好，{name: string}！",
    items: {
      one: "共 1 项数据",
      other: "共 {count} 项数据",
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
import { createI18n } from "ts-intl";

// 1. 导入翻译文件
import zhHans from "./messages/zh-Hans.ts";
import enUS from "./messages/en-US.ts";

// 2. 初始化并解构导出
export const {
  getTranslations,
  getFormatter,
  isSupportedLanguage,
  languages, // readonly ("zh-Hans" | "en-US")[]
  defaultLanguage,
} = createI18n({
  defaultLanguage: "zh-Hans",
  messages: { "zh-Hans": zhHans, "en-US": enUS },
});

// type Language = "zh-Hans" | "en-US"
export type Language = (typeof languages)[number];
```

```ts
import { getTranslations } from "./i18n";

// 3. 获取对应语言与命名空间的翻译函数
const t = getTranslations("zh-Hans", "common");

// 4. 调用翻译
const title = t("title");
// IDE 自动推导类型: (key: "title") => string
// 输出: "系统仪表盘"

const greeting = t("greeting", { name: "开发者" });
// IDE 自动推导类型: (key: "greeting", params: { name: string }) => string
// 输出: "你好，开发者！"

const items = t("items", { count: 5 });
// IDE 自动推导类型: (key: "items", params: { count: number }) => string
// 输出: "共 5 项数据"
```

## 词典文件格式支持

`ts-intl` 支持直接加载 TypeScript、JavaScript 以及 JSON 格式的词典文件。

### TypeScript 静态定义（推荐）

使用 TypeScript 编写词典并搭配 `as const`，可自动推导严格的键名、变量占位符和富文本标签类型：

```ts
export default {
  // ...
  auth: {
    login: "登录",
    welcome: "欢迎回来，{username: string}！",
  },
} as const;
```

### JSON 词典支持

`createI18n` 原生支持直接加载 `.json` 文件作为词典，无需任何全局声明合并或构建插件，即可自动推导出所有层级的命名空间与键名类型，享受完整的自动补全与拼写错误拦截：

```ts
import { createI18n } from "ts-intl";
import zhHans from "./messages/zh-Hans.json";
import enUS from "./messages/en-US.json";

export const {
  getTranslations,
  getFormatter,
  isSupportedLanguage,
  languages,
  defaultLanguage,
} = createI18n({
  defaultLanguage: "zh-Hans",
  messages: { "zh-Hans": zhHans, "en-US": enUS },
});

const t = getTranslations("zh-Hans", "common");
t("title"); // IDE 精准补全: "title" | "greeting" | "items"
// @ts-expect-error 键名拼写错误，TypeScript 立即报错拦截
t("title_typo");
```

> **类型推导差异对比**：
>
> - **JSON 词典**：各层级命名空间与键名（Key）均能获得 100% 的强类型补全与报错拦截；但受限于 JSON 无法使用 `as const`，文本模板参数（如 `{name}`）将采用宽松类型推导。
> - **TypeScript 词典（`as const`）**：在键名强类型的基础上，额外获得占位符参数（如 `{name: string}`、`{count: number}`）在编译期的严格静态校验。

## 进阶翻译特性

### 通用富文本插值 `t.rich()`

`t.rich()` 可将文案中的 `<tag>children</tag>` 标签解析并映射为自定义组件或节点，无缝适配 React JSX、Vue VNode、Svelte 等各类 UI 框架：

```ts
// const messages = {
//   zh: {
//     notice: "请查阅<important>安全准则</important>与<link>使用协议</link>。",
//   },
// } as const;

const t = getTranslations("zh");

// 解析并生成自定义数据结构
const tokens = t.rich("notice", {
  important: (children) => ({ type: "strong", text: children }),
  link: (children) => ({ type: "a", href: "/terms", text: children }),
});

// [
//   "请查阅",
//   { type: "strong", text: "安全准则" },
//   "与",
//   { type: "a", href: "/terms", text: "使用协议" },
//   "。"
// ]
```

#### React

利用 `t.rich()` 直接渲染 React 元素：

```tsx
import React from "react";
import { getTranslations } from "./i18n";

export function WelcomeBanner({ lang }: { lang: "zh" | "en" }) {
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

在 Vue 3 中，可结合渲染函数 `h` 或动态组件 `<component :is>` 渲染富文本：

```vue
<script setup lang="ts">
import { h } from "vue";
import { getTranslations } from "./i18n";

const props = defineProps<{ lang: "zh" | "en" }>();
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

### HTML 字符串渲染 `t.markup()`

当只需生成包含 HTML 标签的纯文本字符串时，可使用 `t.markup()`。标签对应的回调函数必须接收字符串并返回字符串；若返回非字符串，将抛出 `INVALID_MESSAGE` 错误（行为与 `next-intl` 保持一致）：

```ts
// const messages = {
//   zh: {
//     notice: "请查阅<important>安全准则</important>与<link>使用协议</link>。",
//   },
// };

const html = t.markup("notice", {
  important: (c) => `<strong>${c}</strong>`,
  link: (c) => `<a href="/terms">${c}</a>`,
});
// 输出: "请查阅<strong>安全准则</strong>与<a href="/terms">使用协议</a>。"
```

### 提取原始数据 `t.raw()`

获取翻译词典中原始的对象或数组，不执行插值与替换：

```ts
// const messages = {
//   zh: {
//     config: { theme: "dark", level: 1 },
//     features: ["轻量", "类型安全"],
//   },
// } as const;

const t = getTranslations("zh");

const theme = t.raw("config");
// IDE 自动推导类型: { readonly theme: "dark"; readonly level: 1 }

const list = t.raw("features");
// IDE 自动推导类型: readonly ["轻量", "类型安全"]
```

### 键存在性检查 `t.has()`

安全判断指定键在当前语言（或回退语言）中是否存在，检测过程中不会触发文案缺失告警：

```ts
if (t.has("config")) {
  const cfg = t.raw("config");
}
```

## 类型安全机制

### 严格键名检查与路径补全

支持命名空间作用域与顶层点分隔（Dot Notation）访问路径。若输入错误的键名或访问不存在的命名空间，TypeScript 会在编译期直接报错拦截：

```ts
// const zh = {
//   common: {
//     title: "系统仪表盘",
//     greeting: "你好，{name: string}！",
//     items: {
//       one: "共 1 项数据",
//       other: "共 {count} 项数据",
//     },
//   },
// } as const;

const tCommon = getTranslations("zh", "common");
tCommon("title");
// IDE 补全提示: "title" | "greeting" | "items"

const tRoot = getTranslations("zh");
tRoot("common.title");
// IDE 补全提示: "common.title" | "common.greeting" | "common.items"
```

### 参数约束校验

```ts
const t = getTranslations("zh", "common");

// 无占位符：禁止传参
t("title");
// TypeScript 函数签名推导: (key: "title") => string

// 含占位符：必须传参
t("greeting", { name: "张三" });
// TypeScript 函数签名推导: (key: "greeting", params: { name: string }) => string
```

### 参数类型显式注解

在 TypeScript 词典中，可通过 `{name:type}` 语法显式声明参数类型，支持 `string`、`number` 与 `Date`：

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
  total: "100", // 报错: 不能将类型 'string' 分配给类型 'number'
});
```

### 多语言词典结构对齐校验

以 `defaultLanguage` 的词典结构为基准，其他语言在配置到 `messages` 时，必须保持相同的键名层级与占位符变量名。若其他语言存在遗漏、多余字段或占位符拼写不匹配，TypeScript 将在初始化处给出明确的类型错误提示，防止线上漏翻。

## 进阶特性与 ICU 语法

`ts-intl` 内置兼容了 ICU MessageFormat 1.x 规范，支持复数、序数、条件分支选择（Select）以及数值与日期的格式化。

### 复数处理（Pluralization）

#### 结构化复数对象

支持定义包含 `{ zero?, one, two?, few?, many?, other }` 等分类键的对象，轻松应对各类语言复杂的单复数规则：

```ts
// const en = {
//   cart: {
//     zero: "Cart is empty",
//     // 结构化复数对象自动推导出 { count: number }，无需额外类型注解
//     one: "{count} item in cart",
//     other: "{count} items in cart",
//   },
// } as const;

const t = getTranslations("en");

t("cart", { count: 0 }); // 输出: "Cart is empty"
t("cart", { count: 1 }); // 输出: "1 item in cart"
t("cart", { count: 5 }); // 输出: "5 items in cart"
```

#### ICU `plural` 模板语法

```ts
// const messages = {
//   en: {
//     inbox:
//       "You have {count, plural, =0 {no emails} one {# email} other {# emails}}.",
//   },
// } as const;

const t = getTranslations("en");

t("inbox", { count: 0 }); // 输出: "You have no emails."
t("inbox", { count: 1 }); // 输出: "You have 1 email."
t("inbox", { count: 12 }); // 输出: "You have 12 emails."
```

### 序数词格式化（selectordinal）

通过 `selectordinal` 匹配序数规则，自动将 `#` 替换为具体数值，支持精确匹配（`=1`, `=2` 等）：

```ts
// const messages = {
//   en: {
//     rank: "You finished {pos, selectordinal, =1 {first} =2 {second} =3 {third} other {#th}}!",
//     birthday: "It's your {year, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} birthday!",
//   },
// } as const;

const t = getTranslations("en");

// 1. 精确值优先匹配（=value 优先于通用分类规则）
t("rank", { pos: 1 }); // 输出: "You finished first!"
t("rank", { pos: 4 }); // 输出: "You finished 4th!"
t("rank", { pos: 21 }); // 输出: "You finished 21th!"（因模板未声明 one 分支，回退至 other）

// 2. 序数分类规则匹配（自动匹配英语 one/two/few/other 规则）
t("birthday", { year: 1 }); // 输出: "It's your 1st birthday!"
t("birthday", { year: 2 }); // 输出: "It's your 2nd birthday!"
t("birthday", { year: 3 }); // 输出: "It's your 3rd birthday!"
t("birthday", { year: 21 }); // 输出: "It's your 21st birthday!"
```

### 条件分支选择（select）

根据输入的状态或枚举值动态匹配对应文案：

```ts
// const messages = {
//   en: {
//     memberStatus:
//       "{role, select, admin {Administrator} manager {Project Manager} other {General User}}",
//   },
// } as const;

const t = getTranslations("en");

t("memberStatus", { role: "admin" }); // 输出: "Administrator"
t("memberStatus", { role: "guest" }); // 输出: "General User"
```

### 命名格式预设与模板内置格式化

可在全局配置中声明通用的数字、日期时间与列表格式预设，并在模板中直接引用：

```ts
const { getTranslations } = createI18n({
  defaultLanguage: "en",
  formats: {
    number: {
      currency: { style: "currency", currency: "USD" },
    },
    dateTime: {
      shortDate: { dateStyle: "short", timeZone: "UTC" },
    },
  },
  messages: {
    en: {
      invoice:
        "Total: {amount, number, currency}, Due: {dueDate, date, shortDate}",
    },
  },
});

const t = getTranslations("en");
t("invoice", {
  amount: 2500,
  dueDate: new Date("2026-10-01T00:00:00Z"),
});
// 输出: "Total: $2,500.00, Due: 10/1/26"

// 也支持在调用翻译函数时传入第三个参数临时覆盖预设（与 next-intl API 保持一致）：
t(
  "invoice",
  { amount: 2500, dueDate: new Date("2026-10-01T00:00:00Z") },
  { number: { currency: { style: "currency", currency: "EUR" } } },
);
// 输出: "Total: €2,500.00, Due: 10/1/26"
```

## 国际化格式化工具（Formatter）

`ts-intl` 封装了基于 Web 标准 `Intl` API 的类型安全格式化工具，内置实例缓存优化，支持数值、货币、日期时间、相对时间、本地化列表及显示名称等。

提供了两种调用方式：

1. **`getFormatter(lang?)`**（推荐）：通过 `createI18n` 实例解构获得，自动继承全局 `formats` 命名预设、`timeZone` 时区与统一错误处理，并按语言进行单例缓存。
2. **`createFormatter(options)`**：独立的格式化器工厂函数，无需创建完整的 i18n 实例，适合在各种轻量或独立模块中使用。

### 方式一：从 `createI18n` 实例获取 `getFormatter()`（推荐）

通过 `createI18n` 解构出 `getFormatter`，可以方便地获取绑定了全局配置的格式化器：

```ts
import { createI18n } from "ts-intl";

export const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "zh-Hans",
  formats: {
    number: {
      cny: { style: "currency", currency: "CNY" },
      compact: { notation: "compact" },
    },
    dateTime: {
      shortDate: { dateStyle: "short" },
    },
  },
  timeZone: "Asia/Shanghai",
  messages: {
    "zh-Hans": {
      /* ... */
    },
    "en-US": {
      /* ... */
    },
  },
});

// 1. 获取指定语言的格式化器（内置单例缓存，多次调用无重复创建开销）
const formatter = getFormatter("zh-Hans");

// 2. 省略参数时，默认使用 defaultLanguage ("zh-Hans")
const defaultFormatter = getFormatter();

// 3. 也可以获取其他支持语言的格式化器，同样继承全局 formats 预设
const formatterEn = getFormatter("en-US");

// 使用示例：
formatter.number(888.8, "cny");
// 输出: "¥888.80"

formatterEn.number(1200000, "compact");
// 输出: "1.2M"
```

### 方式二：独立使用 `createFormatter(options)`

适用于未调用 `createI18n` 或需要临时自定义格式化配置的独立模块：

```ts
import { createFormatter } from "ts-intl";

const formatter = createFormatter({
  locale: "zh-CN",
  formats: {
    number: {
      cny: { style: "currency", currency: "CNY" },
    },
  },
  timeZone: "Asia/Shanghai", // 可选，默认时区
});
```

### 格式化 API 功能速览

无论通过 `getFormatter()` 还是 `createFormatter()` 获取的格式化器，均提供完全一致的 API：

```ts
// 1. 数值与货币（支持标准 Intl 选项或命名预设）
formatter.number(1234567.89);
// 输出: "1,234,567.89"

formatter.number(888.8, "cny");
// 输出: "¥888.80"（使用预设命名格式）

formatter.number(888.8, "cny", { maximumFractionDigits: 0 });
// 输出: "¥889"（支持覆盖预设选项）

// 2. 日期与时间
formatter.dateTime(new Date("2026-09-11T12:00:00Z"), { dateStyle: "full" });
// 输出: "2026年9月11日星期五"

// 3. 日期范围
formatter.dateTimeRange(new Date("2026-05-01"), new Date("2026-05-05"));
// 输出: "2026/5/1 – 2026/5/5"

// 4. 相对时间（自动根据时间差计算最佳时间单位）
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
formatter.relativeTime(twoHoursAgo);
// 输出: "2小时前"

// 支持自定义基准时间和 numeric 选项（"auto" 可智能显示 "昨天" / "明天"）
formatter.relativeTime(new Date("2026-06-02"), {
  now: new Date("2026-06-01"),
  numeric: "auto",
});
// 输出: "明天"

// 5. 本地化列表连接（ListFormat）
formatter.list(["苹果", "香蕉", "橙子"]);
// 输出: "苹果、香蕉和橙子"

// 6. 本地化名称显示（DisplayNames）
formatter.displayName("en-US", { type: "language" });
// 输出: "美国英语"

formatter.displayName("US", { type: "region" });
// 输出: "美国"
```

## 错误处理与容错兜底

支持统一的运行时异常监控与自定义文案回退策略：

```ts
import { createI18n, I18nError, I18nErrorCode } from "ts-intl";

export const i18n = createI18n({
  defaultLanguage: "zh-Hans",
  messages: { "zh-Hans": { hello: "你好" } },

  // 统一错误回调
  onError(error: I18nError) {
    if (error.code === I18nErrorCode.MISSING_MESSAGE) {
      console.warn(`[监控告警] 缺失文案: ${error.key} (语言: ${error.lang})`);
    } else if (error.code === I18nErrorCode.INVALID_KEY) {
      console.warn(`[词典校验] 非法键名: ${error.message}`);
    } else if (error.code === I18nErrorCode.INVALID_MESSAGE) {
      console.warn(`[消息类型] 回调类型错误: ${error.message}`);
    } else if (error.code === I18nErrorCode.MISSING_FORMAT) {
      console.warn(`[格式预设] 找不到命名格式: ${error.message}`);
    } else if (error.code === I18nErrorCode.FORMATTING_ERROR) {
      console.warn(`[格式化错误] ${error.message}`);
    }
  },

  // 自定义缺失文案回退策略
  getMessageFallback({ error, key, lang, namespace }) {
    return `[未翻译: ${key}]`;
  },
});
```

在非生产环境下，`createI18n` 在初始化时会自动校验词典对象，检测键名中是否误用了点号（例如 `{"foo.bar": "value"}` 会导致深层路径解析歧义），并通过 `onError` 提前告警；生产环境下会自动跳过该校验，确保零额外运行时开销。

### API 参考

#### `createI18n` 实例返回属性与方法

| 属性 / 方法                         | 类型                           | 说明                                                                     |
| :---------------------------------- | :----------------------------- | :----------------------------------------------------------------------- |
| `getTranslations(lang, namespace?)` | `Function`                     | 获取指定语言（及可选命名空间）的翻译函数 `t`，纯同步且无状态             |
| `getFormatter(lang?)`               | `(lang?: string) => Formatter` | 获取指定语言的格式化器实例（缺省时为 `defaultLanguage`，按语言单例缓存） |
| `isSupportedLanguage(lang)`         | `(lang: string) => boolean`    | 运行时语言类型守卫（Type Guard），检查传入语言是否配置在 `messages` 中   |
| `languages`                         | `readonly string[]`            | 当前配置支持的所有语言代码列表                                           |
| `defaultLanguage`                   | `string`                       | 当前配置的默认基准语言代码                                               |

#### 翻译器方法（`t`）

| 方法                               | 返回类型          | 说明                                                                       |
| :--------------------------------- | :---------------- | :------------------------------------------------------------------------- |
| `t(key, params?, formats?)`        | `string`          | 格式化纯文本，自动处理变量替换与单复数匹配，支持单次调用覆盖预设格式       |
| `t.rich(key, params?, formats?)`   | `(string \| R)[]` | 格式化富文本节点数组，回调可返回任意组件对象，支持单次调用覆盖预设格式     |
| `t.markup(key, params?, formats?)` | `string`          | 生成包含 HTML 标签的纯字符串，要求回调返回字符串，支持单次调用覆盖预设格式 |
| `t.raw(key)`                       | `精确类型 / any`  | 获取词典中指定路径的原始对象或数组（若键存在于词典中则推导精确类型）       |
| `t.has(key)`                       | `boolean`         | 检测指定键是否存在，不会触发缺失文案告警                                   |

#### 格式化器方法（`formatter`）

| 方法                                                                | 说明                                                                 |
| :------------------------------------------------------------------ | :------------------------------------------------------------------- |
| `formatter.number(value, formatOrOptions?, overrides?)`             | 格式化数字、货币、百分比（支持命名预设或标准 Intl 选项）             |
| `formatter.dateTime(date, formatOrOptions?, overrides?)`            | 格式化单个日期时间（支持命名预设或标准 Intl 选项）                   |
| `formatter.dateTimeRange(start, end, formatOrOptions?, overrides?)` | 格式化时间区间范围                                                   |
| `formatter.relativeTime(date, nowOrOptions?)`                       | 格式化相对时间（如“3天前”、“昨天”、“2小时前”，自动计算最佳时间单位） |
| `formatter.list(items, formatOrOptions?, overrides?)`               | 本地化列表项合并（如“苹果、香蕉和橙子”，符合目标语言连接习惯）       |
| `formatter.displayName(code, formatOrOptions, overrides?)`          | 语言、国家地区、货币符号等的本地化显示名称                           |

## 许可证 (License)

[MIT](./LICENSE)
