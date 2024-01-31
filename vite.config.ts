/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "vite-preset-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],

  resolve: {
    alias: {
      "@/components": path.resolve("src/components/"),
      "@/module": path.resolve("src/module/"),
      "@/lib": path.resolve("src/lib/"),
      "@/assets": path.resolve("src/assets/"),
      "@/utils": path.resolve("src/utils/"),
      "@/providers": path.resolve("src/providers/"),
      "@/types": path.resolve("src/types/"),
      "@/config": path.resolve("src/config/"),
      "@/services": path.resolve("src/services/"),
      "@/hooks": path.resolve("src/hooks/"),
      "@/data": path.resolve("src/data/"),
      "@/feature": path.resolve("src/feature/"),
      "@/routes": path.resolve("src/routes/"),
      "@/layouts": path.resolve("src/layouts/"),
      "@/modules": path.resolve("src/modules/"),
      components: path.resolve("src/components/"),
      lib: path.resolve("src/lib/"),
      hooks: path.resolve("src/hooks/"),
      utils: path.resolve("src/utils/"),
      config: path.resolve("src/config/"),
      features: path.resolve("src/features/"),
      pages: path.resolve("src/pages/"),
      store: path.resolve("src/store/"),
      types: path.resolve("src/types/"),
      assets: path.resolve("src/assets/"),
      providers: path.resolve("src/providers/"),
      services: path.resolve("src/services/"),
      data: path.resolve("src/data/"),
    },
  },
  // define: {
  // 	'process.env': import.meta.env,
  // },
  server: {
    open: true,
    port: 3030,
  },
  build: {
    outDir: "build",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 6000,
  },
});
