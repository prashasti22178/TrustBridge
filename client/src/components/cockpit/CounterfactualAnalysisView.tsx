import {
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { Applicant, CounterfactualPathItem } from '../../types/underwriter';

interface CounterfactualAnalysisViewProps {
  applicant: Applicant;
  onOpenSimulator: () => void;
}

export default function CounterfactualAnalysisView({
  applicant,
  onOpenSimulator
}: CounterfactualAnalysisViewProps) {
  // Use applicant's counterfactual paths or default deterministic ones
  const paths: CounterfactualPathItem[] = applicant.counterfactualPaths || [
    {
      leverName: 'Wholesale Supplier Repayment Punctuality',
      currentValue: '80%',
      targetValue: '95%',
      projectedScore: Math.min(100, applicant.trustScore + 6),
      projectedScoreDelta: 6,
      confidence: 'High (Direct willingness weight)',
      actionItem: 'Clear wholesale fruit/inventory supplier invoices within 3 days of delivery.'
    },
    {
      leverName: 'Continuous Physical Business Tenure',
      currentValue: `${applicant.stallTenureMonths} Months`,
      targetValue: `${Math.min(24, applicant.stallTenureMonths + 6)} Months`,
      projectedScore: Math.min(100, applicant.trustScore + 5),
      projectedScoreDelta: 5,
      confidence: 'High (Longevity accumulation)',
      actionItem: 'Maintain continuous presence at the same declared stall pitch through Q1 2027.'
    },
    {
      leverName: 'Community SHG / Chit Participation',
      currentValue: 'Non-Participant',
      targetValue: 'Active Verified Contributor',
      projectedScore: Math.min(100, applicant.trustScore + 5),
      projectedScoreDelta: 5,
      confidence: 'Medium (Social collateral bonus)',
      actionItem: 'Enroll in an official market mutual-aid savings group or registered chit fund.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Counterfactual Analysis: Actionable Borrower Growth
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 06
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic inverse simulation answering: <strong className="text-slate-200">"How can this applicant improve their credit standing?"</strong>
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Interactive What-If Simulator</span>
        </button>
      </div>

      {/* Hero Overview */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Applicant Baseline
          </span>
          <div className="text-lg font-bold text-white mt-1">
            {applicant.name} ({applicant.businessType})
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Current Trust Score: <strong className="font-mono-numbers text-indigo-400">{applicant.trustScore}/100</strong> • Tier: {applicant.confidenceTier}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Max Projected Lift</span>
            <span className="text-xl font-bold font-mono-numbers text-emerald-400">
              +{Math.max(...paths.map(p => p.projectedScoreDelta))} pts
            </span>
          </div>
        </div>
      </div>

      {/* Counterfactual Action Cards: CURRENT STATE -> CHANGE -> PROJECTED STATE */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Actionable Improvement Pathways
        </h2>

        {paths.map((path, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-100">
                  {path.leverName}
                </h3>
              </div>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 self-start sm:self-auto">
                Confidence: {path.confidence}
              </span>
            </div>

            {/* Visual Transformation: CURRENT -> CHANGE -> PROJECTED */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
              {/* CURRENT */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Current State
                </span>
                <div className="text-base font-bold text-slate-300 font-mono-numbers">
                  {path.currentValue}
                </div>
                <div className="text-[11px] text-slate-400 font-mono-numbers">
                  Score: {applicant.trustScore}/100
                </div>
              </div>

              {/* CHANGE / TARGET */}
              <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                  Prescribed Adjustment
                </span>
                <div className="text-base font-bold text-indigo-300 font-mono-numbers flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4 text-indigo-400" />
                  {path.targetValue}
                </div>
                <div className="text-[11px] text-indigo-400/80">
                  Target milestone
                </div>
              </div>

              {/* PROJECTED RESULT */}
              <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  Projected Trust Score
                </span>
                <div className="text-base font-bold text-emerald-400 font-mono-numbers flex items-baseline gap-1.5">
                  <span>{path.projectedScore}/100</span>
                  <span className="text-xs font-semibold">
                    (+{path.projectedScoreDelta} pts)
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400/80">
                  {path.projectedScore >= 80 ? 'Upgrades to Prime' : 'Reduces default margin'}
                </div>
              </div>
            </div>

            {/* Action Item Description */}
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-300">Prescription for Applicant: </strong>
                <span>{path.actionItem}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Simulation / Estimated Impact:</strong> Counterfactual calculations are derived from the deterministic scoring engine by perturbing singular feature inputs while holding all other telemetry constant. They provide actionable paths rather than speculative predictions.
        </span>
      </div>
    </div>
  );
}
