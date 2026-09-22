/* eslint-disable @typescript-eslint/no-explicit-any */
import { I18nError, I18nErrorCode } from "./errors";

function validateSegment(
  messages: Record<string, any>,
  invalidKeys: string[],
  parentPath?: string,
): void {
  for (const [key, value] of Object.entries(messages)) {
    const fullPath = parentPath ? `${parentPath}.${key}` : key;
    if (key.includes(".")) {
      invalidKeys.push(fullPath);
    }
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof value.other !== "string"
    ) {
      validateSegment(value, invalidKeys, fullPath);
    }
  }
}

/**
 * Validates message catalogs to detect unsupported characters (like '.') in key names.
 * Runs only in non-production environments to avoid production runtime overhead.
 */
export function validateMessages(
  messages: Record<string, any>,
  onError?: (error: I18nError) => void,
): void {
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "production"
  ) {
    return;
  }

  const invalidKeys: string[] = [];
  for (const [lang, langMessages] of Object.entries(messages)) {
    if (langMessages && typeof langMessages === "object") {
      validateSegment(langMessages, invalidKeys, lang);
    }
  }

  if (invalidKeys.length > 0) {
    const message =
      `[ts-intl] Translation keys cannot contain '.' as it is reserved for nested paths. ` +
      `Invalid keys: ${invalidKeys.map((k) => `"${k}"`).join(", ")}`;
    const error = new I18nError(I18nErrorCode.INVALID_KEY, message);
    if (onError) {
      onError(error);
    } else {
      console.warn(message);
    }
  }
}
