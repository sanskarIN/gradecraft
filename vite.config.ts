import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const tauriDevHost = process.env.TAURI_DEV_HOST;

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    sourcemap: true,
    target: "es2020",
  },
  server: {
    port: 5173,
    strictPort: true,
    host: tauriDevHost || false,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
