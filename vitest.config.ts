/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ["**/*.test.mts"],
  },
});
