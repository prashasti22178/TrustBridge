import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Sliders, 
  Menu, 
  X,
  Scale,
  LogIn,
  LogOut,
  KeyRound
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/apply', label: 'Score Simulator' },
    { to: '/underwriter', label: 'Underwriter Cockpit', isSpecial: true },
    { to: '/fairness', label: 'Fairness Charter' },
    { to: '/privacy-security', label: 'Privacy & Security' },
  ];

  return (
    <nav className="border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/25 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/50 transition-colors">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">TrustBridge</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">Credit Intelligence</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">FinTech Alternative Credit Platform</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            if (link.isSpecial) {
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 border border-indigo-500/20'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  {link.label}
                  <span className="px-1.5 py-0.2 bg-indigo-500/30 rounded text-[10px] text-indigo-200 font-mono">
                    Live
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>

        {/* Authentication & CTA */}
        <div className="hidden sm:flex items-center space-x-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium truncate max-w-[120px]">{user.fullName}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded font-mono-numbers ${
                  user.role === 'admin'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    : user.role === 'underwriter'
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5 text-indigo-400" />
              Sign In
            </Link>
          )}

          <Link
            to="/apply"
            className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-950" />
            Check Trust Score
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-[#0f172a] border-b border-slate-800 animate-in fade-in duration-150">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              location.pathname === '/' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            Overview
          </Link>
          <Link 
            to="/apply" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              location.pathname === '/apply' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            Score Simulator
          </Link>
          <Link 
            to="/underwriter" 
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-indigo-400 hover:bg-indigo-950/40"
          >
            Underwriter Cockpit
          </Link>
          <Link 
            to="/fairness" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
              location.pathname === '/fairness' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Scale className="h-4 w-4 text-emerald-400" />
            Fairness Charter
          </Link>
          <Link 
            to="/privacy-security" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
              location.pathname === '/privacy-security' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <KeyRound className="h-4 w-4 text-indigo-400" />
            Privacy & Security
          </Link>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 text-xs">
                <span className="text-slate-300 truncate">{user.fullName} ({user.role})</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="h-4 w-4 text-indigo-400" /> Sign In
              </Link>
            )}

            <Link
              to="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Sliders className="h-4 w-4" /> Check Trust Score
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
