import { ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-850 bg-[#090d16] py-4 px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
      {/* Brand & Tagline */}
      <div className="flex items-center space-x-2.5 shrink-0">
        <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-semibold text-slate-300">TrustBridge</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 text-[11px]">Alternative Credit Scoring</span>
        </div>
      </div>

      {/* Nav Links with Clean Dot Spacers */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-slate-400 text-[11px]">
        <Link to="/" className="hover:text-emerald-400 transition-colors">Overview</Link>
        <span className="text-slate-600 select-none">·</span>
        <Link to="/apply" className="hover:text-emerald-400 transition-colors">Score Simulator</Link>
        <span className="text-slate-600 select-none">·</span>
        <Link to="/underwriter" className="hover:text-indigo-400 transition-colors">Underwriter Cockpit</Link>
        <span className="text-slate-600 select-none">·</span>
        <Link to="/fairness" className="hover:text-emerald-400 transition-colors">Fairness Charter</Link>
        <span className="text-slate-600 select-none">·</span>
        <Link to="/privacy-security" className="hover:text-emerald-400 transition-colors">Security</Link>
      </div>

      {/* Engineered Tagline with Spacing to avoid Assistant Button Collision */}
      <div className="text-center md:text-right text-[11px] text-slate-500 flex items-center justify-center md:justify-end gap-1.5 shrink-0 md:pr-14">
        <span>Engineered with</span>
        <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline-block" />
        <span className="whitespace-nowrap">by TrustBridge Credit Intelligence</span>
      </div>
    </footer>
  );
}
