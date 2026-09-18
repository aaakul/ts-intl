/* eslint-disable @typescript-eslint/no-explicit-any */
import { I18nError, I18nErrorCode } from "../core/errors";
import type { Formatter } from "../formatters/createFormatter";

export interface IcuResolveContext {
  getPluralCategory: (lang: string, count: number) => string;
  getOrdinalCategory: (lang: string, count: number) => string;
  formatter?: Formatter;
  onError?: (error: I18nError) => void;
  /** Masks '<' and '>' in variable values to prevent user input from injecting markup tags in rich text. */
  escapeTags?: boolean;
}

export function parseIcuCases(casesStr: string): Map<string, string> {
  const cases = new Map<string, string>();
  let i = 0;
  const len = casesStr.length;

  while (i < len) {
    while (i < len && /\s/.test(casesStr[i]!)) i++;
    if (i >= len) break;

    const selectorStart = i;
    while (i < len && !/\s/.test(casesStr[i]!) && casesStr[i] !== "{") {
      i++;
    }
    const selector = casesStr.slice(selectorStart, i).trim();

    while (i < len && /\s/.test(casesStr[i]!)) i++;
    if (i >= len || casesStr[i] !== "{") break;

    i++;
    const bodyStart = i;
    let depth = 1;
    while (i < len && depth > 0) {
      if (casesStr[i] === "{") depth++;
      else if (casesStr[i] === "}") depth--;
      if (depth > 0) i++;
    }
    const body = casesStr.slice(bodyStart, i);
    i++;

    if (selector) {
      cases.set(selector, body);
    }
  }

  return cases;
}

export function resolveIcu(
  template: string,
  params: Record<string, any> | undefined,
  lang: string,
  context: IcuResolveContext,
  _depth = 0,
): string {
  if (!template.includes("{")) {
    return template;
  }
  if (_depth > 16) {
    context.onError?.(
      new I18nError(
        I18nErrorCode.FORMATTING_ERROR,
        `ICU nesting depth exceeded (max 16) in template: "${template}".`,
      ),
    );
    return template;
  }

  let result = "";
  let i = 0;
  const len = template.length;

  while (i < len) {
    if (template[i] === "{") {
      const start = i;
      let depth = 1;
      i++;
      while (i < len && depth > 0) {
        if (template[i] === "{") depth++;
        else if (template[i] === "}") depth--;
        if (depth > 0) i++;
      }

      if (depth === 0) {
        const fullExpr = template.slice(start, i + 1);
        const inner = template.slice(start + 1, i);
        i++;

        const commas: number[] = [];
        let innerDepth = 0;
        for (let j = 0; j < inner.length; j++) {
          if (inner[j] === "{") innerDepth++;
          else if (inner[j] === "}") innerDepth--;
          else if (inner[j] === "," && innerDepth === 0) {
            commas.push(j);
          }
        }

        if (commas.length >= 2) {
          const firstComma = commas[0]!;
          const secondComma = commas[1]!;
          const argName = inner.slice(0, firstComma).trim();
          const formatType = inner
            .slice(firstComma + 1, secondComma)
            .trim()
            .toLowerCase();
          const casesOrStyle = inner.slice(secondComma + 1);

          if (formatType === "select") {
            const cases = parseIcuCases(casesOrStyle);
            const rawVal = params?.[argName];
            const val =
              rawVal !== undefined && rawVal !== null ? String(rawVal) : "";
            let branch = cases.get(val);
            if (branch === undefined) {
              branch = cases.get("other") ?? "";
            }
            result += resolveIcu(branch, params, lang, context, _depth + 1);
          } else if (formatType === "selectordinal") {
            const cases = parseIcuCases(casesOrStyle);
            const rawVal = params?.[argName];
            const numVal =
              typeof rawVal === "number" ? rawVal : Number(rawVal) || 0;
            const exactKey = `=${numVal}`;
            let branch = cases.get(exactKey);
            if (branch === undefined) {
              const category = context.getOrdinalCategory(lang, numVal);
              branch = cases.get(category);
              if (branch === undefined) {
                branch = cases.get("other") ?? "";
              }
            }
            const branchWithNum = branch.replace(/#/g, String(numVal));
            result += resolveIcu(
              branchWithNum,
              params,
              lang,
              context,
              _depth + 1,
            );
          } else if (formatType === "plural") {
            const cases = parseIcuCases(casesOrStyle);
            const rawVal = params?.[argName];
            const numVal =
              typeof rawVal === "number" ? rawVal : Number(rawVal) || 0;
            const exactKey = `=${numVal}`;
            let branch = cases.get(exactKey);
            if (branch === undefined) {
              const category = context.getPluralCategory(lang, numVal);
              branch = cases.get(category);
              if (branch === undefined) {
                branch = cases.get("other") ?? "";
              }
            }
            const branchWithNum = branch.replace(/#/g, String(numVal));
            result += resolveIcu(
              branchWithNum,
              params,
              lang,
              context,
              _depth + 1,
            );
          } else if (formatType === "number" && context.formatter) {
            const rawVal = params?.[argName];
            const numVal =
              typeof rawVal === "number" || typeof rawVal === "bigint"
                ? rawVal
                : Number(rawVal) || 0;
            const style = casesOrStyle.trim();
            result += context.formatter.number(numVal, style);
          } else if (
            (formatType === "date" || formatType === "time") &&
            context.formatter
          ) {
            const rawVal = params?.[argName];
            const dateVal =
              rawVal instanceof Date || typeof rawVal === "number"
                ? rawVal
                : new Date(rawVal ?? Date.now());
            const style = casesOrStyle.trim();
            result += context.formatter.dateTime(dateVal, style);
          } else {
            result += fullExpr;
          }
        } else if (commas.length === 1) {
          const firstComma = commas[0]!;
          const argName = inner.slice(0, firstComma).trim();
          const formatType = inner
            .slice(firstComma + 1)
            .trim()
            .toLowerCase();

          if (formatType === "number" && context.formatter) {
            const rawVal = params?.[argName];
            const numVal =
              typeof rawVal === "number" || typeof rawVal === "bigint"
                ? rawVal
                : Number(rawVal) || 0;
            result += context.formatter.number(numVal);
          } else if (
            (formatType === "date" || formatType === "time") &&
            context.formatter
          ) {
            const rawVal = params?.[argName];
            const dateVal =
              rawVal instanceof Date || typeof rawVal === "number"
                ? rawVal
                : new Date(rawVal ?? Date.now());
            result += context.formatter.dateTime(
              dateVal,
              formatType === "time" ? { timeStyle: "medium" } : undefined,
            );
          } else {
            const val = params?.[argName];
            if (val !== undefined) {
              const strVal = String(val);
              result += context.escapeTags
                ? strVal.replace(/</g, "\uE000").replace(/>/g, "\uE001")
                : strVal;
            } else {
              result += fullExpr;
            }
          }
        } else {
          const colonIdx = inner.indexOf(":");
          const varName =
            colonIdx === -1 ? inner.trim() : inner.slice(0, colonIdx).trim();
          const val = params?.[varName];
          if (val !== undefined && typeof val !== "function") {
            const strVal = String(val);
            result += context.escapeTags
              ? strVal.replace(/</g, "\uE000").replace(/>/g, "\uE001")
              : strVal;
          } else {
            if (params !== undefined) {
              context.onError?.(
                new I18nError(
                  I18nErrorCode.FORMATTING_ERROR,
                  `The intl string context variable "${varName}" was not provided to the string "${template}".`,
                ),
              );
            }
            result += fullExpr;
          }
        }
      } else {
        result += template.slice(start);
        break;
      }
    } else {
      const textStart = i;
      while (i < len && template[i] !== "{") {
        i++;
      }
      result += template.slice(textStart, i);
    }
  }

  return result;
}
