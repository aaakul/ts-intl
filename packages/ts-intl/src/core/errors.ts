export const I18nErrorCode = {
  /** Translation key not found in active or fallback dictionary. */
  MISSING_MESSAGE: "MISSING_MESSAGE",

  /** Key contains '.', which conflicts with dot-delimited namespace traversal. */
  INVALID_KEY: "INVALID_KEY",

  /** Tag callback in t.markup returned a non-string value. */
  INVALID_MESSAGE: "INVALID_MESSAGE",

  FORMATTING_ERROR: "FORMATTING_ERROR",

  /** Named format preset referenced in ICU expression not found in config.formats. */
  MISSING_FORMAT: "MISSING_FORMAT",
} as const;

export type I18nErrorCode = (typeof I18nErrorCode)[keyof typeof I18nErrorCode];

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
