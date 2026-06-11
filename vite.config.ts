import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: mode !== 'production',
    minify: 'esbuild',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react/")) return "vendor-react";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("lucide-react")) return "vendor-icons";
            return "vendor";
          }
          // Keep auth/context in the entry graph — isolating them in "admin" breaks React hook imports.
          if (id.includes("/src/context/") || id.includes("/src/hooks/")) return undefined;
          if (id.includes("/src/data/aiNpcs")) return "data-npcs";
          if (id.includes("riddles.clues.json") || id.includes("/src/data/riddles")) return "data-riddles";
          if (id.includes("innerWays.json") || id.includes("/src/data/innerWays")) return "data-innerways";
          if (id.includes("/src/components/staffChat/")) return "staffchat";
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': mode === 'production' ? '"production"' : '"development"',
  },
}));
