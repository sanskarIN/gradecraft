import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const tauriDevHost = process.env.TAURI_DEV_HOST;

export default defineConfig({
  base: "./",
  clearScreen: false,
  plugins: [react()],
  build: {
    sourcemap: true,
    target: "es2020",
  },
  server: {
    port: 5173,
    strictPort: true,
    host: tauriDevHost || false,
    hmr: tauriDevHost
      ? {
          protocol: "ws",
          host: tauriDevHost,
          port: 5174,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
