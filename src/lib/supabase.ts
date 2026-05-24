import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_KEY &&
    SUPABASE_KEY !== 'your-anon-key-here' &&
    !String(SUPABASE_KEY).includes('your-anon-key'),
);

if (!isSupabaseConfigured) {
  console.warn('[Supabase] Укажите VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env или в секретах GitHub Actions');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');
