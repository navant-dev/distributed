import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://navant.dev",
  base: process.env.BASE_PATH || "/",
  output: "static",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: "github-dark" },
  },
});
