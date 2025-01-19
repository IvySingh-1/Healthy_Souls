import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right corner to set up your Supabase project.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);