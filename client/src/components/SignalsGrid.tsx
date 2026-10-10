import { useState } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Smartphone, 
  Store, 
  Users, 
  Clock, 
  ChevronDown, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface SignalItem {
  id: number;
  title: string;
  category: string;
  icon: typeof TrendingUp;
  summary: string;
  what: string;
  why: string;
  how: string;
  pillarImpact: string;
  badgeColor: string;
}

export default function SignalsGrid() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const signals: SignalItem[] = [
    {
      id: 1,
      title: 'Weekly Business Turnover',
      category: 'Cashflow Liquidity',
      icon: TrendingUp,
      summary: 'Stable gross sales tracked over time via QR/UPI payments and physical daily ledger proofs.',
      what: 'The average recurring weekly gross intake generated from customer sales over the past 3 to 6 months.',
      why: 'Micro-entrepreneurs operate on weekly working capital cycles. High turnover frequency provides immediate cash liquidity to comfortably pay back micro-installments.',
      how: 'Feeds directly into the Ability to Repay pillar (40% weight). Higher coverage over weekly loan installments yields up to 100 points.',
      pillarImpact: 'Ability (40%)',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 2,
      title: 'Stall Rent Promptness',
      category: 'Contractual Discipline',
      icon: Receipt,
      summary: 'Monthly or weekly commercial stall rent payment consistency verified by landlord receipts or UPI records.',
      what: 'Documented record of on-time rental payments for the physical premises, pushcart permit, or market stall footprint.',
      why: 'Stall rent is a non-negotiable operational liability. Honoring rent punctually is the single highest behavioral predictor of debt repayment integrity.',
      how: 'Carries a 50% sub-weight inside the Willingness to Repay pillar. Timeliness above 90% significantly boosts trust confidence.',
      pillarImpact: 'Willingness (35%)',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 3,
      title: 'Utility & Mobile Recharges',
      category: 'Operational Habits',
      icon: Smartphone,
      summary: 'Punctual commercial electricity bill payments and uninterrupted prepaid mobile/data recharges.',
      what: 'Verification of recurrent utility charges: stall lighting meter, market electricity pool, and active mobile SIM connectivity.',
      why: 'Continuous active telecom connection and paid utilities reflect methodical personal budgeting and absence of financial chaos or service disconnects.',
      how: 'Contributes 20% to the Willingness to Repay pillar. Consistent recharge timestamps signal regular operational routine.',
      pillarImpact: 'Willingness (35%)',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 4,
      title: 'Supplier Repayment History',
      category: 'Commercial Integrity',
      icon: Store,
      summary: 'Credit honoring history with wholesale mandi merchants, distributors, and raw material providers.',
      what: 'The track record of settling informal or invoice-based wholesale inventory credit on scheduled settlement days.',
      why: 'Preserving supplier trust is essential for merchant survival. Vendors will not grant credit to bad actors; regular vendor clearance proves high commercial discipline.',
      how: 'Contributes 30% to the Willingness to Repay pillar. 90%+ punctuality establishes prime willingness ranking.',
      pillarImpact: 'Willingness (35%)',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 5,
      title: 'Community Chit / SHG Participation',
      category: 'Social Collateral',
      icon: Users,
      summary: 'Active contributions to local Self-Help Groups (SHGs) or verified neighborhood chit fund pools.',
      what: 'Regular monthly or weekly participation in mutual-aid savings pools where community peers mutually guarantee loans.',
      why: 'Micro-entrepreneurs often lack physical collateral (land, gold). Peer endorsement in savings groups acts as verified social collateral and reputational capital.',
      how: 'Provides a +5 score stability enhancement and validates peer trustworthiness within the Stability pillar.',
      pillarImpact: 'Stability (25%)',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 6,
      title: 'Business Continuity (Tenure)',
      category: 'Longevity & Survival',
      icon: Clock,
      summary: 'Number of consecutive months the merchant has operated continuously at the same location.',
      what: 'Verifiable physical longevity of the stall or enterprise at its present commercial address or street coordinates.',
      why: 'Micro-retail exhibits a high initial mortality rate. A business that survives beyond 12–18 months has an established customer base and resilient footfall.',
      how: 'Directly drives the Stability of Activity pillar: min(100, (Months / 24) * 100). Reaching 24 months unlocks maximum stability score.',
      pillarImpact: 'Stability (25%)',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  ];

  return (
    <section id="six-signals" className="py-16 border-b border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Everyday Behavioral Telemetry</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          The 6 Everyday Signals
        </h2>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Instead of looking backward at bureau debt cards, TrustBridge measures forward-looking commercial habits. Click any signal to inspect its underwriting logic.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signals.map((sig) => {
          const Icon = sig.icon;
          const isExpanded = expandedId === sig.id;

          return (
            <div
              key={sig.id}
              onClick={() => setExpandedId(isExpanded ? null : sig.id)}
              className={`bg-slate-900 border rounded-3xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isExpanded 
                  ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 bg-slate-900/95 ring-1 ring-indigo-500/50' 
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-800 text-indigo-400 border border-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        {sig.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">{sig.title}</h3>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-indigo-400' : ''
                    }`} 
                  />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {sig.summary}
                </p>

                {/* Expanded Detailed Q&A */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-slate-800 space-y-3.5 text-xs animate-in fade-in duration-200">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="font-bold text-slate-200 block text-[11px] mb-0.5">
                        WHAT IS IT?
                      </span>
                      <p className="text-slate-400 text-[11px]">{sig.what}</p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="font-bold text-indigo-400 block text-[11px] mb-0.5">
                        WHY DOES IT MATTER?
                      </span>
                      <p className="text-slate-400 text-[11px]">{sig.why}</p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20">
                      <span className="font-bold text-emerald-400 block text-[11px] mb-0.5">
                        HOW DOES IT AFFECT THE SCORE?
                      </span>
                      <p className="text-slate-300 text-[11px]">{sig.how}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Tag */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className={`px-2 py-0.5 rounded-full font-semibold border ${sig.badgeColor}`}>
                  {sig.pillarImpact}
                </span>
                <span className="text-slate-500 font-medium">
                  {isExpanded ? 'Click to collapse' : 'Click to explain'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fairness Callout */}
      <div className="mt-10 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center max-w-2xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>Strict Data Minimization: We collect only these 6 operational signals with zero demographic tracking.</span>
      </div>

    </section>
  );
}
