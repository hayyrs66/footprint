import { defineConfig } from "astro/config";
import auth from "auth-astro";
import vercel from "@astrojs/vercel/serverless";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [auth()],
  output: "server",
  adapter: node({
    mode: "middleware",
    
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