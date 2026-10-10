import { useState } from 'react';
import { 
  BadgeAlert, 
  CheckCircle2, 
  Store, 
  MapPin, 
  Clock, 
  IndianRupee, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RaviCaseStudy() {
  const [activeTab, setActiveTab] = useState<'compare' | 'signals'>('compare');

  return (
    <section id="ravi-case" className="py-16 border-b border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Benchmark Case Study</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          The Ground Truth: Ravi Kumar's Story
        </h2>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Ravi has operated a fresh fruit stall at the same Bengaluru market corner for 18 months, generating steady weekly revenue. See how traditional bureau scoring fails him while TrustBridge unlocks fair credit.
        </p>

        {/* View Toggle */}
        <div className="inline-flex bg-slate-900 p-1 rounded-xl border border-slate-800 mt-6">
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'compare'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bank vs TrustBridge Comparison
          </button>
          <button
            onClick={() => setActiveTab('signals')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'signals'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ravi's 6 Verified Signals
          </button>
        </div>
      </div>

      {/* Profile Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 max-w-4xl mx-auto backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
              RK
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Ravi Kumar</h4>
              <p className="text-slate-400 text-[11px] flex items-center gap-2">
                <span className="flex items-center gap-1"><Store className="h-3 w-3 text-indigo-400" /> Fruit Stall Vendor</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-500" /> Bengaluru, KA</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Stall Tenure</span>
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <Clock className="h-3 w-3 text-emerald-400" /> 18 Months
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Weekly Turnover</span>
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-emerald-400" /> ₹7,500 / wk
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Requested Capital</span>
              <span className="font-bold text-emerald-400 font-mono">₹10,000 Starter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison View */}
      {activeTab === 'compare' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Traditional Credit Decision */}
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-500/10 border-b border-l border-red-500/20 text-red-400 text-xs font-bold rounded-bl-2xl">
              Commercial Bureau System
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <BadgeAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Traditional Bank</h3>
                  <p className="text-xs text-red-400 font-mono font-semibold">CIBIL: 0 / -1 (No File Exists)</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Underwriting Process:</span>
                  <p className="text-slate-300 font-mono text-[11px]">
                    Automated credit engine checks TransUnion/CIBIL database. 0 records found.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-red-500/20">
                  <span className="text-slate-400 block text-[11px] mb-1">Bureau Verdict:</span>
                  <p className="text-red-400 font-bold text-sm flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4" /> 100% Instant Auto-Rejection
                  </p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    "Insufficient bureau depth. Applicant deemed high-risk due to lack of historical bank credit card or loan data."
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">The Reality on the Ground:</span>
                  <p className="text-slate-400 text-[11px]">
                    Forced to borrow from unregulated street moneylenders at 60%–120% annualized daily compound interest.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
              *India has over 400M citizens classified as credit-invisible despite consistent daily earnings.
            </div>
          </div>

          {/* TrustBridge Alternative Credit Decision */}
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-emerald-500/5">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500/10 border-b border-l border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-bl-2xl">
              TrustBridge Engine
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">TrustBridge Assessment</h3>
                  <p className="text-xs text-emerald-400 font-semibold">Trust Score: 78 / 100 (Medium-High)</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Evaluated Discipline:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400">✓ 18 Mo Stall Continuity</span>
                    <span className="flex items-center gap-1 text-emerald-400">✓ 95% Stall Rent Timeliness</span>
                    <span className="flex items-center gap-1 text-emerald-400">✓ 90% Mandi Supplier Repay</span>
                    <span className="flex items-center gap-1 text-emerald-400">✓ Active Community Chit</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30">
                  <span className="text-slate-400 block text-[11px] mb-1">Human Underwriter Sanction:</span>
                  <p className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" /> Sanction ₹10,000 Starter Loan
                  </p>
                  <p className="text-slate-300 text-[11px] mt-1">
                    Structured with ₹833 weekly collection over 12 weeks. Covered 9x by verified weekly cashflow.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Growth Runway:</span>
                  <p className="text-slate-300 text-[11px]">
                    On-time repayment of this starter loan graduates Ravi into the formal banking system with a verified track record.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium">Explainable • Fair • Human-Sanctioned</span>
              <Link to="/apply" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                Test in Simulator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      ) : (
        /* Detailed 6 Signals Breakdown for Ravi */
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Signal 1: Turnover</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">₹7,500 / week</div>
            <p className="text-xs text-slate-400 mt-1">Steady QR and cash revenue tracked continuously across 6 months.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Signal 2: Rent Timeliness</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">95% On-Time</div>
            <p className="text-xs text-slate-400 mt-1">12 consecutive monthly stall landlord receipts with zero default notices.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Signal 3: Supplier Repay</span>
            <div className="text-lg font-bold text-indigo-400 mt-1">90% Punctual</div>
            <p className="text-xs text-slate-400 mt-1">Wholesale fruit mandi accounts settled every Tuesday without friction.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Signal 4: Utilities</span>
            <div className="text-lg font-bold text-amber-400 mt-1">85% Consistency</div>
            <p className="text-xs text-slate-400 mt-1">Commercial electricity and primary business phone recharged monthly.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Signal 5: Community Chit</span>
            <div className="text-lg font-bold text-indigo-400 mt-1">Active Verified</div>
            <p className="text-xs text-slate-400 mt-1">Contributing ₹500 monthly to local fruit merchant self-help association.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Signal 6: Stall Longevity</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">18 Months</div>
            <p className="text-xs text-slate-400 mt-1">Continuous operation at same physical street intersection in Bengaluru.</p>
          </div>
        </div>
      )}

    </section>
  );
}
