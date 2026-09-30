import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/domain/**/*.ts", "src/data/**/*.ts"],
      thresholds: {
        lines: 75,
        functions: 75,
        statements: 75,
        branches: 65,
      },
    },
  },
});
