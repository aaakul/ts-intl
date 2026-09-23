import { build } from "vite";
import fs from "node:fs/promises";
import { normalize } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  builds,
  buildConfigToString,
  createViteConfig,
  type BuildConfig,
} from "./build.config.ts";
import { compile } from "@inlang/paraglide-js";
import {
  sampleMessages,
  sampleLocales,
  sampleInlangSettings,
} from "./build.samples.ts";

export async function buildSingle(b: BuildConfig) {
  const locales = sampleLocales.slice(0, b.locales);
  const base = buildConfigToString(b);
  const outdir = `./dist/${base}`;
  const numDynamic = Math.floor((b.percentDynamic / 100) * b.messages);

  // create generated i18n file
  const libFile = await fs.readFile(`./src/i18n/${b.library}.ts`, "utf-8");
  await fs.writeFile(
    `./src/i18n/generated.ts`,
    libFile + "\nexport const locales = " + JSON.stringify(locales) + ";\n",
  );

  // generate messages
  const keys = await generateMessages({
    locales,
    numMessages: b.messages,
    numDynamic,
    namespaceSize: b.namespaceSize,
    library: b.library,
  });

  if (b.library === "paraglide") {
    await compileParaglide({ locales, mode: b.libraryMode });
  }

  // generate pages
  const staticPaths = ["/"];

  if (b.generateAboutPage) {
    staticPaths.push("/about");
  }

  await generatePage({
    path: "/index.ts",
    keys,
    library: b.library,
  });

  if (b.generateAboutPage) {
    await generatePage({
      path: "/about/index.ts",
      keys,
      library: b.library,
    });
  }

  // client side build
  await build(
    createViteConfig({
      buildName: base,
      outdir,
      base,
      mode: "ssg",
      library: b.library,
      libraryMode: b.libraryMode,
      generateAboutPage: b.generateAboutPage,
    }),
  );

  // server side build
  process.env.BASE = base;
  process.env.LIBRARY = b.library;
  process.env.LIBRARY_MODE = b.libraryMode;
  process.env.IS_CLIENT = "false";

  const { handle } = await import(`./src/entry-server.ts?build=${base}`);

  // render each route
  for (const path of staticPaths) {
    const response = await handle(
      new Request(new URL(path, "http://example.com")),
    );
    const html = await response.text();
    const outputPath = normalize(`./${outdir}/${path}/index.html`);
    await fs.mkdir(normalize(`./${outdir}/${path}`), { recursive: true });
    await fs.writeFile(outputPath, html, "utf-8");
  }

  await fs.cp("./messages", `./dist/${base}/messages`, { recursive: true });
  await fs.rm("./messages", { force: true, recursive: true });
}

export const runBuilds = async () => {
  // Clean the dist directory
  await fs.rm("./dist", { recursive: true, force: true });
  await fs.mkdir("./dist", { recursive: true });

  const buildScript = fileURLToPath(import.meta.url);

  for (const [i, b] of builds.entries()) {
    const libraryDisplay = `${b.library} (${b.libraryMode})`;

    console.log(`Build ${i + 1} of ${builds.length}:`);
    console.table([
      {
        Locales: b.locales,
        Messages: b.messages,
        "Namespace Size": b.namespaceSize || b.messages,
        "% Dynamic": b.percentDynamic,
        Library: libraryDisplay,
      },
    ]);

    const base = buildConfigToString(b);

    const execArgs = [
      ...new Set([...process.execArgv, "--experimental-strip-types"]),
      buildScript,
      "--single",
      base,
    ];

    execFileSync(process.execPath, execArgs, {
      stdio: "inherit",
      env: process.env,
    });
  }
};

async function generatePage(args: {
  path: string;
  keys: string[];
  library: string;
}) {
  const { refMessage, importExpression } = await import(
    `./src/i18n/${args.library}.ts`
  );

  let paragraphs: string[] = [];

  for (const key of args.keys) {
    if (key.endsWith("dynamic")) {
      paragraphs.push(`\`<p>\${${refMessage(key, { name: "Peter" })}}</p>\``);
    } else {
      paragraphs.push(`\`<p>\${${refMessage(key)}}</p>\``);
    }
  }

  const basePath = args.path === "/index.ts" ? ".." : "../..";

  const page = `${importExpression().replace("<src>", basePath)}

export function Page(): string {
	return shuffleArray([
		${paragraphs.join(",\n")}
	]).join("\\n");
};

// shuffle the paragraphs
// to have a visible difference when switching locales
function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
`;
  await fs.mkdir(`src/pages/about`, { recursive: true });
  await fs.writeFile(`./src/pages${args.path}`, page);
}

async function generateMessages(args: {
  locales: string[];
  numMessages: number;
  numDynamic: number;
  namespaceSize?: number;
  library: string;
}) {
  const totalMessages = args.namespaceSize || args.numMessages;

  if (args.namespaceSize && args.namespaceSize < args.numMessages) {
    throw new Error(
      `Namespace size (${args.namespaceSize}) cannot be lower than message count (${args.numMessages})`,
    );
  }

  let messages: Record<string, string> = {};
  let msgI = 0;

  // Use {name} for ts-intl, {{name}} for i18next and paraglide plugin-i18next
  const dynamicSuffix = args.library === "ts-intl" ? " {name}" : " {{name}}";

  for (let i = 0; i < totalMessages; i++) {
    if (i < args.numDynamic) {
      messages[`message${i}dynamic`] = sampleMessages[msgI] + dynamicSuffix;
    } else {
      messages[`message${i}`] = sampleMessages[msgI];
    }
    msgI++;
    if (msgI === sampleMessages.length) {
      msgI = 0;
    }
  }

  for (const locale of args.locales) {
    await fs.mkdir(`./messages`, { recursive: true });
    await fs.writeFile(
      `./messages/${locale}.json`,
      JSON.stringify(messages, null, 2),
    );
  }

  return Object.keys(messages).slice(0, args.numMessages);
}

async function compileParaglide(args: { locales: string[]; mode: string }) {
  await fs.mkdir(`./project.inlang`, { recursive: true });
  await fs.writeFile(
    `./project.inlang/settings.json`,
    JSON.stringify(
      {
        ...sampleInlangSettings,
        locales: args.locales,
      },
      null,
      2,
    ),
  );
  await compile({
    project: "./project.inlang",
    outdir: "./src/paraglide",
    isServer: "!process.env.IS_CLIENT",
    experimentalMiddlewareLocaleSplitting:
      args.mode === "experimental-middleware-locale-splitting",
  });
}

const singleArgIdx = process.argv.indexOf("--single");
if (singleArgIdx !== -1 && process.argv[singleArgIdx + 1]) {
  const targetBase = process.argv[singleArgIdx + 1];
  const b = builds.find((x) => buildConfigToString(x) === targetBase);
  if (!b) {
    throw new Error(`Build configuration "${targetBase}" not found`);
  }
  await buildSingle(b);
} else if (process.env.RUN_BUILD || process.argv.includes("--run")) {
  await runBuilds();
}
