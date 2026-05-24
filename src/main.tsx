import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import SetupError from "./components/SetupError";
import { isSupabaseConfigured } from "./lib/supabase";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Элемент #root не найден в index.html");
}

const root = createRoot(rootEl);

if (import.meta.env.PROD && !isSupabaseConfigured) {
  root.render(
    <SetupError message="В собранной версии нет ключей Supabase. Пересоберите проект с VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY." />,
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
