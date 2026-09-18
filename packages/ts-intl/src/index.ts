export type {
  IsPluralValue,
  PluralCategory,
  Prettify,
  UnionToIntersection,
} from "./types/utility";

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

export type { Leaves, NamespaceKeys, ValueAtPath } from "./types/paths";

export type {
  PluralStringUnion,
  ValidateLanguages,
  ValidateMessages,
} from "./types/validation";

export type { Formats, I18nConfig } from "./types/config";

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

export { I18nError, I18nErrorCode } from "./core/errors";

export { validateMessages } from "./core/validate";

export { resolvePath } from "./core/resolvePath";
export { parseIcuCases, resolveIcu, type IcuResolveContext } from "./core/icu";
export { renderRichHierarchy } from "./core/rich";

export {
  createIntlCache,
  createIntlFormatters,
  LruMap,
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

export { createI18n } from "./core/createI18n";
