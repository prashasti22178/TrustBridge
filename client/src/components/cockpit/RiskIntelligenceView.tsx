import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import LineAreaChart from '../charts/LineAreaChart';
import BarChart from '../charts/BarChart';
import type { Applicant } from '../../types/underwriter';

interface RiskIntelligenceViewProps {
  applicant: Applicant;
  onOpenSimulator?: () => void;
}

export default function RiskIntelligenceView({
  applicant,
  onOpenSimulator
}: RiskIntelligenceViewProps) {
  // Deterioration trajectory
  const trajectory = applicant.riskTrajectory || 'STABLE';
  const isDeteriorating = trajectory === 'DETERIORATING';

  // 6-Month cashflow & consistency timeline
  const timeline = applicant.behaviorTimeline || [
    { month: 'May 2026', income: applicant.weeklyRevenue * 0.95, consistencyPct: 92 },
    { month: 'Jun 2026', income: applicant.weeklyRevenue * 1.02, consistencyPct: 94 },
    { month: 'Jul 2026', income: applicant.weeklyRevenue * 0.94, consistencyPct: 90 },
    { month: 'Aug 2026', income: applicant.weeklyRevenue * 0.98, consistencyPct: 93 },
    { month: 'Sep 2026', income: applicant.weeklyRevenue * 1.01, consistencyPct: 95 },
    { month: 'Oct 2026', income: applicant.weeklyRevenue, consistencyPct: 96 }
  ];

  const timelineLabels = timeline.map(t => t.month);
  const incomeSeries = [
    {
      name: 'Weekly Revenue (₹)',
      data: timeline.map(t => Math.round(t.income)),
      color: '#6366f1'
    }
  ];

  // Pillar Consistency Metrics (B. Behavioral Trends)
  const bci = applicant.behavioralConsistencyIndex || 87;
  const behavioralPillars = [
    {
      label: 'Income Consistency',
      value: Math.min(100, Math.round(bci * 0.96)),
      color: '#6366f1',
      description: 'Variance in weekly cash deposits and UPI merchant sweeps'
    },
    {
      label: 'Supplier Repayment',
      value: isDeteriorating ? 68 : Math.min(100, Math.round(bci * 1.02)),
      color: isDeteriorating ? '#f43f5e' : '#10b981',
      description: 'APMC mandi vendor invoice clearance speed'
    },
    {
      label: 'Rent Consistency',
      value: isDeteriorating ? 72 : Math.min(100, Math.round(bci * 1.05)),
      color: isDeteriorating ? '#f59e0b' : '#10b981',
      description: 'Market pitch & municipal stall lease settlement'
    },
    {
      label: 'Transaction Behavior',
      value: Math.min(100, Math.round(bci * 0.98)),
      color: '#06b6d4',
      description: 'Daily transaction frequency and QR settlement cadence'
    },
    {
      label: 'Business Stability',
      value: Math.min(100, Math.round(Math.min(1, applicant.stallTenureMonths / 24) * 100)),
      color: '#8b5cf6',
      description: `${applicant.stallTenureMonths} months confirmed pitch location`
    }
  ];

  // C. Early Warnings Trajectory Points
  // E.g. Suresh Patel: 78 -> 76 -> 74 -> 71 -> 69
  // E.g. Ravi Kumar: 72 -> 74 -> 75 -> 77 -> 78
  const trajectoryLabels = ['T-4 (Jun)', 'T-3 (Jul)', 'T-2 (Aug)', 'T-1 (Sep)', 'Current (Oct)'];
  const trajectoryData = isDeteriorating
    ? [78, 76, 74, 71, 69]
    : [
        Math.max(40, applicant.trustScore - 6),
        Math.max(40, applicant.trustScore - 4),
        Math.max(40, applicant.trustScore - 3),
        Math.max(40, applicant.trustScore - 1),
        applicant.trustScore
      ];

  const trajectorySeries = [
    {
      name: `${applicant.name} Score Trajectory`,
      data: trajectoryData,
      color: isDeteriorating ? '#f43f5e' : '#10b981'
    }
  ];

  // Specific deterioration reasons
  const deteriorationReasons = isDeteriorating
    ? [
        {
          id: 'det-1',
          text: 'Supplier repayment declined from 90% to 68% over the last 60 days.',
          severity: 'CRITICAL',
          icon: AlertTriangle
        },
        {
          id: 'det-2',
          text: 'Income volatility increased with 2 consecutive delayed pitch rental settlements.',
          severity: 'HIGH',
          icon: AlertTriangle
        },
        {
          id: 'det-3',
          text: 'Average daily merchant QR ticket volume dropped by 18%.',
          severity: 'MEDIUM',
          icon: AlertTriangle
        }
      ]
    : [
        {
          id: 'pos-1',
          text: 'Consistent 100% on-time wholesale supplier settlement for 5 consecutive months.',
          severity: 'POSITIVE',
          icon: CheckCircle2
        },
        {
          id: 'pos-2',
          text: 'Stable monthly stall rent clearance with zero municipal violation flags.',
          severity: 'POSITIVE',
          icon: CheckCircle2
        },
        {
          id: 'pos-3',
          text: 'Positive income trajectory with low variance in weekly gross revenue.',
          severity: 'POSITIVE',
          icon: CheckCircle2
        }
      ];

  const getRiskTierBadge = (tier?: string) => {
    switch (tier) {
      case 'LOW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            LOW RISK (Prime Micro)
          </span>
        );
      case 'MODERATE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            MODERATE RISK (Standard Underwriting)
          </span>
        );
      case 'HIGH':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            HIGH RISK (Surveillance Active)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Risk Intelligence: {applicant.name}
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Active Context
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic underwriting surveillance combining real-time behavioral signals, cashflow volatility, and early warning trajectory.
          </p>
        </div>

        {onOpenSimulator && (
          <button
            type="button"
            onClick={onOpenSimulator}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Stress Test Scenario</span>
          </button>
        )}
      </div>

      {/* ================================================== */}
      {/* SECTION A: TRUST SCORE VISUALIZATION HERO */}
      {/* ================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Large Score Card */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-3 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            A. Calculated Trust Score
          </span>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold font-mono-numbers text-white tracking-tight">
              {applicant.trustScore}
            </span>
            <span className="text-lg text-slate-400 font-mono-numbers">/ 100</span>
          </div>

          <div className="flex items-center gap-2">
            {getRiskTierBadge(applicant.riskTier)}
            <span className="text-xs text-slate-400 font-mono-numbers">
              {applicant.confidenceTier} Tier
            </span>
          </div>

          <p className="text-xs text-slate-400 pt-1">
            Deterministic rating computed across Ability (40%), Willingness (35%), and Stability (25%).
          </p>
        </div>

        {/* Score Context & Risk Trajectory Summary */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Trajectory Status:
            </span>
            <div className="flex items-center gap-1.5">
              {isDeteriorating ? (
                <span className="text-xs font-bold text-rose-400 inline-flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" /> DETERIORATING ({trajectoryData[0]} → {trajectoryData[trajectoryData.length - 1]})
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> STABLE / IMPROVING ({trajectoryData[0]} → {trajectoryData[trajectoryData.length - 1]})
                </span>
              )}
            </div>
          </div>

          {/* Trajectory String representation: e.g. 78 → 76 → 74 → 71 → 69 */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Trajectory Path:</span>
            <div className="flex items-center gap-2 font-mono-numbers text-sm font-bold">
              {trajectoryData.map((val, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span
                    className={
                      idx === trajectoryData.length - 1
                        ? isDeteriorating
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                        : 'text-slate-300'
                    }
                  >
                    {val}
                  </span>
                  {idx < trajectoryData.length - 1 && (
                    <span className="text-slate-600 font-normal">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Declared Business</span>
              <strong className="text-white text-xs block truncate mt-0.5">{applicant.businessType}</strong>
              <span className="text-[10px] text-slate-400">{applicant.stallTenureMonths} Mo at Pitch</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Requested Facility</span>
              <strong className="text-emerald-400 text-xs block font-mono-numbers mt-0.5">
                ₹{applicant.requestedAmount.toLocaleString()}
              </strong>
              <span className="text-[10px] text-slate-400">
                Recommended: ₹{Math.round(applicant.requestedAmount * 0.85).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SECTION B: BEHAVIORAL TRENDS (VISUAL CHARTS) */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Behavioral Pillars Horizontal Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              B. Behavioral Consistency Breakdown
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pillar-by-pillar discipline score on a 0–100 normalized index
            </p>
          </div>

          <div className="pt-2">
            <BarChart
              data={behavioralPillars.map(p => ({
                label: p.label,
                value: p.value,
                color: p.color
              }))}
              height={220}
              horizontal={true}
              unit=" pts"
              benchmarkValue={80}
              benchmarkLabel="Prime Benchmark (80)"
            />
          </div>

          <div className="text-[11px] text-slate-400 italic">
            * Rent and supplier repayment punctuality contribute 35% to total Trust Score.
          </div>
        </div>

        {/* 6-Month Cashflow & Consistency Area Chart (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cashflow & Consistency Timeline
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                6-month historical stability across weekly turnover pulses
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Mean: ₹{applicant.weeklyRevenue.toLocaleString()} / wk
            </span>
          </div>

          <div>
            <LineAreaChart
              labels={timelineLabels}
              series={incomeSeries}
              height={220}
              unit=" ₹"
            />
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Verified through APMC mandi receipts & merchant QR log</span>
            <span className="text-emerald-400 font-semibold">Variance: Low</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SECTION C: EARLY WARNINGS & DETERIORATION TIMELINE */}
      {/* ================================================== */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${isDeteriorating ? 'text-rose-400' : 'text-emerald-400'}`} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                C. Early Warning Score Trajectory & Deterioration Signals
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Continuous monitoring trajectory detecting payment slippage and cashflow distress before default.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border font-mono-numbers ${
              isDeteriorating
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {isDeteriorating ? '⚠ ACTIVE DETERIORATION' : '✓ HEALTHY PROFILE'}
            </span>
          </div>
        </div>

        {/* Score Trajectory Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7">
            <LineAreaChart
              labels={trajectoryLabels}
              series={trajectorySeries}
              height={200}
              unit=" pts"
            />
          </div>

          {/* Reasons for Deterioration / Positive Signals */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {isDeteriorating ? 'Identified Deterioration Factors:' : 'Key Stability Indicators:'}
            </span>

            {deteriorationReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.id}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    isDeteriorating
                      ? 'bg-rose-950/20 border-rose-500/25 text-rose-200'
                      : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-200'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      isDeteriorating ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  />
                  <p className="text-xs leading-snug">{reason.text}</p>
                </div>
              );
            })}

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Underwriter Action:</span>
              <span className="font-semibold text-slate-300">
                {isDeteriorating ? 'Pause facility or request updated invoice' : 'Eligible for starter credit facility'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
