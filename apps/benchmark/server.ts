import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";
import path from "node:path";
import fs from "node:fs";

export function startServer(port: number) {
  const app = new Hono();

  const distPath = path.resolve("dist");
  const directories = fs.existsSync(distPath)
    ? fs
        .readdirSync(distPath)
        .filter((f) => fs.statSync(path.join(distPath, f)).isDirectory())
    : [];

  for (const dir of directories) {
    app.use(`/${dir}*`, serveStatic({ root: "./dist" }));
  }

  app.get("/benchmark-results.json", (c) => {
    if (fs.existsSync("./benchmark-results.json")) {
      return c.body(fs.readFileSync("./benchmark-results.json", "utf-8"), 200, {
        "Content-Type": "application/json",
      });
    }
    return c.text("Results not found yet. Run benchmark first.", 404);
  });

  app.get("/benchmark-visualization.js", (c) => {
    if (fs.existsSync("./benchmark-visualization.js")) {
      return c.body(
        fs.readFileSync("./benchmark-visualization.js", "utf-8"),
        200,
        {
          "Content-Type": "application/javascript",
        },
      );
    }
    return c.text("Not found", 404);
  });

  app.get("/", (c) => {
    const hasResults = fs.existsSync("./benchmark-results.json");
    return c.html(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>i18n Benchmark Dashboard</title>
  <script src="/benchmark-visualization.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 2rem auto; padding: 0 1rem; color: #18181b; }
    h1 { margin-bottom: 0.5rem; }
    .builds { margin-top: 2rem; padding: 1rem; background: #f4f4f5; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>i18n Bundle Transfer Size Benchmark</h1>
  <p>Comparing <strong>@aaakul/ts-intl</strong>, <strong>Paraglide</strong>, and <strong>i18next</strong>.</p>
  ${
    hasResults
      ? `<benchmark-visualization src="/benchmark-results.json"></benchmark-visualization>`
      : `<p><em>Benchmark results not yet generated. Run <code>pnpm bench</code> to execute the benchmark suite.</em></p>`
  }
  <div class="builds">
    <h3>Available Build Pages (${directories.length}):</h3>
    <div style="display: flex; flex-direction: column; gap: 0.25rem; max-height: 200px; overflow-y: auto;">
      ${directories.map((dir) => `<a href="/${dir}">${dir}</a>`).join("")}
    </div>
  </div>
</body>
</html>
`);
  });

  app.use("*", async (c) => {
    return c.html(
      `<p>404 Not Found.</p><p><a href="/">Go back to dashboard</a></p>`,
      404,
    );
  });

  const server = serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Server is running at http://localhost:${port}`);
  return server;
}

if (process.env.PREVIEW || process.argv.includes("--preview")) {
  startServer(3005);
}
