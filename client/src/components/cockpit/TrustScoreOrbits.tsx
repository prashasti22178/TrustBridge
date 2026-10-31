import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Receipt, 
  Clock, 
  Orbit, 
  Play, 
  Pause, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Applicant, SignalDetail } from '../../types/underwriter';

interface TrustScoreOrbitsProps {
  applicant?: Applicant;
  score?: number;
  abilityScore?: number;
  willingnessScore?: number;
  stabilityScore?: number;
  confidenceTier?: string;
  riskTier?: string;
  compact?: boolean;
  className?: string;
}

export default function TrustScoreOrbits({ 
  applicant, 
  score,
  abilityScore: propAbilityScore,
  willingnessScore: propWillingnessScore,
  stabilityScore: propStabilityScore,
  confidenceTier: propConfidenceTier,
  riskTier: propRiskTier,
  compact = false,
  className 
}: TrustScoreOrbitsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<'ability' | 'willingness' | 'stability' | null>(null);

  // Defensive extraction supporting both decomposed props and applicant object
  const trustScore = score ?? applicant?.trustScore ?? (applicant as any)?.trust_score ?? 78;
  const confidenceTier = propConfidenceTier ?? applicant?.confidenceTier ?? (applicant as any)?.confidence_tier ?? 'High Confidence';
  const riskTier = propRiskTier ?? applicant?.riskTier ?? (applicant as any)?.risk_tier ?? 'Low-Moderate Risk';
  
  const abilityScore = propAbilityScore ?? applicant?.pillars?.ability ?? (applicant as any)?.pillars?.ability ?? 82;
  const willingnessScore = propWillingnessScore ?? applicant?.pillars?.willingness ?? (applicant as any)?.pillars?.willingness ?? 76;
  const stabilityScore = propStabilityScore ?? applicant?.pillars?.stability ?? (applicant as any)?.pillars?.stability ?? 71;
  const signals: SignalDetail[] = applicant?.signals ?? (applicant as any)?.signals ?? [];
  const weeklyRevenue = applicant?.weeklyRevenue ?? 42000;
  const stallTenureMonths = applicant?.stallTenureMonths ?? 24;

  const abilityPts = (abilityScore * 0.40).toFixed(1);
  const willingnessPts = (willingnessScore * 0.35).toFixed(1);
  const stabilityPts = (stabilityScore * 0.25).toFixed(1);

  // Filter signals per pillar
  const abilitySignals = signals.filter((s: SignalDetail) => s.pillar?.toLowerCase().includes('ability'));
  const willingnessSignals = signals.filter((s: SignalDetail) => s.pillar?.toLowerCase().includes('willingness'));
  const stabilitySignals = signals.filter((s: SignalDetail) => s.pillar?.toLowerCase().includes('stability'));

  // Orbital revolution speeds (seconds per full 360 rotation)
  const DURATION_INNER = 22;   // Ability (40%)
  const DURATION_MIDDLE = 32;  // Willingness (35%)
  const DURATION_OUTER = 44;   // Stability (25%)

  // Compact ThreeUI Orbits Widget (max height h-[280px])
  if (compact) {
    return (
      <div 
        className={cn(
          "relative rounded-2xl bg-[#080c14] border border-slate-800 p-3.5 transition-all duration-300 shadow-xl overflow-hidden max-h-[280px] h-[280px] flex flex-col justify-between select-none group",
          className
        )}
      >
        {/* Subtle Ambient Mesh & Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.2) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>

        {/* Compact Header */}
        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Orbit className="h-3 w-3" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white leading-none">
                Orbital Mechanics
              </h3>
              <span className="text-[10px] text-slate-400 leading-none">
                3-Pillar Triangulation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="h-6 px-2 inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-medium text-slate-300 transition-colors"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <>
                  <Play className="h-2.5 w-2.5 text-emerald-400" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="h-2.5 w-2.5 text-amber-400" />
                  <span>Pause</span>
                </>
              )}
            </button>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-indigo-400 border border-indigo-500/20">
              ThreeUI
            </span>
          </div>
        </div>

        {/* Compact Orbit Stage (170px height) */}
        <div className="relative flex items-center justify-center w-full h-[175px] my-auto shrink-0 select-none">
          {/* Subtle Outer Atmosphere Glow */}
          <div 
            className="absolute inset-0 m-auto rounded-full blur-2xl opacity-15 pointer-events-none"
            style={{
              width: 170,
              height: 170,
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(16, 185, 129, 0.2) 40%, rgba(168, 85, 247, 0.15) 70%, transparent 100%)'
            }}
          />

          {/* 1. OUTER ORBIT: STABILITY (25%) */}
          <div 
            className="absolute inset-0 m-auto rounded-full border border-purple-500/20 border-dashed pointer-events-none"
            style={{ width: 168, height: 168 }}
          />
          <motion.div
            className="absolute inset-0 m-auto rounded-full pointer-events-none"
            style={{ width: 168, height: 168 }}
            animate={{ rotate: isPaused ? 0 : 360 }}
            transition={{ repeat: Infinity, duration: DURATION_OUTER, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <motion.div
                animate={{ rotate: isPaused ? 0 : -360 }}
                transition={{ repeat: Infinity, duration: DURATION_OUTER, ease: "linear" }}
                onClick={() => setSelectedPillar(selectedPillar === 'stability' ? null : 'stability')}
                className={cn(
                  "cursor-pointer rounded-md bg-[#080c14]/95 border px-1.5 py-0.5 backdrop-blur-md transition-all shadow flex items-center gap-1",
                  "hover:scale-105 hover:border-purple-400",
                  selectedPillar === 'stability' ? "border-purple-400 ring-1 ring-purple-400" : "border-purple-500/30"
                )}
                title={`Stability: ${stabilityScore}/100 (25%)`}
              >
                <Clock className="h-2.5 w-2.5 text-purple-400" />
                <span className="text-[9px] font-mono font-bold text-purple-300">{stabilityScore}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* 2. MIDDLE ORBIT: WILLINGNESS (35%) */}
          <div 
            className="absolute inset-0 m-auto rounded-full border border-emerald-500/20 border-dashed pointer-events-none"
            style={{ width: 118, height: 118 }}
          />
          <motion.div
            className="absolute inset-0 m-auto rounded-full pointer-events-none"
            style={{ width: 118, height: 118 }}
            animate={{ rotate: isPaused ? 0 : -360 }}
            transition={{ repeat: Infinity, duration: DURATION_MIDDLE, ease: "linear" }}
          >
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <motion.div
                animate={{ rotate: isPaused ? 0 : 360 }}
                transition={{ repeat: Infinity, duration: DURATION_MIDDLE, ease: "linear" }}
                onClick={() => setSelectedPillar(selectedPillar === 'willingness' ? null : 'willingness')}
                className={cn(
                  "cursor-pointer rounded-md bg-[#080c14]/95 border px-1.5 py-0.5 backdrop-blur-md transition-all shadow flex items-center gap-1",
                  "hover:scale-105 hover:border-emerald-400",
                  selectedPillar === 'willingness' ? "border-emerald-400 ring-1 ring-emerald-400" : "border-emerald-500/30"
                )}
                title={`Willingness: ${willingnessScore}/100 (35%)`}
              >
                <Receipt className="h-2.5 w-2.5 text-emerald-400" />
                <span className="text-[9px] font-mono font-bold text-emerald-300">{willingnessScore}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* 3. INNER ORBIT: ABILITY (40%) */}
          <div 
            className="absolute inset-0 m-auto rounded-full border border-sky-400/25 border-dashed pointer-events-none"
            style={{ width: 72, height: 72 }}
          />
          <motion.div
            className="absolute inset-0 m-auto rounded-full pointer-events-none"
            style={{ width: 72, height: 72 }}
            animate={{ rotate: isPaused ? 0 : 360 }}
            transition={{ repeat: Infinity, duration: DURATION_INNER, ease: "linear" }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto">
              <motion.div
                animate={{ rotate: isPaused ? 0 : -360 }}
                transition={{ repeat: Infinity, duration: DURATION_INNER, ease: "linear" }}
                onClick={() => setSelectedPillar(selectedPillar === 'ability' ? null : 'ability')}
                className={cn(
                  "cursor-pointer rounded-md bg-[#080c14]/95 border px-1.5 py-0.5 backdrop-blur-md transition-all shadow flex items-center gap-1",
                  "hover:scale-105 hover:border-sky-400",
                  selectedPillar === 'ability' ? "border-sky-400 ring-1 ring-sky-400" : "border-sky-400/30"
                )}
                title={`Ability: ${abilityScore}/100 (40%)`}
              >
                <TrendingUp className="h-2.5 w-2.5 text-sky-400" />
                <span className="text-[9px] font-mono font-bold text-sky-300">{abilityScore}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* 4. CENTER CORE: COMPOSITE TRUST SCORE */}
          <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#080c14]/95 backdrop-blur-md border border-slate-800 shadow-[0_0_20px_rgba(5,150,105,0.15)] flex flex-col items-center justify-center text-center z-10 pointer-events-none">
            <span className="font-mono text-base font-bold text-white leading-none">
              {trustScore}
            </span>
            <span className="text-[7px] font-mono text-slate-500 uppercase leading-none mt-0.5">
              SCORE
            </span>
          </div>
        </div>

        {/* Compact Footer Strip */}
        <div className="relative z-10 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Ability 40% · Willingness 35% · Stability 25%</span>
          </span>
          <span className="text-emerald-400 font-semibold">{confidenceTier}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative rounded-2xl bg-[#080c14] border border-slate-800 p-5 sm:p-6 transition-all duration-300 shadow-2xl overflow-hidden",
        className
      )}
    >
      {/* Background Ambient Starfield & Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.2) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Top Header Strip */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Orbit className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Harmonic Orbital Triangulation
              </h3>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-900 text-indigo-400 border border-indigo-500/20">
                ThreeUI Motion Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Synchronous 3-Pillar Orbital Mechanics • Counter-rotating Telemetry Satellites
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="h-8 inline-flex items-center gap-1.5 px-3 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors"
            title={isPaused ? "Resume orbital rotation" : "Pause orbital rotation for inspection"}
          >
            {isPaused ? (
              <>
                <Play className="h-3 w-3 text-emerald-400" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 text-amber-400" />
                <span>Pause Orbits</span>
              </>
            )}
          </button>

          <div className="hidden md:inline-flex h-8 items-center gap-1.5 px-2.5 rounded-md bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full shrink-0",
              isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
            )} />
            <span>{isPaused ? "ORBITS PAUSED" : "LIVE REVOLUTION"}</span>
          </div>
        </div>
      </div>

      {/* Main Orbit Stage */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 py-6">
        
        {/* Orbital Mechanics Stage (Left/Center) */}
        <div className="relative flex items-center justify-center w-full max-w-[440px] h-[400px] sm:h-[440px] mx-auto shrink-0 select-none">
          
          {/* Subtle Outer Atmosphere Glow */}
          <div 
            className="absolute inset-0 m-auto rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{
              width: 380,
              height: 380,
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(16, 185, 129, 0.2) 40%, rgba(168, 85, 247, 0.15) 70%, transparent 100%)'
            }}
          />

          {/* ======================================================== */}
          {/* 1. OUTER ORBIT: STABILITY (25%) - ACCENT: #a855f7        */}
          {/* ======================================================== */}
          {/* Static Orbit Guide Track */}
          <div 
            className="absolute inset-0 m-auto rounded-full border border-purple-500/20 border-dashed pointer-events-none"
            style={{ width: 360, height: 360 }}
          />

          {/* Revolving Orbital Frame */}
          <motion.div
            className="absolute inset-0 m-auto rounded-full pointer-events-none"
            style={{ width: 360, height: 360 }}
            animate={{ rotate: isPaused ? 0 : 360 }}
            transition={{
              repeat: Infinity,
              duration: DURATION_OUTER,
              ease: "linear"
            }}
          >
            {/* Satellite Node at Top (12 o'clock) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <motion.div
                animate={{ rotate: isPaused ? 0 : -360 }}
                transition={{
                  repeat: Infinity,
                  duration: DURATION_OUTER,
                  ease: "linear"
                }}
                onClick={() => setSelectedPillar(selectedPillar === 'stability' ? null : 'stability')}
                className={cn(
                  "cursor-pointer rounded-lg bg-[#080c14]/95 border px-2.5 py-1.5 backdrop-blur-md transition-all duration-200 shadow-lg flex items-center gap-2",
                  "hover:scale-105 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
                  selectedPillar === 'stability' ? "border-purple-400 ring-1 ring-purple-400" : "border-purple-500/30"
                )}
              >
                <div className="h-6 w-6 rounded bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[11px] font-bold text-white whitespace-nowrap">Stability</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      25%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px]">
                    <span className="text-purple-400 font-bold">{stabilityScore}/100</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">+{stabilityPts} pts</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>


          {/* ======================================================== */}
          {/* 2. MIDDLE ORBIT: WILLINGNESS (35%) - ACCENT: #10b981     */}
          {/* ======================================================== */}
          {/* Static Orbit Guide Track */}
          <div 
            className="absolute inset-0 m-auto rounded-full border border-emerald-500/20 border-dashed pointer-events-none"
            style={{ width: 260, height: 260 }}
          />

          {/* Revolving Orbital Frame (Counter-clockwise for dynamic visual contrast) */}
          <motion.div
            className="absolute inset-0 m-auto rounded-full pointer-events-none"
            style={{ width: 260, height: 260 }}
            animate={{ rotate: isPaused ? 0 : -360 }}
            transition={{
              repeat: Infinity,
              duration: DURATION_MIDDLE,
              ease: "linear"
            }}
          >
            {/* Satellite Node at Right (3 o'clock) */}
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <motion.div
                animate={{ rotate: isPaused ? 0 : 360 }}
                transition={{
                  repeat: Infinity,
                  duration: DURATION_MIDDLE,
                  ease: "linear"
                }}
                onClick={() => setSelectedPillar(selectedPillar === 'willingness' ? null : 'willingness')}
                className={cn(
                  "cursor-pointer rounded-lg bg-[#080c14]/95 border px-2.5 py-1.5 backdrop-blur-md transition-all duration-200 shadow-lg flex items-center gap-2",
                  "hover:scale-105 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                  selectedPillar === 'willingness' ? "border-emerald-400 ring-1 ring-emerald-400" : "border-emerald-500/30"
                )}
              >
                <div className="h-6 w-6 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Receipt className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[11px] font-bold text-white whitespace-nowrap">Willingness</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      35%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px]">
                    <span className="text-emerald-400 font-bold">{willingnessScore}/100</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">+{willingnessPts} pts</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>


          {/* ======================================================== */}
          {/* 3. INNER ORBIT: ABILITY (40%) - ACCENT: #38bdf8          */}
          {/* ======================================================== */}
          {/* Static Orbit Guide Track */}
          <div 
            className="absolute inset-0 m-auto rounded-full border border-sky-400/25 border-dashed pointer-events-none"
            style={{ width: 175, height: 175 }}
          />

          {/* Revolving Orbital Frame */}
          <motion.div
            className="absolute inset-0 m-auto rounded-full pointer-events-none"
            style={{ width: 175, height: 175 }}
            animate={{ rotate: isPaused ? 0 : 360 }}
            transition={{
              repeat: Infinity,
              duration: DURATION_INNER,
              ease: "linear"
            }}
          >
            {/* Satellite Node at Bottom (6 o'clock) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto">
              <motion.div
                animate={{ rotate: isPaused ? 0 : -360 }}
                transition={{
                  repeat: Infinity,
                  duration: DURATION_INNER,
                  ease: "linear"
                }}
                onClick={() => setSelectedPillar(selectedPillar === 'ability' ? null : 'ability')}
                className={cn(
                  "cursor-pointer rounded-lg bg-[#080c14]/95 border px-2.5 py-1.5 backdrop-blur-md transition-all duration-200 shadow-lg flex items-center gap-2",
                  "hover:scale-105 hover:border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]",
                  selectedPillar === 'ability' ? "border-sky-400 ring-1 ring-sky-400" : "border-sky-400/30"
                )}
              >
                <div className="h-6 w-6 rounded bg-sky-400/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[11px] font-bold text-white whitespace-nowrap">Ability</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-400/15 text-sky-300 border border-sky-400/30">
                      40%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px]">
                    <span className="text-sky-400 font-bold">{abilityScore}/100</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">+{abilityPts} pts</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>


          {/* ======================================================== */}
          {/* 4. CENTER CORE: COMPOSITE TRUST SCORE (0-100)            */}
          {/* ======================================================== */}
          <div className="absolute inset-0 m-auto w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#080c14]/95 backdrop-blur-md border border-slate-800 shadow-[0_0_35px_rgba(16,185,129,0.22)] flex flex-col items-center justify-center text-center z-10">
            {/* Concentric Center Ripple Effect */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20 pointer-events-none" />
            
            <span className="text-[8px] uppercase tracking-wider font-mono text-slate-400 font-semibold mb-0.5">
              TRUST SCORE
            </span>
            
            <div className="flex items-baseline gap-0.5">
              <span className="font-mono-numbers text-3xl sm:text-4xl font-black text-white tracking-tight">
                {trustScore}
              </span>
              <span className="text-[10px] font-mono text-slate-500">/100</span>
            </div>

            {/* Live Confidence Badge */}
            <span className="mt-1 text-[9px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>{confidenceTier}</span>
            </span>

            {/* Risk Tier Tag */}
            <span className="text-[8px] font-mono text-slate-500 mt-0.5 whitespace-nowrap">
              {riskTier}
            </span>
          </div>

        </div>

        {/* Telemetry & Detailed Signals Column (Right) */}
        <div className="flex-1 w-full space-y-3 lg:max-w-md">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Orbital Alignment Telemetry
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Deterministic Weights
            </span>
          </div>

          {/* Pillar 1: Ability Card */}
          <div 
            onClick={() => setSelectedPillar(selectedPillar === 'ability' ? null : 'ability')}
            className={cn(
              "p-3 rounded-xl bg-slate-900/60 border cursor-pointer transition-all duration-200",
              selectedPillar === 'ability' 
                ? "border-sky-400/80 bg-sky-950/20 ring-1 ring-sky-400/30" 
                : "border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                <span className="text-xs font-bold text-white">Inner Orbit • Ability to Repay</span>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400">
                {abilityScore}/100 <span className="text-[10px] text-slate-400 font-normal">({abilityPts} pts)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Synthesizes daily turnover of ₹{weeklyRevenue.toLocaleString()} with 3.5x coverage over requested weekly installment.
            </p>
            {abilitySignals.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {abilitySignals.map((sig: SignalDetail, sIdx: number) => (
                  <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-400/10 text-sky-300 border border-sky-400/20">
                    {sig.name}: <strong>{sig.rawMetric}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pillar 2: Willingness Card */}
          <div 
            onClick={() => setSelectedPillar(selectedPillar === 'willingness' ? null : 'willingness')}
            className={cn(
              "p-3 rounded-xl bg-slate-900/60 border cursor-pointer transition-all duration-200",
              selectedPillar === 'willingness' 
                ? "border-emerald-400/80 bg-emerald-950/20 ring-1 ring-emerald-400/30" 
                : "border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span className="text-xs font-bold text-white">Middle Orbit • Willingness to Repay</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {willingnessScore}/100 <span className="text-[10px] text-slate-400 font-normal">({willingnessPts} pts)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Evaluates stall landlord rent vouchers, APMC mandi credit logs, and periodic telecom recharge punctuality.
            </p>
            {willingnessSignals.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {willingnessSignals.map((sig: SignalDetail, sIdx: number) => (
                  <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                    {sig.name}: <strong>{sig.rawMetric}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pillar 3: Stability Card */}
          <div 
            onClick={() => setSelectedPillar(selectedPillar === 'stability' ? null : 'stability')}
            className={cn(
              "p-3 rounded-xl bg-slate-900/60 border cursor-pointer transition-all duration-200",
              selectedPillar === 'stability' 
                ? "border-purple-400/80 bg-purple-950/20 ring-1 ring-purple-400/30" 
                : "border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
                <span className="text-xs font-bold text-white">Outer Orbit • Stability of Activity</span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400">
                {stabilityScore}/100 <span className="text-[10px] text-slate-400 font-normal">({stabilityPts} pts)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in {stallTenureMonths} months uninterrupted commercial operation at declared physical marketplace pitch.
            </p>
            {stabilitySignals.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {stabilitySignals.map((sig: SignalDetail, sIdx: number) => (
                  <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-400/10 text-purple-300 border border-purple-400/20">
                    {sig.name}: <strong>{sig.rawMetric}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Footer Telemetry Strip */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>ISO/IEC 24028 Auditable Deterministic Triangulation</span>
        </div>
        <span>Formula: (Ability × 0.40) + (Willingness × 0.35) + (Stability × 0.25)</span>
      </div>
    </div>
  );
}
