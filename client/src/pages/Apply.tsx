import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sliders, 
  RefreshCw, 
  Award, 
  Clock, 
  TrendingUp, 
  Receipt, 
  Store, 
  Smartphone, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Lock, 
  X,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Loader2,
  Cpu
} from 'lucide-react';
import { submitApplicationApi, calculateScoreApi } from '../lib/api';
import type { FeatureAttributionItem } from '../types/underwriter';

export default function Apply() {
  const { user } = useAuth();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  // Step 1: Borrower Identity (Defaults set to Ravi Kumar Benchmark)
  const [fullName, setFullName] = useState<string>('Ravi Kumar');
  const [businessType, setBusinessType] = useState<string>('Fruit Stall');
  const [location, setLocation] = useState<string>('Malleshwaram, Bengaluru, KA');

  // Step 2: 6 Everyday Signals (Defaults set to Ravi Kumar Benchmark)
  const [stallMonths, setStallMonths] = useState<number>(18);
  const [weeklyIncome, setWeeklyIncome] = useState<number>(7500);
  const [rentTimeliness, setRentTimeliness] = useState<number>(95);
  const [supplierRepay, setSupplierRepay] = useState<number>(90);
  const [utilityConsistency, setUtilityConsistency] = useState<number>(85);
  const [chitActive, setChitActive] = useState<boolean>(true);

  // Loan Request Configuration
  const [requestedLoan, setRequestedLoan] = useState<number>(10000);
  const [repaymentWeeks, setRepaymentWeeks] = useState<number>(12);

  // Calculated Scores State
  const [compositeScore, setCompositeScore] = useState<number>(78);
  const [abilityScore, setAbilityScore] = useState<number>(82);
  const [willingnessScore, setWillingnessScore] = useState<number>(85);
  const [stabilityScore, setStabilityScore] = useState<number>(65);
  const [confidenceTier, setConfidenceTier] = useState<string>('Medium-High Confidence');
  const [whatHelped, setWhatHelped] = useState<string[]>([]);
  const [whatNeedsAttention, setWhatNeedsAttention] = useState<string[]>([]);

  // Experimental model output (synthetic training data) State
  const [mlProbabilityOfDefault, setMlProbabilityOfDefault] = useState<number | null>(null);
  const [mlRiskBand, setMlRiskBand] = useState<string | null>(null);
  const [shapContributions, setShapContributions] = useState<FeatureAttributionItem[]>([]);
  const [showShapDetails, setShowShapDetails] = useState<boolean>(false);

  // Consent & Submission Modal
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isDataUsageModalOpen, setIsDataUsageModalOpen] = useState<boolean>(false);
  const [consentRevokedMessage, setConsentRevokedMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccessId, setSubmissionSuccessId] = useState<string | null>(null);

  const weeklyInstallment = Math.round(requestedLoan / repaymentWeeks);

  // Calculate score whenever signals change (FastAPI with deterministic fallback)
  useEffect(() => {
    let isCancelled = false;

    calculateScoreApi({
      stall_tenure_months: stallMonths,
      weekly_income: weeklyIncome,
      stall_rent_timeliness: rentTimeliness,
      supplier_repayment_pct: supplierRepay,
      utility_recharge_pct: utilityConsistency,
      chit_shg_active: chitActive,
      requested_loan: requestedLoan,
      repayment_weeks: repaymentWeeks
    }).then((res) => {
      if (!isCancelled) {
        setCompositeScore(res.composite_score);
        setAbilityScore(res.ability_score);
        setWillingnessScore(res.willingness_score);
        setStabilityScore(res.stability_score);
        setConfidenceTier(res.confidence_tier);
        setWhatHelped(res.what_helped);
        setWhatNeedsAttention(res.what_needs_attention);
        setMlProbabilityOfDefault(res.probability_of_default ?? null);
        setMlRiskBand(res.ml_risk_band ?? null);
        setShapContributions(res.shap_feature_contributions ?? []);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [
    stallMonths,
    weeklyIncome,
    rentTimeliness,
    supplierRepay,
    utilityConsistency,
    chitActive,
    requestedLoan,
    repaymentWeeks
  ]);

  // Handle Application Submission to Supabase PostgreSQL with explicit consent
  const handleFinalSubmit = async () => {
    if (!hasConsented) return;
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const res = await submitApplicationApi({
        explicitConsentGiven: hasConsented,
        fullName,
        businessType,
        location,
        stallTenureMonths: stallMonths,
        weeklyIncome,
        stallRentTimeliness: rentTimeliness,
        supplierRepaymentPct: supplierRepay,
        utilityRechargePct: utilityConsistency,
        chitShgActive: chitActive,
        requestedAmount: requestedLoan,
        repaymentWeeks
      });

      if (res.success) {
        setSubmissionSuccessId(res.id);
        setIsConsentModalOpen(false);
      }
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'Application could not be saved. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to Ravi's exact benchmark
  const handleResetToRavi = () => {
    setFullName('Ravi Kumar');
    setBusinessType('Fruit Stall');
    setLocation('Malleshwaram, Bengaluru, KA');
    setStallMonths(18);
    setWeeklyIncome(7500);
    setRentTimeliness(95);
    setSupplierRepay(90);
    setUtilityConsistency(85);
    setChitActive(true);
    setRequestedLoan(10000);
    setRepaymentWeeks(12);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Submission Success Toast Banner */}
      {submissionError && <p role="alert" className="m-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{submissionError}</p>}
      {submissionSuccessId && (
        <div className="mb-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Application Recorded in Live Database</h4>
                <p className="text-xs text-emerald-300">
                  Reference ID: <strong className="font-mono text-white">{submissionSuccessId}</strong> for <strong>{fullName}</strong> with Trust Score <strong>{compositeScore}/100</strong>. {user?.isDemo ? 'Saved in this demo session only; it will disappear when the page reloads.' : 'Saved for human underwriter review.'}
                </p>
              </div>
            </div>
            <Link
              to="/underwriter"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              Open Underwriter Cockpit <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Credit Simulator & Application</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Borrower Assessment & Trust Simulator
        </h1>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Adjust the 6 behavioral inputs below to observe deterministic score calculation, pillar breakdowns, and dynamic plain-language explanations in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            {/* Card Header & Benchmark Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-400" />
                  Consent-Driven Signals
                </h2>
                <p className="text-xs text-slate-400">Zero demographic bias: no caste, religion, or social media data.</p>
              </div>
              <button 
                onClick={handleResetToRavi}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors w-fit"
              >
                <RefreshCw className="h-3 w-3" />
                Reset to Ravi Benchmark
              </button>
            </div>

            {/* Step 1: Basic Business Profile (SPEC.md Section 11) */}
            <div className="mt-6 p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Step 1: Micro-Enterprise Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px] font-medium flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Ravi Kumar"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px] font-medium flex items-center gap-1">
                    <Store className="h-3 w-3 text-indigo-400" /> Business Type
                  </label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Fruit Stall"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px] font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400" /> Location / Market
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Bengaluru, KA"
                  />
                </div>
              </div>
            </div>

            {/* Loan Configuration */}
            <div className="mt-4 p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-400" />
                  Requested Working Capital
                </span>
                <span className="text-emerald-400 font-bold text-sm">₹{requestedLoan.toLocaleString()}</span>
              </div>

              <input 
                type="range"
                min={5000}
                max={25000}
                step={1000}
                value={requestedLoan}
                onChange={(e) => setRequestedLoan(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Repayment Period:</span>
                <div className="flex gap-2">
                  {[8, 12, 16].map((weeks) => (
                    <button
                      key={weeks}
                      onClick={() => setRepaymentWeeks(weeks)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        repaymentWeeks === weeks 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {weeks} Weeks
                    </button>
                  ))}
                </div>
                <span className="text-indigo-300 font-mono">EMI: ₹{weeklyInstallment}/wk</span>
              </div>
            </div>

            {/* 6 Everyday Signal Controls */}
            <div className="space-y-6 pt-6">
              
              {/* Signal 1: Stall Tenure */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    1. Stall Continuity Tenure
                  </span>
                  <span className="font-bold text-emerald-400">{stallMonths} Months</span>
                </div>
                <input 
                  type="range" 
                  min={1} 
                  max={36} 
                  value={stallMonths} 
                  onChange={(e) => setStallMonths(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>1 Mo (New Kiosk)</span>
                  <span>18 Mo (Ravi Benchmark)</span>
                  <span>36 Mo (Established)</span>
                </div>
              </div>

              {/* Signal 2: Weekly Turnover */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    2. Weekly Business Turnover
                  </span>
                  <span className="font-bold text-emerald-400">₹{weeklyIncome.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min={1000} 
                  max={25000} 
                  step={500}
                  value={weeklyIncome} 
                  onChange={(e) => setWeeklyIncome(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹1,000 / week</span>
                  <span>₹7,500 (Ravi Benchmark)</span>
                  <span>₹25,000 / week</span>
                </div>
              </div>

              {/* Signal 3: Stall Rent Timeliness */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-indigo-400" />
                    3. Stall Rent Punctuality
                  </span>
                  <span className="font-bold text-indigo-400">{rentTimeliness}% On-Time</span>
                </div>
                <input 
                  type="range" 
                  min={50} 
                  max={100} 
                  value={rentTimeliness} 
                  onChange={(e) => setRentTimeliness(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block mt-1">Consistency of monthly or weekly landlord payments</span>
              </div>

              {/* Signal 4: Supplier Repayments */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <Store className="h-4 w-4 text-indigo-400" />
                    4. Wholesale Supplier Credit Discipline
                  </span>
                  <span className="font-bold text-indigo-400">{supplierRepay}% Timely</span>
                </div>
                <input 
                  type="range" 
                  min={50} 
                  max={100} 
                  value={supplierRepay} 
                  onChange={(e) => setSupplierRepay(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block mt-1">Repayment track record with mandi / fruit wholesale suppliers</span>
              </div>

              {/* Signal 5: Utility & Recharges */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-amber-400" />
                    5. Utility & Mobile Recharge Punctuality
                  </span>
                  <span className="font-bold text-amber-400">{utilityConsistency}% Punctual</span>
                </div>
                <input 
                  type="range" 
                  min={50} 
                  max={100} 
                  value={utilityConsistency} 
                  onChange={(e) => setUtilityConsistency(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block mt-1">Continuous electricity recharge and active commercial SIM activity</span>
              </div>

              {/* Signal 6: Community Savings SHG */}
              <div className="flex items-center justify-between p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">6. Community Chit / SHG Participation</p>
                    <p className="text-[11px] text-slate-400">Regular active contributions to local self-help group pool</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={chitActive} 
                  onChange={(e) => setChitActive(e.target.checked)}
                  className="h-5 w-5 rounded bg-slate-900 border-slate-700 text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Score Gauge & Dynamic Explainability */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Composite Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Calculated Trust Score</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                compositeScore >= 70 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {confidenceTier}
              </span>
            </div>

            {/* Large Radial Display */}
            <div className="flex items-center justify-center py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
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
                    className={`${compositeScore >= 70 ? 'text-emerald-500' : 'text-amber-500'} stroke-current transition-all duration-500 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={314}
                    strokeDashoffset={314 - (314 * Math.min(100, Math.max(0, compositeScore))) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-white tracking-tight">{compositeScore}</span>
                  <span className="text-xs font-semibold text-slate-500">/ 100</span>
                </div>
              </div>
            </div>

            {/* Three Pillars Breakdown */}
            <div className="space-y-3.5 pt-5 border-t border-slate-800">
              
              {/* Ability */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Ability to Repay (40%)</span>
                  <span className="text-emerald-400 font-bold">{abilityScore}/100</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${abilityScore}%` }}
                  />
                </div>
              </div>

              {/* Willingness */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Willingness to Repay (35%)</span>
                  <span className="text-indigo-400 font-bold">{willingnessScore}/100</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${willingnessScore}%` }}
                  />
                </div>
              </div>

              {/* Stability */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Stability of Activity (25%)</span>
                  <span className="text-amber-400 font-bold">{stabilityScore}/100</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${stabilityScore}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Experimental model output (synthetic training data) Card */}
            {mlProbabilityOfDefault !== null && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Cpu className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          ML Probability of Default
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Random Forest
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Experimental output from synthetic training data; not a validated default forecast.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-black font-mono-numbers ${
                        mlProbabilityOfDefault < 0.05 
                          ? 'text-emerald-400' 
                          : mlProbabilityOfDefault < 0.12 
                          ? 'text-cyan-400' 
                          : mlProbabilityOfDefault < 0.25 
                          ? 'text-amber-400' 
                          : 'text-rose-400'
                      }`}>
                        {(mlProbabilityOfDefault * 100).toFixed(1)}%
                      </span>
                      <div className="text-[9px] font-semibold uppercase text-slate-400">
                        {mlRiskBand ? mlRiskBand.replace(/_/g, ' ') : 'Predicted PD'}
                      </div>
                    </div>
                  </div>

                  {/* SHAP Feature Contributions toggle */}
                  {shapContributions.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setShowShapDetails(!showShapDetails)}
                        className="w-full flex items-center justify-between text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>SHAP Feature Attributions</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {showShapDetails ? '▲ Hide' : '▼ View Drivers'}
                        </span>
                      </button>

                      {showShapDetails && (
                        <div className="mt-2.5 space-y-1.5">
                          {shapContributions.slice(0, 5).map((item, idx) => {
                            const isPositive = item.contribution > 0;
                            return (
                              <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                                <div className="truncate mr-2">
                                  <span className="text-slate-200 font-medium block truncate">{item.feature}</span>
                                  <span className="text-[10px] text-slate-400">{item.rawMetric}</span>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className={`font-mono-numbers font-bold ${
                                    isPositive ? 'text-amber-400' : 'text-emerald-400'
                                  }`}>
                                    {isPositive ? '+' : ''}{item.contribution.toFixed(1)}%
                                  </span>
                                  <span className="text-[9px] block text-slate-400">
                                    {isPositive ? 'Risk Driver' : 'Risk Reducer'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Being Evaluated & Privacy Transparency Block */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Data Being Evaluated
                  </span>
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Consent v2.1
                  </span>
                </div>

                <ul className="text-xs space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Business information:</strong> Stall tenure ({stallMonths}m), category, declared location</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Income information:</strong> ₹{weeklyIncome.toLocaleString()}/wk turnover & cashflow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Payment behavior:</strong> Rent ({rentTimeliness}%), supplier ({supplierRepay}%), utilities ({utilityConsistency}%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Evidence:</strong> No uploaded documents are verified by this form.</span>
                  </li>
                </ul>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Purpose: </strong>
                  Alternative creditworthiness assessment for micro-enterprise working capital.
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDataUsageModalOpen(true)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
                  >
                    [View Data Usage]
                  </button>

                  {hasConsented ? (
                    <button
                      type="button"
                      onClick={() => {
                        setHasConsented(false);
                        setConsentRevokedMessage('Borrower consent has been successfully withdrawn. Application cannot be submitted without affirmative consent.');
                        setTimeout(() => setConsentRevokedMessage(null), 5000);
                      }}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-2 transition-colors"
                    >
                      [Withdraw Consent]
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono-numbers">
                      Consent pending
                    </span>
                  )}
                </div>
              </div>

              {/* Consent Revocation Alert */}
              {consentRevokedMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{consentRevokedMessage}</span>
                </div>
              )}

              {/* Submission Trigger Button */}
              <button 
                onClick={() => setIsConsentModalOpen(true)}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <FileCheck2 className="h-4 w-4" />
                Submit Application for Verification
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Requires affirmative borrower consent (v2.1). Saved to Supabase PostgreSQL.
              </p>
            </div>
          </div>

          {/* Explainability Cards: What Helped vs Needs Attention */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                What Helped The Assessment
              </h3>
              <ul className="space-y-2">
                {whatHelped.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {whatNeedsAttention.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  What Needs Attention
                </h3>
                <ul className="space-y-2">
                  {whatNeedsAttention.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-amber-400 font-bold">⚠</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* CONSENT & SUBMISSION MODAL */}
      {isConsentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Affirmative Borrower Consent</h3>
              </div>
              <button 
                onClick={() => setIsConsentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">Applicant & Signals Profile:</span>
                <p className="text-slate-300 font-medium">{fullName} • {businessType} ({location})</p>
                <ul className="text-slate-400 list-disc list-inside space-y-1 text-[11px]">
                  <li>Stall continuity tenure: {stallMonths} months</li>
                  <li>Weekly business revenue: ₹{weeklyIncome.toLocaleString()}</li>
                  <li>Stall rent promptness: {rentTimeliness}%</li>
                  <li>Wholesale supplier repayment: {supplierRepay}%</li>
                  <li>Calculated Trust Score: <strong className="text-emerald-400">{compositeScore}/100</strong></li>
                </ul>
              </div>

              {/* Data being evaluated checklist */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">Data Being Evaluated (Part 15):</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Business information
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Income information
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Payment behavior
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Uploaded evidence
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">Purpose of Assessment:</span>
                <p className="text-slate-400">
                  Alternative creditworthiness assessment for a requested ₹{requestedLoan.toLocaleString()} working capital loan, routed directly to the underwriter review queue.
                </p>
              </div>

              <label className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl cursor-pointer border border-slate-700/50">
                <input 
                  type="checkbox"
                  checked={hasConsented}
                  onChange={(e) => setHasConsented(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-600 accent-emerald-500 cursor-pointer"
                />
                <span className="text-slate-300 leading-snug">
                  I explicitly consent to the evaluation of my verified business signals solely for alternative credit assessment (Consent Version v2.1). I understand demographic variables are never collected.
                </span>
              </label>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsConsentModalOpen(false);
                    setIsDataUsageModalOpen(true);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  [View Data Usage Policy]
                </button>
                {hasConsented && (
                  <button
                    type="button"
                    onClick={() => {
                      setHasConsented(false);
                      setConsentRevokedMessage('Consent withdrawn.');
                    }}
                    className="text-rose-400 hover:text-rose-300 underline underline-offset-2"
                  >
                    [Withdraw Consent]
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsConsentModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                disabled={!hasConsented || isSubmitting}
                onClick={handleFinalSubmit}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  hasConsented && !isSubmitting
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving to Supabase...
                  </>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DATA USAGE MODAL */}
      {isDataUsageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">TrustBridge Data Usage & Privacy Disclosure</h3>
              </div>
              <button 
                onClick={() => setIsDataUsageModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">
                  1. Purpose Limitation
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  All submitted data is strictly restricted to alternative creditworthiness evaluation for micro-enterprises under the Digital Personal Data Protection (DPDP) Act and RBI Guidelines on Digital Lending. Data will never be sold, brokered, or used for advertising.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 text-[11px] uppercase tracking-wider block">
                  2. Authorized Data Categories
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  <li><strong>Business Information:</strong> Tenure in months, stall category, physical kiosk photo.</li>
                  <li><strong>Income Information:</strong> Weekly turnover, estimated debt-service coverage ratio.</li>
                  <li><strong>Payment Behavior:</strong> Landlord rent timeliness, wholesale supplier settlements, utility recharges.</li>
                  <li><strong>Uploaded Evidence:</strong> OCR-extracted slips, invoice hashes, and merchant UPI logs.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5 text-rose-200">
                <span className="font-bold text-rose-400 text-[11px] uppercase tracking-wider block">
                  3. Strictly Prohibited & Non-Collected Data
                </span>
                <p className="leading-relaxed text-[11px]">
                  TrustBridge does <strong>NOT</strong> collect, scrape, or factor in: phone contacts, SMS messages, web browsing history, geographic tracking, religion, caste, gender, or marital status.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                  4. Consent Version & Revocation Rights
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Current Consent Protocol: <span className="font-mono-numbers text-amber-300 font-semibold">v2.1</span>. Every consent event is recorded with an immutable timestamp in the audit log. Borrowers retain the right to withdraw consent at any point prior to loan sanction.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDataUsageModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
              >
                Close Disclosure
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
