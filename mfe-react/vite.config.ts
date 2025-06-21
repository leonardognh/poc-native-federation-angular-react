import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
