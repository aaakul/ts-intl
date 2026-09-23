import { App } from "./app.ts";
import { init, middleware } from "./i18n/generated.ts";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function handle(request: Request): Promise<Response> {
  if (init) {
    await init();
  }

  // @ts-ignore - middleware might not be defined
  const _middleware: typeof mockMiddleware = middleware ?? mockMiddleware;

  return _middleware(request, async ({ request }) => {
    let children: string;

    const templatePath = fileURLToPath(
      new URL(`../dist/${process.env.BASE}/index.html`, import.meta.url),
    );
    const rootHtml = await fs.readFile(templatePath, "utf-8");

    const path = new URL(request.url).pathname;

    if (path === "/" || path === "") {
      const { Page } = await import(
        `./pages/index.ts?build=${process.env.BASE}`
      );
      children = Page();
    } else if (path === "/about") {
      const { Page } = await import(
        `./pages/about/index.ts?build=${process.env.BASE}`
      );
      children = Page();
    } else {
      throw new Error(`Unknown page: ${path}`);
    }

    const html = App({ children });

    return new Response(rootHtml.replace("<!--app-html-->", html), {
      headers: { "Content-Type": "text/html" },
    });
  });
}

function mockMiddleware(
  request: Request,
  resolve: (args: { request: Request }) => Promise<Response>,
): Promise<Response> {
  return resolve({ request });
}
