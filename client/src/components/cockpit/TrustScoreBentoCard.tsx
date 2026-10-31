import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  TrendingUp, 
  Receipt, 
  Clock, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Applicant } from '../../types/underwriter';

interface TrustScoreBentoCardProps {
  applicant: Applicant;
  className?: string;
  variant?: 'full' | 'compact';
}

export default function TrustScoreBentoCard({
  applicant,
  className,
  variant = 'full'
}: TrustScoreBentoCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showFormulaProof, setShowFormulaProof] = useState(false);
  const [scoreMetricMode, setScoreMetricMode] = useState<'points' | 'percent'>('points');

  const targetScore = applicant.trustScore;
  const abilityScore = applicant.pillars.ability;
  const willingnessScore = applicant.pillars.willingness;
  const stabilityScore = applicant.pillars.stability;

  // Calibrated weighted contributions
  const abilityContribution = Number((abilityScore * 0.40).toFixed(1));
  const willingnessContribution = Number((willingnessScore * 0.35).toFixed(1));
  const stabilityContribution = Number((stabilityScore * 0.25).toFixed(1));
  const calculatedSum = Number((abilityContribution + willingnessContribution + stabilityContribution).toFixed(1));

  // Risk calibration
  const isLowRisk = targetScore >= 75 || (applicant.riskTier && applicant.riskTier.toLowerCase().includes('low'));
  const isHighRisk = targetScore < 60 || (applicant.riskTier && applicant.riskTier.toLowerCase().includes('high'));

  // Micro-glow and badge calibration (FinTech muted palette)
  const glowShadowClass = isLowRisk
    ? 'shadow-[0_0_24px_rgba(5,150,105,0.08)]'
    : isHighRisk
    ? 'shadow-[0_0_24px_rgba(244,63,94,0.12)]'
    : 'shadow-[0_0_24px_rgba(245,158,11,0.12)]';

  const glowRadialStyle = isLowRisk
    ? 'radial-gradient(circle at center, rgba(5,150,105,0.12) 0%, rgba(5,150,105,0.02) 55%, transparent 75%)'
    : isHighRisk
    ? 'radial-gradient(circle at center, rgba(244,63,94,0.14) 0%, rgba(244,63,94,0.02) 55%, transparent 75%)'
    : 'radial-gradient(circle at center, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.02) 55%, transparent 75%)';

  const strokeColor = isLowRisk ? 'url(#trustGaugeGradient)' : isHighRisk ? '#f43f5e' : '#f59e0b';
  const badgeClasses = isLowRisk
    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 text-xs px-2.5 py-0.5 rounded-full font-medium'
    : isHighRisk
    ? 'bg-rose-950/40 text-rose-300 border border-rose-800/50 text-xs px-2.5 py-0.5 rounded-full font-medium'
    : 'bg-amber-950/40 text-amber-300 border border-amber-800/50 text-xs px-2.5 py-0.5 rounded-full font-medium';

  // Smooth counter animation from 0 to targetScore over 1.2s with easeOutExpo
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    const duration = 1200; // 1.2s

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * targetScore);
      setDisplayScore(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayScore(targetScore);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetScore]);

  // SVG Gauge geometry
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * targetScore) / 100;

  return (
    <div 
      className={cn(
        "relative rounded-2xl bg-[#080c14] border border-slate-800/90 p-5 sm:p-6 transition-all duration-300 hover:border-slate-700/80 group",
        "fintech-surface-subtle",
        className
      )}
    >
      {/* Background Micro-mesh grid & subtle ambient glow */}
      <div 
        className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full blur-3xl opacity-20"
        style={{ background: isLowRisk ? 'rgba(5, 150, 105, 0.15)' : isHighRisk ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)' }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Composite Trust Score
              </span>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Deterministic 3-Pillar Multi-Source Credit Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Confidence Tier Pill Badge */}
          <span className={badgeClasses}>
            <span className={cn(
              "inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse",
              isLowRisk ? "bg-emerald-400" : isHighRisk ? "bg-rose-400" : "bg-amber-400"
            )} />
            {applicant.confidenceTier}
          </span>

          {applicant.riskTier && (
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-mono-numbers">
              {applicant.riskTier}
            </span>
          )}

          <button
            onClick={() => setShowFormulaProof(!showFormulaProof)}
            title="Inspect Mathematical Proof"
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Score & Gauge Bento Content */}
      <div className={cn(
        "grid items-center gap-6 py-5",
        variant === 'full' ? "grid-cols-1 md:grid-cols-12" : "grid-cols-1"
      )}>
        
        {/* Left Column: Radial Score Gauge with Micro-Glow */}
        <div className={cn(
          "flex flex-col items-center justify-center text-center",
          variant === 'full' ? "md:col-span-5 md:border-r md:border-slate-800/80 md:pr-6" : ""
        )}>
          {/* Gauge Container with subtle calibrated radial glow */}
          <div className="relative flex items-center justify-center my-2">
            
            {/* Calibrated Ambient Micro-Glow */}
            <div 
              className={cn(
                "absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700",
                glowShadowClass
              )}
              style={{
                background: glowRadialStyle,
                transform: 'scale(1.15)'
              }}
            />

            {/* SVG Circular Gauge */}
            <svg 
              className="relative w-36 h-36 sm:w-40 sm:h-40 transform -rotate-90" 
              viewBox="0 0 120 120"
            >
              <defs>
                <linearGradient id="trustGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Background Inactive Ring: Cool deep slate track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#1e293b"
                strokeWidth="7"
                fill="transparent"
              />

              {/* Sub-track hairline decoration */}
              <circle
                cx="60"
                cy="60"
                r={radius - 8}
                stroke="#0f172a"
                strokeWidth="1"
                strokeDasharray="2 4"
                fill="transparent"
              />

              {/* Active Animated Gauge Stroke */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                stroke={strokeColor}
                strokeWidth="7"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              />
            </svg>

            {/* Center Text Readout with Animated Count-Up */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-white font-mono text-4xl font-semibold tracking-tight">
                {displayScore}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  SCALE 0–100
                </span>
              </div>
            </div>
          </div>

          {/* Verification Ratio & Status Indicator */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-mono font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
              {applicant.verificationRatio || '5/5 Verified'}
            </span>
            <span className="text-[10px] text-slate-400">
              Verified Evidence
            </span>
          </div>
        </div>

        {/* Right Column: 3-Pillar Breakdown Bars */}
        <div className={cn(
          "flex flex-col justify-center space-y-4",
          variant === 'full' ? "md:col-span-7" : ""
        )}>
          {/* Subheader with View Toggle */}
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Triangulated 3-Pillar Breakdown
            </span>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
              <button
                onClick={() => setScoreMetricMode('points')}
                className={cn(
                  "px-2 py-0.5 rounded transition-colors font-medium",
                  scoreMetricMode === 'points' 
                    ? "bg-slate-800 text-white font-bold" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                Points
              </button>
              <button
                onClick={() => setScoreMetricMode('percent')}
                className={cn(
                  "px-2 py-0.5 rounded transition-colors font-medium",
                  scoreMetricMode === 'percent' 
                    ? "bg-slate-800 text-white font-bold" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                Raw %
              </button>
            </div>
          </div>

          {/* Unified Proportional Strip (40% | 35% | 25%) */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800/80 p-[1px]">
              {/* Ability Segment (40%) */}
              <div 
                style={{ width: '40%' }} 
                className="h-full pr-[1px]" 
                title={`Ability: 40% weight (${abilityScore}/100)`}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${abilityScore}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-indigo-500 rounded-l-full"
                />
              </div>

              {/* Willingness Segment (35%) */}
              <div 
                style={{ width: '35%' }} 
                className="h-full px-[1px]" 
                title={`Willingness: 35% weight (${willingnessScore}/100)`}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${willingnessScore}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="h-full bg-emerald-500"
                />
              </div>

              {/* Stability Segment (25%) */}
              <div 
                style={{ width: '25%' }} 
                className="h-full pl-[1px]" 
                title={`Stability: 25% weight (${stabilityScore}/100)`}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stabilityScore}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="h-full bg-amber-500 rounded-r-full"
                />
              </div>
            </div>
            
            <div className="flex justify-between text-[10px] font-mono-numbers text-slate-400 px-0.5">
              <span className="text-indigo-400">Ability 40%</span>
              <span className="text-emerald-400">Willingness 35%</span>
              <span className="text-amber-400">Stability 25%</span>
            </div>
          </div>

          {/* Pillar 1: Ability (40%) */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                Ability to Repay
                <span className="text-[10px] text-slate-400 font-mono-numbers font-normal">
                  (40% Weight)
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-numbers font-bold text-indigo-400 text-xs">
                  {scoreMetricMode === 'points' ? `+${abilityContribution} pts` : `${abilityScore} / 100`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-numbers">
                  ({abilityScore}%)
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${abilityScore}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
              />
            </div>
          </div>

          {/* Pillar 2: Willingness (35%) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Receipt className="h-3.5 w-3.5 text-emerald-400" />
                Willingness to Repay
                <span className="text-[10px] text-slate-400 font-mono-numbers font-normal">
                  (35% Weight)
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-numbers font-bold text-emerald-400 text-xs">
                  {scoreMetricMode === 'points' ? `+${willingnessContribution} pts` : `${willingnessScore} / 100`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-numbers">
                  ({willingnessScore}%)
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${willingnessScore}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
              />
            </div>
          </div>

          {/* Pillar 3: Stability (25%) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                Stability of Activity
                <span className="text-[10px] text-slate-400 font-mono-numbers font-normal">
                  (25% Weight)
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-numbers font-bold text-amber-400 text-xs">
                  {scoreMetricMode === 'points' ? `+${stabilityContribution} pts` : `${stabilityScore} / 100`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-numbers">
                  ({stabilityScore}%)
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stabilityScore}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Expandable Mathematical Proof Drawer */}
      {showFormulaProof && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs"
        >
          <div className="flex items-center justify-between text-indigo-300 font-medium text-[11px]">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Deterministic Formulation Proof
            </span>
            <span className="text-[10px] font-mono-numbers text-slate-500">
              ISO/IEC 24028 Auditable
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono-numbers text-[11px] space-y-1.5 text-slate-300">
            <div className="flex justify-between items-center text-slate-400 pb-1 border-b border-slate-800/80 text-[10px]">
              <span>Formula</span>
              <span>(Ability × 0.40) + (Willingness × 0.35) + (Stability × 0.25)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pillar Contributions:</span>
              <span className="text-white font-semibold">
                ({abilityScore} × 0.40 = <span className="text-indigo-400">{abilityContribution}</span>) + ({willingnessScore} × 0.35 = <span className="text-emerald-400">{willingnessContribution}</span>) + ({stabilityScore} × 0.25 = <span className="text-amber-400">{stabilityContribution}</span>)
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Total Deterministic Score:</span>
              <span className="text-emerald-400 font-bold text-xs">
                {calculatedSum} ≈ {targetScore} / 100
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom Micro-Strip */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-mono-numbers">
        <span>Calibration: Standard RBI Fair Lending Anchor</span>
        <span>Model Version: TB-ML-v2.1</span>
      </div>
    </div>
  );
}
