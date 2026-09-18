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

export type PluralParams<V> = Prettify<
  { count: number } & UnionToIntersection<
    PluralStringUnion<V> extends infer S extends string
      ? ExtractTypedParams<S> & TagParams<S>
      : {}
  >
>;

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

export type RichPluralParams<V, R = any> = Prettify<
  { count: number } & UnionToIntersection<
    PluralStringUnion<V> extends infer S extends string
      ? ExtractTypedParams<S> & RichTagParams<S, R>
      : {}
  >
>;

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

export interface Translator<TNamespace> {
  <K extends Leaves<TNamespace>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TNamespace, K>>
  ): string;

  /**
   * Returns an array of tokens (string or node type R), allowing UI components
   * (e.g. ReactElement, VNode, DOM Node) to be returned from tag render callbacks.
   */
  rich<K extends Leaves<TNamespace>, R = any>(
    key: K,
    ...params: RichParamsForValue<ValueAtPath<TNamespace, K>, R>
  ): (string | R)[];

  /**
   * Tag render callbacks must return strings. Returning non-string values
   * triggers an INVALID_MESSAGE error.
   */
  markup<K extends Leaves<TNamespace>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TNamespace, K>>
  ): string;

  /**
   * Returns the dictionary value directly without ICU placeholder or plural interpolation.
   */
  raw<K extends Leaves<TNamespace> | string>(
    key: K,
  ): ValueAtPath<TNamespace, K> extends never
    ? any
    : ValueAtPath<TNamespace, K>;

  /**
   * Checks key existence without triggering onError callbacks or fallback generators.
   */
  has<K extends Leaves<TNamespace> | (string & {})>(key: K): boolean;
}

export interface FlatTranslator<TBase> {
  <K extends Leaves<TBase>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TBase, K>>
  ): string;

  /**
   * Returns an array of tokens (string or node type R), allowing UI components
   * (e.g. ReactElement, VNode, DOM Node) to be returned from tag render callbacks.
   */
  rich<K extends Leaves<TBase>, R = any>(
    key: K,
    ...params: RichParamsForValue<ValueAtPath<TBase, K>, R>
  ): (string | R)[];

  /**
   * Tag render callbacks must return strings. Returning non-string values
   * triggers an INVALID_MESSAGE error.
   */
  markup<K extends Leaves<TBase>>(
    key: K,
    ...params: ParamsForValue<ValueAtPath<TBase, K>>
  ): string;

  /**
   * Returns the dictionary value directly without ICU placeholder or plural interpolation.
   */
  raw<K extends Leaves<TBase> | string>(
    key: K,
  ): ValueAtPath<TBase, K> extends never ? any : ValueAtPath<TBase, K>;

  /**
   * Checks key existence without triggering onError callbacks or fallback generators.
   */
  has<K extends Leaves<TBase> | (string & {})>(key: K): boolean;
}
