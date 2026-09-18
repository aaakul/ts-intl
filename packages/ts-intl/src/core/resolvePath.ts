/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Resolves nested properties by dot-separated path.
 * Prototype properties (__proto__, prototype, constructor) are guarded against prototype pollution.
 */
export function resolvePath(obj: any, path: string): any {
  if (!obj) return undefined;
  if (path === "__proto__" || path === "prototype" || path === "constructor") {
    return undefined;
  }
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path];
  }

  let start = 0;
  let curr = obj;
  const len = path.length;

  while (start < len) {
    const dotIdx = path.indexOf(".", start);
    const key = dotIdx === -1 ? path.slice(start) : path.slice(start, dotIdx);

    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      return undefined;
    }
    if (curr == null || !Object.prototype.hasOwnProperty.call(curr, key)) {
      return undefined;
    }

    curr = curr[key];
    if (dotIdx === -1) break;
    start = dotIdx + 1;
  }

  return curr;
}
