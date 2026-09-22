import { describe, expect, it, vi } from "vitest";
import { runWithLocale } from "../src/context";
import { createAstroI18n } from "../src/factory";
import tsIntlAstro from "../src/integration";
import { onRequest, setGlobalMiddlewareOptions } from "../src/middleware";
import { resolveRequestLocale } from "../src/resolver";

const enUS = {
  hero: {
    title: "Hello {name}!",
    badge: "New Release",
    items: {
      one: "1 item",
      other: "{count} items",
    },
  },
  common: {
    confirm: "Confirm",
  },
} as const;

const zhHans = {
  hero: {
    title: "你好 {name}！",
    badge: "新版本",
    items: {
      other: "{count} 项",
    },
  },
  common: {
    confirm: "确认",
  },
} as const;

describe("createAstroI18n & useTranslations", () => {
  const {
    useTranslations,
    useLocale,
    useFormatter,
    i18nMiddleware,
    languages,
    defaultLanguage,
  } = createAstroI18n({
    defaultLanguage: "en-US",
    messages: {
      "en-US": enUS,
      "zh-Hans": zhHans,
    },
  });

  it("exports configuration correctly", () => {
    expect(languages).toEqual(["en-US", "zh-Hans"]);
    expect(defaultLanguage).toBe("en-US");
  });

  it("translates using active locale without passing language prop", () => {
    runWithLocale("zh-Hans", () => {
      const t = useTranslations("hero");
      expect(useLocale()).toBe("zh-Hans");
      expect(t("title", { name: "Astro" })).toBe("你好 Astro！");
      expect(t("badge")).toBe("新版本");
    });

    runWithLocale("en-US", () => {
      const t = useTranslations("hero");
      expect(useLocale()).toBe("en-US");
      expect(t("title", { name: "Astro" })).toBe("Hello Astro!");
      expect(t("badge")).toBe("New Release");
    });
  });

  it("supports root namespace when no namespace is specified", () => {
    runWithLocale("zh-Hans", () => {
      const t = useTranslations();
      expect(t("common.confirm")).toBe("确认");
    });
  });

  it("allows explicit locale override when needed", () => {
    runWithLocale("zh-Hans", () => {
      const t = useTranslations("hero", { locale: "en-US" });
      expect(t("badge")).toBe("New Release");
    });
  });

  it("formats date/number with active locale via useFormatter", () => {
    runWithLocale("en-US", () => {
      const formatter = useFormatter();
      const num = formatter.number(123456.78);
      expect(num).toBe("123,456.78");
    });
  });

  it("falls back safely to defaultLanguage when no context is active", () => {
    const t = useTranslations("hero");
    expect(t("badge")).toBe("New Release");
  });

  it("caches translator instances for identical locale and namespace", () => {
    runWithLocale("zh-Hans", () => {
      const t1 = useTranslations("hero");
      const t2 = useTranslations("hero");
      expect(t1).toBe(t2);

      const tRoot1 = useTranslations();
      const tRoot2 = useTranslations();
      expect(tRoot1).toBe(tRoot2);
    });
  });

  it("middleware sets context.locals and runs wrapped inside AsyncLocalStorage", async () => {
    let capturedInsideLocale = "";

    const mockContext = {
      url: new URL("https://example.com/zh-Hans/about"),
      params: { lang: "zh-Hans" },
      locals: {},
    };

    const mockNext = async () => {
      capturedInsideLocale = useLocale();
      return new Response("OK");
    };

    const response = await i18nMiddleware(mockContext as any, mockNext);

    expect(response.status).toBe(200);
    expect(capturedInsideLocale).toBe("zh-Hans");
    expect((mockContext.locals as any).locale).toBe("zh-Hans");
  });
});

describe("resolveRequestLocale (Astro 3/4/5 cross-version compatibility)", () => {
  const options = {
    supportedLanguages: ["en-US", "zh-Hans", "ja-JP"],
    defaultLanguage: "en-US",
  };

  it("resolves context.currentLocale if available (Astro 3.5+)", () => {
    const res = resolveRequestLocale(
      {
        url: new URL("https://example.com/"),
        currentLocale: "ja-JP",
      },
      options,
    );
    expect(res).toBe("ja-JP");
  });

  it("resolves context.params.lang if available", () => {
    const res = resolveRequestLocale(
      {
        url: new URL("https://example.com/zh-Hans/index"),
        params: { lang: "zh-Hans" },
      },
      options,
    );
    expect(res).toBe("zh-Hans");
  });

  it("resolves from URL pathname when currentLocale/params are missing", () => {
    const res = resolveRequestLocale(
      {
        url: new URL("https://example.com/ja-JP/docs/intro"),
      },
      options,
    );
    expect(res).toBe("ja-JP");
  });

  it("handles complex, deeply nested paths and multiple consecutive slashes", () => {
    expect(
      resolveRequestLocale(
        { url: new URL("https://example.com///zh-Hans///deeply/nested/slug") },
        options,
      ),
    ).toBe("zh-Hans");

    expect(
      resolveRequestLocale(
        { url: new URL("https://example.com/ja-JP/") },
        options,
      ),
    ).toBe("ja-JP");

    expect(
      resolveRequestLocale({ url: new URL("https://example.com/") }, options),
    ).toBe("en-US");
  });

  it("falls back to defaultLanguage if no matching language is found", () => {
    const res = resolveRequestLocale(
      {
        url: new URL("https://example.com/unknown/route"),
      },
      options,
    );
    expect(res).toBe("en-US");
  });
});

describe("onRequest standalone middleware", () => {
  it("resolves locale using registered options", async () => {
    let captured = "";
    const ctx = {
      url: new URL("https://example.com/zh-Hans/page"),
      locals: {},
    };
    const next = async () => {
      captured = (ctx.locals as any).locale;
      return new Response("OK");
    };

    const res = await onRequest(ctx as any, next);
    expect(res.status).toBe(200);
    expect(captured).toBe("zh-Hans");
    expect((ctx.locals as any).lang).toBe("zh-Hans");
  });

  it("safely falls back when params are untrusted or options are unset", async () => {
    setGlobalMiddlewareOptions(undefined as any);
    const ctx = {
      url: new URL("https://example.com/"),
      params: { lang: "../../malicious" },
      locals: {},
    };
    await onRequest(ctx as any, async () => new Response("OK"));
    expect((ctx.locals as any).locale).toBe("en-US");

    const validCtx = {
      url: new URL("https://example.com/"),
      params: { lang: "fr-FR" },
      locals: {},
    };
    await onRequest(validCtx as any, async () => new Response("OK"));
    expect((validCtx.locals as any).locale).toBe("fr-FR");
  });
});

describe("tsIntlAstro integration", () => {
  it("registers middleware with pre order in astro:config:setup", () => {
    const integration = tsIntlAstro();
    expect(integration.name).toBe("ts-intl-astro");

    const addMiddleware = vi.fn();
    integration.hooks["astro:config:setup"]({ addMiddleware });

    expect(addMiddleware).toHaveBeenCalledWith({
      entrypoint: "ts-intl-astro/middleware",
      order: "pre",
    });
  });

  it("supports custom middleware entrypoint", () => {
    const integration = tsIntlAstro({
      middlewareEntrypoint: "./src/custom-middleware.ts",
    });
    const addMiddleware = vi.fn();
    integration.hooks["astro:config:setup"]({ addMiddleware });

    expect(addMiddleware).toHaveBeenCalledWith({
      entrypoint: "./src/custom-middleware.ts",
      order: "pre",
    });
  });

  it("warns when addMiddleware is unsupported", () => {
    const integration = tsIntlAstro();
    const warn = vi.fn();
    integration.hooks["astro:config:setup"]({
      logger: { warn },
    });
    expect(warn).toHaveBeenCalled();
  });
});
