import { describe, it, expectTypeOf } from "vitest";
import {
  createI18n,
  ExtractPlaceholders,
  ExtractTags,
  I18nConfig,
} from "../src/index";

const en = {
  common: {
    title: "Title",
    greeting: "Hello, {name}!",
    typed: "Count: {count:number}, Label: {label:string}",
    items: { one: "1 item", other: "{count} items" },
    terms: "Please read <link>Terms of Service</link>",
    mixed: "{name:string}, please check <bold>Notice</bold>",
    tags_list: ["secure", "lightweight", "open-source"],
  },
} as const;

const es = {
  common: {
    title: "Título",
    greeting: "¡Hola, {name}!",
    typed: "Cantidad: {count:number}, Etiqueta: {label:string}",
    items: { one: "1 elemento", other: "{count} elementos" },
    terms: "Por favor lea los <link>Términos de Servicio</link>",
    mixed: "{name:string}, por favor revise el <bold>Aviso</bold>",
    tags_list: ["seguro", "ligero", "código abierto"],
  },
} as const;

const i18n = createI18n({
  defaultLanguage: "en",
  messages: { en, es },
});

const { getTranslations } = i18n;

// ── Feature 2: Typed Placeholders ──
describe("Typed Placeholders", () => {
  it("ExtractPlaceholders removes type annotations and extracts only parameter names", () => {
    type Result =
      ExtractPlaceholders<"Hello {name:string}, count: {count:number}">;
    expectTypeOf<Result>().toEqualTypeOf<"name" | "count">();
  });

  it("extracts original parameter name when no type annotation is present", () => {
    type Result = ExtractPlaceholders<"Hello {name}">;
    expectTypeOf<Result>().toEqualTypeOf<"name">();
  });

  it("returns never when there are no placeholders", () => {
    type Result = ExtractPlaceholders<"Hello world">;
    expectTypeOf<Result>().toEqualTypeOf<never>();
  });

  it("infers native TypeScript types for annotated parameters", () => {
    const t = getTranslations("en", "common");
    expectTypeOf(t<"typed">)
      .parameter(1)
      .toEqualTypeOf<{ count: number; label: string }>();
  });
});

// ── Feature 3: Strict Parameter Presence ──
describe("Strict Parameter Presence", () => {
  it("disallows second argument when key has no placeholders", () => {
    const t = getTranslations("en", "common");
    t("title");
    // @ts-expect-error No parameters allowed when template has no placeholders
    t("title", {});
  });

  it("requires parameter argument when key has placeholders", () => {
    const t = getTranslations("en", "common");
    t("greeting", { name: "test" });
    // @ts-expect-error Parameters required when template has placeholders
    t("greeting");
  });

  it("requires count for plural object keys", () => {
    const t = getTranslations("en", "common");
    t("items", { count: 1 });
    // @ts-expect-error Plural object requires count
    t("items");
  });

  it("requires render callback for tag keys", () => {
    const t = getTranslations("en", "common");
    t("terms", { link: (c: string) => c });
    // @ts-expect-error Tag keys require render callbacks
    t("terms");
  });
});

// ── Feature 4: Cross-Language Placeholder Matching ──
describe("Cross-Language Placeholder Matching", () => {
  it("compiles successfully when placeholders match across languages", () => {
    createI18n({
      defaultLanguage: "en",
      messages: {
        en: { msg: "Hello {name}" } as const,
        es: { msg: "Hola {name}" } as const,
      },
    });
  });

  it("fails type check when placeholders do not match across languages", () => {
    createI18n({
      defaultLanguage: "en",
      messages: {
        en: { msg: "Hello {name}" } as const,
        // @ts-expect-error Placeholder mismatch: name vs nane
        es: { msg: "Hola {nane}" } as const,
      },
    });
  });

  it("fails type check when plural placeholders do not match", () => {
    createI18n({
      defaultLanguage: "en",
      messages: {
        en: { items: { one: "1 item", other: "{count} items" } } as const,
        // @ts-expect-error Plural placeholder mismatch: count vs cnt
        es: { items: { one: "1 elemento", other: "{cnt} elementos" } } as const,
      },
    });
  });
});

// ── Feature 1+6: Pluralization Safety ──
describe("Pluralization Safety", () => {
  it("requires count: number for plural object keys", () => {
    const t = getTranslations("en", "common");
    expectTypeOf(t<"items">)
      .parameter(1)
      .toEqualTypeOf<{ count: number }>();
  });
});

// ── Feature 5: Rich Text Tags ──
describe("Rich Text Tags", () => {
  it("ExtractTags extracts tag names correctly", () => {
    type Result =
      ExtractTags<"Please <link>click here</link> and <bold>confirm</bold>">;
    expectTypeOf<Result>().toEqualTypeOf<"link" | "bold">();
  });

  it("returns never when there are no tags", () => {
    type Result = ExtractTags<"Hello world">;
    expectTypeOf<Result>().toEqualTypeOf<never>();
  });

  it("requires callback functions for tag keys", () => {
    const t = getTranslations("en", "common");
    expectTypeOf(t<"terms">)
      .parameter(1)
      .toEqualTypeOf<{ link: (children: string) => string }>();
  });

  it("infers correct types for mixed tag and placeholder keys", () => {
    const t = getTranslations("en", "common");
    expectTypeOf(t<"mixed">)
      .parameter(1)
      .toEqualTypeOf<{
        name: string;
        bold: (children: string) => string;
      }>();
  });
});

// ── t.rich Type Inference ──
describe("t.rich Type Inference", () => {
  it("supports explicit generic return type for nodes", () => {
    const t = getTranslations("en", "common");
    interface MockNode {
      type: string;
      children: string | MockNode | (string | MockNode)[];
    }
    const result = t.rich<"terms", MockNode>("terms", {
      link: (children): MockNode => ({ type: "a", children }),
    });
    expectTypeOf(result).toEqualTypeOf<(string | MockNode)[]>();
  });

  it("defaults return type to (string | any)[]", () => {
    const t = getTranslations("en", "common");
    const result = t.rich("terms", {
      link: (children) => ({ type: "a", children }),
    });
    expectTypeOf(result).toBeArray();

    const titleResult = t.rich("title");
    expectTypeOf(titleResult).toBeArray();
  });
});

// ── t.raw Type Inference ──
describe("t.raw Type Inference", () => {
  it("infers exact raw types from the dictionary", () => {
    const t = getTranslations("en", "common");
    expectTypeOf(t.raw("items")).toEqualTypeOf<{
      readonly one: "1 item";
      readonly other: "{count} items";
    }>();
    expectTypeOf(t.raw("tags_list")).toEqualTypeOf<
      readonly ["secure", "lightweight", "open-source"]
    >();
    expectTypeOf(t.raw("title")).toEqualTypeOf<"Title">();
  });
});

// ── Leaves Path & Flat Translator Inference ──
describe("Leaves Path & Flat Translator Inference", () => {
  it("extracts all leaf paths from nested objects", () => {
    const t = i18n.getTranslations("en");
    t("common.greeting", { name: "test" });
    // @ts-expect-error Missing required parameter
    t("common.greeting");
  });

  it("extracts all keys from flat dictionaries", () => {
    const flat = {
      title: "Title",
      welcome: "Hello, {name}!",
    } as const;

    const flatI18n = createI18n({
      defaultLanguage: "en",
      messages: {
        en: flat,
        es: { title: "Título", welcome: "¡Hola, {name}!" } as const,
      },
    });
    const t = flatI18n.getTranslations("en");
    t("title");
    t("welcome", { name: "World" });
    // @ts-expect-error Missing 'name' parameter
    t("welcome");
  });
});

// ── I18nConfig Interface Checks ──
describe("I18nConfig Interface Checks", () => {
  it("properly constrains defaultLanguage and messages structure", () => {
    type Config = I18nConfig<"en", { en: { hello: "Hello" } }>;
    expectTypeOf<Config["defaultLanguage"]>().toEqualTypeOf<"en">();
    expectTypeOf<Config["messages"]>().toEqualTypeOf<{
      en: { hello: "Hello" };
    }>();
  });
});

// ── Nested Tags & Multiple Placeholders Type Inference ──
describe("Nested Tags & Multiple Placeholders Type Inference", () => {
  it("ExtractTags extracts nested, self-closing, and adjacent tags while ignoring closing tags", () => {
    type Nested =
      ExtractTags<"<p>System notice: <warn>Security alert</warn>. Refer to <note>Documentation</note></p>">;
    expectTypeOf<Nested>().toEqualTypeOf<"p" | "warn" | "note">();

    type SelfClosing = ExtractTags<"Text <br/> and <img src='test' />">;
    expectTypeOf<SelfClosing>().toEqualTypeOf<"br" | "img">();
  });

  it("infers required object type for multiple placeholders", () => {
    const userDict = {
      transfer: "Transfer from {source} to {target}",
      endpoints: { local: "Local Storage", cloud: "Cloud Storage" },
    } as const;

    const testI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: userDict },
    });
    const t = testI18n.getTranslations("en");

    expectTypeOf(t<"transfer">)
      .parameter(1)
      .toEqualTypeOf<{ source: string | number; target: string | number }>();

    t("transfer", { source: "local", target: "cloud" });
  });

  it("infers optional parameter tuple for wide string dictionaries without 'as const'", () => {
    const jsonDict = {
      transfer: "Transfer from {source} to {target}",
      endpoints: { local: "Local Storage" },
    };

    const dynamicI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: jsonDict },
    });
    const t = dynamicI18n.getTranslations("en");

    t("transfer", { source: "local", target: "cloud" });
    t("transfer");
  });

  it("provides contextual type inference for nested rich-text callbacks in t.rich", () => {
    const complexDict = {
      system: {
        alert:
          "<p>Security notice: Your account has <warn>unusual sign-ins</warn>. Check logs.</p><p>Maintenance: System upgrades on <note>Sunday midnight</note>. Service is <note>temporarily suspended</p>",
      },
    } as const;

    const richI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: complexDict },
    });
    const t = richI18n.getTranslations("en");

    t.rich("system.alert", {
      p: (children) => ({ type: "p", children }),
      note: (children) => ({ type: "note", children }),
      warn: (children) => ({ type: "warn", children }),
    });
  });

  it("provides contextual type inference for JSON dictionaries in t.rich without implicit any", () => {
    const jsonDict = {
      system: {
        alert:
          "<p>Security notice: Your account has <warn>unusual sign-ins</warn>. Check logs.</p>",
      },
    };

    const richI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: jsonDict },
    });

    const tFlat = richI18n.getTranslations("en");
    tFlat.rich("system.alert", {
      p: (children) => ({ type: "p", children }),
      warn: (children) => ({ type: "warn", children }),
    });

    const tNamespace = richI18n.getTranslations("en", "system");
    tNamespace.rich("alert", {
      p: (children) => ({ type: "p", children }),
      warn: (children) => ({ type: "warn", children }),
    });
  });
});

// ── Strict Key Validation ──
describe("Strict Key Validation", () => {
  it("rejects nonexistent or misspelled keys in t(), t.rich(), and t.markup()", () => {
    const t = i18n.getTranslations("en", "common");

    // @ts-expect-error Reject misspelled key
    t("title_typo");
    // @ts-expect-error Reject key outside namespace
    t("available.title");
    // @ts-expect-error Reject misspelled key in t.rich
    t.rich("title_typo");
    // @ts-expect-error Reject misspelled key in t.markup
    t.markup("title_typo");
  });
});

// ── Nested Namespaces ──
describe("Nested Namespaces", () => {
  const deepDict = {
    dashboard: {
      analytics: {
        table: {
          title: "Summary Report",
          row_desc: "Row {num:number}: {label:string}",
        },
      },
    },
    list: ["a", "b"],
  } as const;

  const deepI18n = createI18n({
    defaultLanguage: "en",
    messages: { en: deepDict },
  });

  it("supports multi-level dot-separated namespaces", () => {
    const t = deepI18n.getTranslations("en", "dashboard.analytics.table");

    t("title");
    t("row_desc", { num: 1, label: "Users" });

    // @ts-expect-error Reject invalid child key
    t("not_exist");
    // @ts-expect-error Missing parameter
    t("row_desc");
  });

  it("infers sub-paths from intermediate namespaces", () => {
    const t = deepI18n.getTranslations("en", "dashboard.analytics");
    t("table.title");
    t("table.row_desc", { num: 2, label: "Revenue" });

    // @ts-expect-error Reject invalid sub-path
    t("table.wrong");
  });
});

// ── Standard Plural Rule Types ──
describe("Standard Plural Rule Types", () => {
  it("supports plural objects with standard PluralCategory keys", () => {
    const pluralDict = {
      arabic_items: {
        zero: "No items",
        one: "1 item",
        two: "2 items",
        few: "A few items",
        many: "Many items",
        other: "{count:number} items",
      },
    } as const;

    const pluralI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: pluralDict },
    });

    const t = pluralI18n.getTranslations("en");
    t("arabic_items", { count: 3 });
    // @ts-expect-error Missing count parameter
    t("arabic_items");
  });
});

// ── Ordinal Plural Type Inference (selectordinal) ──
describe("Ordinal Plural Type Inference (selectordinal)", () => {
  it("ExtractPlaceholders extracts ordinal parameter name while ignoring # symbol", () => {
    type Msg =
      "It's your {year, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} birthday!";
    type Result = ExtractPlaceholders<Msg>;
    expectTypeOf<Result>().toEqualTypeOf<"year">();
  });

  it("strictly infers number type for selectordinal parameter", () => {
    const ordinalDict = {
      birthday:
        "It's your {year, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} birthday!",
      exact: "{rank, selectordinal, =1 {1st} other {#th}}",
    } as const;

    const ordI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: ordinalDict },
    });

    const t = ordI18n.getTranslations("en");
    expectTypeOf(t<"birthday">)
      .parameter(1)
      .toEqualTypeOf<{ year: number }>();

    t("birthday", { year: 1 });

    // @ts-expect-error Missing 'year' parameter
    t("birthday");

    // @ts-expect-error Invalid parameter type
    t("birthday", { year: "first" });
  });
});

// ── Enum-based Value Selection Type Inference (select) ──
describe("Enum-based Value Selection Type Inference (select)", () => {
  it("ExtractPlaceholders extracts select parameter name", () => {
    type Msg =
      "{gender, select, female {She is} male {He is} other {They are}} online.";
    type Result = ExtractPlaceholders<Msg>;
    expectTypeOf<Result>().toEqualTypeOf<"gender">();
  });

  it("supports string type for select parameter and combinations with other parameters", () => {
    const selectDict = {
      status:
        "{gender, select, female {She is} male {He is} other {They are}} online.",
      label:
        "{locale, select, en_GB {British English} en_US {American English} other {Unknown}}",
      combined:
        "Hello, {name:string}! {gender, select, female {She is} male {He is} other {They are}} online.",
    } as const;

    const selI18n = createI18n({
      defaultLanguage: "en",
      messages: { en: selectDict },
    });

    const t = selI18n.getTranslations("en");

    t("status", { gender: "female" });
    t("status", { gender: "male" });

    const localeStr = "en-GB".replaceAll("-", "_");
    t("label", { locale: localeStr });
    t("label", { locale: "en_GB" });

    // @ts-expect-error Missing parameter
    t("status");

    expectTypeOf(t<"combined">)
      .parameter(1)
      .toEqualTypeOf<{ name: string; gender: string }>();

    t("combined", { name: "Alice", gender: "female" });
  });
});

// ── Cross-Language Placeholder Validation (select & selectordinal) ──
describe("Cross-Language Placeholder Validation (select & selectordinal)", () => {
  it("compiles cleanly when select and selectordinal placeholders match", () => {
    createI18n({
      defaultLanguage: "en",
      messages: {
        en: {
          msg: "It's your {year, selectordinal, one {#st} other {#th}} birthday!",
          role: "{role, select, admin {Admin} other {User}}",
        } as const,
        es: {
          msg: "¡Es tu {year, selectordinal, other {#}} cumpleaños!",
          role: "{role, select, admin {Administrador} other {Usuario}}",
        } as const,
      },
    });
  });

  it("fails type check when select placeholders do not match", () => {
    createI18n({
      defaultLanguage: "en",
      messages: {
        en: {
          role: "{role, select, admin {Admin} other {User}}",
        } as const,
        es: {
          // @ts-expect-error Mismatched placeholders: role vs userRole
          role: "{userRole, select, admin {Administrador} other {Usuario}}",
        } as const,
      },
    });
  });
});

// ── t.has and Formatter Type Checks ──
describe("t.has and Formatter Type Checks", () => {
  it("infers boolean return type for t.has", () => {
    const t = getTranslations("en", "common");
    expectTypeOf(t.has("title")).toEqualTypeOf<boolean>();
  });

  it("getFormatter returns Formatter interface", () => {
    const fmt = i18n.getFormatter("en");
    expectTypeOf(fmt.number(123)).toEqualTypeOf<string>();
    expectTypeOf(fmt.dateTime(new Date())).toEqualTypeOf<string>();
  });
});
