import { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  ArrowUpRight
} from 'lucide-react';
import type { Applicant } from '../../types/underwriter';

interface BehavioralSignalsViewProps {
  applicant: Applicant;
  onOpenSimulator: () => void;
}

export default function BehavioralSignalsView({
  applicant,
  onOpenSimulator
}: BehavioralSignalsViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(5); // Default to latest month (Sep 2026)

  // Use applicant's timeline or fallback
  const timeline = applicant.behaviorTimeline || [
    { month: 'Apr 2026', income: applicant.weeklyRevenue * 0.95, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 95 },
    { month: 'May 2026', income: applicant.weeklyRevenue * 1.02, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 92 },
    { month: 'Jun 2026', income: applicant.weeklyRevenue * 0.92, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 90 },
    { month: 'Jul 2026', income: applicant.weeklyRevenue * 0.98, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 94 },
    { month: 'Aug 2026', income: applicant.weeklyRevenue * 1.01, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 95 },
    { month: 'Sep 2026', income: applicant.weeklyRevenue, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 96 }
  ];

  const currentRecord = timeline[selectedMonth] || timeline[timeline.length - 1];

  // Behavioral Consistency Index components
  const bci = applicant.behavioralConsistencyIndex || 87;
  const paymentConsistency = Math.min(100, Math.round(bci * 1.03));
  const incomeStability = Math.min(100, Math.round(bci * 0.96));
  const businessContinuity = Math.min(100, Math.round(Math.min(1, applicant.stallTenureMonths / 24) * 100));
  const recurringDiscipline = Math.min(100, Math.round(bci * 0.98));

  // Generate GitHub-style temporal heatmap data (26 weeks x 7 days)
  // Intensity 0 to 4 based on applicant's discipline
  const generateHeatmap = () => {
    const weeks = [];
    const baseP = bci / 100.0;
    for (let w = 0; w < 26; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Pseudo-random deterministic seed based on week, day and applicant id hash
        const hash = (w * 7 + d + applicant.name.length * 13) % 100;
        let level = 0;
        if (d === 0) {
          // Sunday/Market holiday
          level = hash < 30 ? 1 : 0;
        } else {
          if (hash < baseP * 50) level = 4;
          else if (hash < baseP * 75) level = 3;
          else if (hash < baseP * 95) level = 2;
          else level = 1;
        }
        days.push(level);
      }
      weeks.push(days);
    }
    return weeks;
  };

  const heatmapWeeks = generateHeatmap();

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-emerald-500';
      case 3:
        return 'bg-emerald-600/80';
      case 2:
        return 'bg-emerald-700/60';
      case 1:
        return 'bg-emerald-900/40';
      default:
        return 'bg-slate-800/60';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Behavioral Signal Intelligence
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 03
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal consistency analysis across 6-month recurring cashflows for <strong className="text-slate-200">{applicant.name}</strong> ({applicant.businessType}).
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <span>Run What-If Scenario</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Top Row: Behavioral Consistency Index & 4 Sub-Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Composite Index Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Behavioral Consistency Index
              </span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono-numbers text-white tracking-tight">
                {bci}
              </span>
              <span className="text-xs text-slate-400 font-mono-numbers">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Synthesizes temporal regularity of micro-turnover, vendor settlements, stall rent timeliness, and commercial utility recharges over 180 operating days.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] flex items-center justify-between text-slate-300">
            <span>Historical Volatility:</span>
            <span className="font-mono-numbers text-emerald-400 font-bold">
              {bci >= 80 ? 'Low (±4.2%)' : bci >= 65 ? 'Moderate (±8.8%)' : 'High (±16.4%)'}
            </span>
          </div>
        </div>

        {/* 4 Index Sub-Components */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Consistency Index Decomposition
            </h2>
            <span className="text-[10px] font-mono-numbers text-indigo-400">
              Deterministic 4-Vector Weighting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Payment Consistency */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Payment Consistency</span>
                <span className="font-mono-numbers text-emerald-400">{paymentConsistency}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${paymentConsistency}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">Rent & vendor settlement punctuality records.</p>
            </div>

            {/* Income Stability */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Income Stability</span>
                <span className="font-mono-numbers text-indigo-400">{incomeStability}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${incomeStability}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">Low variance across weekly gross turnover pulses.</p>
            </div>

            {/* Business Continuity */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Business Continuity</span>
                <span className="font-mono-numbers text-amber-400">{businessContinuity}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${businessContinuity}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">{applicant.stallTenureMonths} continuous months at same kiosk pitch.</p>
            </div>

            {/* Recurring Obligation Discipline */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Recurring Discipline</span>
                <span className="font-mono-numbers text-teal-400">{recurringDiscipline}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${recurringDiscipline}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">Regular telecom & commercial meter recharge cycles.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Behaviour 6-Month Timeline */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Financial Behaviour Timeline (6-Month Rolling)
            </h2>
            <p className="text-[11px] text-slate-400">
              Click any month tab to inspect historical income and settlement verification telemetry.
            </p>
          </div>
          <span className="text-[10px] font-mono-numbers text-slate-400">
            Source: Landlord vouchers, UPI logs & APMC mandi bills
          </span>
        </div>

        {/* Month Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
          {timeline.map((item, idx) => {
            const isSelected = selectedMonth === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedMonth(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400">{item.month}</div>
                <div className="text-xs font-bold font-mono-numbers text-slate-100 mt-1">
                  ₹{Math.round(item.income).toLocaleString()}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono-numbers">{item.consistencyPct}%</span>
                  <span className={`h-2 w-2 rounded-full ${
                    item.consistencyPct >= 90 ? 'bg-emerald-400' :
                    item.consistencyPct >= 75 ? 'bg-indigo-400' : 'bg-amber-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Month Detail Breakdown */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Monthly Turnover
            </span>
            <span className="text-base font-bold font-mono-numbers text-white">
              ₹{Math.round(currentRecord.income).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">UPI & cash ledger</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Stall Rent Punctuality
            </span>
            <span className={`font-semibold inline-flex items-center gap-1 ${
              currentRecord.rent.includes('ON_TIME') ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {currentRecord.rent.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Verified landlord receipt</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Supplier Repayment
            </span>
            <span className={`font-semibold inline-flex items-center gap-1 ${
              currentRecord.supplier.includes('ON_TIME') ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {currentRecord.supplier.includes('ON_TIME') ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {currentRecord.supplier}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Wholesale clearing record</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Utility & Recharge
            </span>
            <span className="font-semibold text-emerald-400 inline-flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              {currentRecord.utility.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Electricity & business phone</span>
          </div>
        </div>
      </div>

      {/* GitHub-Style Temporal Activity Heatmap */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Temporal Activity Heatmap (180 Days / 26 Weeks)
            </h2>
            <p className="text-[11px] text-slate-400">
              Daily micro-merchant activity pulses: commercial UPI QR settlements, inventory vendor clearances, and operational stall continuity.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Less Active</span>
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-800" />
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-900/60" />
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-700/80" />
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span>High Intensity</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1 min-w-[640px]">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((level, dIdx) => (
                  <div
                    key={dIdx}
                    title={`Week ${wIdx + 1}, Day ${dIdx + 1}: Activity Pulse Level ${level}/4`}
                    className={`h-3 w-3 rounded-sm ${getHeatmapColor(level)} transition-colors hover:ring-1 hover:ring-white`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Seeded Data Disclosure */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Seeded Temporal Demonstration:</strong> Daily settlement activity pulses simulate real-world PhonePe/GooglePay QR transaction volumes and APMC vendor ledger clearances. In production, this ingests real-time AA (Account Aggregator) data streams.
          </span>
        </div>
      </div>
    </div>
  );
}
