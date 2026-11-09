import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// GitHub Pages deploys to https://<user>.github.io/<repo>/
// Set VITE_BASE at build time if deploying to a sub-path, e.g. /yen-linh-the-khoa/
const base = process.env["VITE_BASE"] ?? "/";

export default defineConfig({
  base,
  plugins: [
    // Must be before react() — generates routeTree.gen.ts from src/routes/
    TanStackRouterVite({ routesDirectory: "src/routes", generatedRouteTree: "src/routeTree.gen.ts" }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": "/src" },
  },
  build: {
    outDir: "dist",
  },
});
