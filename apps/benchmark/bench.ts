import { chromium } from "playwright";
import { builds, buildConfigToString } from "./build.config.ts";
import { startServer } from "./server.ts";
import fs from "node:fs";
import { runBuilds } from "./build.ts";

async function benchmarkBuild(url: string): Promise<number> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const responsePromises: Promise<number>[] = [];
  page.on("response", (response) => {
    if (response.status() >= 200 && response.status() < 400) {
      const promise = response
        .body()
        .then((body) => body.length)
        .catch(() => 0);
      responsePromises.push(promise);
    }
  });

  console.log(`Benchmarking ${url}`);

  await page.goto(url, { waitUntil: "networkidle" });

  const sizes = await Promise.all(responsePromises);
  const totalBytes = sizes.reduce((sum, size) => sum + size, 0);

  await browser.close();

  return totalBytes;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
}

function toMarkdownTable(headers: string[], rows: string[][]): string {
  const all = [headers, ...rows];
  const colWidths = headers.map((_, colIdx) =>
    Math.max(...all.map((row) => (row[colIdx] || "").length)),
  );
  const headerLine = `| ${headers.map((h, i) => h.padEnd(colWidths[i])).join(" | ")} |`;
  const separatorLine = `| ${colWidths.map((w) => "-".repeat(Math.max(w, 3))).join(" | ")} |`;
  const rowLines = rows.map(
    (row) =>
      `| ${row.map((cell, i) => cell.padEnd(colWidths[i])).join(" | ")} |`,
  );
  return [headerLine, separatorLine, ...rowLines].join("\n");
}

function sortLibraryKeys(a: string, b: string): number {
  const getPriority = (name: string) => {
    if (name.startsWith("ts-intl")) return 1;
    if (name.startsWith("paraglide")) return 2;
    if (name.startsWith("i18next")) return 3;
    return 4;
  };
  const pA = getPriority(a);
  const pB = getPriority(b);
  if (pA !== pB) return pA - pB;
  return a.localeCompare(b);
}

async function runBenchmarks() {
  if (!process.argv.includes("--skip-build") && !process.env.SKIP_BUILD) {
    await runBuilds();
  }

  const port = 8110;
  const server = startServer(port);

  const libraryModeMap = new Map<string, string>();
  for (const build of builds) {
    const key = `${build.library}-${build.libraryMode}`;
    const displayName = `${build.library} (${build.libraryMode})`;
    libraryModeMap.set(key, displayName);
  }

  const configResults = new Map<
    string,
    {
      locale: number;
      message: number;
      namespaceSize: number;
      results: Record<string, number>;
    }
  >();

  for (const build of builds) {
    const name = buildConfigToString(build);
    const size = await benchmarkBuild(`http://localhost:${port}/${name}`);
    const nsValue = build.namespaceSize ?? build.messages;
    const configKey = `l${build.locales}-m${build.messages}-ns${nsValue}`;

    let config = configResults.get(configKey);
    if (!config) {
      config = {
        locale: build.locales,
        message: build.messages,
        namespaceSize: nsValue,
        results: {},
      };
      configResults.set(configKey, config);
    }
    config.results[`${build.library}-${build.libraryMode}`] = size;
  }

  server.close();

  let markdownOutput =
    "# Benchmark Results\n\n" +
    "Summary of initial page network transfer sizes across i18n libraries, locales count, and namespace sizes under Vite SSG pre-rendering and client-side hydration.\n\n" +
    "Captured using Playwright Headless Chromium measuring successful HTTP responses until network idle.\n\n";

  const sortedConfigs = Array.from(configResults.entries()).sort((a, b) => {
    if (a[1].locale !== b[1].locale) return a[1].locale - b[1].locale;
    if (a[1].message !== b[1].message) return a[1].message - b[1].message;
    return (a[1].namespaceSize || 0) - (b[1].namespaceSize || 0);
  });

  for (const [, config] of sortedConfigs) {
    const hasResults = Object.values(config.results).some((size) => size > 0);
    if (!hasResults) continue;

    markdownOutput += `\`Locales: ${config.locale}\`  \n`;
    markdownOutput += `\`Used Messages: ${config.message}\`   \n`;
    markdownOutput += `\`Namespace Size: ${config.namespaceSize} (${(
      config.namespaceSize! / config.message
    ).toFixed(1)}x)\` \n\n`;

    const sortedEntries = Object.entries(config.results).sort((a, b) =>
      sortLibraryKeys(a[0], b[0]),
    );

    const tableRows: string[][] = [];
    for (const [key, size] of sortedEntries) {
      if (size === 0) continue;
      const displayName = libraryModeMap.get(key) || key;
      tableRows.push([displayName, formatBytes(size)]);
    }

    markdownOutput +=
      toMarkdownTable(["Library", "Total Transfer Size"], tableRows) + "\n\n";
  }

  const jsonData = {
    scenarios: sortedConfigs
      .filter(([, config]) =>
        Object.values(config.results).some((size) => size > 0),
      )
      .map(([, config]) => {
        const sortedEntries = Object.entries(config.results)
          .sort((a, b) => sortLibraryKeys(a[0], b[0]))
          .filter(([, size]) => size > 0);

        return {
          locales: config.locale,
          usedMessages: config.message,
          namespaceSize: config.namespaceSize,
          namespaceSizeFactor: parseFloat(
            (config.namespaceSize! / config.message).toFixed(1),
          ),
          results: sortedEntries.map(([key, size]) => ({
            library: libraryModeMap.get(key) || key,
            size: parseFloat((size / 1024).toFixed(1)),
          })),
        };
      }),
  };

  fs.writeFileSync("benchmark-results.md", markdownOutput);
  console.log("\nResults saved to benchmark-results.md");

  fs.writeFileSync("benchmark-results.json", JSON.stringify(jsonData, null, 2));
  console.log("Results saved to benchmark-results.json");

  return markdownOutput;
}

runBenchmarks();
