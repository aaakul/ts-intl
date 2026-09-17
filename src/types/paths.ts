/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IsPluralValue } from "./utility";

/**
 * Resolves the value type at a dot-separated path in object T.
 */
export type ValueAtPath<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? ValueAtPath<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * Extracts all leaf key paths from an object (supports flat keys and dot-separated paths).
 */
export type Leaves<T> = T extends object
  ? IsPluralValue<T> extends true
    ? ""
    : {
        [K in keyof T & string]: T[K] extends readonly unknown[]
          ? K
          : Leaves<T[K]> extends ""
            ? K
            : `${K}.${Leaves<T[K]>}`;
      }[keyof T & string]
  : "";

/**
 * Extracts all valid namespace paths from an object (excludes plural objects and arrays).
 */
export type NamespaceKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends readonly unknown[]
        ? never
        : IsPluralValue<T[K]> extends true
          ? never
          : T[K] extends Record<string, any>
            ? K | `${K}.${NamespaceKeys<T[K]>}`
            : never;
    }[keyof T & string]
  : never;
