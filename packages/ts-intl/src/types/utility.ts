export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export type IsPluralValue<T> = T extends {
  readonly other: string;
}
  ? [Exclude<keyof T, PluralCategory>] extends [never]
    ? true
    : false
  : false;
