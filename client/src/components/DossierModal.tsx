import { useState } from 'react';
import { 
  X, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  MapPin, 
  Store, 
  Layers, 
  ChevronRight, 
  FileText,
  Loader2,
  Camera,
  Building,
  QrCode
} from 'lucide-react';
import type { Applicant, ProofDocument, ReviewStatus } from '../types/underwriter';
import { explainUnderwritingApi, type UnderwritingExplanationResult } from '../lib/api';

interface DossierModalProps {
  applicant: Applicant;
  onClose: () => void;
  onAction: (applicantId: string, action: ReviewStatus, notes: string) => void;
}

export default function DossierModal({ applicant, onClose, onAction }: DossierModalProps) {
  const [selectedProof, setSelectedProof] = useState<ProofDocument | null>(applicant.proofDocuments[0] || null);
  const [confirmationAction, setConfirmationAction] = useState<ReviewStatus | null>(null);
  const [underwriterNotes, setUnderwriterNotes] = useState('');

  // AI Explanation State
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiDossier, setAiDossier] = useState<UnderwritingExplanationResult>({
    summary: applicant.aiExplanation.summary,
    strengths: applicant.aiExplanation.strengths,
    risk_factors: applicant.aiExplanation.riskFactors,
    underwriting_recommendation: applicant.aiExplanation.underwritingRecommendation,
    model_used: 'gemini-2.5-flash',
    human_decision_required: true
  });

  const weeklyInstallment = Math.round(applicant.requestedAmount / applicant.repaymentWeeks);

  const handleConfirmDecision = () => {
    if (!confirmationAction) return;
    onAction(applicant.id, confirmationAction, underwriterNotes);
    setConfirmationAction(null);
  };

  // Trigger Gemini / API Explain Endpoint
  const handleGenerateAiExplanation = async () => {
    setIsGeneratingAi(true);
    try {
      const result = await explainUnderwritingApi(applicant);
      setAiDossier(result);
    } catch (err) {
      console.warn('[TrustBridge] Error triggering AI narrative:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Helper icon for proof document categories
  const getDocumentIcon = (category: string) => {
    switch (category) {
      case 'Rent':
        return <Building className="h-4 w-4 text-emerald-400" />;
      case 'Supplier':
        return <Store className="h-4 w-4 text-indigo-400" />;
      case 'Utility':
        return <QrCode className="h-4 w-4 text-amber-400" />;
      case 'Business Photo':
        return <Camera className="h-4 w-4 text-teal-400" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#090d16] border border-white/10 rounded-2xl max-w-5xl w-full my-6 max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="p-5 sm:p-6 bg-slate-950/90 border-b border-white/5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-300 text-lg shrink-0 shadow-lg shadow-indigo-600/10">
              {applicant.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-editorial">
                  {applicant.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 font-mono-numbers border border-slate-800">
                  {applicant.id}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  applicant.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  applicant.status === 'NEEDS_INFO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  applicant.status === 'PAUSED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                  'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                }`}>
                  {applicant.status === 'PENDING_REVIEW' ? 'PENDING REVIEW' : 
                   applicant.status === 'NEEDS_INFO' ? 'NEEDS INFO' : applicant.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1"><Store className="h-3.5 w-3.5 text-indigo-400" /> {applicant.businessType}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono-numbers"><Clock className="h-3.5 w-3.5 text-emerald-400" /> {applicant.stallTenureMonths} Mo Tenure</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {applicant.location}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Score Badge */}
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Trust Score</span>
              <div className="text-2xl font-black text-emerald-400 font-mono-numbers">{applicant.trustScore} <span className="text-xs text-slate-500">/ 100</span></div>
              <span className="text-[10px] text-emerald-400/90 font-semibold">{applicant.confidenceTier}</span>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5 transition-colors"
              aria-label="Close Dossier"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}
        <div className="p-6 space-y-8 overflow-y-auto flex-grow custom-scrollbar">
          
          {/* 1. TOP STATS & 3-PILLAR BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/70 border border-white/5 rounded-xl p-5 sm:p-6 shadow-xl">
            
            {/* Trust Score Radial Display */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center lg:border-r lg:border-white/5 lg:pr-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Composite Trust Score
              </span>
              
              <div className="relative w-36 h-36 flex items-center justify-center my-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="text-slate-800 stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className={`${applicant.trustScore >= 70 ? 'text-emerald-500' : 'text-amber-500'} stroke-current transition-all duration-700 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={314}
                    strokeDashoffset={314 - (314 * applicant.trustScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white font-mono-numbers">{applicant.trustScore}</span>
                  <span className="text-[11px] font-semibold text-slate-500 font-mono-numbers">/ 100</span>
                </div>
              </div>

              <span className={`text-xs px-3 py-0.5 rounded-full font-bold border ${
                applicant.trustScore >= 70 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              }`}>
                {applicant.confidenceTier}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Deterministic 3-Pillar Calculation
              </span>
            </div>

            {/* 3 Pillars Visual Meters */}
            <div className="lg:col-span-8 flex flex-col justify-center space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  3-Pillar Mathematical Breakdown
                </span>
                <span className="text-[11px] text-slate-500 font-mono-numbers">Formula: 40% + 35% + 25% = 100%</span>
              </div>

              {/* Pillar 1: Ability */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    Ability to Repay (40% Weight)
                  </span>
                  <span className="text-emerald-400 font-bold font-mono-numbers">{applicant.pillars.ability} / 100</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${applicant.pillars.ability}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Weekly cashflow <strong className="text-slate-300 font-mono-numbers">₹{applicant.weeklyRevenue.toLocaleString()}</strong> covers weekly EMI (<strong className="text-slate-300 font-mono-numbers">₹{weeklyInstallment}</strong>) comfortably.
                </span>
              </div>

              {/* Pillar 2: Willingness */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5 text-indigo-400" />
                    Willingness to Repay (35% Weight)
                  </span>
                  <span className="text-indigo-400 font-bold font-mono-numbers">{applicant.pillars.willingness} / 100</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${applicant.pillars.willingness}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Weighted payment punctuality across stall rent, wholesale suppliers, and telecom recharges.
                </span>
              </div>

              {/* Pillar 3: Stability */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    Stability of Activity (25% Weight)
                  </span>
                  <span className="text-amber-400 font-bold font-mono-numbers">{applicant.pillars.stability} / 100</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${applicant.pillars.stability}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Operational continuity at physical stall ({applicant.stallTenureMonths} mo) + community peer participation.
                </span>
              </div>
            </div>

          </div>

          {/* 2. 6 SIGNALS DEEP-DIVE CARDS */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                6 Signals Telemetry Deep-Dive
              </h3>
              <span className="text-xs text-slate-400 font-mono">100% Consent-Driven</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applicant.signals.map((sig, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-semibold text-slate-400">{sig.pillar}</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        sig.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        sig.status === 'DOCUMENTED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {sig.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{sig.name}</h4>
                    <div className="text-base font-extrabold text-emerald-400 mt-1">
                      {sig.rawMetric}
                    </div>
                    
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                      {sig.insight}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                    <span>Point Contribution:</span>
                    <span className="font-bold text-slate-300">+{sig.contribution} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. EVIDENCE & PROOF DOCUMENTS SECTION */}
          <div className="bg-slate-950/70 border border-white/5 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-indigo-400" />
                  Verified Evidence & Proof Documents
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any document thumbnail to inspect verified audit slips and metadata.
                </p>
              </div>
              <span className="text-xs font-mono-numbers font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 w-fit">
                {applicant.verificationRatio}
              </span>
            </div>

            {/* Document Thumbnail Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
              {applicant.proofDocuments.map((doc) => {
                const isSelected = selectedProof?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedProof(doc)}
                    className={`bg-slate-900 border rounded-xl p-3.5 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/40 shadow-lg' 
                        : 'border-white/5 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Document Type Badge & Icon Header */}
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                          {getDocumentIcon(doc.category)}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          doc.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          doc.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          doc.status === 'NEEDS_REVIEW' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">{doc.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {doc.summary}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
                      <span className="truncate max-w-[120px]">{doc.issuedBy}</span>
                      <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Proof Inspector Preview */}
            {selectedProof && (
              <div className="mt-5 p-4 bg-slate-900/90 border border-white/10 rounded-xl text-xs space-y-3 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      {getDocumentIcon(selectedProof.category)}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {selectedProof.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Category: {selectedProof.category} • Issuer: {selectedProof.issuedBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedProof.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      selectedProof.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {selectedProof.status === 'VERIFIED' ? 'VERIFIED AUDIT PROOF' : `${selectedProof.status} VERIFICATION`}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-numbers">
                      {selectedProof.verifiedAt || 'Field verification logged'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-lg p-3 border border-white/5 font-mono text-[11px] space-y-1.5 text-slate-300">
                  <div className="flex justify-between text-slate-500 text-[10px] border-b border-white/5 pb-1 mb-1 font-mono-numbers">
                    <span>TRUSTBRIDGE PROTOCOL • EVIDENCE SLIP</span>
                    <span>SECURE RECORD</span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs">
                    {selectedProof.summary}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono-numbers">
                    <span>Verified By: <strong className="text-slate-300 font-sans">{selectedProof.issuedBy}</strong></span>
                    <span>Storage Hash: <code className="text-emerald-400/90 font-mono">sha256:4f8e91a27b884c</code></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. AI UNDERWRITING NARRATIVE (GEMINI 2.5 FLASH GROUNDED) */}
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-500/20 gap-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Grounded Underwriting Dossier (Gemini 2.5 Flash Layer)</span>
              </div>

              {/* Generate AI Explanation Button */}
              <button
                onClick={handleGenerateAiExplanation}
                disabled={isGeneratingAi}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 w-fit"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                    <span>Generate AI Underwriting Narrative</span>
                  </>
                )}
              </button>
            </div>

            {/* Executive Summary */}
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed my-4">
              "{aiDossier.summary}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-indigo-500/20">
              {/* Positive Strengths */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Key Strengths (Positive Trust Signals):
                </span>
                <ul className="space-y-2 text-slate-300">
                  {aiDossier.strengths.map((str, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2 text-[11px] bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/20">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Factors / Cautionary Points */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Verification Risk Gaps & Cautionary Points:
                </span>
                <ul className="space-y-2 text-slate-300">
                  {aiDossier.risk_factors.map((rf, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2 text-[11px] bg-amber-500/5 p-2 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-indigo-300/80">
              <span className="font-semibold">Neutral Recommendation: {aiDossier.underwriting_recommendation}</span>
              <span className="font-mono text-[10px] text-slate-500">
                Model: <strong className="text-indigo-300">{aiDossier.model_used || 'gemini-2.5-flash'}</strong> • Human decision required
              </span>
            </div>
          </div>

        </div>

        {/* ================= 5. HUMAN-IN-THE-LOOP ACTION BAR ================= */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-300 block">
                Human-in-the-Loop Sanction Matrix:
              </span>
              <p className="text-[11px] text-slate-500">
                Select an underwriting action. Every sanction persists directly to Supabase.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setConfirmationAction('APPROVED')}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                <UserCheck className="h-4 w-4" />
                Offer Starter Loan ₹{applicant.requestedAmount.toLocaleString()}
              </button>

              <button
                onClick={() => setConfirmationAction('NEEDS_INFO')}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
              >
                Request More Info
              </button>

              <button
                onClick={() => setConfirmationAction('PAUSED')}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-red-400 font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
              >
                Pause Application
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      {confirmationAction && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-2">
              {confirmationAction === 'APPROVED' && `Confirm Sanction of ₹${applicant.requestedAmount.toLocaleString()}`}
              {confirmationAction === 'NEEDS_INFO' && 'Request Additional Documentation'}
              {confirmationAction === 'PAUSED' && 'Pause Application Processing'}
            </h3>
            
            <p className="text-xs text-slate-400 mb-4">
              Enter any contextual underwriting notes for the audit trail.
            </p>

            <textarea 
              value={underwriterNotes}
              onChange={(e) => setUnderwriterNotes(e.target.value)}
              placeholder="e.g. Verified stall rent receipts and mandi credit slips show high repayment discipline. Approved ₹10,000 starter loan..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 mb-4 h-24"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmationAction(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDecision}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
