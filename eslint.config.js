import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      ".astro/",
      "**/.astro/",
      "**/.sanity/",
      "**/dist/",
      "**/node_modules/",
      "public/assets/css/style.css",
      "pnpm-lock.yaml",
      "studio/pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["src/scripts/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
