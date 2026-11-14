import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://www.borchgomez.es",
  trailingSlash: "never",
  build: {
    format: "file",
  },
});
