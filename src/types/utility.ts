/** Flattens intersection types to improve IDE hover tooltips. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/** Converts a union type to an intersection type. */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/** Standard plural categories supported by Intl.PluralRules. */
export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

/** Checks if a value is a plural object (must include 'other: string' and only standard plural keys). */
export type IsPluralValue<T> = T extends {
  readonly other: string;
}
  ? [Exclude<keyof T, PluralCategory>] extends [never]
    ? true
    : false
  : false;

