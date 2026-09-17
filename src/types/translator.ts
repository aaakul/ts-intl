/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type */
import type { Formats } from "./config";
import type { Leaves, ValueAtPath } from "./paths";
import type {
  ExtractPlaceholders,
  ExtractTags,
  ExtractTypedParams,
  RichStringParams,
  RichTagParams,
  StringParams,
  TagParams,
} from "./placeholders";
import type { IsPluralValue, Prettify, UnionToIntersection } from "./utility";
import type { PluralStringUnion } from "./validation";

/** Builds text parameters for a plural object (includes required 'count'). */
export type PluralParams<V> = Prettify<
  { count: number } & UnionToIntersection<
    PluralStringUnion<V> extends infer S extends string
      ? ExtractTypedParams<S> & TagParams<S>
      : {}
  >
>;

/** General parameter values for plain string interpolation (used for loose strings or JSON imports). */
export type StringTranslationValues = Record<
  string,
  | string
  | number
  | boolean
  | bigint
  | Date
  | null
  | undefined
  | ((children: string) => string)
  | readonly (string | number | boolean | Date | null | undefined)[]
>;

/**
 * Builds parameter tuples for t() and t.markup() based on message type:
 * - Plural object → [params: { count: number, ... }, formats?: Formats] (required)
 * - Wide string (JSON imports or without 'as const') → [params?: StringTranslationValues, formats?: Formats]
 * - String literal with placeholders/tags → [params: StringParams, formats?: Formats] (required)
 * - Plain string literal without placeholders/tags → [] (no params allowed)
 *
 * The optional `formats` argument allows per-call format overrides, matching next-intl's
 * `t(key, values, formats?)` signature.
 */
export type ParamsForValue<V> =
  IsPluralValue<V> extends true
    ? [params: PluralParams<V>, formats?: Formats]
    : string extends V
      ? [params?: StringTranslationValues, formats?: Formats]
      : V extends string
        ? [ExtractPlaceholders<V> | ExtractTags<V>] extends [never]
          ? []
          : [params: StringParams<V>, formats?: Formats]
        : [params?: StringTranslationValues, formats?: Formats];

/** Builds rich-text parameters for a plural object. */
export type RichPluralParams<V, R = any> = Prettify<
  { count: number } & UnionToIntersection<
    PluralStringUnion<V> extends infer S extends string
      ? ExtractTypedParams<S> & RichTagParams<S, R>
      : {}
  >
>;

/** General parameter values for rich-text interpolation (used for loose strings or JSON imports). */
export type RichTranslationValues<R = any> = Record<
  string,
  | string
  | number
  | boolean
  | bigint
  | Date
  | null
  | undefined
  | ((children: R | string | (R | string)[]) => R)
  | readonly (string | number | boolean | Date | null | undefined)[]
>;

/**
 * Builds parameter tuples for t.rich() based on message type.
 * An optional `formats` argument allows per-call format overrides.
 */
export type RichParamsForValue<V, R = any> =
  IsPluralValue<V> extends true
    ? [params: RichPluralParams<V, R>, formats?: Formats]
    : string extends V
      ? [params?: RichTranslationValues<R>, formats?: Formats]
      : V extends string
        ? [ExtractPlaceholders<V> | ExtractTags<V>] extends [never]
          ? []
          : [params: RichStringParams<V, R>, formats?: Formats]
        : [params?: RichTranslationValues<R>, formats?: Formats];

/** Namespace translator interface. */
export interface Translator<TNamespace> {
  /** Formats plain text, handling placeholders and plurals. Returns a string. */
  <K extends Leaves<TNamespace>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TNamespace, K>>
  ): string;

  /**
   * Formats rich text, returning an array of tokens.
   * Callback functions can return any node type (e.g. ReactElement, VNode, DOM Node).
   */
  rich<K extends Leaves<TNamespace>, R = any>(
    key: K,
    ...params: RichParamsForValue<ValueAtPath<TNamespace, K>, R>
  ): (string | R)[];

  /**
   * Formats HTML tags as a plain string.
   * Callback functions receive a string and return a string.
   */
  markup<K extends Leaves<TNamespace>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TNamespace, K>>
  ): string;

  /**
   * Gets the raw value from the translation dictionary without interpolation.
   * Useful for arrays, nested objects, or raw configs.
   */
  raw<K extends Leaves<TNamespace> | string>(
    key: K,
  ): ValueAtPath<TNamespace, K> extends never
    ? any
    : ValueAtPath<TNamespace, K>;

  /**
   * Checks whether a translation key exists in the current dictionary (or namespace) without triggering error callbacks.
   */
  has<K extends Leaves<TNamespace> | (string & {})>(key: K): boolean;
}

/** Root flat translator interface. */
export interface FlatTranslator<TBase> {
  /** Formats plain text, handling placeholders and plurals. Returns a string. */
  <K extends Leaves<TBase>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TBase, K>>
  ): string;

  /**
   * Formats rich text, returning an array of tokens.
   */
  rich<K extends Leaves<TBase>, R = any>(
    key: K,
    ...params: RichParamsForValue<ValueAtPath<TBase, K>, R>
  ): (string | R)[];

  /**
   * Formats HTML tags as a plain string.
   */
  markup<K extends Leaves<TBase>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TBase, K>>
  ): string;

  /**
   * Gets the raw value from the translation dictionary without interpolation.
   */
  raw<K extends Leaves<TBase> | string>(
    key: K,
  ): ValueAtPath<TBase, K> extends never ? any : ValueAtPath<TBase, K>;

  /**
   * Checks whether a translation key exists in the current dictionary without triggering error callbacks.
   */
  has<K extends Leaves<TBase> | (string & {})>(key: K): boolean;
}
