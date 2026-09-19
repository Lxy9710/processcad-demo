import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  server: {
    watch: {
      ignored: ["**/dist/**", "**/dist-zh/**"],
    },
  },
  build: {
    outDir: "dist-zh",
    rollupOptions: {
      input: resolve(__dirname, "index.zh.html"),
    },
  },
});
