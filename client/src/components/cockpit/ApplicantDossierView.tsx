import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  PauseCircle,
  HelpCircle,
  Building,
  Receipt,
  Zap,
  Camera
} from 'lucide-react';
import type { Applicant, ReviewStatus } from '../../types/underwriter';
import TrustScoreBentoCard from './TrustScoreBentoCard';
import TrustScoreOrbits from './TrustScoreOrbits';

interface ApplicantDossierViewProps {
  applicant: Applicant;
  onUnderwriterDecision: (applicantId: string, decision: ReviewStatus, notes: string, sanctionedAmount?: number) => void;
  onOpenSimulator: () => void;
  onOpenCounterfactuals: () => void;
}

export default function ApplicantDossierView({
  applicant,
  onUnderwriterDecision,
  onOpenSimulator,
  onOpenCounterfactuals
}: ApplicantDossierViewProps) {
  const [decisionNotes, setDecisionNotes] = useState('');
  const [customSanctionAmount, setCustomSanctionAmount] = useState<number>(
    applicant.suggestedLendingMin || applicant.requestedAmount
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const suggestedMin = applicant.suggestedLendingMin || Math.round(applicant.requestedAmount * 0.8);
  const suggestedMax = applicant.suggestedLendingMax || applicant.requestedAmount;

  const handleDecision = async (status: ReviewStatus) => {
    setIsSubmitting(true);
    try {
      await onUnderwriterDecision(applicant.id, status, decisionNotes, customSanctionAmount);
    } catch {
      return; // Parent displays the persistence error.
    } finally {
      setIsSubmitting(false);
    }

    let msg = '';
    if (status === 'APPROVED') msg = `Successfully sanctioned ₹${customSanctionAmount.toLocaleString()} starter loan.`;
    else if (status === 'NEEDS_INFO') msg = 'Requested supplementary verification vouchers from applicant.';
    else if (status === 'PAUSED') msg = 'Application paused for manual risk committee inspection.';

    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const getDocIcon = (category: string) => {
    switch (category) {
      case 'Rent':
        return Building;
      case 'Supplier':
        return Receipt;
      case 'Utility':
        return Zap;
      case 'Business Photo':
        return Camera;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner with Active Borrower Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Comprehensive Applicant Dossier: {applicant.name}
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {applicant.id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {applicant.businessType} • {applicant.location} • Applied {applicant.appliedDate}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenSimulator}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
            <span>Simulate Stress</span>
          </button>
          <button
            onClick={onOpenCounterfactuals}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Counterfactuals</span>
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Interactive Bento-Style Trust Score & 3-Pillar Breakdown with Harmonic Orbits Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          <TrustScoreBentoCard applicant={applicant} />
        </div>
        <div className="lg:col-span-4">
          <TrustScoreOrbits
            applicant={applicant}
            score={applicant.trustScore}
            abilityScore={applicant.pillars.ability}
            willingnessScore={applicant.pillars.willingness}
            stabilityScore={applicant.pillars.stability}
            confidenceTier={applicant.confidenceTier}
            riskTier={applicant.riskTier}
            compact={true}
            className="w-full h-[280px]"
          />
        </div>
      </div>

      {/* PART 12: LOAN RECOMMENDATION BAND */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Lending Decision Support System
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight mt-0.5">
              AI-Assisted Underwriting Recommendation
            </h2>
          </div>
          <span className="text-[10px] font-mono-numbers px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Certified Human Sign-off Mandatory
          </span>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Requested</span>
            <span className="font-mono-numbers font-bold text-white text-sm">
              ₹{applicant.requestedAmount.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Trust Score</span>
            <span className={`font-mono-numbers font-bold text-sm ${
              applicant.trustScore >= 80 ? 'text-emerald-400' :
              applicant.trustScore >= 70 ? 'text-indigo-400' : 'text-amber-400'
            }`}>
              {applicant.trustScore}/100
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Verification</span>
            <span className="font-mono-numbers font-bold text-slate-200 text-sm">
              {applicant.verificationRatio}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Risk Tier</span>
            <span className="font-semibold text-slate-200 text-xs">
              {applicant.riskTier || 'Low-Moderate'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-0.5">Suggested Range</span>
            <span className="font-mono-numbers font-bold text-indigo-300 text-xs">
              ₹{suggestedMin.toLocaleString()} – ₹{suggestedMax.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Non-Binding Recommendation Callout */}
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-200 space-y-1">
          <div className="font-bold text-indigo-300 flex items-center gap-1.5 text-[11px]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Assisted Underwriting Recommendation:
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {applicant.aiExplanation.underwritingRecommendation}
          </p>
        </div>

        {/* Human Underwriter Decision Actions */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-36">
              <input
                type="number"
                title="Sanctioned amount in INR"
                placeholder="Sanction ₹"
                value={customSanctionAmount}
                onChange={(e) => setCustomSanctionAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Underwriter decision rational notes (stored in audit log)..."
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={isSubmitting}
                onClick={() => handleDecision('APPROVED')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Offer Starter Loan</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleDecision('NEEDS_INFO')}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Request Info</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleDecision('PAUSED')}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <PauseCircle className="h-3.5 w-3.5" />
                <span>Pause</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic">
            * Invariant: Never displays "AI Approved". All actions are recorded with underwriter timestamp into the regulatory audit log.
          </p>
        </div>
      </div>

      {/* High-End ThreeUI-Style React Orbits Motion Design Component */}
      <TrustScoreOrbits
        applicant={applicant}
        score={applicant.trustScore}
        abilityScore={applicant.pillars.ability}
        willingnessScore={applicant.pillars.willingness}
        stabilityScore={applicant.pillars.stability}
      />

      {/* 3 Pillars & Signals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pillar 1: Ability */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-start pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400">Pillar 1 (40% Weight)</span>
              <h3 className="text-sm font-bold text-white">Ability to Repay</h3>
            </div>
            <span className="text-xl font-bold font-mono-numbers text-indigo-400">
              {applicant.pillars.ability}/100
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Weekly turnover of ₹{applicant.weeklyRevenue.toLocaleString()} provides {Math.round((applicant.weeklyRevenue / Math.max(1, applicant.requestedAmount / 12)) * 10) / 10}x coverage over weekly installment.
          </p>
        </div>

        {/* Pillar 2: Willingness */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-start pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Pillar 2 (35% Weight)</span>
              <h3 className="text-sm font-bold text-white">Willingness to Repay</h3>
            </div>
            <span className="text-xl font-bold font-mono-numbers text-emerald-400">
              {applicant.pillars.willingness}/100
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Synthesizes stall rent vouchers (50%), APMC wholesale settlements (30%), and telecom recharges (20%).
          </p>
        </div>

        {/* Pillar 3: Stability */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-start pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">Pillar 3 (25% Weight)</span>
              <h3 className="text-sm font-bold text-white">Stability of Activity</h3>
            </div>
            <span className="text-xl font-bold font-mono-numbers text-amber-400">
              {applicant.pillars.stability}/100
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Continuous operational longevity of {applicant.stallTenureMonths} months at the declared market pitch.
          </p>
        </div>
      </div>

      {/* 6 Everyday Operational Signals */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="pb-2 border-b border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Micro-Enterprise Signals ({applicant.signals.length})
          </h2>
          <p className="text-[11px] text-slate-400">
            Everyday commercial activity telemetry mapped into mathematical pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {applicant.signals.map((sig, sIdx) => (
            <div key={sIdx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{sig.name}</span>
                <span className="font-mono-numbers font-bold text-indigo-400">{sig.rawMetric}</span>
              </div>
              <div className="text-[10px] text-slate-400">{sig.pillar}</div>
              <p className="text-[11px] text-slate-400 pt-1 leading-snug">
                {sig.insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Proof Documents Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uploaded Proof Documents ({applicant.proofDocuments.length})
            </h2>
            <p className="text-[11px] text-slate-400">
              Physical and digital vouchers submitted with applicant consent.
            </p>
          </div>
          <span className="text-[10px] font-mono-numbers text-emerald-400 font-semibold">
            {applicant.verificationRatio}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {applicant.proofDocuments.map((doc) => {
            const Icon = getDocIcon(doc.category);
            return (
              <div key={doc.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">{doc.issuedBy}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                    doc.status === 'NEEDS_REVIEW' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {doc.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
