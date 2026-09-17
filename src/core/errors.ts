/** Standard error codes emitted by ts-intl operations. */
export enum I18nErrorCode {
  /**
   * A required translation key or message could not be found.
   * Matches next-intl's IntlErrorCode.MISSING_MESSAGE.
   */
  MISSING_MESSAGE = "MISSING_MESSAGE",

  INVALID_KEY = "INVALID_KEY",
  /**
   * Emitted when `t.markup` receives a tag callback that returns a non-string value,
   * or when `t()` is used on a message that contains rich-text tags
   * and the result cannot be coerced to a plain string.
   * Matches next-intl's IntlErrorCode.INVALID_MESSAGE.
   */
  INVALID_MESSAGE = "INVALID_MESSAGE",

  FORMATTING_ERROR = "FORMATTING_ERROR",
  /**
   * Emitted when a named format preset (e.g. "currency" in `formats.number`)
   * is referenced in a message but not found in the global `formats` config.
   * Matches next-intl's IntlErrorCode.MISSING_FORMAT.
   */
  MISSING_FORMAT = "MISSING_FORMAT",
}

/**
 * Structured error class for internationalization errors.
 */
export class I18nError extends Error {
  readonly code: I18nErrorCode;
  readonly key?: string | undefined;
  readonly lang?: string | undefined;
  readonly originalError?: unknown;

  constructor(
    code: I18nErrorCode,
    message: string,
    options?: {
      key?: string | undefined;
      lang?: string | undefined;
      originalError?: unknown;
    },
  ) {
    super(message);
    this.name = "I18nError";
    this.code = code;
    this.key = options?.key;
    this.lang = options?.lang;
    this.originalError = options?.originalError;

    // Restore prototype chain for instanceof checks in older runtimes
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
