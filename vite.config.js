import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { buildSeo } from "./build-seo.js";
const indexable = (process.env.VERCEL_ENV || process.env.SITE_ENV) === "production";
export default defineConfig({
  plugins: [react(), buildSeo(indexable)],
  define: { "import.meta.env.VITE_SITE_INDEXABLE": JSON.stringify(indexable) },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "three";
        },
      },
    },
  },
});
