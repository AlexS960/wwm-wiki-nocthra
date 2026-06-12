import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function syncApiDevPlugin(env: Record<string, string>) {
  return {
    name: "sync-api-dev",
    configureServer(server: { middlewares: { use: (fn: (req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/api/sync-content") return next();
        try {
          for (const key of [
            "SYNC_API_SECRET",
            "LM_STUDIO_BASE_URL",
            "LM_STUDIO_API_KEY",
            "LM_STUDIO_MODEL",
            "AI_ENRICH_LIMIT",
            "AI_BATCH_SIZE",
            "AI_TIMEOUT_MS",
          ]) {
            if (env[key]) process.env[key] = env[key];
          }
          const { handleSyncRequest } = await import("./api/sync-content.mjs");
          await handleSyncRequest(req, res);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [react(), tailwindcss(), syncApiDevPlugin(env)],
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
};
});
