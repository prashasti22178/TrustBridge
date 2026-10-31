import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DEMO_ENABLED, SESSION_STORAGE_KEY, getTrustedRole } from '../lib/auth';
import type { Session, User } from '@supabase/supabase-js';

export type UserRole = 'borrower' | 'underwriter' | 'admin';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isDemo: boolean;
  avatarUrl?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: UserSession | null;
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS: Record<UserRole, UserSession> = {
  borrower: {
    id: 'demo-usr-borrower-01',
    email: 'borrower@trustbridge.dev',
    fullName: 'Ravi Kumar (Micro-Borrower)',
    role: 'borrower',
    isDemo: true,
    lastLogin: new Date().toLocaleTimeString()
  },
  underwriter: {
    id: 'demo-usr-underwriter-09',
    email: 'prashasti.pandey@trustbridge.dev',
    fullName: 'Prashasti Pandey',
    role: 'underwriter',
    isDemo: true,
    lastLogin: new Date().toLocaleTimeString()
  },
  admin: {
    id: 'demo-usr-admin-01',
    email: 'admin@trustbridge.dev',
    fullName: 'Vikramaditya Rao (Chief Risk Officer)',
    role: 'admin',
    isDemo: true,
    lastLogin: new Date().toLocaleTimeString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applySession = (next: Session | null) => {
    setSession(next);
    setSupabaseUser(next?.user ?? null);
    if (next?.user) {
      const u = next.user;
      setUser({ id: u.id, email: u.email || '',
        fullName: u.user_metadata?.full_name || 'User',
        role: getTrustedRole(u), isDemo: false });
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      setUser(previous => previous?.isDemo ? previous : null);
    }
  };

  useEffect(() => {
    let mounted = true;
    // Only explicitly enabled demo identities can be restored from this cache.
    try {
      const cached = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) || 'null');
      if (DEMO_ENABLED && cached?.isDemo && ['borrower', 'underwriter', 'admin'].includes(cached.role)) {
        setUser(DEMO_ACCOUNTS[cached.role as UserRole]);
      }
    } catch { sessionStorage.removeItem(SESSION_STORAGE_KEY); }
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    // Auth events include INITIAL_SESSION, avoiding races with a second getSession call.
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return;
      applySession(next);
      setIsLoading(false);
    });
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    if (!isSupabaseConfigured) return { success: false, error: 'Configure Supabase to sign in, or use the local demo.' };
    setIsLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      applySession(data.session);
      return { success: Boolean(data.session) };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed.';
      setError(message);
      return { success: false, error: message };
    } finally { setIsLoading(false); }
  };

  const signup = async (email: string, password: string, fullName: string, _role: UserRole) => {
    setError(null);
    if (!isSupabaseConfigured) return { success: false, error: 'Configure Supabase to create an account.' };
    setIsLoading(true);
    try {
      // Staff access must be provisioned by an administrator using app_metadata.
      const { data, error: authError } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: fullName } }
      });
      if (authError) throw authError;
      if (!data.session) return { success: false, error: 'Check your email to confirm your account, then sign in.' };
      applySession(data.session);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      setError(message);
      return { success: false, error: message };
    } finally { setIsLoading(false); }
  };

  const loginAsDemo = (role: UserRole) => {
    if (!DEMO_ENABLED) return;
    const profile = DEMO_ACCOUNTS[role];
    setSession(null);
    setSupabaseUser(null);
    setUser(profile);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(profile));
    setIsLoading(false);
    setError(null);
  };

  const logout = async () => {
    setIsLoading(true);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setSession(null);
    setSupabaseUser(null);
    try { if (isSupabaseConfigured) await supabase.auth.signOut(); }
    finally { setIsLoading(false); }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) return { success: false, error: 'Configure Supabase to reset your password.' };
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`
      });
      if (resetError) throw resetError;
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Password reset failed.' };
    }
  };

  return <AuthContext.Provider value={{ user, supabaseUser, session, isAuthenticated: !!user,
    isLoading, error, login, signup, loginAsDemo, logout, resetPassword,
    clearError: () => setError(null) }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
