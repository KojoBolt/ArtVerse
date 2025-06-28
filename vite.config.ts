import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src", "notechain_frontend"),
  build: {
    outDir: path.resolve(__dirname, "dist", "notechain_frontend"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src", "notechain_frontend", "src"),
      declarations: path.resolve(__dirname, ".dfx", "local", "canisters"),
    },
  },
  define: {
    global: "globalThis",
    process: {
      env: {
        DFX_NETWORK: JSON.stringify(process.env.VITE_DFX_NETWORK || "local"),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
