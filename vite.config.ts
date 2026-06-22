import { readFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SITE_URL = "https://wwm-wiki-nocthra.ru";

function resolveSiteUrl(env: Record<string, string>): string {
  return (env.VITE_SITE_URL || env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function resolveBuildTime(env: Record<string, string>): string {
  if (env.VITE_BUILD_TIME) return env.VITE_BUILD_TIME;
  try {
    const meta = JSON.parse(readFileSync(path.join(__dirname, ".build-meta.json"), "utf8")) as { buildTime?: string };
    if (meta.buildTime) return meta.buildTime;
  } catch {
    /* generate-seo.mjs runs before vite build */
  }
  return new Date().toISOString();
}

/** Подставляет VITE_SITE_URL в index.html при сборке (canonical, Open Graph). */
function siteUrlHtmlPlugin(siteUrl: string) {
  return {
    name: "site-url-html",
    transformIndexHtml(html: string) {
      return html
        .replace(/__SITE_URL__/g, siteUrl)
        .replace(new RegExp(DEFAULT_SITE_URL.replace(/\./g, "\\."), "g"), siteUrl);
    },
  };
}

function syncApiDevPlugin(env: Record<string, string>) {
  return {
    name: "sync-api-dev",
    configureServer(server: { middlewares: { use: (fn: (req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/api/sync-content") return next();
        try {
          for (const key of ["SYNC_API_SECRET"]) {
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
  const siteUrl = resolveSiteUrl(env);
  const buildTime = resolveBuildTime(env);
  return {
  base: "/",
  plugins: [react(), tailwindcss(), syncApiDevPlugin(env), siteUrlHtmlPlugin(siteUrl)],
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
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
  },
};
});
