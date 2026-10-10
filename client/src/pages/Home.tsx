import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Award,
  Layers,
  FileCheck2
} from 'lucide-react';
import RaviCaseStudy from '../components/RaviCaseStudy';
import PillarsSection from '../components/PillarsSection';
import SignalsGrid from '../components/SignalsGrid';

export default function Home() {
  return (
    <div className="pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>ALTERNATIVE CREDIT FOR THE CREDIT-INVISIBLE</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                "Your credit history may be missing. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                  Your trust isn't.
                </span>"
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                TrustBridge turns everyday financial discipline into explainable credit signals — helping micro-entrepreneurs demonstrate reliability beyond traditional bureau history.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link 
                  to="/apply"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sliders className="h-4 w-4" />
                  Check My Trust Score
                </Link>
                <a 
                  href="#ravi-case"
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  See How It Works
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Right Hero Visual: Large Animated Trust Score Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Trust Score Preview</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Established Signals
                  </span>
                </div>

                {/* SVG Radial Gauge */}
                <div className="py-6 flex flex-col items-center justify-center relative">
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
                        className="text-emerald-500 stroke-current transition-all duration-700 ease-out"
                        strokeWidth="10"
                        strokeDasharray={314}
                        strokeDashoffset={314 - (314 * 78) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-black text-white tracking-tight">78</span>
                      <span className="text-xs font-semibold text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Medium-High Confidence
                  </span>
                </div>

                {/* Surrounding Signals Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Stall Continuity</span>
                    <span className="font-semibold text-emerald-400">18 Mo Verified</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Supplier Repay</span>
                    <span className="font-semibold text-indigo-400">90% Punctual</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Stall Rent</span>
                    <span className="font-semibold text-emerald-400">95% On-Time</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Weekly Cashflow</span>
                    <span className="font-semibold text-indigo-400">₹7,500 Avg</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Statistics Banner */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="flex items-center justify-center gap-1.5 text-3xl sm:text-4xl font-extrabold text-white">
                <Users className="h-6 w-6 text-slate-400" />
                40Cr+
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Potentially credit-invisible citizens</div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-center gap-1.5 text-3xl sm:text-4xl font-extrabold text-emerald-400">
                <Award className="h-6 w-6 text-emerald-400" />
                ₹5K–₹25K
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Target micro-working capital range</div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-center gap-1.5 text-3xl sm:text-4xl font-extrabold text-indigo-400">
                <Layers className="h-6 w-6 text-indigo-400" />
                6 Signals
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Everyday discipline data points</div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-center gap-1.5 text-3xl sm:text-4xl font-extrabold text-amber-400">
                <CheckCircle2 className="h-6 w-6 text-amber-400" />
                3 Pillars
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Transparent, explainable math</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ravi Kumar Case Study */}
      <RaviCaseStudy />

      {/* The 3 Pillars Section */}
      <PillarsSection />

      {/* The 6 Signals Grid */}
      <SignalsGrid />

      {/* Bottom CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-emerald-950/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to test your alternative credit score?
            </h2>
            <p className="text-slate-300 text-sm">
              Use our live interactive simulator with 6 everyday discipline inputs. See exactly why your score moves.
            </p>
            <div className="pt-2">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-sm"
              >
                <FileCheck2 className="h-4 w-4" />
                Open Interactive Simulator
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
