import { createI18n } from "@aaakul/ts-intl";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Creates a reference to the message using ts-intl.
 *
 * @example
 *   refMessage("message", { name: "Peter" })
 *   -> t("message", { name: "Peter" })
 */
export const refMessage = (key: string, params?: Record<string, string>) => {
  return `t("${key}"${params ? `, ${JSON.stringify(params)}` : ""})`;
};

export const importExpression = () =>
  `import { t } from "<src>/i18n/generated.ts";`;

export const getLocale = () => {
  if (typeof window !== "undefined") {
    return new URL(window.location.href).searchParams.get("locale") || "en";
  }
  return "en";
};

export const setLocale = (locale: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("locale", locale);
  window.location.href = url.toString();
};

let translator: ((key: string, params?: any) => string) | undefined;

export const t = (key: string, params?: any) => {
  if (!translator) {
    throw new Error("[ts-intl] Translator not initialized");
  }
  return translator(key, params);
};

export const init = async () => {
  if (typeof window !== "undefined") {
    // Browser client
    const currentLocale = getLocale();

    if (process.env.LIBRARY_MODE === "locale-splitting") {
      // Only load current locale chunk dynamically
      const mod = await import(`../../messages/${currentLocale}.json`);
      const messages = mod.default || mod;
      const i18n = createI18n({
        defaultLanguage: currentLocale,
        messages: { [currentLocale]: messages },
      });
      translator = i18n.getTranslations(currentLocale);
    } else {
      // Bundle all locales eagerly
      const jsonFiles: Record<string, { default: any }> = (
        import.meta as any
      ).glob("../../messages/*.json", {
        eager: true,
      });

      const messages: Record<string, any> = {};
      for (const [filepath, content] of Object.entries(jsonFiles)) {
        const locale = filepath
          .replace("../../messages/", "")
          .replace(".json", "");
        messages[locale] = content.default || content;
      }

      const i18n = createI18n({
        defaultLanguage: "en",
        messages: messages as any,
      });
      translator = i18n.getTranslations(currentLocale);
    }
  } else {
    // Server-side SSG prerendering in Node
    const currentLocale = "en";
    const messagesDir = path.resolve("./messages");

    if (process.env.LIBRARY_MODE === "locale-splitting") {
      const raw = await fs.readFile(
        path.join(messagesDir, `${currentLocale}.json`),
        "utf-8",
      );
      const msgs = JSON.parse(raw);
      const i18n = createI18n({
        defaultLanguage: currentLocale,
        messages: { [currentLocale]: msgs },
      });
      translator = i18n.getTranslations(currentLocale);
    } else {
      const files = await fs.readdir(messagesDir);
      const messages: Record<string, any> = {};
      for (const file of files) {
        if (file.endsWith(".json")) {
          const locale = file.replace(".json", "");
          const raw = await fs.readFile(path.join(messagesDir, file), "utf-8");
          messages[locale] = JSON.parse(raw);
        }
      }
      const i18n = createI18n({
        defaultLanguage: "en",
        messages: messages as any,
      });
      translator = i18n.getTranslations(currentLocale);
    }
  }
};

export const middleware = undefined;
