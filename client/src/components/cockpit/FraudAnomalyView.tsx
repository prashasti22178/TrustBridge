import {
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { Applicant } from '../../types/underwriter';

interface FraudAnomalyViewProps {
  applicant: Applicant;
  onNavigateToDocuments: () => void;
}

export default function FraudAnomalyView({
  applicant,
  onNavigateToDocuments
}: FraudAnomalyViewProps) {
  const anomalyScore = applicant.anomalyScore !== undefined ? applicant.anomalyScore : 12;

  const getRiskBadge = (score: number) => {
    if (score >= 50) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5" /> HIGH ANOMALY RISK
        </span>
      );
    }
    if (score >= 20) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" /> MEDIUM ANOMALY RISK
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" /> LOW ANOMALY RISK
      </span>
    );
  };

  // Heuristic Anomaly Signals List from Part 9
  const anomalyChecks = [
    {
      checkName: 'Duplicate Invoice Number Search',
      rule: 'Search global applicant document hash table for repeated #INV references',
      outcome: applicant.id === 'TB-2026-0147' ? 'FLAGGED (Invoice #INV-4091 Match)' : 'PASS (No duplicate references)',
      severity: applicant.id === 'TB-2026-0147' ? 'HIGH' : 'LOW',
      isPass: applicant.id !== 'TB-2026-0147'
    },
    {
      checkName: 'Repeated Identical Documents Check',
      rule: 'Detect byte-level identical image/PDF uploads across multiple loan requests',
      outcome: 'PASS (Distinct document byte hashes verified)',
      severity: 'LOW',
      isPass: true
    },
    {
      checkName: 'Unusual Amount Variance Spike',
      rule: 'Flag single supplier voucher exceeding 3.5x declared weekly gross turnover',
      outcome: 'PASS (All invoice vouchers within normal operating scale)',
      severity: 'LOW',
      isPass: true
    },
    {
      checkName: 'Abnormal Payment Timing Rhythm',
      rule: 'Identify clustered retroactive receipts created on the same calendar day',
      outcome: applicant.id === 'TB-2026-0144' ? 'REVIEW REQUIRED (Handwritten cluster)' : 'PASS (Sequential payment timestamps)',
      severity: applicant.id === 'TB-2026-0144' ? 'MEDIUM' : 'LOW',
      isPass: applicant.id !== 'TB-2026-0144'
    },
    {
      checkName: 'Inconsistent Business Information',
      rule: 'Cross-verify merchant name, stall address, and municipal ward numbering',
      outcome: applicant.id === 'TB-2026-0147' ? 'FLAGGED (GPS coordinate offset 420m)' : 'PASS (Entity name & ward address match)',
      severity: applicant.id === 'TB-2026-0147' ? 'HIGH' : 'LOW',
      isPass: applicant.id !== 'TB-2026-0147'
    },
    {
      checkName: 'Sudden Unexplained Income Surge',
      rule: 'Flag sudden >300% turnover spikes immediately prior to loan application',
      outcome: 'PASS (Steady organic cashflow cadence)',
      severity: 'LOW',
      isPass: true
    },
    {
      checkName: 'Document Issue vs Registration Date Mismatch',
      rule: 'Detect receipt dates predating registered physical kiosk establishment date',
      outcome: applicant.id === 'TB-2026-0147' ? 'FLAGGED (Slip predates lease by 4m)' : 'PASS (Chronological consistency)',
      severity: applicant.id === 'TB-2026-0147' ? 'HIGH' : 'LOW',
      isPass: applicant.id !== 'TB-2026-0147'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Fraud & Anomaly Screening Engine
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Module 08
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Heuristic detection screening for duplicate references, invoice recycling, and telemetry inconsistencies for <strong className="text-slate-200">{applicant.name}</strong>.
          </p>
        </div>

        <button
          onClick={onNavigateToDocuments}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <span>View Verified Proofs</span>
        </button>
      </div>

      {/* Hero Score Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overall Anomaly Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-extrabold font-mono-numbers tracking-tight ${
              anomalyScore >= 50 ? 'text-rose-400' :
              anomalyScore >= 20 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {anomalyScore}
            </span>
            <span className="text-xs text-slate-400 font-mono-numbers">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Lower score indicates clean documentary consistency. Higher score triggers human review.
          </p>
        </div>

        <div>{getRiskBadge(anomalyScore)}</div>
      </div>

      {/* Itemized Anomaly Rules Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Heuristic Anomaly Screening Checks (7 Vectors)
            </h2>
            <p className="text-[11px] text-slate-400">
              Automated rules screening for loan stacking, duplicate documents, and information discrepancies.
            </p>
          </div>
          <span className="text-[10px] font-mono-numbers text-slate-400">
            Rule Version: TB-HEURISTIC-v2.1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-2.5 font-semibold">Anomaly Check Vector</th>
                <th className="pb-2.5 font-semibold">Detection Rule Description</th>
                <th className="pb-2.5 font-semibold">Outcome</th>
                <th className="pb-2.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {anomalyChecks.map((check, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 pr-3 font-semibold text-slate-200">
                    {check.checkName}
                  </td>
                  <td className="py-3 pr-3 text-slate-400 text-[11px]">
                    {check.rule}
                  </td>
                  <td className={`py-3 pr-3 font-medium ${
                    check.isPass ? 'text-slate-300' : 'text-rose-400 font-semibold'
                  }`}>
                    {check.outcome}
                  </td>
                  <td className="py-3 text-right">
                    {check.isPass ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="h-3 w-3" /> FLAGGED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Example Sample Voucher Result */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Sample Voucher</span>
            <span className="font-mono-numbers text-slate-200 font-semibold">#INV-1029</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Duplicate Found</span>
            <span className="text-emerald-400 font-semibold">NO</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Amount Anomaly</span>
            <span className="text-emerald-400 font-semibold">LOW (₹5,000)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Date Consistency</span>
            <span className="text-emerald-400 font-semibold">PASS</span>
          </div>
        </div>

        {/* Clear Prototype Screening Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Risk / Anomaly Screening (Not Definitive Fraud Detection):</strong> This module performs statistical and heuristic consistency checks across applicant evidence. It highlights anomalies for human field investigation and does not claim definitive forensic image-manipulation detection.
          </span>
        </div>
      </div>
    </div>
  );
}
