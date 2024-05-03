import { defineConfig } from "astro/config";
import auth from "auth-astro";
import vercel from "@astrojs/vercel/serverless";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [auth(), tailwind(), icon(), db()],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "[name]-[hash].js"
        }
      }
    }
  }
});