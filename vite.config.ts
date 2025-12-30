import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import path from "path";

const browser = process.env.BROWSER || "chrome";

export default defineConfig({
  plugins: [
    react(),

    webExtension({
      manifest: path.resolve(__dirname, `src/${browser}/manifest.json`),
      browser: browser as "chrome" | "firefox",
      disableAutoLaunch: true,
    }),
  ],

  build: {
    outDir: `build_${browser}`,

    sourcemap: process.env.NODE_ENV === "development",
    minify: process.env.NODE_ENV !== "development",

    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background" || chunkInfo.name === "content") {
            return "src/[name].js";
          }
          return "[name].js";
        },
        manualChunks: undefined,
      },
    },
  },

  define: {
    "import.meta.env.VITE_BROWSER": JSON.stringify(browser),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
