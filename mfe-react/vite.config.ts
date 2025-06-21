import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    modulePreload: false,
    outDir: "dist",
    rollupOptions: {
      output: {
        format: "system",
        entryFileNames: "remoteEntry.js",
        inlineDynamicImports: false,
        manualChunks: undefined,
        exports: "named",
      },
    },
  },
  server: {
    cors: true,
    port: 3000,
  },
});
