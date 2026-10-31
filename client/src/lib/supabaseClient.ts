import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[TrustBridge] Missing Supabase environment variables. Check client/.env.'
  );
}

// Allow the synthetic-data demo to start without a configured remote project.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = createClient(
  supabaseUrl || 'https://unconfigured.supabase.co',
  supabaseAnonKey || 'unconfigured-public-key'
);
