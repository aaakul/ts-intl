import loader from "@monaco-editor/loader";
import { transform } from "sucrase";
import { h, Fragment, render } from "preact";
import * as tsIntl from "@aaakul/ts-intl";
import { TEMPLATES } from "./templates";

// Use jsdelivr CDN for monaco-editor assets
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

const JSX_TYPES = `
declare function h(type: any, props?: any, ...children: any[]): any;
declare const Fragment: any;
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  type Element = any;
}
`;

const FALLBACK_DTS = `
export type Formats = any;
export type I18nConfig<TDefaultLanguage extends string = string, TLanguages = any> = {
  defaultLanguage: TDefaultLanguage;
  messages: TLanguages;
  formats?: any;
  timeZone?: string;
  onError?: (error: any) => void;
  getMessageFallback?: (info: any) => string;
};
export type Translator<T = any> = {
  (key: string, params?: Record<string, any>, formats?: Formats): string;
  rich<R = any>(key: string, params?: Record<string, any>, formats?: Formats): (string | R)[];
  markup(key: string, params?: Record<string, any>, formats?: Formats): string;
  raw(key: string): any;
  has(key: string): boolean;
};
export type Formatter = {
  number(value: number, formatOrOptions?: any, overrides?: any): string;
  dateTime(date: Date | number, formatOrOptions?: any, overrides?: any): string;
  dateTimeRange(start: Date | number, end: Date | number, formatOrOptions?: any, overrides?: any): string;
  relativeTime(date: Date | number, nowOrOptions?: any): string;
  list(items: string[], formatOrOptions?: any, overrides?: any): string;
  displayName(code: string, formatOrOptions?: any, overrides?: any): string;
};
export declare function createI18n<TDefaultLanguage extends string, TLanguages extends Record<TDefaultLanguage, Record<string, any>>>(config: I18nConfig<TDefaultLanguage, TLanguages>): {
  languages: readonly string[];
  defaultLanguage: TDefaultLanguage;
  getTranslations: (lang: string, namespace?: string) => Translator;
  isSupportedLanguage: (lang: string) => boolean;
  getFormatter: (lang?: string) => Formatter;
};
`;

let dtsCache: string | null = null;

async function fetchTsIntlDts(): Promise<string> {
  if (dtsCache) return dtsCache;
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@aaakul/ts-intl@latest/dist/index.d.ts",
    );
    if (res.ok) {
      dtsCache = await res.text();
      return dtsCache;
    }
  } catch (e) {
    console.warn(
      "[playground] CDN fetch failed, using fallback declarations",
      e,
    );
  }
  return FALLBACK_DTS;
}

export interface PlaygroundInstance {
  setTab: (tab: "messages" | "app") => void;
  reset: () => void;
  destroy: () => void;
}

export interface InitPlaygroundOptions {
  container: HTMLElement;
  previewContainer: HTMLElement;
  errorContainer: HTMLElement;
  errorText: HTMLElement;
  lang?: string;
  onReady?: () => void;
}

export async function createPlayground(
  options: InitPlaygroundOptions,
): Promise<PlaygroundInstance> {
  const {
    container,
    previewContainer,
    errorContainer,
    errorText,
    lang = "en-US",
    onReady,
  } = options;

  const template = TEMPLATES[lang] || TEMPLATES["en-US"];

  // 1. Initialize Monaco from CDN
  const monaco = await loader.init();

  // 2. Configure TypeScript compiler options
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2022,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    jsxFactory: "h",
    jsxFragmentFactory: "Fragment",
    reactNamespace: "h",
    allowJs: true,
    strict: false,
  });

  // 3. Inject JSX types & CDN ts-intl types
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    JSX_TYPES,
    "file:///global.d.ts",
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    JSX_TYPES,
    "file:///node_modules/@types/react/index.d.ts",
  );

  const dtsContent = await fetchTsIntlDts();
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    dtsContent,
    "file:///node_modules/@aaakul/ts-intl/index.d.ts",
  );

  // 4. Create Models
  const messagesUri = monaco.Uri.parse("file:///messages.ts");
  const appUri = monaco.Uri.parse("file:///App.tsx");

  let messagesModel = monaco.editor.getModel(messagesUri);
  if (!messagesModel) {
    messagesModel = monaco.editor.createModel(
      template.messages,
      "typescript",
      messagesUri,
    );
  } else {
    messagesModel.setValue(template.messages);
  }

  let appModel = monaco.editor.getModel(appUri);
  if (!appModel) {
    appModel = monaco.editor.createModel(template.app, "typescript", appUri);
  } else {
    appModel.setValue(template.app);
  }

  // 5. Create Editor
  const isDark = document.documentElement.classList.contains("dark");
  const editor = monaco.editor.create(container, {
    model: messagesModel,
    theme: isDark ? "vs-dark" : "vs",
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 12.5,
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    tabSize: 2,
    renderLineHighlight: "all",
    fontFamily:
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif',
    quickSuggestions: true,
    hover: { enabled: true, delay: 200 },
    fixedOverflowWidgets: true,
    scrollbar: {
      verticalScrollbarSize: 6,
      horizontalScrollbarSize: 6,
    },
    padding: { top: 12, bottom: 12 },
  });

  // 6. Theme synchronization
  const observer = new MutationObserver(() => {
    const darkNow = document.documentElement.classList.contains("dark");
    monaco.editor.setTheme(darkNow ? "vs-dark" : "vs");
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // 7. Error handlers
  function showError(msg: string) {
    errorText.textContent = msg;
    errorContainer.classList.remove("hidden");
  }

  function hideError() {
    errorContainer.classList.add("hidden");
    errorText.textContent = "";
  }

  // 8. Code execution runner
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function runCode() {
    try {
      // Step A: Transpile messages.ts
      const rawMessagesCode = messagesModel.getValue();
      const compiledMessages = transform(rawMessagesCode, {
        transforms: ["typescript", "imports"],
      }).code;

      const messagesModule: any = { exports: {} };
      const runMessages = new Function(
        "module",
        "exports",
        "require",
        compiledMessages,
      );
      runMessages(messagesModule, messagesModule.exports, () => ({}));
      const messagesData =
        messagesModule.exports.default || messagesModule.exports;

      // Step B: Transpile App.tsx
      const rawAppCode = appModel.getValue();
      const compiledApp = transform(rawAppCode, {
        transforms: ["typescript", "jsx", "imports"],
        jsxRuntime: "classic",
        jsxPragma: "h",
        jsxFragmentPragma: "Fragment",
      }).code;

      const appModule: any = { exports: {} };
      const customRequire = (specifier: string) => {
        if (
          specifier === "@aaakul/ts-intl" ||
          specifier === "ts-intl" ||
          specifier.startsWith("@aaakul/ts-intl")
        ) {
          return { __esModule: true, default: tsIntl, ...tsIntl };
        }
        if (
          specifier === "./messages" ||
          specifier === "./messages.ts" ||
          specifier === "messages"
        ) {
          return { __esModule: true, default: messagesData, ...messagesData };
        }
        throw new Error(`Module '${specifier}' is not available in sandbox`);
      };

      const runApp = new Function(
        "module",
        "exports",
        "require",
        "h",
        "Fragment",
        compiledApp,
      );
      runApp(appModule, appModule.exports, customRequire, h, Fragment);

      const Component = appModule.exports.default || appModule.exports.App;
      if (!Component || typeof Component !== "function") {
        throw new Error(
          "App.tsx must export a default function component (e.g. export default function App() { ... })",
        );
      }

      // Step C: Render Preact Component
      render(h(Component, null), previewContainer);
      hideError();
    } catch (err: any) {
      showError(err.message || String(err));
    }
  }

  let jsxDecorations: string[] = [];

  function highlightJsx() {
    const model = editor.getModel();
    if (!model || !model.uri.path.endsWith(".tsx")) {
      jsxDecorations = editor.deltaDecorations(jsxDecorations, []);
      return;
    }

    const text = model.getValue();
    const newDecorations: any[] = [];

    // Match tags: <tag, </tag, >, />
    const tagRegex = /(<\/?[a-zA-Z][a-zA-Z0-9.-]*)|(\/?>)/g;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const matchStr = match[0];
      const startPos = model.getPositionAt(matchIndex);
      const endPos = model.getPositionAt(matchIndex + matchStr.length);

      if (match[1]) {
        const isClosing = matchStr.startsWith("</");
        const prefixLen = isClosing ? 2 : 1;
        const tagName = matchStr.slice(prefixLen);
        const bracketEnd = model.getPositionAt(matchIndex + prefixLen);

        newDecorations.push({
          range: new monaco.Range(
            startPos.lineNumber,
            startPos.column,
            bracketEnd.lineNumber,
            bracketEnd.column,
          ),
          options: { inlineClassName: "monaco-jsx-bracket" },
        });

        const isComponent = tagName[0] === tagName[0].toUpperCase();
        newDecorations.push({
          range: new monaco.Range(
            bracketEnd.lineNumber,
            bracketEnd.column,
            endPos.lineNumber,
            endPos.column,
          ),
          options: {
            inlineClassName: isComponent
              ? "monaco-jsx-component"
              : "monaco-jsx-tag",
          },
        });
      } else if (match[2]) {
        newDecorations.push({
          range: new monaco.Range(
            startPos.lineNumber,
            startPos.column,
            endPos.lineNumber,
            endPos.column,
          ),
          options: { inlineClassName: "monaco-jsx-bracket" },
        });
      }
    }

    // Match attributes: e.g. className=, onClick=
    const attrRegex = /\b([a-zA-Z_][a-zA-Z0-9_-]*)(?=\s*=)/g;
    while ((match = attrRegex.exec(text)) !== null) {
      const startPos = model.getPositionAt(match.index);
      const endPos = model.getPositionAt(match.index + match[1].length);
      newDecorations.push({
        range: new monaco.Range(
          startPos.lineNumber,
          startPos.column,
          endPos.lineNumber,
          endPos.column,
        ),
        options: { inlineClassName: "monaco-jsx-attr" },
      });
    }

    jsxDecorations = editor.deltaDecorations(jsxDecorations, newDecorations);
  }

  function scheduleRun() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      runCode();
      highlightJsx();
    }, 300);
  }

  messagesModel.onDidChangeContent(scheduleRun);
  appModel.onDidChangeContent(() => {
    highlightJsx();
    scheduleRun();
  });

  // Initial execution
  runCode();
  highlightJsx();
  if (onReady) onReady();

  return {
    setTab(tab: "messages" | "app") {
      if (tab === "messages") {
        editor.setModel(messagesModel);
      } else {
        editor.setModel(appModel);
      }
      highlightJsx();
      editor.focus();
    },
    reset() {
      messagesModel.setValue(template.messages);
      appModel.setValue(template.app);
      runCode();
      highlightJsx();
    },
    destroy() {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
      jsxDecorations = editor.deltaDecorations(jsxDecorations, []);
      editor.dispose();
    },
  };
}
