import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/middleware.ts"],
  format: ["esm", "cjs"],
  target: "es2022",
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  cjsInterop: true,
});
