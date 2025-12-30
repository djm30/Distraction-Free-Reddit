import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import path from "path";

const browser = process.env.BROWSER || "chrome";

export default defineConfig({
  plugins: [
    react(),

    webExtension({
      // Tell it which manifest to use based on browser
      // Use path.resolve to get absolute path to manifest
      manifest: path.resolve(__dirname, `src/${browser}/manifest.json`),

      // The plugin automatically finds entry points from the manifest:
      // - popup.html and options.html from action.default_popup and options_ui.page
      // - background.ts from background.service_worker
      // - content.ts from content_scripts[].js

      // Disable auto-launch of browser during dev (we'll load manually)
      browser: browser as "chrome" | "firefox",
      disableAutoLaunch: true,
    }),
  ],

  // Build configuration
  build: {
    // Output directory based on browser
    outDir: `build_${browser}`,

    // Generate sourcemaps for easier debugging
    sourcemap: process.env.NODE_ENV === "development",

    // Disable minification in dev for easier debugging
    minify: process.env.NODE_ENV !== "development",

    rollupOptions: {
      // Note: popup.html and options.html are handled by webExtension plugin
      // It reads them from the manifest and processes them automatically

      output: {
        // Let the plugin handle entry file names for background/content
        // It needs to track them for manifest rewriting
        entryFileNames: (chunkInfo) => {
          // Background and content scripts go to src/ to match plugin expectations
          if (chunkInfo.name === "background" || chunkInfo.name === "content") {
            return "src/[name].js";
          }
          // Other entries go to static/js/
          return "static/js/[name].js";
        },
        chunkFileNames: "static/js/[name].js",
        assetFileNames: (assetInfo) => {
          // Put CSS files in static/css/
          const name = assetInfo.names?.[0] || assetInfo.name || "";
          if (name.endsWith(".css")) {
            return "static/css/[name].[ext]";
          }
          // Everything else in static/
          return "static/[name].[ext]";
        },
        // Disable code splitting - extensions load better with single files
        manualChunks: undefined,
      },
    },
  },

  // Define global constants available in your code
  define: {
    // Make browser type available as a constant
    __BROWSER__: JSON.stringify(browser),
    // Also expose as VITE_ prefixed env var (Vite convention)
    "import.meta.env.VITE_BROWSER": JSON.stringify(browser),
  },

  // Resolve configuration
  resolve: {
    alias: {
      // Create shorthand imports like '@/components'
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Server configuration for development
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      // Hot Module Replacement for instant updates during dev
      port: 3000,
    },
  },
});
