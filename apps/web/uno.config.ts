import { defineConfig, presetWind3 } from "unocss";

export default defineConfig({
  presets: [
    presetWind3({
      dark: "class",
    }),
  ],
  theme: {
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif',
    },
    colors: {
      neutral: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0a0a0a",
      },
    },
  },
});
