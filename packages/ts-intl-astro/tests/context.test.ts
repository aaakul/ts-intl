import { describe, expect, it } from "vitest";
import {
  getActiveLocale,
  runWithLocale,
  setGlobalFallbackLanguage,
} from "../src/context";

describe("I18n Context Isolation", () => {
  it("returns default fallback when no context is active", () => {
    setGlobalFallbackLanguage("en-US");
    expect(getActiveLocale()).toBe("en-US");
    expect(getActiveLocale("custom-fallback")).toBe("custom-fallback");
  });

  it("retrieves active locale within runWithLocale", () => {
    runWithLocale("zh-Hans", () => {
      expect(getActiveLocale()).toBe("zh-Hans");
    });
    expect(getActiveLocale()).toBe("en-US");
  });

  it("guarantees isolation during concurrent asynchronous executions", async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const task1 = runWithLocale("zh-Hans", async () => {
      expect(getActiveLocale()).toBe("zh-Hans");
      await delay(20);
      expect(getActiveLocale()).toBe("zh-Hans");
      return getActiveLocale();
    });

    const task2 = runWithLocale("ja-JP", async () => {
      expect(getActiveLocale()).toBe("ja-JP");
      await delay(10);
      expect(getActiveLocale()).toBe("ja-JP");
      return getActiveLocale();
    });

    const task3 = runWithLocale("en-US", async () => {
      expect(getActiveLocale()).toBe("en-US");
      await delay(30);
      expect(getActiveLocale()).toBe("en-US");
      return getActiveLocale();
    });

    const [res1, res2, res3] = await Promise.all([task1, task2, task3]);
    expect(res1).toBe("zh-Hans");
    expect(res2).toBe("ja-JP");
    expect(res3).toBe("en-US");
  });
});
