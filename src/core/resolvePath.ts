/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Resolves nested object properties using dot notation (e.g. 'common.buttons.submit').
 */
export function resolvePath(obj: any, path: string): any {
  if (!obj) return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path];
  }
  return path
    .split(".")
    .reduce(
      (acc: any, part: string) => (acc != null ? acc[part] : undefined),
      obj,
    );
}
