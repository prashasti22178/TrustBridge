import { 
  TrendingUp, 
  Receipt, 
  Clock, 
  Calculator, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function PillarsSection() {
  const pillars = [
    {
      title: 'Ability to Repay',
      weight: '40%',
      weightNum: 40,
      color: 'emerald',
      icon: TrendingUp,
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      barColor: 'bg-emerald-500',
      measures: 'Cashflow Coverage & Surplus',
      description:
        'Analyzes whether current weekly business revenue reliably outpaces operating costs and comfortably services the micro-installment without causing household distress.',
      keyMetrics: [
        'Weekly Gross Turnover vs. Weekly Loan Installment',
        'Coverage Ratio Benchmark: >= 5x for prime confidence',
        'Seasonal revenue volatility buffer'
      ],
      formulaNote: 'min(100, (Weekly Revenue / Weekly Loan Installment) × 20)'
    },
    {
      title: 'Willingness to Repay',
      weight: '35%',
      weightNum: 35,
      color: 'indigo',
      icon: Receipt,
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      barColor: 'bg-indigo-500',
      measures: 'Behavioral Payment Discipline',
      description:
        'A comprehensive record of how punctually the merchant honors recurrent real-world financial dues across landlords, inventory suppliers, and utility providers.',
      keyMetrics: [
        'Stall Rent Punctuality (50% sub-weight)',
        'Wholesale Mandi Supplier Credit (30% sub-weight)',
        'Utility & Mobile Recharges (20% sub-weight)'
      ],
      formulaNote: '(0.50 × Rent) + (0.30 × Supplier) + (0.20 × Utility)'
    },
    {
      title: 'Stability of Activity',
      weight: '25%',
      weightNum: 25,
      color: 'amber',
      icon: Clock,
      borderColor: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      barColor: 'bg-amber-500',
      measures: 'Operational Continuity & Community Anchor',
      description:
        'Verifies business longevity at the same physical geography and assesses collective accountability through local community chit funds or self-help groups (SHG).',
      keyMetrics: [
        'Physical Stall Tenure (capped at 24 months for max points)',
        'Active Community Chit / SHG Participation (+5 pts)',
        'Supplier relationship duration'
      ],
      formulaNote: 'min(100, (Months at Stall / 24) × 100)'
    }
  ];

  return (
    <section id="three-pillars" className="py-16 border-b border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Transparent Mathematical Weights</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          The 3 Scoring Pillars
        </h2>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Unlike opaque neural networks or proprietary black-box algorithms, TrustBridge calculates creditworthiness using open, deterministic weights where every point is explainable.
        </p>
      </div>

      {/* Visual Weight Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-10 max-w-4xl mx-auto shadow-xl">
        <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2.5">
          <span>Formula: Trust Score = (0.40 × Ability) + (0.35 × Willingness) + (0.25 × Stability)</span>
          <span className="font-mono text-emerald-400">100% Deterministic</span>
        </div>
        
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: '40%' }} title="Ability: 40%"></div>
          <div className="h-full bg-indigo-500 transition-all" style={{ width: '35%' }} title="Willingness: 35%"></div>
          <div className="h-full bg-amber-500 transition-all" style={{ width: '25%' }} title="Stability: 25%"></div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[11px] font-semibold">
          <div className="text-emerald-400">Ability to Repay (40%)</div>
          <div className="text-indigo-400">Willingness to Repay (35%)</div>
          <div className="text-amber-400">Stability of Activity (25%)</div>
        </div>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div 
              key={idx}
              className={`bg-slate-900 border ${pillar.borderColor} rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all hover:scale-[1.01]`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${pillar.badgeBg}`}>
                    Weight: {pillar.weight}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <span className="text-[11px] font-semibold text-slate-400 block mt-1">
                  Focus: {pillar.measures}
                </span>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {pillar.description}
                </p>

                <div className="mt-5 space-y-2 pt-4 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Underlying Data Points:
                  </span>
                  {pillar.keyMetrics.map((metric, mIdx) => (
                    <div key={mIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <Calculator className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{pillar.formulaNote}</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
