import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initGuestAccentFromStorage } from "./lib/userAccent";
import App from "./App";
import AppErrorBoundary from "./components/AppErrorBoundary";
import SetupError from "./components/SetupError";
import { isSupabaseConfigured } from "./lib/supabase";
import { isChunkLoadError, recoverFromChunkError } from "./lib/chunkError";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Элемент #root не найден");

initGuestAccentFromStorage();

const root = createRoot(rootEl);

window.addEventListener("unhandledrejection", (event) => {
  if (isChunkLoadError(event.reason)) {
    event.preventDefault();
    void recoverFromChunkError();
  }
});

const vercelHint = `Vercel → Project → Settings → Environment Variables:

VITE_SUPABASE_URL = URL из Supabase (Project Settings → API)
VITE_SUPABASE_ANON_KEY = anon public key

Включите для Production и Preview, затем Redeploy.`;

if (!isSupabaseConfigured) {
  root.render(
    <SetupError
      message="При сборке не были переданы ключи Supabase (VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY). Без них приложение не может подключиться к базе."
      hint={vercelHint}
    />,
  );
} else {
  root.render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
}
