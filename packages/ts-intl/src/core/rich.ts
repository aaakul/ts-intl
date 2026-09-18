/* eslint-disable @typescript-eslint/no-explicit-any */

interface StackFrame<R> {
  tag: string;
  rawOpen: string;
  children: (string | R)[];
}

function getOwnRenderer(
  params: Record<string, any> | undefined,
  tagName: string,
): ((children: any) => any) | undefined {
  if (!params || !tagName) return undefined;
  if (!Object.prototype.hasOwnProperty.call(params, tagName)) {
    return undefined;
  }
  const candidate = params[tagName];
  return typeof candidate === "function" ? candidate : undefined;
}

function unmaskTags(str: string): string {
  return str.includes("\uE000") || str.includes("\uE001")
    ? str.replace(/\uE000/g, "<").replace(/\uE001/g, ">")
    : str;
}

function unmaskValue<T>(val: T): T {
  if (typeof val === "string") {
    return unmaskTags(val) as unknown as T;
  }
  if (Array.isArray(val)) {
    return val.map((item) =>
      typeof item === "string" ? unmaskTags(item) : item,
    ) as unknown as T;
  }
  return val;
}

/**
 * Parses rich-text tags hierarchically, supporting arbitrary nesting, self-closing tags, and unclosed tag recovery.
 */
export function renderRichHierarchy<R>(
  templateWithVars: string,
  params?: Record<string, any>,
): (string | R)[] {
  if (!templateWithVars.includes("<")) {
    return [unmaskValue(templateWithVars)];
  }

  const tagRegex = /<(\/)?([a-zA-Z0-9_-]+)([^>]*)>/g;
  const root: StackFrame<R> = { tag: "", rawOpen: "", children: [] };
  const stack: StackFrame<R>[] = [root];
  const currentFrame = () => stack[stack.length - 1]!;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(templateWithVars)) !== null) {
    const fullMatch = match[0]!;
    const isClosing = Boolean(match[1]);
    const tagName = match[2]!;
    const restOfTag = match[3] ?? "";
    const matchIndex = match.index;
    const isSelfClosing = !isClosing && restOfTag.trim().endsWith("/");

    if (matchIndex > lastIndex) {
      currentFrame().children.push(
        templateWithVars.slice(lastIndex, matchIndex),
      );
    }
    lastIndex = matchIndex + fullMatch.length;

    const renderer = getOwnRenderer(params, tagName);

    if (isClosing) {
      let targetIdx = -1;
      for (let i = stack.length - 1; i >= 1; i--) {
        const frame = stack[i];
        if (frame && frame.tag === tagName) {
          targetIdx = i;
          break;
        }
      }

      if (targetIdx !== -1) {
        while (stack.length > targetIdx) {
          const frame = stack.pop()!;
          const frameRenderer = getOwnRenderer(params, frame.tag);
          const innerChildren =
            frame.children.length === 0
              ? ""
              : frame.children.every((c) => typeof c === "string")
                ? (frame.children as string[]).join("")
                : frame.children.length === 1
                  ? frame.children[0]
                  : frame.children;

          const rendered = frameRenderer
            ? frameRenderer(unmaskValue(innerChildren))
            : [
                frame.rawOpen,
                ...frame.children.map(unmaskValue),
                `</${frame.tag}>`,
              ].join("");

          currentFrame().children.push(rendered);
        }
      } else {
        currentFrame().children.push(fullMatch);
      }
    } else if (isSelfClosing) {
      if (renderer) {
        currentFrame().children.push(renderer(""));
      } else {
        currentFrame().children.push(fullMatch);
      }
    } else {
      stack.push({
        tag: tagName,
        rawOpen: fullMatch,
        children: [],
      });
    }
  }

  if (lastIndex < templateWithVars.length) {
    currentFrame().children.push(templateWithVars.slice(lastIndex));
  }

  while (stack.length > 1) {
    const frame = stack.pop()!;
    const frameRenderer = getOwnRenderer(params, frame.tag);
    const innerChildren =
      frame.children.length === 0
        ? ""
        : frame.children.every((c) => typeof c === "string")
          ? (frame.children as string[]).join("")
          : frame.children.length === 1
            ? frame.children[0]
            : frame.children;

    const rendered = frameRenderer
      ? frameRenderer(unmaskValue(innerChildren))
      : [frame.rawOpen, ...frame.children.map(unmaskValue)].join("");

    currentFrame().children.push(rendered);
  }

  return root.children.map(unmaskValue);
}
