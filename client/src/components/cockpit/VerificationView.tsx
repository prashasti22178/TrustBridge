import {
  CheckCircle2,
  AlertTriangle,
  Calendar,
  DollarSign,
  Copy,
  Building,
  Activity,
  ChevronDown
} from 'lucide-react';
import type { Applicant } from '../../types/underwriter';

interface VerificationViewProps {
  applicant: Applicant;
  applicants?: Applicant[];
  onSelectApplicant?: (applicant: Applicant) => void;
}

export default function VerificationView({
  applicant,
  applicants = [],
  onSelectApplicant
}: VerificationViewProps) {
  const overallScore = applicant.documentTrustScore || 94;
  const isHighRisk = applicant.riskTier === 'HIGH';

  // 4 Primary Document Categories specified in prompt:
  // ✓ Rent Receipt, ✓ Supplier Invoice, ✓ Utility Bill, ⚠/✓ Transaction Evidence
  const documents: {
    category: string;
    name: string;
    status: 'VERIFIED' | 'NEEDS_REVIEW' | 'PENDING';
    date: string;
    details: string;
  }[] = [
    {
      category: 'Rent Receipt',
      name: 'Municipal Market Pitch Rent Voucher #2026-09',
      status: 'VERIFIED',
      date: 'Sep 28, 2026',
      details: 'Landlord signature and municipal stamp matched official registry.'
    },
    {
      category: 'Supplier Invoice',
      name: 'APMC Wholesale Mandi Inventory Slip #INV-8821',
      status: 'VERIFIED',
      date: 'Sep 29, 2026',
      details: 'Wholesale fruit supplier confirmed receipt of payment.'
    },
    {
      category: 'Utility Bill',
      name: 'BESCOM Commercial Power Statement',
      status: 'VERIFIED',
      date: 'Sep 22, 2026',
      details: 'Commercial meter ID matches declared stall address.'
    },
    {
      category: 'Transaction Evidence',
      name: 'Merchant UPI Settlement QR Log (30-day export)',
      status: isHighRisk ? 'NEEDS_REVIEW' : 'VERIFIED',
      date: 'Oct 02, 2026',
      details: isHighRisk
        ? 'Discrepancy detected between claimed weekly volume and daily batch clearances.'
        : 'Continuous daily turnover pulses validated with 96% consistency.'
    }
  ];

  // 5 Specific Verification Checks specified in prompt:
  // 1. Date consistency
  // 2. Amount consistency
  // 3. Duplicate detection
  // 4. Business information consistency
  // 5. Transaction consistency
  const verificationChecks = [
    {
      id: 'chk-1',
      name: 'Date Consistency',
      status: 'PASSED',
      icon: Calendar,
      description: 'Document issuance timestamps align with monthly accounting cycles without retroactive anomalies.'
    },
    {
      id: 'chk-2',
      name: 'Amount Consistency',
      status: 'PASSED',
      icon: DollarSign,
      description: 'Stated weekly revenue (₹' + applicant.weeklyRevenue.toLocaleString() + ') matches receipt voucher totals within a 3.4% tolerance.'
    },
    {
      id: 'chk-3',
      name: 'Duplicate Detection',
      status: 'PASSED',
      icon: Copy,
      description: 'Cryptographic SHA-256 fingerprint checked against cross-lender database; zero collision or recycled evidence.'
    },
    {
      id: 'chk-4',
      name: 'Business Information Consistency',
      status: 'PASSED',
      icon: Building,
      description: 'Business name, owner identity, and declared market location match physical stall verification.'
    },
    {
      id: 'chk-5',
      name: 'Transaction Consistency',
      status: isHighRisk ? 'FLAGGED' : 'PASSED',
      icon: Activity,
      description: isHighRisk
        ? 'Transaction rhythm exhibits unexplained multi-day gaps in UPI merchant batch settlements.'
        : 'Daily transaction frequency demonstrates continuous recurring customer activity.'
    }
  ];

  const passedCount = verificationChecks.filter(c => c.status === 'PASSED').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Applicant Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Evidence & Document Verification
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Integrity Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated verification checks and document authenticity scoring for alternative credit evidence.
          </p>
        </div>

        {applicants.length > 0 && onSelectApplicant && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Applicant:</span>
            <div className="relative">
              <select
                value={applicant.id}
                onChange={(e) => {
                  const target = applicants.find(a => a.id === e.target.value);
                  if (target) onSelectApplicant(target);
                }}
                className="appearance-none bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-indigo-500 font-semibold"
              >
                {applicants.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.businessType})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Hero Overview: Overall Verification Score */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 pr-0 md:pr-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overall Verification Score
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold font-mono-numbers text-emerald-400 tracking-tight">
              {overallScore}
            </span>
            <span className="text-lg text-slate-400 font-mono-numbers">/ 100</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              HIGH CONFIDENCE
            </span>
            <span className="text-xs text-slate-400 font-mono-numbers">
              {passedCount} / {verificationChecks.length} Checks Validated
            </span>
          </div>
        </div>

        <div className="md:col-span-8 space-y-2 text-xs text-slate-400">
          <div className="text-sm font-bold text-white">
            Verification Protocol: {applicant.name} ({applicant.id})
          </div>
          <p>
            Evidence documents are verified using optical character parsing, cryptographic tamper hashing, and cross-source consistency checks against municipal and APMC wholesale registries.
          </p>
          <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-400">
            <span>Business: <strong className="text-slate-300">{applicant.businessType}</strong></span>
            <span>Pitch Tenure: <strong className="text-slate-300 font-mono-numbers">{applicant.stallTenureMonths} Months</strong></span>
            <span>Anti-Fraud Check: <strong className="text-emerald-400 font-mono-numbers">PASSED</strong></span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* DOCUMENTS CHECKLIST */}
      {/* ================================================== */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Submitted Proof Documents
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Primary alternative underwriting evidence provided by borrower
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono-numbers">
            4 of 4 Submitted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, idx) => {
            const isVerified = doc.status === 'VERIFIED';
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isVerified
                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isVerified
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {isVerified ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{doc.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                          isVerified
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        }`}>
                          {isVerified ? '✓ VERIFIED' : '⚠ NEEDS REVIEW'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-300 mt-1">{doc.name}</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{doc.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-numbers shrink-0">
                    {doc.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* 5 CORE VERIFICATION CHECKS */}
      {/* ================================================== */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Integrity & Cross-Consistency Checks
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              5-point verification matrix protecting against synthetic identities and forged receipts
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 font-mono-numbers">
            {passedCount} / 5 Checks Passed
          </span>
        </div>

        <div className="space-y-3">
          {verificationChecks.map((chk) => {
            const Icon = chk.icon;
            const isPassed = chk.status === 'PASSED';

            return (
              <div
                key={chk.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isPassed ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{chk.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        isPassed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}>
                        {isPassed ? '✓ PASSED' : '⚠ FLAGGED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      {chk.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-mono-numbers text-slate-400 uppercase">
                    Automated
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
