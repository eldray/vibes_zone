import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    historyApiFallback: false,
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
});
