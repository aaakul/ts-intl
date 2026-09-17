// ━━━ Utility & General Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type {
  IsPluralValue,
  PluralCategory,
  Prettify,
  UnionToIntersection,
} from "./types/utility";

// ━━━ Placeholder & Tag Extraction Types ━━━━━━━━━━━━━━━━━━━━━
export type {
  ExtractPlaceholders,
  ExtractTags,
  ExtractTypedParams,
  RichStringParams,
  RichTagParams,
  StringParams,
  TagParams,
  Trim,
  TrimLeft,
  TrimRight,
} from "./types/placeholders";

// ━━━ Path & Namespace Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type { Leaves, NamespaceKeys, ValueAtPath } from "./types/paths";

// ━━━ Validation Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type {
  PluralStringUnion,
  ValidateLanguages,
  ValidateMessages,
} from "./types/validation";

// ━━━ Configuration Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type { Formats, I18nConfig } from "./types/config";

// ━━━ Translator Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type {
  FlatTranslator,
  ParamsForValue,
  PluralParams,
  RichParamsForValue,
  RichPluralParams,
  RichTranslationValues,
  StringTranslationValues,
  Translator,
} from "./types/translator";

// ━━━ Structured Error Handling ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export { I18nError, I18nErrorCode } from "./core/errors";

// ━━━ Dictionary Validation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export { validateMessages } from "./core/validate";

// ━━━ Path Navigation & ICU / Rich Processing ━━━━━━━━━━━━━━━━
export { resolvePath } from "./core/resolvePath";
export { parseIcuCases, resolveIcu, type IcuResolveContext } from "./core/icu";
export { renderRichHierarchy } from "./core/rich";

// ━━━ Native Web Intl Formatters ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export {
  createIntlCache,
  createIntlFormatters,
  type IntlCache,
  type IntlFormatters,
} from "./formatters/cache";
export {
  createFormatter,
  resolveRelativeTimeUnit,
  type Formatter,
  type FormatterOptions,
  type RelativeTimeOptions,
} from "./formatters/createFormatter";

// ━━━ Main Instance Factory ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export { createI18n } from "./core/createI18n";
