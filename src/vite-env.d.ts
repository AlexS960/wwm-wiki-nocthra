/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_BUILD_TIME?: string;
  readonly VITE_SYNC_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
