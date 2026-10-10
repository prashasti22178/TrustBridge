import { useState } from 'react';
import {
  CheckCircle2,
  Info
} from 'lucide-react';
import BarChart from '../charts/BarChart';

export default function FairnessLabView() {
  const [activeMetricTab, setActiveMetricTab] = useState<'APPROVAL' | 'SCORE'>('APPROVAL');

  // Chart 1: Approval Rate Comparison across groups
  const approvalRateData = [
    { label: 'Male Micro-Borrowers', value: 68, color: '#6366f1' },
    { label: 'Female Micro-Borrowers', value: 70, color: '#10b981' },
    { label: 'Tier-1 Metro Pitch', value: 69, color: '#06b6d4' },
    { label: 'Tier-2/3 Semi-Urban', value: 67, color: '#8b5cf6' }
  ];

  // Chart 2: Average Score Distribution across groups
  const scoreDistributionData = [
    { label: 'Male Micro-Borrowers', value: 72, color: '#6366f1' },
    { label: 'Female Micro-Borrowers', value: 73, color: '#10b981' },
    { label: 'Tier-1 Metro Pitch', value: 72, color: '#06b6d4' },
    { label: 'Tier-2/3 Semi-Urban', value: 71, color: '#8b5cf6' }
  ];

  const allowedAuditedSignals = [
    { name: 'Stall rent payment timeliness', status: 'AUDITED & APPROVED', desc: 'Landlord rent vouchers and lease agreements' },
    { name: 'Wholesale supplier invoice clearance', status: 'AUDITED & APPROVED', desc: 'APMC mandi vendor settlement slips' },
    { name: 'Commercial electricity & utility pulses', status: 'AUDITED & APPROVED', desc: 'Official utility and meter records' },
    { name: 'Pitch operational longevity', status: 'AUDITED & APPROVED', desc: 'Municipal stall location duration' }
  ];

  const monitoredProxies = [
    { name: 'Geographic Pincode Density', status: 'ACTIVE MONITORING', note: 'Monitored to prevent unintentional rural/semi-urban redlining' },
    { name: 'Bank Branch Proximity', status: 'EXCLUDED FROM ENGINE', note: 'Explicitly omitted to avoid physical branch access bias' },
    { name: 'Borrower Religion / Caste / Gender', status: 'EXCLUDED BY DESIGN', note: 'Zero protected demographic fields exist in scoring schema' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Fairness Monitoring & Statistical Parity
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Four-Fifths Compliant (0.94)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous surveillance of demographic parity, disparate impact ratios, and feature governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-numbers px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
            Demo / Synthetic Dataset
          </span>
        </div>
      </div>

      {/* Relevant Fairness Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Disparate Impact Ratio */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Disparate Impact Ratio</span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-400 tracking-tight">
            0.94
          </div>
          <div className="text-[11px] text-slate-400">
            Threshold: ≥ 0.80 (Four-Fifths Rule)
          </div>
        </div>

        {/* 2. Demographic Parity Difference */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Approval Parity Difference</span>
          <div className="text-2xl font-bold font-mono-numbers text-indigo-400 tracking-tight">
            +2.3%
          </div>
          <div className="text-[11px] text-slate-400">
            Within ±5.0% compliance band
          </div>
        </div>

        {/* 3. False Positive Parity Diff */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">False Positive Parity Diff</span>
          <div className="text-2xl font-bold font-mono-numbers text-slate-200 tracking-tight">
            0.018
          </div>
          <div className="text-[11px] text-slate-400">
            FPR parity tolerance ≤ 0.05
          </div>
        </div>

        {/* 4. Monitoring Status */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Monitoring Status</span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-400 tracking-tight flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5" /> PASSED
          </div>
          <div className="text-[11px] text-slate-400">
            Continuous automated telemetry
          </div>
        </div>
      </div>

      {/* Row: Visual Comparison Charts */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Demographic Group Comparisons
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Evaluating underwriting outcomes across gender and geographic sectors
            </p>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveMetricTab('APPROVAL')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeMetricTab === 'APPROVAL'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Approval Rate (%)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetricTab('SCORE')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeMetricTab === 'SCORE'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Trust Score Avg (pts)
            </button>
          </div>
        </div>

        <div>
          {activeMetricTab === 'APPROVAL' ? (
            <BarChart
              data={approvalRateData}
              height={220}
              benchmarkValue={68}
              benchmarkLabel="Portfolio Baseline (68%)"
              unit="%"
            />
          ) : (
            <BarChart
              data={scoreDistributionData}
              height={220}
              benchmarkValue={71}
              benchmarkLabel="Portfolio Avg (71)"
              unit=" pts"
            />
          )}
        </div>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
          <span>* High consistency across female and semi-urban groups confirms absence of systematic exclusionary bias.</span>
          <span className="font-mono-numbers text-slate-400">Sample: 1,284 Records</span>
        </div>
      </div>

      {/* Row: Feature Governance & Monitored Proxies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Approved Input Signals */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Audited Behavioral Feature Set
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Only explainable, behaviorally justified cashflow signals are incorporated
            </p>
          </div>

          <div className="space-y-2">
            {allowedAuditedSignals.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monitored Proxies & Redlining Guards */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proxy Risk Surveillance
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Continuous monitoring guards against latent demographic correlation
            </p>
          </div>

          <div className="space-y-2">
            {monitoredProxies.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.note}</div>
                </div>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory / Ethical Notice */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-slate-200">Fairness Monitoring Disclaimer:</strong> TrustBridge engages in proactive fairness monitoring and statistical disparity audits across all scoring iterations. We do not claim our models are universally "bias-free," as all underwriting decisions must remain subject to human underwriter review, statutory non-discrimination mandates, and regular disparate impact calibration.
        </p>
      </div>
    </div>
  );
}
