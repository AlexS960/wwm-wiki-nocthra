import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lmshxcpridbvfzoyrpas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nEkKlf3wJZdA0dh8YJJ2VA_2DJzXRcc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
