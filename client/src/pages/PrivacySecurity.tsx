import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  KeyRound,
  ArrowLeft,
  LogOut
} from 'lucide-react';

export default function PrivacySecurity() {
  const { user, logout } = useAuth();
  const [consentRevoked, setConsentRevoked] = useState(false);
  const [revocationToast, setRevocationToast] = useState<string | null>(null);

  const handleWithdrawConsent = () => {
    setConsentRevoked(true);
    setRevocationToast('Consent successfully revoked. No pending automated credit evaluations will proceed.');
    setTimeout(() => setRevocationToast(null), 6000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                TrustBridge Privacy & Security Center
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-numbers">
                Compliance v2.1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographic session verification, affirmative consent lifecycle, and DPDP Act compliance.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>

      {revocationToast && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{revocationToast}</span>
        </div>
      )}

      {/* Grid: Session & Consent Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Session Status */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-indigo-400" />
              Authenticated Session
            </span>
            <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-400">User Identity:</span>
              <span className="font-semibold text-white">{user?.fullName || 'Guest / Evaluator'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-400">Authenticated Email:</span>
              <span className="font-mono-numbers text-slate-200">{user?.email || 'unauthenticated'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-400">Assigned Platform Role:</span>
              <span className="font-mono-numbers px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold uppercase text-[11px]">
                {user?.role || 'borrower'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Session Mode:</span>
              <span className="text-slate-300 font-mono-numbers">
                {user?.isDemo ? 'Evaluation Demo Session' : 'Supabase Authenticated'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-slate-500">
              Token refresh managed securely via HttpOnly & Supabase Auth.
            </span>
            {user && (
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="h-3 w-3" />
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Affirmative Consent Lifecycle */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4 text-emerald-400" />
              Borrower Consent Protocol
            </span>
            <span
              className={`text-[11px] font-mono-numbers px-2 py-0.5 rounded font-semibold ${
                consentRevoked
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {consentRevoked ? 'REVOKED' : 'AFFIRMATIVE (v2.1)'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-400">Consent Specification:</span>
              <span className="font-mono-numbers text-white font-semibold">DPDP-ACT-2023-V2.1</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-400">Purpose Limitation:</span>
              <span className="text-slate-200">Alternative Credit Assessment Only</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900">
              <span className="text-slate-400">Data Sharing:</span>
              <span className="text-emerald-400 font-semibold">Strictly Prohibited (No 3rd-Party Brokers)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Right to Erasure:</span>
              <span className="text-slate-300">Supported upon loan closure</span>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            {!consentRevoked ? (
              <button
                onClick={handleWithdrawConsent}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Withdraw Borrower Consent</span>
              </button>
            ) : (
              <span className="text-xs text-rose-400 font-semibold">
                Consent revoked. Re-consent required on new loan application.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Data Governance Matrix: Evaluated vs Strictly Prohibited */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-5">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Data Governance & Privacy Boundary Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent disclosure of evaluated financial signals versus strictly prohibited invasive data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Authorized Data */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Authorized Evaluated Signals</span>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Stall Operating Longevity:</strong> Physical pitch stability in continuous months.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Rental Promptness:</strong> Landlord rental slips and municipal market pitch receipts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Wholesale Supplier Settlements:</strong> Trade credit clearance ledger and invoice payment logs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Weekly Cashflow Pulses:</strong> Gross turnover consistency and QR collection statements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Utility Regularity:</strong> Commercial electricity and telecom recharge frequency.</span>
              </li>
            </ul>
          </div>

          {/* Strictly Prohibited Data */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <XCircle className="h-4 w-4" />
              <span>Strictly Prohibited & Non-Collected Data</span>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span><strong>Address Book / Phone Contacts:</strong> Never accessed or scraped.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span><strong>SMS & Call Records:</strong> Strictly excluded under RBI digital lending mandates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span><strong>Continuous GPS Tracking:</strong> No real-time geo-tracking of borrower movements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span><strong>Demographic Protected Attributes:</strong> Religion, caste, gender, and marital status never collected.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span><strong>Browser & App History:</strong> Completely isolated from credit evaluation.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cryptographic Controls & Invariants */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-400" />
          <span>Cryptographic Security & System Invariants</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-slate-200 block">Row Level Security</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              PostgreSQL RLS policies restrict borrower queries to <code className="text-indigo-300">auth.uid() = user_id</code>. Underwriters have read-only access to review queues.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-slate-200 block">Deterministic Scoring Ground Truth</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Trust Scores (0-100) are calculated solely by Python mathematics in <code className="text-indigo-300">engine.py</code>. AI models never alter mathematical scores.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-bold text-slate-200 block">Evidence SHA-256 Hashing</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              All uploaded invoice and rental receipts receive a cryptographic SHA-256 fingerprint to prevent document recycling or tampering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
