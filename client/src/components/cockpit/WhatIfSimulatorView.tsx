import { useState, useEffect } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type { Applicant } from '../../types/underwriter';
import { simulateScenarioApi, type SimulationResult } from '../../lib/api';

interface WhatIfSimulatorViewProps {
  applicant: Applicant;
}

export default function WhatIfSimulatorView({ applicant }: WhatIfSimulatorViewProps) {
  // Baseline values from active applicant
  const baseIncome = applicant.weeklyRevenue;
  const baseRent = 95;
  const baseSupplier = 90;
  const baseTenure = applicant.stallTenureMonths;
  const baseChit = true;

  // Modifiable simulation state
  const [incomeDeltaPct, setIncomeDeltaPct] = useState<number>(-30); // Default to -30% shock from prompt
  const [supplierRepayPct, setSupplierRepayPct] = useState<number>(baseSupplier);
  const [rentTimelinessPct, setRentTimelinessPct] = useState<number>(baseRent);
  const [tenureMonths, setTenureMonths] = useState<number>(baseTenure);
  const [chitActive, setChitActive] = useState<boolean>(baseChit);

  // Simulation output state
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Re-run simulation whenever slider parameters change
  useEffect(() => {
    let isCancelled = false;
    setIsCalculating(true);

    const supplierDeltaPct = ((supplierRepayPct - baseSupplier) / Math.max(1, baseSupplier)) * 100;
    const rentDeltaPct = ((rentTimelinessPct - baseRent) / Math.max(1, baseRent)) * 100;

    simulateScenarioApi({
      baseline_signals: {
        stall_tenure_months: baseTenure,
        weekly_income: baseIncome,
        stall_rent_timeliness: baseRent,
        supplier_repayment_pct: baseSupplier,
        utility_recharge_pct: 85,
        chit_shg_active: baseChit,
        requested_loan: applicant.requestedAmount,
        repayment_weeks: applicant.repaymentWeeks
      },
      income_delta_pct: incomeDeltaPct,
      supplier_delta_pct: supplierDeltaPct,
      rent_delta_pct: rentDeltaPct,
      tenure_months_override: tenureMonths,
      chit_shg_override: chitActive
    }).then((res) => {
      if (!isCancelled) {
        setSimResult(res);
        setIsCalculating(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [
    applicant.id,
    baseIncome,
    baseTenure,
    incomeDeltaPct,
    supplierRepayPct,
    rentTimelinessPct,
    tenureMonths,
    chitActive
  ]);

  const resetToBaseline = () => {
    setIncomeDeltaPct(0);
    setSupplierRepayPct(baseSupplier);
    setRentTimelinessPct(baseRent);
    setTenureMonths(baseTenure);
    setChitActive(baseChit);
  };

  const simulatedIncome = Math.round(baseIncome * (1 + incomeDeltaPct / 100));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              What-If Risk & Scenario Simulator
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 10
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-destructive stress-testing cockpit for <strong className="text-slate-200">{applicant.name}</strong>. Modifying parameters tests risk resilience without altering database records.
          </p>
        </div>

        <button
          onClick={resetToBaseline}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Main Comparison Split: Sliders on Left, Live Outcome on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Underwriter Sliders */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Adjust Simulation Levers
            </h2>
            <span className="text-[10px] font-mono-numbers text-indigo-400">
              {isCalculating ? 'Calculating...' : 'Real-time recalculation'}
            </span>
          </div>

          {/* 1. Weekly Gross Turnover Slider (-50% to +50%) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-200">Weekly Gross Revenue Shock</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">
                {incomeDeltaPct > 0 ? `+${incomeDeltaPct}%` : `${incomeDeltaPct}%`} (₹{simulatedIncome.toLocaleString()}/wk)
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={incomeDeltaPct}
              onChange={(e) => setIncomeDeltaPct(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-numbers text-slate-400">
              <span>-50% Recession shock</span>
              <span>Baseline: ₹{baseIncome.toLocaleString()}</span>
              <span>+50% Growth surge</span>
            </div>
          </div>

          {/* 2. Supplier Repayment Punctuality (0-100%) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-200">Wholesale Supplier Settlement Punctuality</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">{supplierRepayPct}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={supplierRepayPct}
              onChange={(e) => setSupplierRepayPct(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-numbers text-slate-400">
              <span>30% Severe arrears</span>
              <span>Baseline: {baseSupplier}%</span>
              <span>100% Spot cash</span>
            </div>
          </div>

          {/* 3. Stall Rent Punctuality (0-100%) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-200">Stall Rent Payment Consistency</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">{rentTimelinessPct}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              value={rentTimelinessPct}
              onChange={(e) => setRentTimelinessPct(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-numbers text-slate-400">
              <span>40% Rent friction</span>
              <span>Baseline: {baseRent}%</span>
              <span>100% Flawless</span>
            </div>
          </div>

          {/* 4. Business Continuity Tenure (1 to 48 months) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-200">Continuous Stall Tenure Longevity</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">{tenureMonths} Months</span>
            </div>
            <input
              type="range"
              min="2"
              max="48"
              step="1"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-numbers text-slate-400">
              <span>2m Brand new kiosk</span>
              <span>Baseline: {baseTenure}m</span>
              <span>48m Veteran stall</span>
            </div>
          </div>

          {/* 5. Community SHG / Chit Toggle */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Community SHG / Chit Social Collateral</span>
              <span className="text-[10px] text-slate-400">Peer endorsement verification</span>
            </div>
            <button
              onClick={() => setChitActive(!chitActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chitActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {chitActive ? 'ACTIVE MEMBER' : 'NON-PARTICIPANT'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Comparison (CURRENT vs SIMULATED) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* CURRENT STATE CARD */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Current Ground Truth
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono-numbers text-slate-200">
                  {simResult ? simResult.baseline_score : applicant.trustScore}
                </span>
                <span className="text-xs text-slate-400 font-mono-numbers">/ 100</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 inline-block font-mono-numbers">
                {simResult ? simResult.baseline_risk_tier : 'MODERATE RISK'}
              </span>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono-numbers">
                <div>Ability: {simResult?.baseline_pillars.ability || 82}</div>
                <div>Willingness: {simResult?.baseline_pillars.willingness || 85}</div>
                <div>Stability: {simResult?.baseline_pillars.stability || 65}</div>
              </div>
            </div>

            {/* SIMULATED SCENARIO CARD */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              simResult && simResult.score_delta < 0
                ? 'bg-rose-950/20 border-rose-500/30'
                : simResult && simResult.score_delta > 0
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-indigo-950/20 border-indigo-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Simulated Scenario
                </span>
                {simResult && (
                  <span className={`text-xs font-bold font-mono-numbers ${
                    simResult.score_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {simResult.score_delta >= 0 ? `+${simResult.score_delta}` : simResult.score_delta} pts
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-extrabold font-mono-numbers ${
                  simResult && simResult.score_delta < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {simResult ? simResult.simulated_score : applicant.trustScore}
                </span>
                <span className="text-xs text-slate-400 font-mono-numbers">/ 100</span>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block font-mono-numbers ${
                simResult && simResult.score_delta < 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {simResult ? simResult.simulated_risk_tier : 'MODERATE RISK'}
              </span>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1 font-mono-numbers">
                <div>Ability: {simResult?.simulated_pillars.ability || 82}</div>
                <div>Willingness: {simResult?.simulated_pillars.willingness || 85}</div>
                <div>Stability: {simResult?.simulated_pillars.stability || 65}</div>
              </div>
            </div>
          </div>

          {/* Dynamic Scenario Explanation Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Causal Scenario Explanation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simResult?.scenario_explanation || 'Modifications simulate micro-business stress resilience.'}
            </p>
          </div>

          {/* Underwriter Guidance & Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Non-Destructive Guarantee:</span>
            </div>
            <p>
              Simulated runs are calculated purely in-memory. The real borrower profile for <strong className="text-slate-300">{applicant.name}</strong> stored in Supabase remains strictly unaffected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
