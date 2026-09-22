import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/middleware.ts"],
  format: ["esm", "cjs"],
  target: "es2022",
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  cjsInterop: true,
});
