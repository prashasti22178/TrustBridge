import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
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

const SESSION_STORAGE_KEY = 'tb_auth_session_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      // 1. Check Supabase Auth session first
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && data.session?.user) {
          const sUser = data.session.user;
          setSession(data.session);
          setSupabaseUser(sUser);

          const role = (sUser.user_metadata?.role || sUser.app_metadata?.role || 'underwriter') as UserRole;
          const fullName = sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User';

          setUser({
            id: sUser.id,
            email: sUser.email || '',
            fullName,
            role,
            isDemo: false,
            lastLogin: new Date().toLocaleTimeString()
          });
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('[TrustBridge Auth] Supabase session retrieval note:', err);
      }

      // 2. Check transient sessionStorage for demo evaluation sessions
      try {
        const cached = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (cached && mounted) {
          const parsed = JSON.parse(cached) as UserSession;
          setUser(parsed);
        }
      } catch (err) {
        console.warn('[TrustBridge Auth] Cache parse error:', err);
      }

      if (mounted) setIsLoading(false);
    }

    initSession();

    // Listen to real Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      if (newSession?.user) {
        setSession(newSession);
        setSupabaseUser(newSession.user);
        const role = (newSession.user.user_metadata?.role || 'underwriter') as UserRole;
        const fullName = newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0] || 'User';
        const sessionObj: UserSession = {
          id: newSession.user.id,
          email: newSession.user.email || '',
          fullName,
          role,
          isDemo: false,
          lastLogin: new Date().toLocaleTimeString()
        };
        setUser(sessionObj);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionObj));
      } else {
        setSession(null);
        setSupabaseUser(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    // 1. Check for quick demo accounts
    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail === 'borrower@trustbridge.dev') {
      loginAsDemo('borrower');
      setIsLoading(false);
      return { success: true };
    }
    if (lowerEmail === 'underwriter@trustbridge.dev') {
      loginAsDemo('underwriter');
      setIsLoading(false);
      return { success: true };
    }
    if (lowerEmail === 'admin@trustbridge.dev') {
      loginAsDemo('admin');
      setIsLoading(false);
      return { success: true };
    }

    // 2. Execute Supabase signInWithPassword
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return { success: false, error: signInError.message };
      }

      if (data.user) {
        const role = (data.user.user_metadata?.role || 'underwriter') as UserRole;
        const fullName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User';
        const sessionObj: UserSession = {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
          role,
          isDemo: false,
          lastLogin: new Date().toLocaleTimeString()
        };
        setUser(sessionObj);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionObj));
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please verify your credentials.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    setIsLoading(false);
    return { success: false, error: 'Sign in failed.' };
  };

  const signup = async (email: string, password: string, fullName: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return { success: false, error: signUpError.message };
      }

      if (data.user) {
        const sessionObj: UserSession = {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
          role,
          isDemo: false,
          lastLogin: new Date().toLocaleTimeString()
        };
        setUser(sessionObj);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionObj));
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      const msg = err.message || 'Account registration failed. Please try again.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemo = (role: UserRole) => {
    const demoProfile = DEMO_ACCOUNTS[role];
    setUser(demoProfile);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoProfile));
    setError(null);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[TrustBridge Auth] Sign out error:', err);
    }
    setUser(null);
    setSession(null);
    setSupabaseUser(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`
      });
      if (resetErr) {
        return { success: false, error: resetErr.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed.' };
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        loginAsDemo,
        logout,
        resetPassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
