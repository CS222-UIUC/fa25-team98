import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",   // 👈 gives us window, document, etc.
    globals: true,          // so we can use describe/it/expect without imports if we want
    setupFiles: "./src/tests/setupTests.js",
  },
});
