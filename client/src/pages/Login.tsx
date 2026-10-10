import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  Briefcase,
  Sliders,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Login() {
  const { login, signup, loginAsDemo, error, clearError, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('underwriter');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Return path from location state or role-based default
  const fromPath = (location.state as any)?.from?.pathname;

  const getDestination = (userRole: UserRole) => {
    if (fromPath && fromPath !== '/login') return fromPath;
    if (userRole === 'borrower') return '/apply';
    return '/underwriter';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    clearError();

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      // Navigate to destination
      const destRole = email.toLowerCase().includes('borrower') ? 'borrower' : 'underwriter';
      navigate(getDestination(destRole), { replace: true });
    } else {
      setFormError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    clearError();

    if (!email || !password || !fullName) {
      setFormError('Please fill in all registration fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const res = await signup(email, password, fullName, role);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate(getDestination(role), { replace: true });
      }, 1000);
    } else {
      setFormError(res.error || 'Registration failed.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!email) {
      setFormError('Please enter your email address to receive reset instructions.');
      return;
    }

    setSubmitting(true);
    const res = await resetPassword(email);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Password reset instructions sent. Please check your inbox.');
    } else {
      setFormError(res.error || 'Unable to send reset email.');
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    loginAsDemo(demoRole);
    navigate(getDestination(demoRole), { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/50 transition-colors">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  TrustBridge
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Credit Intelligence Platform</p>
            </div>
          </Link>

          <p className="text-xs text-slate-400 italic pt-1">
            "No credit history does not mean no trust."
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setFormError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setFormError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {(formError || error) && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="underwriter@trustbridge.dev"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Platform</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@microbusiness.in"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-300">Select Platform Role</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                      role === 'underwriter'
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="underwriter"
                      checked={role === 'underwriter'}
                      onChange={() => setRole('underwriter')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 font-bold">
                      <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Underwriter</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Review queue & credit dossiers</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                      role === 'borrower'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="borrower"
                      checked={role === 'borrower'}
                      onChange={() => setRole('borrower')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 font-bold">
                      <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Borrower</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Micro-enterprise applicant</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Registering user...</span>
                  </>
                ) : (
                  <>
                    <span>Create Platform Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

          {/* 1-CLICK EVALUATION DEMO ACCOUNTS (Part 24) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Instant Evaluation
              </span>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                DEMO ONLY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('underwriter')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200 group-hover:text-indigo-300">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Underwriter</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono-numbers mt-0.5 truncate">
                  underwriter@...
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('borrower')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200 group-hover:text-emerald-300">
                  <Sliders className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Borrower</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono-numbers mt-0.5 truncate">
                  borrower@...
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200 group-hover:text-amber-300">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  <span>Admin / CRO</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono-numbers mt-0.5 truncate">
                  admin@...
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security / Privacy Banner */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <span>Protected under DPDP Act & RBI Digital Lending Guidelines</span>
          <span>•</span>
          <Link to="/privacy-security" className="text-slate-400 hover:text-slate-300 underline">
            Privacy Center
          </Link>
        </div>
      </div>
    </div>
  );
}
