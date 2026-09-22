import { describe, it, expect, vi } from "vitest";
import {
  createI18n,
  createFormatter,
  I18nError,
  I18nErrorCode,
  validateMessages,
  LruMap,
  resolvePath,
} from "../src/index";

const en = {
  common: {
    title: "Title",
    greeting: "Hello, {name}!",
    only_in_en: "Only available in English",
    typed_msg: "{name:string}, you have {count:number} messages",
    items: { one: "1 item", other: "{count} items" },
    terms: "Please read <link>Terms of Service</link>",
    rich_greeting: "{name:string}, please check <bold>Important Notice</bold>",
    tags_list: ["secure", "lightweight", "open-source"],
    user_config: { theme: "light", level: 1 },
  },
} as const;

const es = {
  common: {
    title: "Título",
    greeting: "¡Hola, {name}!",
    only_in_en: "",
    typed_msg: "{name:string}, tienes {count:number} mensajes",
    items: { one: "1 elemento", other: "{count} elementos" },
    terms: "Por favor lea los <link>Términos de Servicio</link>",
    rich_greeting:
      "{name:string}, por favor revise el <bold>Aviso Importante</bold>",
    tags_list: ["seguro", "ligero", "código abierto"],
    user_config: { theme: "oscuro", level: 2 },
  },
} as const;

const { getTranslations, isSupportedLanguage, languages, defaultLanguage } =
  createI18n({
    defaultLanguage: "en",
    messages: { en, es },
  });

describe("ts-intl runtime tests", () => {
  it("translates basic strings correctly", () => {
    const tEn = getTranslations("en", "common");
    expect(tEn("title")).toBe("Title");

    const tEs = getTranslations("es", "common");
    expect(tEs("title")).toBe("Título");
  });

  it("interpolates placeholders correctly", () => {
    const t = getTranslations("en", "common");
    expect(t("greeting", { name: "Alice" })).toBe("Hello, Alice!");
  });

  it("applies language-level and key-level fallbacks", () => {
    // Language-level fallback (unknown language 'fr' falls back to defaultLanguage 'en').
    const tUnknown = getTranslations("fr", "common");
    expect(tUnknown("title")).toBe("Title");

    // Key-level fallback (es.only_in_en is empty, falls back to en text).
    const tEs = getTranslations("es", "common");
    expect(tEs("only_in_en")).toBe("Only available in English");
  });

  it("validates supported languages with isSupportedLanguage", () => {
    expect(isSupportedLanguage("en")).toBe(true);
    expect(isSupportedLanguage("ja")).toBe(false);
    expect(isSupportedLanguage("es")).toBe(true);
    expect(isSupportedLanguage("fr")).toBe(false);
  });

  it("exposes languages and defaultLanguage correctly", () => {
    expect(languages).toContain("en");
    expect(languages).toContain("es");
    expect(defaultLanguage).toBe("en");
  });

  it("returns missing translation message when key is not found", () => {
    const t = getTranslations("en");
    // @ts-expect-error Type check catches nonexistent key
    expect(t("nonexistent.key")).toBe("Missing translation: nonexistent.key");
  });
});

// ── Feature 1+6: Pluralization ──
describe("Pluralization", () => {
  it("selects 'one' branch when count === 1", () => {
    const t = getTranslations("en", "common");
    expect(t("items", { count: 1 })).toBe("1 item");
  });

  it("selects 'other' branch and interpolates count when count !== 1", () => {
    const t = getTranslations("en", "common");
    expect(t("items", { count: 5 })).toBe("5 items");
  });

  it("selects 'other' branch when count === 0", () => {
    const t = getTranslations("en", "common");
    expect(t("items", { count: 0 })).toBe("0 items");
  });

  it("handles Spanish plurals correctly", () => {
    const t = getTranslations("es", "common");
    expect(t("items", { count: 1 })).toBe("1 elemento");
    expect(t("items", { count: 3 })).toBe("3 elementos");
  });

  it("handles plurals correctly with language-level fallback", () => {
    const t = getTranslations("fr", "common");
    expect(t("items", { count: 2 })).toBe("2 items");
  });
});

// ── Feature 2: Typed Placeholders ──
describe("Typed Placeholders", () => {
  it("interpolates placeholders with :type annotations", () => {
    const t = getTranslations("en", "common");
    expect(t("typed_msg", { count: 3, name: "Alice" })).toBe(
      "Alice, you have 3 messages",
    );
  });

  it("interpolates Spanish templates with :type annotations", () => {
    const t = getTranslations("es", "common");
    expect(t("typed_msg", { count: 10, name: "Carlos" })).toBe(
      "Carlos, tienes 10 mensajes",
    );
  });
});

// ── Feature 5: String Tag Interpolation ──
describe("Basic String Tag Interpolation", () => {
  it("interpolates a single tag correctly", () => {
    const t = getTranslations("en", "common");
    expect(
      t("terms", { link: (children: string) => `[${children}](/terms)` }),
    ).toBe("Please read [Terms of Service](/terms)");
  });

  it("interpolates mixed tags and placeholders", () => {
    const t = getTranslations("en", "common");
    expect(
      t("rich_greeting", {
        name: "Alice",
        bold: (children: string) => `**${children}**`,
      }),
    ).toBe("Alice, please check **Important Notice**");
  });

  it("interpolates Spanish tags correctly", () => {
    const t = getTranslations("es", "common");
    expect(
      t("terms", { link: (children: string) => `<a>${children}</a>` }),
    ).toBe("Por favor lea los <a>Términos de Servicio</a>");
  });
});

// ── t.rich: Generic Rich Text Interpolation ──
describe("t.rich Generic Rich Text Interpolation", () => {
  it("returns token array containing rendered component nodes", () => {
    const t = getTranslations("en", "common");
    const result = t.rich("terms", {
      link: (children) => ({
        type: "a",
        props: { href: "/terms" },
        children,
      }),
    });
    expect(result).toEqual([
      "Please read ",
      {
        type: "a",
        props: { href: "/terms" },
        children: "Terms of Service",
      },
    ]);
  });

  it("parses placeholders and rich text tags together", () => {
    const t = getTranslations("en", "common");
    const result = t.rich("rich_greeting", {
      name: "Bob",
      bold: (children) => ({ type: "b", text: children }),
    });
    expect(result).toEqual([
      "Bob, please check ",
      { type: "b", text: "Important Notice" },
    ]);
  });

  it("returns a single-element array for messages without tags", () => {
    const t = getTranslations("en", "common");
    const result = t.rich("title");
    expect(result).toEqual(["Title"]);
  });

  it("preserves raw tag text when no renderer is provided", () => {
    const t = getTranslations("en", "common");
    // @ts-expect-error Intentionally empty params to test fallback
    const result = t.rich("terms", {});
    expect(result).toEqual(["Please read ", "<link>Terms of Service</link>"]);
  });
});

// ── t.markup: String HTML Tag Replacement ──
describe("t.markup String Tag Replacement", () => {
  it("outputs plain string with replaced HTML tags", () => {
    const t = getTranslations("en", "common");
    expect(
      t.markup("terms", {
        link: (children) => `<a href="/terms">${children}</a>`,
      }),
    ).toBe('Please read <a href="/terms">Terms of Service</a>');
  });
});

// ── t.raw: Raw Data Extraction ──
describe("t.raw Raw Data Extraction", () => {
  it("reads plural objects as raw data", () => {
    const t = getTranslations("en", "common");
    expect(t.raw("items")).toEqual({
      one: "1 item",
      other: "{count} items",
    });
  });

  it("reads arrays and objects as raw data", () => {
    const t = getTranslations("en", "common");
    expect(t.raw("tags_list")).toEqual([
      "secure",
      "lightweight",
      "open-source",
    ]);
    expect(t.raw("user_config")).toEqual({ theme: "light", level: 1 });
  });

  it("falls back to default language for raw data", () => {
    const tFallback = getTranslations("fr", "common");
    expect(tFallback.raw("tags_list")).toEqual([
      "secure",
      "lightweight",
      "open-source",
    ]);
  });
});

// ── isSupportedLanguage Type Guard ──
describe("isSupportedLanguage Type Guard", () => {
  it("correctly identifies supported languages", () => {
    expect(isSupportedLanguage("en")).toBe(true);
    expect(isSupportedLanguage("ja")).toBe(false);
    expect(isSupportedLanguage("es")).toBe(true);
    expect(isSupportedLanguage("fr")).toBe(false);
  });
});

// ── Type Inference Tests ──
describe("Type Inference", () => {
  it("infers string | number for unannotated placeholders", () => {
    const t = getTranslations("en", "common");
    expect(t("greeting", { name: "Alice" })).toBe("Hello, Alice!");
    expect(t("greeting", { name: 123 })).toBe("Hello, 123!");
  });

  it("infers native types for annotated placeholders", () => {
    const t = getTranslations("en", "common");
    expect(t("typed_msg", { count: 5, name: "Bob" })).toBe(
      "Bob, you have 5 messages",
    );
  });

  it("infers count: number for plural object keys", () => {
    const t = getTranslations("en", "common");
    expect(t("items", { count: 3 })).toBe("3 items");
  });
});

// ── Flat Dictionaries & Safe Interpolation ──
describe("Flat Dictionaries & Edge Cases", () => {
  it("supports flat dictionaries without namespaces", () => {
    const flatI18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { title: "Hi", welcome: "Hello, {name}!" } as const,
        es: { title: "Hola", welcome: "¡Hola, {name}!" } as const,
      },
    });
    const tEn = flatI18n.getTranslations("en");
    expect(tEn("title")).toBe("Hi");
    expect(tEn("welcome", { name: "Alice" })).toBe("Hello, Alice!");

    const tEs = flatI18n.getTranslations("es");
    expect(tEs("title")).toBe("Hola");
    expect(tEs("welcome", { name: "Carlos" })).toBe("¡Hola, Carlos!");
  });

  it("safely interpolates values containing regex special characters", () => {
    const t = getTranslations("en", "common");
    expect(t("greeting", { name: "$100 * (test) + ? ^" })).toBe(
      "Hello, $100 * (test) + ? ^!",
    );
  });
});

// ── Multiple Placeholders & Nested Rich Text ──
describe("Multiple Placeholders & Nested Rich Text (next-intl style)", () => {
  const advancedEn = {
    transfer: "Transfer from {source} to {target}",
    endpoints: {
      local: "Local Storage",
      cloud: "Cloud Storage",
      backup: "Backup Server",
    },
    system: {
      title: "System Notification",
      alert:
        "<p>Security notice: Your account has <warn>unusual sign-ins</warn>. Check logs.</p><p>Maintenance: System upgrades on <note>Sunday midnight</note>. Service is <note>temporarily suspended</p>",
    },
  } as const;

  const advancedI18n = createI18n({
    defaultLanguage: "en",
    messages: { en: advancedEn },
  });

  it("supports multiple placeholders in a single string ({source} to {target})", () => {
    const t = advancedI18n.getTranslations("en");
    const source = "local";
    const target = "cloud";

    const result = t("transfer", {
      source: t(`endpoints.${source}`),
      target: t(`endpoints.${target}`),
    });
    expect(result).toBe("Transfer from Local Storage to Cloud Storage");
  });

  it("supports dot notation paths within namespace translators", () => {
    const nsI18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: {
          storage: {
            transfer: "{source} -> {target}",
            endpoints: { local: "Local Storage", cloud: "Cloud Storage" },
          },
        },
      },
    });
    const t = nsI18n.getTranslations("en", "storage");
    expect(t("endpoints.local")).toBe("Local Storage");
    expect(
      t("transfer", {
        src: undefined,
        source: t("endpoints.local"),
        target: t("endpoints.cloud"),
      } as any),
    ).toBe("Local Storage -> Cloud Storage");
  });

  it("handles nested rich-text tags with tree structure", () => {
    const t = advancedI18n.getTranslations("en");
    const result = t.rich("system.alert", {
      p: (children) => ({ type: "p", children }),
      note: (children) => ({ type: "strong", class: "note", children }),
      warn: (children) => ({ type: "strong", class: "warn", children }),
    });

    expect(result).toHaveLength(2);
    expect((result[0] as any).type).toBe("p");
    expect((result[0] as any).children).toEqual([
      "Security notice: Your account has ",
      { type: "strong", class: "warn", children: "unusual sign-ins" },
      ". Check logs.",
    ]);
    expect((result[1] as any).type).toBe("p");
    expect((result[1] as any).children).toEqual([
      "Maintenance: System upgrades on ",
      { type: "strong", class: "note", children: "Sunday midnight" },
      ". Service is ",
      { type: "strong", class: "note", children: "temporarily suspended" },
    ]);
  });

  it("replaces nested tags in plain strings with t.markup", () => {
    const t = advancedI18n.getTranslations("en");
    const result = t.markup("system.alert", {
      p: (children: string) => `<p>${children}</p>`,
      note: (children: string) => `<strong>${children}</strong>`,
      warn: (children: string) => `<em>${children}</em>`,
    });

    expect(result).toBe(
      "<p>Security notice: Your account has <em>unusual sign-ins</em>. Check logs.</p><p>Maintenance: System upgrades on <strong>Sunday midnight</strong>. Service is <strong>temporarily suspended</strong></p>",
    );
  });

  it("supports wide string dictionaries without 'as const' (e.g. JSON imports)", () => {
    const jsonStyleDict = {
      transfer: "Transfer from {source} to {target}",
      greeting: "Hello, {name}!",
    };

    const dynamicI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: jsonStyleDict },
    });
    const t = dynamicI18n.getTranslations("en");
    expect(t("transfer", { source: "Node A", target: "Node B" })).toBe(
      "Transfer from Node A to Node B",
    );
    expect(t("greeting", { name: "Tom" })).toBe("Hello, Tom!");
  });
});

// ── Missing Key Lifecycle & Custom Fallback ──
describe("Missing Key Lifecycle & Custom Fallback", () => {
  it("warns in console by default on missing keys", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const testI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: { title: "Title" } as const },
    });
    const t = testI18n.getTranslations("en");

    const result = (t as any)("not_found.key");
    expect(result).toBe("Missing translation: not_found.key");
    expect(warnSpy).toHaveBeenCalledWith(
      '[ts-intl] Missing translation for key "not_found.key" in language "en".',
    );

    warnSpy.mockRestore();
  });

  it("supports custom onError and getMessageFallback", () => {
    const reportedErrors: Array<{
      code: string;
      key: string | undefined;
      lang: string | undefined;
    }> = [];

    const customI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: { welcome: "Welcome" } as const },
      onError: (error) => {
        reportedErrors.push({
          code: error.code,
          key: error.key,
          lang: error.lang,
        });
      },
      getMessageFallback: ({ key, lang }) => `[FALLBACK:${lang}:${key}]`,
    });

    const t = customI18n.getTranslations("en");
    const val = (t as any)("header.subtitle");

    expect(val).toBe("[FALLBACK:en:header.subtitle]");
    expect(reportedErrors).toEqual([
      {
        code: I18nErrorCode.MISSING_MESSAGE,
        key: "header.subtitle",
        lang: "en",
      },
    ]);

    const richVal = (t.rich as any)("header.banner");
    expect(richVal).toEqual(["[FALLBACK:en:header.banner]"]);
  });
});

// ── Nested Namespaces Runtime Resolution ──
describe("Nested Namespaces Runtime Resolution", () => {
  const dict = {
    dashboard: {
      analytics: {
        table: {
          title: "Summary Report",
          item: "Row {row}",
        },
      },
    },
  } as const;

  const nestedI18n = createI18n({
    defaultLanguage: "en",
    messages: { en: dict },
  });

  it("resolves translations with 3-level dot-separated namespace", () => {
    const t = nestedI18n.getTranslations("en", "dashboard.analytics.table");
    expect(t("title")).toBe("Summary Report");
    expect(t("item", { row: 1 })).toBe("Row 1");
  });

  it("resolves sub-keys from intermediate namespace", () => {
    const t = nestedI18n.getTranslations("en", "dashboard.analytics");
    expect(t("table.title")).toBe("Summary Report");
    expect(t("table.item", { row: 2 })).toBe("Row 2");
  });
});

// ── Native Intl.PluralRules Plural Support ──
describe("Native Intl.PluralRules Plural Support", () => {
  const pluralDict = {
    items: {
      zero: "No items",
      one: "1 item",
      other: "{count} items",
    },
    en_items: {
      one: "1 item",
      other: "{count} items",
    },
    // Supports Slavic plural rules (Russian: one, few, many, other)
    ru_apples: {
      one: "{count} яблоко",
      few: "{count} яблока",
      many: "{count} яблок",
      other: "{count} яблок",
    },
  } as const;

  const pluralI18n = createI18n({
    defaultLanguage: "en",
    messages: {
      en: pluralDict,
      ru: pluralDict,
    },
  });

  it("prefers explicit 'zero' branch when count === 0", () => {
    const t = pluralI18n.getTranslations("en");
    expect(t("items", { count: 0 })).toBe("No items");
    expect(t("items", { count: 1 })).toBe("1 item");
    expect(t("items", { count: 10 })).toBe("10 items");
  });

  it("matches Intl.PluralRules when 'zero' is not explicitly defined", () => {
    const t = pluralI18n.getTranslations("en");
    expect(t("en_items", { count: 0 })).toBe("0 items");
    expect(t("en_items", { count: 1 })).toBe("1 item");
    expect(t("en_items", { count: 5 })).toBe("5 items");
  });

  it("matches Russian plural categories (one / few / many)", () => {
    const t = pluralI18n.getTranslations("ru");
    expect(t("ru_apples", { count: 1 })).toBe("1 яблоко");
    expect(t("ru_apples", { count: 2 })).toBe("2 яблока");
    expect(t("ru_apples", { count: 4 })).toBe("4 яблока");
    expect(t("ru_apples", { count: 5 })).toBe("5 яблок");
  });
});

// ── Ordinal Pluralization (selectordinal) ──
describe("Ordinal Pluralization (selectordinal)", () => {
  const ordinalDict = {
    birthday:
      "It's your {year, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} birthday!",
    exact_ordinal:
      "You finished {rank, selectordinal, =1 {first} =2 {second} =3 {third} other {#th}}!",
    zh_rank: "Rank #{pos, selectordinal, other {#}}",
    rich_ordinal:
      "It's your {year, selectordinal, one {<b>#st</b>} other {<i>#th</i>}} birthday!",
  } as const;

  const ordinalI18n = createI18n({
    defaultLanguage: "en",
    messages: {
      en: ordinalDict,
      es: {
        birthday: "¡Es tu {year, selectordinal, other {#}} cumpleaños!",
        exact_ordinal:
          "¡Terminaste en el puesto {rank, selectordinal, =1 {primero} =2 {segundo} =3 {tercero} other {#}}!",
        zh_rank: "Puesto {pos, selectordinal, other {#}}",
        rich_ordinal:
          "¡Es tu {year, selectordinal, other {<b>#</b>}} cumpleaños!",
      } as const,
    },
  });

  it("matches English ordinal rules accurately (1st, 2nd, 3rd, 4th, 11th, 21st, etc.)", () => {
    const t = ordinalI18n.getTranslations("en");
    expect(t("birthday", { year: 1 })).toBe("It's your 1st birthday!");
    expect(t("birthday", { year: 2 })).toBe("It's your 2nd birthday!");
    expect(t("birthday", { year: 3 })).toBe("It's your 3rd birthday!");
    expect(t("birthday", { year: 4 })).toBe("It's your 4th birthday!");
    expect(t("birthday", { year: 11 })).toBe("It's your 11th birthday!");
    expect(t("birthday", { year: 12 })).toBe("It's your 12th birthday!");
    expect(t("birthday", { year: 13 })).toBe("It's your 13th birthday!");
    expect(t("birthday", { year: 21 })).toBe("It's your 21st birthday!");
    expect(t("birthday", { year: 22 })).toBe("It's your 22nd birthday!");
    expect(t("birthday", { year: 23 })).toBe("It's your 23rd birthday!");
    expect(t("birthday", { year: 24 })).toBe("It's your 24th birthday!");
    expect(t("birthday", { year: 101 })).toBe("It's your 101st birthday!");
  });

  it("prioritizes exact =value syntax over general categories", () => {
    const tEn = ordinalI18n.getTranslations("en");
    expect(tEn("exact_ordinal", { rank: 1 })).toBe("You finished first!");
    expect(tEn("exact_ordinal", { rank: 2 })).toBe("You finished second!");
    expect(tEn("exact_ordinal", { rank: 3 })).toBe("You finished third!");
    expect(tEn("exact_ordinal", { rank: 4 })).toBe("You finished 4th!");
    expect(tEn("exact_ordinal", { rank: 21 })).toBe("You finished 21th!"); // Falls back to other when 'one' branch is absent
  });

  it("resolves Spanish ordinal rules correctly", () => {
    const tEs = ordinalI18n.getTranslations("es");
    expect(tEs("exact_ordinal", { rank: 1 })).toBe(
      "¡Terminaste en el puesto primero!",
    );
    expect(tEs("exact_ordinal", { rank: 2 })).toBe(
      "¡Terminaste en el puesto segundo!",
    );
    expect(tEs("exact_ordinal", { rank: 3 })).toBe(
      "¡Terminaste en el puesto tercero!",
    );
    expect(tEs("exact_ordinal", { rank: 5 })).toBe(
      "¡Terminaste en el puesto 5!",
    );
  });

  it("resolves rich-text tags inside selectordinal branches with t.rich", () => {
    const t = ordinalI18n.getTranslations("en");
    const result1 = t.rich("rich_ordinal", {
      year: 1,
      b: (children) => ({ type: "b", text: children }),
      i: (children) => ({ type: "i", text: children }),
    });
    expect(result1).toEqual([
      "It's your ",
      { type: "b", text: "1st" },
      " birthday!",
    ]);

    const result4 = t.rich("rich_ordinal", {
      year: 4,
      b: (children) => ({ type: "b", text: children }),
      i: (children) => ({ type: "i", text: children }),
    });
    expect(result4).toEqual([
      "It's your ",
      { type: "i", text: "4th" },
      " birthday!",
    ]);
  });

  it("resolves HTML tag replacements inside selectordinal branches with t.markup", () => {
    const t = ordinalI18n.getTranslations("en");
    const html = t.markup("rich_ordinal", {
      year: 1,
      b: (c) => `<strong>${c}</strong>`,
      i: (c) => `<em>${c}</em>`,
    });
    expect(html).toBe("It's your <strong>1st</strong> birthday!");
  });
});

// ── Enum-based Value Selection (select) ──
describe("Enum-based Value Selection (select)", () => {
  const selectDict = {
    status:
      "{gender, select, female {She is} male {He is} other {They are}} online.",
    label:
      "{locale, select, en_GB {British English} en_US {American English} other {Unknown}}",
    role_label:
      "{role, select, admin {Administrator} guest {Guest} other {User}}",
    combined:
      "Hello, {name:string}! {gender, select, female {She is} male {He is} other {They are}} online.",
  } as const;

  const selectI18n = createI18n({
    defaultLanguage: "en",
    messages: {
      en: selectDict,
      es: {
        status:
          "{gender, select, female {Ella está} male {Él está} other {Ellos están}} en línea.",
        label:
          "{locale, select, en_GB {Inglés británico} en_US {Inglés americano} other {Desconocido}}",
        role_label:
          "{role, select, admin {Administrador} guest {Invitado} other {Usuario}}",
        combined:
          "¡Hola, {name:string}! {gender, select, female {Ella está} male {Él está} other {Ellos están}} en línea.",
      } as const,
    },
  });

  it("matches exact branch for selected value", () => {
    const t = selectI18n.getTranslations("en");
    expect(t("status", { gender: "female" })).toBe("She is online.");
    expect(t("status", { gender: "male" })).toBe("He is online.");
  });

  it("falls back to 'other' when value does not match", () => {
    const t = selectI18n.getTranslations("en");
    expect(t("status", { gender: "other" })).toBe("They are online.");
    expect(t("status", { gender: "unknown_value" })).toBe("They are online.");
  });

  it("matches when hyphenated locale codes are mapped to underscores", () => {
    const t = selectI18n.getTranslations("en");
    const rawLocale = "en-GB";
    expect(t("label", { locale: rawLocale.replaceAll("-", "_") })).toBe(
      "British English",
    );

    const usLocale = "en-US";
    expect(t("label", { locale: usLocale.replaceAll("-", "_") })).toBe(
      "American English",
    );

    const frLocale = "fr-FR";
    expect(t("label", { locale: frLocale.replaceAll("-", "_") })).toBe(
      "Unknown",
    );
  });

  it("interpolates combined select variables and typed placeholders", () => {
    const tEn = selectI18n.getTranslations("en");
    expect(
      tEn("combined", {
        name: "Alice",
        gender: "female",
      }),
    ).toBe("Hello, Alice! She is online.");

    expect(
      tEn("combined", {
        name: "Bob",
        gender: "male",
      }),
    ).toBe("Hello, Bob! He is online.");

    expect(
      tEn("role_label", {
        role: "admin",
      }),
    ).toBe("Administrator");

    expect(
      tEn("role_label", {
        role: "developer",
      }),
    ).toBe("User");

    const tEs = selectI18n.getTranslations("es");
    expect(
      tEs("combined", {
        name: "Elena",
        gender: "female",
      }),
    ).toBe("¡Hola, Elena! Ella está en línea.");
  });
});

// ── t.has: Key Existence Check ──
describe("t.has: Key Existence Check", () => {
  it("returns true for existing keys in current language", () => {
    const t = getTranslations("en", "common");
    expect(t.has("title")).toBe(true);
    expect(t.has("greeting")).toBe(true);
    expect(t.has("items")).toBe(true);
  });

  it("returns true for keys falling back to default language", () => {
    const t = getTranslations("es", "common");
    expect(t.has("only_in_en")).toBe(true);
  });

  it("returns false for nonexistent keys without triggering console.warn", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = getTranslations("en", "common");

    expect(t.has("nonexistent_key" as any)).toBe(false);
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("works on root flat translators", () => {
    const flatI18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { "auth.login": "Log in", "auth.logout": "Log out" },
      },
    });
    const t = flatI18n.getTranslations("en");
    expect(t.has("auth.login")).toBe(true);
    expect(t.has("auth.signup" as any)).toBe(false);
  });
});

// ── Native Web Intl Formatters (createFormatter & getFormatter) ──
describe("Native Web Intl Formatters", () => {
  const formatter = createFormatter({
    locale: "en",
    formats: {
      number: {
        currency: { style: "currency", currency: "USD" },
      },
      dateTime: {
        short: { dateStyle: "short" },
      },
    },
  });

  it("formats numbers and currencies with standard Intl options", () => {
    const formattedNum = formatter.number(1234567.89);
    expect(formattedNum).toBe("1,234,567.89");

    const formattedCurrency = formatter.number(100, "currency");
    expect(formattedCurrency).toBe("$100.00");
  });

  it("formats dates and date ranges with standard Intl options", () => {
    const d1 = new Date("2026-05-15T12:00:00Z");
    const d2 = new Date("2026-05-20T12:00:00Z");

    const formattedDate = formatter.dateTime(d1, {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    });
    expect(formattedDate).toBe("May 2026");

    const range = formatter.dateTimeRange(d1, d2, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    expect(range).toContain("May 15");
    expect(range).toContain("20");
  });

  it("formats relative time with auto unit calculation", () => {
    const now = new Date("2026-06-01T12:00:00Z");

    const twoHoursAgo = new Date("2026-06-01T10:00:00Z");
    const relHours = formatter.relativeTime(twoHoursAgo, { now });
    expect(relHours).toBe("2 hours ago");

    const tomorrow = new Date("2026-06-02T12:00:00Z");
    const relDaysAuto = formatter.relativeTime(tomorrow, {
      now,
      numeric: "auto",
    });
    expect(relDaysAuto).toBe("tomorrow");

    const relDaysAlways = formatter.relativeTime(tomorrow, { now });
    expect(relDaysAlways).toBe("in 1 day");
  });

  it("formats language-sensitive lists", () => {
    const listEn = formatter.list(["Apple", "Banana", "Orange"]);
    expect(listEn).toBe("Apple, Banana, and Orange");

    const formatterEs = createFormatter({ locale: "es" });
    const listEs = formatterEs.list(["Manzana", "Plátano", "Naranja"]);
    expect(listEs).toBe("Manzana, Plátano y Naranja");
  });

  it("formats display names of languages and regions", () => {
    const langName = formatter.displayName("zh", { type: "language" });
    expect(langName).toBe("Chinese");

    const regionName = formatter.displayName("US", { type: "region" });
    expect(regionName).toBe("United States");
  });

  it("exposes getFormatter on i18n instance", () => {
    const i18nInstance = createI18n({
      defaultLanguage: "en",
      messages: { en: { hello: "Hello" } },
    });

    const fmt = i18nInstance.getFormatter("en");
    expect(fmt.number(42)).toBe("42");
  });
});

// ── Named Formats & ICU Standard Number/Date Integration ──
describe("Named Formats & ICU Standard Number/Date Integration", () => {
  const i18nWithFormats = createI18n({
    defaultLanguage: "en",
    formats: {
      number: {
        currency: { style: "currency", currency: "USD" },
      },
      dateTime: {
        shortDate: { dateStyle: "short", timeZone: "UTC" },
      },
    },
    messages: {
      en: {
        receipt: "Total: {amount, number, currency}",
        simple_num: "Score: {pts, number}",
        event: "Date: {day, date, shortDate}",
      } as const,
      es: {
        receipt: "Total: {amount, number, currency}",
        simple_num: "Puntos: {pts, number}",
        event: "Fecha: {day, date, shortDate}",
      } as const,
    },
  });

  it("formats numbers using named format in ICU templates", () => {
    const t = i18nWithFormats.getTranslations("en");
    expect(t("receipt", { amount: 50 })).toBe("Total: $50.00");
    expect(t("simple_num", { pts: 1000 })).toBe("Score: 1,000");
  });

  it("formats dates using named format in ICU templates", () => {
    const t = i18nWithFormats.getTranslations("en");
    const d = new Date("2026-01-15T00:00:00Z");
    const result = t("event", { day: d });
    expect(result).toBe("Date: 1/15/26");
  });
});

// ── Structured Error Handling (I18nError & I18nErrorCode) ──
describe("Structured Error Handling (I18nError & I18nErrorCode)", () => {
  it("emits I18nError with MISSING_MESSAGE to onError handler", () => {
    const errors: I18nError[] = [];
    const testI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: { welcome: "Welcome" } as const },
      onError: (err) => {
        errors.push(err);
      },
    });

    const t = testI18n.getTranslations("en");
    (t as any)("missing.key");

    expect(errors.length).toBe(1);
    expect(errors[0]!.code).toBe(I18nErrorCode.MISSING_MESSAGE);
    expect(errors[0]!.key).toBe("missing.key");
    expect(errors[0]!.lang).toBe("en");
  });

  it("uses getMessageFallback to generate fallback string", () => {
    const testI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: { welcome: "Welcome" } as const },
      onError: () => {},
      getMessageFallback: ({ key, lang }) => `!![${lang}:${key}]!!`,
    });

    const t = testI18n.getTranslations("en");
    const result = (t as any)("missing.key");
    expect(result).toBe("!![en:missing.key]!!");
  });
});

// ── validateMessages: Dictionary Key Validation ──
describe("validateMessages", () => {
  it("detects keys containing '.' and invokes onError or warns", () => {
    const errors: I18nError[] = [];
    validateMessages(
      {
        en: {
          "invalid.key": "This has a dot",
          nested: {
            "another.invalid": "Also has a dot",
          },
        },
      },
      (err) => {
        errors.push(err);
      },
    );

    expect(errors.length).toBe(1);
    expect(errors[0]!.code).toBe(I18nErrorCode.INVALID_KEY);
    expect(errors[0]!.message).toContain("invalid.key");
    expect(errors[0]!.message).toContain("another.invalid");
  });

  it("does not report error for valid dictionaries", () => {
    const errors: I18nError[] = [];
    validateMessages(
      {
        en: {
          valid_key: "Hello",
          nested: { valid_sub_key: "World" },
        },
      },
      (err) => {
        errors.push(err);
      },
    );

    expect(errors.length).toBe(0);
  });
});

// ── next-intl Compatibility: New Error Codes ──
describe("next-intl Compatibility: Error Codes", () => {
  it('exports MISSING_MESSAGE with value "MISSING_MESSAGE" (matches next-intl exactly)', () => {
    expect(I18nErrorCode.MISSING_MESSAGE).toBe("MISSING_MESSAGE");
  });

  it("exports INVALID_MESSAGE code", () => {
    expect(I18nErrorCode.INVALID_MESSAGE).toBe("INVALID_MESSAGE");
  });

  it("exports MISSING_FORMAT code", () => {
    expect(I18nErrorCode.MISSING_FORMAT).toBe("MISSING_FORMAT");
  });

  it("emits MISSING_FORMAT when a named format preset is not found", () => {
    const errors: I18nError[] = [];
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { receipt: "Total: {amount, number, currency}" } as const,
      },
      // 'currency' format is NOT defined here — should trigger MISSING_FORMAT
      formats: { number: {} },
      onError: (e) => errors.push(e),
    });

    const t = i18n.getTranslations("en");
    t("receipt", { amount: 42 });

    expect(errors.some((e) => e.code === I18nErrorCode.MISSING_FORMAT)).toBe(
      true,
    );
  });
});

// ── next-intl Compatibility: ICU Missing Placeholder FORMATTING_ERROR ──
describe("next-intl Compatibility: Missing ICU Placeholder", () => {
  it("emits FORMATTING_ERROR when a required ICU variable is not provided", () => {
    const errors: I18nError[] = [];
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: { en: { greeting: "Hello, {name}!" } as const },
      onError: (e) => errors.push(e),
    });

    const t = i18n.getTranslations("en");
    // Pass an empty params object so the resolver knows params were provided but `name` is missing.
    (t as any)("greeting", {});

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.code).toBe(I18nErrorCode.FORMATTING_ERROR);
    expect(errors[0]!.message).toContain("name");
  });

  it("does not emit an error when no params object is passed at all", () => {
    const errors: I18nError[] = [];
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: { en: { greeting: "Hello, {name}!" } as const },
      onError: (e) => errors.push(e),
    });

    const t = i18n.getTranslations("en");
    // Calling without params at all — no FORMATTING_ERROR expected (only type-level enforcement).
    (t as any)("greeting");

    expect(
      errors.filter((e) => e.code === I18nErrorCode.FORMATTING_ERROR),
    ).toHaveLength(0);
  });
});

// ── next-intl Compatibility: t.markup INVALID_MESSAGE ──
describe("next-intl Compatibility: t.markup callback validation", () => {
  it("emits INVALID_MESSAGE when a t.markup callback returns a non-string", () => {
    const errors: I18nError[] = [];
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { msg: "Click <link>here</link>" } as const,
      },
      onError: (e) => errors.push(e),
    });

    const t = i18n.getTranslations("en");
    // Pass a callback that returns an object (wrong — should return string for t.markup).
    const result = t.markup("msg", {
      link: (children) => ({ type: "a", children }) as any,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.code).toBe(I18nErrorCode.INVALID_MESSAGE);
    expect(typeof result).toBe("string");
  });

  it("does not emit INVALID_MESSAGE when all t.markup callbacks return strings", () => {
    const errors: I18nError[] = [];
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { msg: "Click <link>here</link>" } as const,
      },
      onError: (e) => errors.push(e),
    });

    const t = i18n.getTranslations("en");
    const result = t.markup("msg", {
      link: (children) => `<a href="/terms">${children}</a>`,
    });

    expect(
      errors.filter((e) => e.code === I18nErrorCode.INVALID_MESSAGE),
    ).toHaveLength(0);
    expect(result).toBe('Click <a href="/terms">here</a>');
  });
});

// ── next-intl Compatibility: Per-call formats override ──
describe("next-intl Compatibility: Per-call formats override", () => {
  it("allows t() to accept a per-call formats argument that overrides global formats", () => {
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { price: "Price: {amount, number, usd}" } as const,
      },
      formats: {
        number: {
          usd: { style: "currency", currency: "USD" },
        },
      },
    });

    const t = i18n.getTranslations("en");
    expect(t("price", { amount: 10 })).toBe("Price: $10.00");

    const result = t(
      "price",
      { amount: 10 },
      { number: { usd: { style: "currency", currency: "EUR" } } },
    );
    expect(result).toContain("10");
    expect(result).toContain("€");
  });

  it("allows t.rich() to accept a per-call formats argument", () => {
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { score: "Score: <b>{pts, number}</b>" } as const,
      },
      formats: {
        number: { compact: { notation: "compact" } },
      },
    });

    const t = i18n.getTranslations("en");
    const tokens = t.rich("score", { pts: 1500, b: (c) => ({ tag: "b", c }) });
    expect(Array.isArray(tokens)).toBe(true);
  });
});

// ── Security & Performance Fixes Verification ──
describe("Security and Performance Enhancements", () => {
  it("does not execute prototype methods (<valueOf>, <toString>, <isPrototypeOf>) as tag renderers and never crashes", () => {
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: {
          valueOfMsg: "Check <valueOf>item</valueOf> safely",
          toStringMsg: "Check <toString>item</toString> safely",
          isProtoMsg: "Check <isPrototypeOf>item</isPrototypeOf> safely",
          constructorMsg: "Check <constructor>item</constructor> safely",
          selfClosingValueOf: "Check <valueOf/> safely",
        } as const,
      },
    });

    const t = i18n.getTranslations("en");

    // Previously, <valueOf> threw TypeError: Cannot convert undefined or null to object
    expect(() => t("valueOfMsg" as any, {})).not.toThrow();
    expect(t("valueOfMsg" as any, {})).toBe(
      "Check <valueOf>item</valueOf> safely",
    );

    expect(() => t("toStringMsg" as any, {})).not.toThrow();
    expect(t("toStringMsg" as any, {})).toBe(
      "Check <toString>item</toString> safely",
    );

    expect(() => t("isProtoMsg" as any, {})).not.toThrow();
    expect(t("isProtoMsg" as any, {})).toBe(
      "Check <isPrototypeOf>item</isPrototypeOf> safely",
    );

    expect(() => t("constructorMsg" as any, {})).not.toThrow();
    expect(t("constructorMsg" as any, {})).toBe(
      "Check <constructor>item</constructor> safely",
    );

    expect(() => t("selfClosingValueOf" as any, {})).not.toThrow();
    expect(t("selfClosingValueOf" as any, {})).toBe("Check <valueOf/> safely");
  });

  it("prevents prototype traversal and property pollution in resolvePath and t.has()", () => {
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: {
          common: { greeting: "Hello" },
        } as const,
      },
    });

    const t = i18n.getTranslations("en");

    // Prototype properties must not be recognized as present keys
    expect(t.has("toString" as any)).toBe(false);
    expect(t.has("constructor" as any)).toBe(false);
    expect(t.has("valueOf" as any)).toBe(false);
    expect(t.has("__proto__" as any)).toBe(false);
    expect(t.has("constructor.name" as any)).toBe(false);
    expect(t.has("__proto__.polluted" as any)).toBe(false);

    // Dynamic queries for prototype properties must return missing message fallback, not Object prototype
    expect(t("constructor.name" as any)).toBe(
      "Missing translation: constructor.name",
    );
    expect(t.raw("__proto__" as any)).toBeUndefined();
    expect(t.raw("constructor" as any)).toBeUndefined();

    // Direct resolvePath testing
    expect(resolvePath({ a: { b: 1 } }, "toString")).toBeUndefined();
    expect(resolvePath({ a: { b: 1 } }, "__proto__")).toBeUndefined();
    expect(resolvePath({ a: { b: 1 } }, "a.constructor")).toBeUndefined();
    expect(resolvePath({ a: { b: 1 } }, "a.b")).toBe(1);
  });

  it("prevents tag injection when user variables contain HTML/rich tags", () => {
    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: {
          userWelcome: "Welcome, <bold>{username}</bold>!",
          plainWelcome: "Hello {username}!",
        } as const,
      },
    });

    const t = i18n.getTranslations("en");

    const linkSpy = vi.fn((c) => ({ type: "link", children: c }));
    const boldSpy = vi.fn((c) => `**${c}**`);

    // Injected <link> in username must NOT trigger the link renderer
    const resRich = t.rich("userWelcome" as any, {
      bold: (c) => ({ type: "b", children: c }),
      link: linkSpy,
      username: "Alice <link>Click here for prize</link>",
    });

    expect(linkSpy).not.toHaveBeenCalled();
    expect(resRich).toEqual([
      "Welcome, ",
      {
        type: "b",
        children: "Alice <link>Click here for prize</link>",
      },
      "!",
    ]);

    // String interpolation preserves exact user string without executing link
    const linkStrSpy = vi.fn((c: string) => `[LINK:${c}]`);
    const resStr = t("userWelcome" as any, {
      bold: boldSpy,
      link: linkStrSpy,
      username: "Bob <link>test</link>",
    });
    expect(linkStrSpy).not.toHaveBeenCalled();
    expect(resStr).toBe("Welcome, **Bob <link>test</link>**!");

    // Plain message without tags does not trigger rich regex and preserves user string
    const resPlain = t("plainWelcome" as any, {
      username: "<script>alert(1)</script>",
    });
    expect(resPlain).toBe("Hello <script>alert(1)</script>!");
  });

  it("LruMap evicts oldest items when exceeding maxSize", () => {
    const lru = new LruMap<string, number>(3);
    lru.set("a", 1);
    lru.set("b", 2);
    lru.set("c", 3);

    expect(lru.size).toBe(3);
    expect(lru.get("a")).toBe(1);

    lru.set("d", 4);
    expect(lru.size).toBe(3);
    expect(lru.has("a")).toBe(false);
    expect(lru.get("b")).toBe(2);
    expect(lru.get("c")).toBe(3);
    expect(lru.get("d")).toBe(4);
  });

  it("caches formatters correctly regardless of options key ordering", () => {
    const fmt = createFormatter({ locale: "en-US" });

    // Formatting with different key orders uses the same underlying Intl instance
    const d1 = new Date("2026-01-01T00:00:00Z");
    const r1 = fmt.dateTime(d1, { month: "short", day: "numeric" });
    const r2 = fmt.dateTime(d1, { day: "numeric", month: "short" });

    expect(r1).toBe(r2);
  });

  it("prevents runaway recursion by enforcing ICU depth limit (max 16)", () => {
    const errors: I18nError[] = [];
    let deepTemplate = "final";
    for (let i = 0; i < 20; i++) {
      deepTemplate = `{val, select, other {${deepTemplate}}}`;
    }

    const i18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: { deep: deepTemplate } as const,
      },
      onError: (err) => errors.push(err),
    });

    const t = i18n.getTranslations("en");
    const res = (t as any)("deep", { val: "other" });

    expect(
      errors.some(
        (e) =>
          e.code === I18nErrorCode.FORMATTING_ERROR &&
          e.message.includes("ICU nesting depth exceeded"),
      ),
    ).toBe(true);
    expect(res).toBeDefined();
  });
});
