import { useState } from 'react';
import {
  User,
  Sliders,
  Shield,
  Lock,
  Info,
  CheckCircle2,
  Moon,
  Sun,
  Laptop,
  FileText,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsView() {
  const { user } = useAuth();

  // Active section tab
  const [activeSection, setActiveSection] = useState<'account' | 'preferences' | 'security' | 'privacy' | 'about'>('account');

  // Account State
  const [fullName, setFullName] = useState(user?.fullName || 'Prashasti Pandey');
  const [email, setEmail] = useState(user?.email || 'prashasti.pandey@trustbridge.dev');
  const [role, setRole] = useState('Senior Underwriter');
  const [hubLocation, setHubLocation] = useState('Bangalore Rural NBFC');
  const [isSaved, setIsSaved] = useState(false);

  // Preferences State
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [defaultLanding, setDefaultLanding] = useState('dashboard');
  const [tableDensity, setTableDensity] = useState('comfortable');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Settings & Account Management
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              User Controls
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your underwriter account profile, cockpit preferences, security credentials, and data privacy policies.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSection('account')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeSection === 'account'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Account</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('preferences')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeSection === 'preferences'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeSection === 'security'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('privacy')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeSection === 'privacy'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Privacy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('about')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeSection === 'about'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Info className="h-4 w-4" />
          <span>About</span>
        </button>
      </div>

      {/* ================================================== */}
      {/* 1. ACCOUNT SECTION */}
      {/* ================================================== */}
      {activeSection === 'account' && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5 animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-tight">Account Profile</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Personal credentials and underwriting jurisdiction information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Underwriting Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Assigned Hub / Node</label>
              <input
                type="text"
                value={hubLocation}
                onChange={(e) => setHubLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono-numbers">
              Staff Clearance ID: UW-KA-09 (Bangalore Rural)
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaved ? 'Saved Successfully!' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================================================== */}
      {/* 2. PREFERENCES SECTION */}
      {/* ================================================== */}
      {activeSection === 'preferences' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6 animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-tight">Cockpit Preferences</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize dashboard behavior, display themes, and operational alert triggers.
            </p>
          </div>

          {/* Theme selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Interface Theme</label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>Dark (FinTech)</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors ${
                  theme === 'light'
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors ${
                  theme === 'system'
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="h-4 w-4 text-slate-400" />
                <span>System Sync</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-300">Notification Settings</label>
            <div className="space-y-2 max-w-lg">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Early Warning Deterioration Alerts</span>
                  <span className="text-[11px] text-slate-400 block">Receive instant notification when applicant score trajectory drops</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="accent-indigo-600 h-4 w-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Daily Underwriting Digest</span>
                  <span className="text-[11px] text-slate-400 block">Summary of reviewed, pending, and sanctioned files at 18:00 IST</span>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="accent-indigo-600 h-4 w-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Dashboard Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Default Landing View</label>
              <select
                value={defaultLanding}
                onChange={(e) => setDefaultLanding(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="dashboard">Executive Dashboard (Overview)</option>
                <option value="queue">Review Queue</option>
                <option value="portfolio">Portfolio Analytics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Table Display Density</label>
              <select
                value={tableDensity}
                onChange={(e) => setTableDensity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="comfortable">Comfortable (Standard)</option>
                <option value="compact">Compact (High Information Density)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. SECURITY SECTION */}
      {/* ================================================== */}
      {activeSection === 'security' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6 animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-tight">Security & Authentication</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Password management, multi-factor authentication, and active workstation sessions.
            </p>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Change Password
            </span>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {passwordSuccess && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Password updated!
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors ml-auto shadow-md"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Active Workstation Sessions */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Active Sessions
            </span>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Chrome on Windows 11 (Current Session)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono-numbers">
                    IP: 103.21.244.18 • Bengaluru, Karnataka • Active Now
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 4. PRIVACY SECTION */}
      {/* ================================================== */}
      {activeSection === 'privacy' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6 animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-tight">Privacy & Data Governance</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Borrower consent policies, data retention schedules, and regulatory compliance.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-400" />
                Borrower Explicit Consent Mandate
              </h3>
              <p className="text-slate-400 leading-relaxed">
                TrustBridge processes alternative evidence (rental receipts, wholesale mandi invoices, and utility records) strictly pursuant to verified explicit consent collected during applicant onboarding. No data is harvested without affirmative borrower authorization.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                Non-Commercialization Guarantee
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Micro-enterprise cashflow data is dedicated solely to credit underwriting, risk modeling, and institutional portfolio supervision. It is never sold, licensed, or shared with third-party advertising or marketing brokers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                Regulatory Compliance Alignment
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Architected to adhere to the Digital Personal Data Protection (DPDP) Act 2023 and Reserve Bank of India (RBI) Fair Practices Code for Digital Lending.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 5. ABOUT SECTION */}
      {/* ================================================== */}
      {activeSection === 'about' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5 animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-tight">About TrustBridge</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Product details, versioning, and architectural mandate.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-white">TrustBridge Underwriting Cockpit</span>
                <span className="text-xs text-indigo-400 block font-mono-numbers">Release v2.4.0 (Enterprise FinTech)</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-numbers">
                PRODUCTION READY
              </span>
            </div>

            <p className="text-xs text-slate-300 italic">
              "No credit history does not mean no trust."
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              TrustBridge is an explainable alternative credit scoring platform designed for micro-entrepreneurs and credit-invisible street vendors. By converting physical and cash evidence—such as stall rental receipts, APMC supplier invoices, and utility consistency—into verifiable mathematical signals, TrustBridge unlocks fair credit access with human-in-the-loop governance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-numbers">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard</span>
              <span className="text-white font-semibold mt-1 block">RBI FinTech Sandbox</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Auditing</span>
              <span className="text-emerald-400 font-semibold mt-1 block">Four-Fifths Compliant</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Architecture</span>
              <span className="text-indigo-400 font-semibold mt-1 block">Human-in-the-Loop</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
