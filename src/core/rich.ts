/* eslint-disable @typescript-eslint/no-explicit-any */

interface StackFrame<R> {
  tag: string;
  rawOpen: string;
  children: (string | R)[];
}

/**
 * Parses rich-text tags hierarchically, supporting arbitrary nesting, self-closing tags, and unclosed tag recovery.
 */
export function renderRichHierarchy<R>(
  templateWithVars: string,
  params?: Record<string, any>,
): (string | R)[] {
  if (!templateWithVars.includes("<")) {
    return [templateWithVars];
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

    const renderer = params?.[tagName];

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
          const frameRenderer = params?.[frame.tag];
          const innerChildren =
            frame.children.length === 0
              ? ""
              : frame.children.every((c) => typeof c === "string")
                ? (frame.children as string[]).join("")
                : frame.children.length === 1
                  ? frame.children[0]
                  : frame.children;

          const rendered =
            typeof frameRenderer === "function"
              ? frameRenderer(innerChildren)
              : [frame.rawOpen, ...frame.children, `</${frame.tag}>`].join("");

          currentFrame().children.push(rendered);
        }
      } else {
        currentFrame().children.push(fullMatch);
      }
    } else if (isSelfClosing) {
      if (typeof renderer === "function") {
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
    const frameRenderer = params?.[frame.tag];
    const innerChildren =
      frame.children.length === 0
        ? ""
        : frame.children.every((c) => typeof c === "string")
          ? (frame.children as string[]).join("")
          : frame.children.length === 1
            ? frame.children[0]
            : frame.children;

    const rendered =
      typeof frameRenderer === "function"
        ? frameRenderer(innerChildren)
        : [frame.rawOpen, ...frame.children].join("");

    currentFrame().children.push(rendered);
  }

  return root.children;
}
