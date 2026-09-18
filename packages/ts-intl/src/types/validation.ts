/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExtractPlaceholders } from "./placeholders";
import type { IsPluralValue, PluralCategory } from "./utility";

export type PluralStringUnion<V> =
  V extends Record<string, any>
    ? {
        [K in keyof V & PluralCategory]: V[K] extends string ? V[K] : never;
      }[keyof V & PluralCategory]
    : never;

type CheckPlaceholders<TBasePH, TLangPH> = [TBasePH] extends [TLangPH]
  ? [TLangPH] extends [TBasePH]
    ? true
    : false
  : false;

type ValidateString<
  BaseStr extends string,
  LangStr extends string,
  Key extends string,
> = string extends LangStr
  ? string
  : CheckPlaceholders<
        ExtractPlaceholders<BaseStr>,
        ExtractPlaceholders<LangStr>
      > extends true
    ? LangStr
    : `[ts-intl] Placeholder mismatch in key "${Key}": expected {${ExtractPlaceholders<BaseStr>}}`;

export type ValidateMessages<TBase, TLang> = {
  [K in keyof TBase]: IsPluralValue<TBase[K]> extends true
    ? K extends keyof TLang
      ? TLang[K] extends { readonly other: string }
        ? true extends (string extends TLang[K]["other"] ? true : false)
          ? TLang[K]
          : CheckPlaceholders<
                ExtractPlaceholders<PluralStringUnion<TBase[K]>>,
                ExtractPlaceholders<PluralStringUnion<TLang[K]>>
              > extends true
            ? TLang[K]
            : {
                [P in keyof TLang[K]]: P extends "other"
                  ? `[ts-intl] Placeholder mismatch in plural key "${K & string}"`
                  : TLang[K][P];
              }
        : { other: string }
      : never
    : TBase[K] extends Record<string, any>
      ? K extends keyof TLang
        ? TLang[K] extends Record<string, any>
          ? ValidateMessages<TBase[K], TLang[K]>
          : never
        : never
      : K extends keyof TLang
        ? TBase[K] extends string
          ? TLang[K] extends string
            ? ValidateString<TBase[K], TLang[K], K & string>
            : string
          : TLang[K]
        : never;
};

export type ValidateLanguages<
  TDefaultLanguage extends string,
  TLanguages extends Record<string, any>,
> = {
  [L in keyof TLanguages]: L extends TDefaultLanguage
    ? TLanguages[L]
    : ValidateMessages<TLanguages[TDefaultLanguage], TLanguages[L]>;
};
