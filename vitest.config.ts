import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "test/integration/**",
      "**/node_modules/**",
      "dist/**",
      ".stryker-tmp/**",
      "reports/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      thresholds: {
        branches: 80,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
