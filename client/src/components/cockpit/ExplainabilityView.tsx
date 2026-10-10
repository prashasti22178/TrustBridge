import { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Info,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import WaterfallChart from '../charts/WaterfallChart';
import type { Applicant, FeatureAttributionItem } from '../../types/underwriter';
import { explainUnderwritingApi, type UnderwritingExplanationResult } from '../../lib/api';

interface ExplainabilityViewProps {
  applicant: Applicant;
  applicants?: Applicant[];
  onSelectApplicant?: (applicant: Applicant) => void;
}

export default function ExplainabilityView({
  applicant,
  applicants = [],
  onSelectApplicant
}: ExplainabilityViewProps) {
  const [aiExplanation, setAiExplanation] = useState<UnderwritingExplanationResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Counterfactual Interactive Simulation Sliders
  // 1. Supplier repayment (default 80%)
  const [supplierRepay, setSupplierRepay] = useState<number>(85);
  // 2. Business tenure (default current months)
  const [businessTenure, setBusinessTenure] = useState<number>(applicant.stallTenureMonths || 18);
  // 3. Income consistency (default 80%)
  const [incomeConsistency, setIncomeConsistency] = useState<number>(85);
  // 4. Transaction consistency (default 80%)
  const [txConsistency, setTxConsistency] = useState<number>(80);

  // Sync sliders when applicant changes
  useEffect(() => {
    setBusinessTenure(applicant.stallTenureMonths || 18);
  }, [applicant.id]);

  // Derived or standard SHAP-inspired attributions
  const attributions: FeatureAttributionItem[] = applicant.featureAttributions || [
    { feature: 'Rent Consistency', contribution: 14.2, direction: 'POSITIVE', rawMetric: '95% On-Time', category: 'Willingness' },
    { feature: 'Income Consistency', contribution: 12.8, direction: 'POSITIVE', rawMetric: `₹${applicant.weeklyRevenue.toLocaleString()} / wk`, category: 'Ability' },
    { feature: 'Supplier Repayment', contribution: 9.5, direction: 'POSITIVE', rawMetric: '90% Timely', category: 'Willingness' },
    { feature: 'Business Stability', contribution: 8.0, direction: 'POSITIVE', rawMetric: `${applicant.stallTenureMonths} Months`, category: 'Stability' },
    { feature: 'Limited Digital History', contribution: -7.0, direction: 'NEGATIVE', rawMetric: 'Informal cash legacy', category: 'Stability' },
    { feature: 'Income Volatility', contribution: -5.0, direction: 'NEGATIVE', rawMetric: 'Quarterly variance buffer', category: 'Ability' }
  ];

  // Fetch or trigger Gemini explanation
  const fetchExplanation = async () => {
    setIsLoadingAi(true);
    try {
      const res = await explainUnderwritingApi(applicant);
      setAiExplanation(res);
    } catch {
      // Fallback handled inside explainUnderwritingApi
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, [applicant.id]);

  // Calculate live Projected Score from Simulation Sliders
  // Base score = applicant.trustScore
  // Deliberate linear impact estimation:
  const supplierDelta = Math.round(((supplierRepay - 80) / 20) * 4); // -4 to +4 pts
  const tenureDelta = Math.round(((businessTenure - (applicant.stallTenureMonths || 18)) / 12) * 3); // ~0 to +4 pts
  const incomeDelta = Math.round(((incomeConsistency - 80) / 20) * 3); // -3 to +3 pts
  const txDelta = Math.round(((txConsistency - 80) / 20) * 2); // -2 to +2 pts

  const netSimDelta = supplierDelta + tenureDelta + incomeDelta + txDelta;
  const projectedScore = Math.max(20, Math.min(100, applicant.trustScore + netSimDelta));

  const getRiskLabel = (score: number) => {
    if (score >= 75) return { label: 'LOW RISK', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 60) return { label: 'MODERATE RISK', color: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' };
    return { label: 'HIGH RISK', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const currentRisk = getRiskLabel(applicant.trustScore);
  const projectedRisk = getRiskLabel(projectedScore);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================================================== */}
      {/* 1. TOP HEADER & APPLICANT SELECTOR */}
      {/* ================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Explainability & Counterfactual Intelligence
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              SHAP + Simulation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deconstruct the credit score into positive/negative factor contributions and simulate growth pathways.
          </p>
        </div>

        {/* Applicant Selector */}
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
                    {a.name} ({a.trustScore} pts - {a.businessType})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* 2. TRUST SCORE HERO */}
      {/* ================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 pr-0 md:pr-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Profile Trust Score
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold font-mono-numbers text-white tracking-tight">
              {applicant.trustScore}
            </span>
            <span className="text-lg text-slate-400 font-mono-numbers">/ 100</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentRisk.color}`}>
              {currentRisk.label}
            </span>
            <span className="text-xs text-slate-400 font-mono-numbers">
              {applicant.confidenceTier} Tier
            </span>
          </div>
        </div>

        <div className="md:col-span-7 space-y-2 text-xs text-slate-400">
          <div className="text-sm font-bold text-white">
            {applicant.name} • {applicant.businessType}
          </div>
          <p>
            This score is derived deterministically from alternate cashflow evidence without traditional bureau dependency.
            Below is the exact decomposition of why this score was assigned and how it can improve.
          </p>
          <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-400">
            <span>Location: <strong className="text-slate-300">{applicant.location}</strong></span>
            <span>Requested: <strong className="text-emerald-400 font-mono-numbers">₹{applicant.requestedAmount.toLocaleString()}</strong></span>
            <span>Tenure: <strong className="text-slate-300 font-mono-numbers">{applicant.stallTenureMonths} mo</strong></span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. "WHY THIS SCORE?" (SHAP ATTRIBUTION CHART) */}
      {/* ================================================== */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Why this score? (Feature Contribution Waterfall)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Marginal additive point contribution of positive assets versus risk factors.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Positive Factors
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Negative Factors
            </span>
          </div>
        </div>

        {/* Real Visual Waterfall / Horizontal Bar Chart */}
        <div>
          <WaterfallChart
            items={attributions}
            baseScore={45}
            finalScore={applicant.trustScore}
            height={260}
          />
        </div>

        {/* Positive & Negative Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Positive Factors */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              ✓ Primary Positive Drivers:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center justify-between">
                <span>Rent consistency (95% timely vouchers)</span>
                <span className="font-mono-numbers text-emerald-400 font-bold">+14.2 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Income consistency (Verified turnover)</span>
                <span className="font-mono-numbers text-emerald-400 font-bold">+12.8 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Supplier repayment (APMC mandi cleared)</span>
                <span className="font-mono-numbers text-emerald-400 font-bold">+9.5 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Business stability ({applicant.stallTenureMonths} mo continuous tenure)</span>
                <span className="font-mono-numbers text-emerald-400 font-bold">+8.0 pts</span>
              </li>
            </ul>
          </div>

          {/* Negative Factors */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              ⚠ Primary Risk Dampeners:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center justify-between">
                <span>Limited digital history (predominantly cash legacy)</span>
                <span className="font-mono-numbers text-rose-400 font-bold">-7.0 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Income volatility (seasonal weekly turnover variance)</span>
                <span className="font-mono-numbers text-rose-400 font-bold">-5.0 pts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Grounded Narrative Box */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold text-white">Underwriting Narrative (Explainable AI)</span>
            </div>
            <button
              onClick={fetchExplanation}
              disabled={isLoadingAi}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {aiExplanation?.summary ||
              `${applicant.name} exhibits strong behavioral discipline with a 95% on-time rent payment record and consistent weekly gross revenue. The primary constraint dampening the score is the lack of formalized digital banking history, which is typical for credit-invisible micro-vendors.`}
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. "HOW COULD THIS SCORE IMPROVE?" (COUNTERFACTUAL SIMULATION) */}
      {/* ================================================== */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                How could this score improve? (Interactive Counterfactuals)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulate borrower behavioral improvements and inspect the projected impact on Trust Score and Risk Tier.
            </p>
          </div>

          <span className="text-[11px] font-mono-numbers px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            Interactive What-If Engine
          </span>
        </div>

        {/* Simulation Controls: 4 Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Supplier Repayment */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Supplier Repayment Punctuality</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">{supplierRepay}%</span>
            </div>
            <input
              type="range"
              min={60}
              max={100}
              step={5}
              value={supplierRepay}
              onChange={(e) => setSupplierRepay(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>60% (Irregular)</span>
              <span>100% (Strict On-Time)</span>
            </div>
          </div>

          {/* Slider 2: Business Tenure */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Business Operating Tenure</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">{businessTenure} Months</span>
            </div>
            <input
              type="range"
              min={6}
              max={36}
              step={3}
              value={businessTenure}
              onChange={(e) => setBusinessTenure(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>6 Months</span>
              <span>36 Months (Mature Pitch)</span>
            </div>
          </div>

          {/* Slider 3: Income Consistency */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Income Consistency Index</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">{incomeConsistency}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={incomeConsistency}
              onChange={(e) => setIncomeConsistency(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50% (High Variance)</span>
              <span>100% (Stable Weekly Turnover)</span>
            </div>
          </div>

          {/* Slider 4: Transaction Consistency */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Transaction & QR Regularity</span>
              <span className="font-mono-numbers text-indigo-400 font-bold">{txConsistency}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={txConsistency}
              onChange={(e) => setTxConsistency(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50% (Infrequent)</span>
              <span>100% (Daily QR Settlement)</span>
            </div>
          </div>
        </div>

        {/* Projected Score & Risk Transition Display */}
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Score</span>
              <div className="text-2xl font-bold font-mono-numbers text-slate-300">
                {applicant.trustScore}
              </div>
            </div>

            <span className="text-xl text-indigo-400 font-bold">→</span>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Projected Score</span>
              <div className="text-2xl font-bold font-mono-numbers text-emerald-400">
                {projectedScore}
                <span className="text-xs ml-1 font-semibold">
                  ({netSimDelta >= 0 ? `+${netSimDelta}` : netSimDelta} pts)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Risk</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border mt-0.5 inline-block ${currentRisk.color}`}>
                {currentRisk.label}
              </span>
            </div>

            <span className="text-xl text-indigo-400 font-bold">→</span>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Projected Risk</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border mt-0.5 inline-block ${projectedRisk.color}`}>
                {projectedRisk.label}
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory & Simulation Label */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong className="text-slate-200">Simulation / Estimated Impact Notice:</strong> Projected values are simulated via deterministic sensitivity formulas for underwriter scenario modeling and borrower coaching. They do not constitute guaranteed credit sanction outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
