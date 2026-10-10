import { ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0f172a] py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-slate-300">TrustBridge Platform</span>
            <span className="text-slate-500 ml-1.5">— FinTech Alternative Credit Scoring</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Overview</Link>
          <Link to="/apply" className="hover:text-emerald-400 transition-colors">Score Simulator</Link>
          <Link to="/underwriter" className="hover:text-indigo-400 transition-colors">Underwriter Cockpit</Link>
          <Link to="/fairness" className="hover:text-emerald-400 transition-colors">Fairness Charter</Link>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-500 flex items-center gap-1">
          <span>Engineered with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by Team Infinitix for India's 400M+ Credit-Invisible</span>
        </div>

      </div>
    </footer>
  );
}
