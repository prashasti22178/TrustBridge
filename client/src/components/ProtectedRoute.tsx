import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { ShieldAlert, Loader2, ArrowLeft, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, loginAsDemo } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <span className="text-xs text-slate-400 font-mono-numbers">
            Verifying cryptographic session...
          </span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated check -> Redirect to /login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role-based authorization check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Access Restricted by Role Governance
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your active session role is{' '}
              <span className="font-mono-numbers px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold uppercase text-[11px]">
                {user.role}
              </span>
              . This enterprise module requires{' '}
              <span className="font-semibold text-slate-200">
                {allowedRoles.map((r) => r.toUpperCase()).join(' or ')}
              </span>{' '}
              privileges.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 text-left space-y-1">
            <span className="font-bold text-slate-300 block">Session Details:</span>
            <div>User: {user.email}</div>
            <div>Mode: {user.isDemo ? 'Evaluation Demo' : 'Supabase Production'}</div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              to="/apply"
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Borrower Portal
            </Link>

            <button
              onClick={() => loginAsDemo('underwriter')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              Switch to Underwriter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
