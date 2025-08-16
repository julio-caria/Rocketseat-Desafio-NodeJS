import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "text-summary", "html"],
      all: true,
      include: ['src/**/*.ts']
    },
  },
});