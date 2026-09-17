/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type */
import type { Prettify } from "./utility";

export type TrimLeft<S extends string> = S extends
  | ` ${infer R}`
  | `\t${infer R}`
  | `\n${infer R}`
  ? TrimLeft<R>
  : S;

export type TrimRight<S extends string> = S extends
  | `${infer R} `
  | `${infer R}\t`
  | `${infer R}\n`
  ? TrimRight<R>
  : S;

export type Trim<S extends string> = TrimLeft<TrimRight<S>>;

export type IsValidArg<A extends string> = A extends `${string}}${string}`
  ? false
  : A extends `${string}{${string}`
    ? false
    : true;

type ConsumeCases<S extends string> =
  TrimLeft<S> extends `}${infer Rest}`
    ? { params: {}; rest: Rest }
    : TrimLeft<S> extends `${string}{${infer CaseBody}}${infer AfterCase}`
      ? ConsumeCases<AfterCase> extends {
          params: infer RestParams;
          rest: infer RestTemplate;
        }
        ? {
            params: ExtractTypedParams<CaseBody> & RestParams;
            rest: RestTemplate;
          }
        : { params: {}; rest: "" }
      : { params: {}; rest: "" };

type ConsumeCasesNames<S extends string> =
  TrimLeft<S> extends `}${infer Rest}`
    ? { names: never; rest: Rest }
    : TrimLeft<S> extends `${string}{${infer CaseBody}}${infer AfterCase}`
      ? ConsumeCasesNames<AfterCase> extends {
          names: infer RestNames;
          rest: infer RestTemplate;
        }
        ? {
            names: ExtractPlaceholders<CaseBody> | RestNames;
            rest: RestTemplate;
          }
        : { names: never; rest: "" }
      : { names: never; rest: "" };

/**
 * Extracts placeholder names from a string (supports standard placeholders, select, plural, and selectordinal).
 */
export type ExtractPlaceholders<S> = S extends `${string}{${infer Rest}`
  ? Rest extends `${infer Arg}, selectordinal, ${infer Cases}`
    ? IsValidArg<Arg> extends true
      ? ConsumeCasesNames<Cases> extends {
          names: infer InnerNames;
          rest: infer AfterBlock;
        }
        ? Trim<Arg> | InnerNames | ExtractPlaceholders<AfterBlock>
        : Trim<Arg>
      : FallbackPlaceholder<Rest>
    : Rest extends `${infer Arg},selectordinal,${infer Cases}`
      ? IsValidArg<Arg> extends true
        ? ConsumeCasesNames<Cases> extends {
            names: infer InnerNames;
            rest: infer AfterBlock;
          }
          ? Trim<Arg> | InnerNames | ExtractPlaceholders<AfterBlock>
          : Trim<Arg>
        : FallbackPlaceholder<Rest>
      : Rest extends `${infer Arg}, select, ${infer Cases}`
        ? IsValidArg<Arg> extends true
          ? ConsumeCasesNames<Cases> extends {
              names: infer InnerNames;
              rest: infer AfterBlock;
            }
            ? Trim<Arg> | InnerNames | ExtractPlaceholders<AfterBlock>
            : Trim<Arg>
          : FallbackPlaceholder<Rest>
        : Rest extends `${infer Arg},select,${infer Cases}`
          ? IsValidArg<Arg> extends true
            ? ConsumeCasesNames<Cases> extends {
                names: infer InnerNames;
                rest: infer AfterBlock;
              }
              ? Trim<Arg> | InnerNames | ExtractPlaceholders<AfterBlock>
              : Trim<Arg>
            : FallbackPlaceholder<Rest>
          : Rest extends `${infer Arg}, plural, ${infer Cases}`
            ? IsValidArg<Arg> extends true
              ? ConsumeCasesNames<Cases> extends {
                  names: infer InnerNames;
                  rest: infer AfterBlock;
                }
                ? Trim<Arg> | InnerNames | ExtractPlaceholders<AfterBlock>
                : Trim<Arg>
              : FallbackPlaceholder<Rest>
            : Rest extends `${infer Arg},plural,${infer Cases}`
              ? IsValidArg<Arg> extends true
                ? ConsumeCasesNames<Cases> extends {
                    names: infer InnerNames;
                    rest: infer AfterBlock;
                  }
                  ? Trim<Arg> | InnerNames | ExtractPlaceholders<AfterBlock>
                  : Trim<Arg>
                : FallbackPlaceholder<Rest>
              : FallbackPlaceholder<Rest>
  : never;

type FallbackPlaceholder<Rest extends string> =
  Rest extends `${infer P}}${infer After}`
    ?
        | (P extends `${infer Name},${string}`
            ? Trim<Name>
            : P extends `${infer Name}:${string}`
              ? Trim<Name>
              : Trim<P>)
        | ExtractPlaceholders<After>
    : never;

type CleanTagName<T extends string> = T extends `${infer Name} /`
  ? CleanTagName<Name>
  : T extends `${infer Name}/`
    ? CleanTagName<Name>
    : T extends `${infer Name} ${string}`
      ? CleanTagName<Name>
      : T;

/** Extracts tag names `<tag>...</tag>` from a template string (supports nested, self-closing, and attributes). */
export type ExtractTags<S extends string> =
  S extends `${string}<${infer Tag}>${infer Rest}`
    ? Tag extends `/${string}` | ` ${string}`
      ? ExtractTags<Rest>
      : CleanTagName<Tag> extends ""
        ? ExtractTags<Rest>
        : CleanTagName<Tag> | ExtractTags<Rest>
    : never;

/** Maps a type annotation string to a native TypeScript type. */
type ParseParamType<T extends string> = T extends "number"
  ? number
  : T extends "Date"
    ? Date | number
    : string;

/** Extracts a typed parameter from a single placeholder expression. */
type SingleParam<P extends string> = P extends `${infer Name},${infer Type}`
  ? Trim<Type> extends `number${string}`
    ? { [K in Trim<Name>]: number }
    : Trim<Type> extends `date${string}` | `time${string}`
      ? { [K in Trim<Name>]: Date | number }
      : { [K in Trim<Name>]: string | number }
  : P extends `${infer Name}:${infer Type}`
    ? { [K in Trim<Name>]: ParseParamType<Trim<Type>> }
    : { [K in Trim<P>]: string | number };

/** Extracts all typed placeholder parameters from a template string (supports select, plural, selectordinal, and standard formats). */
export type ExtractTypedParams<S> = S extends `${string}{${infer Rest}`
  ? Rest extends `${infer Arg}, selectordinal, ${infer Cases}`
    ? IsValidArg<Arg> extends true
      ? ConsumeCases<Cases> extends {
          params: infer InnerParams;
          rest: infer AfterBlock;
        }
        ? { [K in Trim<Arg>]: number } & InnerParams &
            ExtractTypedParams<AfterBlock>
        : { [K in Trim<Arg>]: number }
      : SingleParamOrRest<Rest>
    : Rest extends `${infer Arg},selectordinal,${infer Cases}`
      ? IsValidArg<Arg> extends true
        ? ConsumeCases<Cases> extends {
            params: infer InnerParams;
            rest: infer AfterBlock;
          }
          ? { [K in Trim<Arg>]: number } & InnerParams &
              ExtractTypedParams<AfterBlock>
          : { [K in Trim<Arg>]: number }
        : SingleParamOrRest<Rest>
      : Rest extends `${infer Arg}, select, ${infer Cases}`
        ? IsValidArg<Arg> extends true
          ? ConsumeCases<Cases> extends {
              params: infer InnerParams;
              rest: infer AfterBlock;
            }
            ? { [K in Trim<Arg>]: string } & InnerParams &
                ExtractTypedParams<AfterBlock>
            : { [K in Trim<Arg>]: string }
          : SingleParamOrRest<Rest>
        : Rest extends `${infer Arg},select,${infer Cases}`
          ? IsValidArg<Arg> extends true
            ? ConsumeCases<Cases> extends {
                params: infer InnerParams;
                rest: infer AfterBlock;
              }
              ? { [K in Trim<Arg>]: string } & InnerParams &
                  ExtractTypedParams<AfterBlock>
              : { [K in Trim<Arg>]: string }
            : SingleParamOrRest<Rest>
          : Rest extends `${infer Arg}, plural, ${infer Cases}`
            ? IsValidArg<Arg> extends true
              ? ConsumeCases<Cases> extends {
                  params: infer InnerParams;
                  rest: infer AfterBlock;
                }
                ? { [K in Trim<Arg>]: number } & InnerParams &
                    ExtractTypedParams<AfterBlock>
                : { [K in Trim<Arg>]: number }
              : SingleParamOrRest<Rest>
            : Rest extends `${infer Arg},plural,${infer Cases}`
              ? IsValidArg<Arg> extends true
                ? ConsumeCases<Cases> extends {
                    params: infer InnerParams;
                    rest: infer AfterBlock;
                  }
                  ? { [K in Trim<Arg>]: number } & InnerParams &
                      ExtractTypedParams<AfterBlock>
                  : { [K in Trim<Arg>]: number }
                : SingleParamOrRest<Rest>
              : SingleParamOrRest<Rest>
  : {};

type SingleParamOrRest<Rest extends string> =
  Rest extends `${infer P}}${infer After}`
    ? SingleParam<P> & ExtractTypedParams<After>
    : {};

/** Maps tag names to string render functions (plain text / markup). */
export type TagParams<S extends string> = [ExtractTags<S>] extends [never]
  ? {}
  : { [T in ExtractTags<S>]: (children: string) => string };

/** Maps tag names to rich-text render functions (supports generic node type R and nested children). */
export type RichTagParams<S extends string, R = any> = [
  ExtractTags<S>,
] extends [never]
  ? {}
  : { [T in ExtractTags<S>]: (children: R | string | (R | string)[]) => R };

/** Builds text parameters for a string value (placeholders + tag callbacks). */
export type StringParams<S extends string> = Prettify<
  ExtractTypedParams<S> & TagParams<S>
>;

/** Builds rich-text parameters for a string value. */
export type RichStringParams<S extends string, R = any> = Prettify<
  ExtractTypedParams<S> & RichTagParams<S, R>
>;
