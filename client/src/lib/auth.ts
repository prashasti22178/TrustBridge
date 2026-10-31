import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const SESSION_STORAGE_KEY = 'tb_auth_session_v2';
export const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO === 'true' ||
  (import.meta.env.DEV && !isSupabaseConfigured);

export function getTrustedRole(user: User): 'borrower' | 'underwriter' | 'admin' {
  const role = user.app_metadata?.role;
  return role === 'underwriter' || role === 'admin' ? role : 'borrower';
}

export function getDemoRole(): 'borrower' | 'underwriter' | 'admin' | null {
  if (!DEMO_ENABLED) return null;
  try {
    const cached = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) || 'null');
    return cached?.isDemo && ['borrower', 'underwriter', 'admin'].includes(cached.role) ? cached.role : null;
  } catch { return null; }
}

export async function authHeaders(): Promise<Record<string, string>> {
  const demoRole = getDemoRole();
  if (demoRole) return { Authorization: `Bearer demo-${demoRole}-token` };
  if (!isSupabaseConfigured) return {};
  const { data } = await supabase.auth.getSession();
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}
