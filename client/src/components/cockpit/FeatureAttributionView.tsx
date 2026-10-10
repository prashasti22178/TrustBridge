import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import type { Applicant, FeatureAttributionItem } from '../../types/underwriter';
import { explainUnderwritingApi, type UnderwritingExplanationResult } from '../../lib/api';

interface FeatureAttributionViewProps {
  applicant: Applicant;
  onOpenCounterfactuals: () => void;
}

export default function FeatureAttributionView({
  applicant,
  onOpenCounterfactuals
}: FeatureAttributionViewProps) {
  const [aiExplanation, setAiExplanation] = useState<UnderwritingExplanationResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Derived or default SHAP-compatible attributions
  const attributions: FeatureAttributionItem[] = applicant.featureAttributions || [
    { feature: 'Gross Weekly Turnover', contribution: 12.8, direction: 'POSITIVE', rawMetric: `₹${applicant.weeklyRevenue.toLocaleString()} / wk`, category: 'Ability' },
    { feature: 'Stall Rent Consistency', contribution: 14.2, direction: 'POSITIVE', rawMetric: '95% On-Time', category: 'Willingness' },
    { feature: 'Wholesale Supplier Repayment', contribution: 9.5, direction: 'POSITIVE', rawMetric: '90% Timely', category: 'Willingness' },
    { feature: 'Business Operating Longevity', contribution: 8.0, direction: 'POSITIVE', rawMetric: `${applicant.stallTenureMonths} Months`, category: 'Stability' },
    { feature: 'Informal Digital History Gap', contribution: -7.0, direction: 'NEGATIVE', rawMetric: 'Sub-prime digital footprint', category: 'Stability' },
    { feature: 'Seasonal Cashflow Volatility', contribution: -5.0, direction: 'NEGATIVE', rawMetric: 'Quarterly variance buffer', category: 'Ability' }
  ];

  const positiveFeatures = attributions.filter(a => a.direction === 'POSITIVE' || a.contribution > 0);
  const negativeFeatures = attributions.filter(a => a.direction === 'NEGATIVE' || a.contribution < 0);

  // Fetch or trigger Gemini grounded explanation
  const fetchExplanation = async () => {
    setIsLoadingAi(true);
    try {
      const res = await explainUnderwritingApi(applicant);
      setAiExplanation(res);
    } catch {
      // Handled inside explainUnderwritingApi
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, [applicant.id]);

  const maxAbsContrib = Math.max(...attributions.map(a => Math.abs(a.contribution)), 20);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Explainable AI: Feature Attribution
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 05
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            SHAP-inspired additive marginal attribution interface decomposing the composite credit score.
          </p>
        </div>

        <button
          onClick={onOpenCounterfactuals}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Counterfactual Analysis</span>
        </button>
      </div>

      {/* Trust Score & Base Value Hero */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Calculated Trust Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-numbers text-white tracking-tight">
              {applicant.trustScore}
            </span>
            <span className="text-xs text-slate-400 font-mono-numbers">/ 100</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
            applicant.trustScore >= 80 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
            applicant.trustScore >= 70 ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' :
            'text-amber-400 bg-amber-500/10 border border-amber-500/20'
          }`}>
            {applicant.confidenceTier}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Model Population Baseline (E[f(x)])
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-numbers text-slate-400 tracking-tight">
              50.0
            </span>
            <span className="text-xs text-slate-500 font-mono-numbers">pts</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Neutral uninformative baseline for unbanked micro-enterprises.
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Net Explained Variance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-numbers text-emerald-400 tracking-tight">
              +{applicant.trustScore - 50}
            </span>
            <span className="text-xs text-slate-400 font-mono-numbers">pts above base</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Sum of verified behavioral & physical stability telemetry.
          </span>
        </div>
      </div>

      {/* SHAP Waterfall / Attribution Breakdown (Positive vs Negative) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Positive Drivers */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Positive Contributions (Score Boosters)
              </h2>
            </div>
            <span className="text-[10px] font-mono-numbers text-slate-400">
              +{positiveFeatures.reduce((acc, f) => acc + f.contribution, 0).toFixed(1)} pts
            </span>
          </div>

          <div className="space-y-3">
            {positiveFeatures.map((feat, idx) => {
              const widthPct = Math.min(100, (Math.abs(feat.contribution) / maxAbsContrib) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-200">{feat.feature}</span>
                    <span className="font-mono-numbers text-emerald-400 font-bold">
                      +{feat.contribution > 0 ? feat.contribution : Math.abs(feat.contribution)} pts
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{feat.category}</span>
                    <span className="font-mono-numbers">{feat.rawMetric}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Negative / Dampening Gaps */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Cautionary / Dampening Factors
              </h2>
            </div>
            <span className="text-[10px] font-mono-numbers text-slate-400">
              {negativeFeatures.reduce((acc, f) => acc + f.contribution, 0).toFixed(1)} pts
            </span>
          </div>

          {negativeFeatures.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 rounded-xl bg-slate-950/60 border border-slate-800/80">
              Zero significant negative dampeners detected for this profile.
            </div>
          ) : (
            <div className="space-y-3">
              {negativeFeatures.map((feat, idx) => {
                const widthPct = Math.min(100, (Math.abs(feat.contribution) / maxAbsContrib) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-200">{feat.feature}</span>
                      <span className="font-mono-numbers text-rose-400 font-bold">
                        {feat.contribution} pts
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{feat.category}</span>
                      <span className="font-mono-numbers">{feat.rawMetric}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* "Why This Score?" Gemini Narrative Explanation Panel */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Why This Score? — AI Underwriting Narrative (Gemini 2.5 Flash)
            </h2>
          </div>
          <button
            onClick={fetchExplanation}
            disabled={isLoadingAi}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <RefreshCw className={`h-3 w-3 ${isLoadingAi ? 'animate-spin' : ''}`} />
            Regenerate Narrative
          </button>
        </div>

        {/* Narrative Summary */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {aiExplanation?.summary || applicant.aiExplanation.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified Strengths
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {(aiExplanation?.strengths || applicant.aiExplanation.strengths).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Risk Factors & Gaps
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {(aiExplanation?.risk_factors || applicant.aiExplanation.riskFactors).map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Methodology Disclosure */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Illustrative Feature Attribution (SHAP-compatible architecture):</strong> Mathematical score weights derive directly from the deterministic 3-pillar formula. In production, a trained tree ensemble (LightGBM/XGBoost) plugs directly into this visual attribution interface using exact TreeSHAP values.
          </span>
        </div>
      </div>
    </div>
  );
}
