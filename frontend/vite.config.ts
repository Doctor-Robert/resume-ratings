import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  // При разработке запросы /api уходят на сервер FastAPI
  server: { proxy: { "/api": "http://localhost:8000" } },
});
