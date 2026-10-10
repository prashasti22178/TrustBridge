import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from './LogoutModal';
import {
  Search,
  Bell,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
  LogOut,
  KeyRound
} from 'lucide-react';
import type { Applicant } from '../../types/underwriter';

interface CockpitHeaderProps {
  applicants: Applicant[];
  activeApplicant: Applicant;
  onSelectApplicant: (applicant: Applicant) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenDossier: () => void;
  onOpenSimulator: () => void;
}

export default function CockpitHeader({
  applicants,
  activeApplicant,
  onSelectApplicant,
  onRefresh,
  isRefreshing,
  onOpenDossier,
  onOpenSimulator
}: CockpitHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const filteredApplicants = applicants.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  const getTrajectoryBadge = (trajectory?: string) => {
    if (trajectory === 'IMPROVING') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          IMPROVING
        </span>
      );
    }
    if (trajectory === 'DETERIORATING') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          DETERIORATING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        STABLE
      </span>
    );
  };

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#090d16]/95 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20">
      {/* Left: Active Borrower Context Switcher */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all text-left shadow-sm group"
            aria-expanded={dropdownOpen}
            aria-label="Select active borrower"
          >
            <div className="h-6 w-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
              {activeApplicant.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-tight">{activeApplicant.name}</span>
                <span className="text-[10px] font-mono-numbers text-slate-400">{activeApplicant.id}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                {activeApplicant.businessType}
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-200 transition-transform ml-1" />
          </button>

          {/* Borrower Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-slate-800/80 mb-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Multi-Borrower Review Queue ({applicants.length})
                </div>
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search applicant name, stall, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                {filteredApplicants.map((appl) => {
                  const isCurrent = appl.id === activeApplicant.id;
                  return (
                    <button
                      key={appl.id}
                      onClick={() => {
                        onSelectApplicant(appl);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                          : 'hover:bg-slate-850 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300 shrink-0">
                          {appl.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-slate-100 truncate">{appl.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {appl.businessType} • {appl.location.split(',')[0]}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span className={`font-mono-numbers font-bold px-1.5 py-0.5 rounded text-[11px] border ${getScoreColor(appl.trustScore)}`}>
                          {appl.trustScore}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Context Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
            <span className={`font-mono-numbers font-bold px-1.5 rounded ${getScoreColor(activeApplicant.trustScore)}`}>
              {activeApplicant.trustScore}/100
            </span>
          </div>

          {getTrajectoryBadge(activeApplicant.riskTrajectory)}
        </div>
      </div>

      {/* Right: Cockpit Action Shortcuts & System Telemetry */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Dossier Open Button */}
        <button
          onClick={onOpenDossier}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-colors"
          title="Open Applicant Full Dossier"
        >
          <FileText className="h-3.5 w-3.5 text-indigo-400" />
          <span>Full Dossier</span>
        </button>

        {/* Quick What-If Simulator Shortcut */}
        <button
          onClick={onOpenSimulator}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 font-medium transition-colors"
          title="Simulate shock scenario on active applicant"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
          <span>Simulate</span>
        </button>

        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          title="Refresh queue from Supabase / Backend"
          aria-label="Refresh Queue"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors relative"
            title="Early warning risk notifications"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-3 z-50 text-xs animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  Active Risk Alerts (3)
                </span>
                <span className="text-[10px] text-slate-400">Real-time</span>
              </div>
              <div className="space-y-2 py-2">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                  <div className="font-bold text-[11px] text-rose-400">Suresh Patel • Deteriorating</div>
                  <div className="text-[10px] text-rose-300/80 mt-0.5">Supplier repayment slipped to 68%. Application paused.</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                  <div className="font-bold text-[11px] text-amber-400">Rajesh Verma • Doc Mismatch</div>
                  <div className="text-[10px] text-amber-300/80 mt-0.5">Duplicate supplier invoice reference #INV-4091 flagged.</div>
                </div>
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                  <div className="font-bold text-[11px] text-indigo-400">Arjun Singh • Missing Receipts</div>
                  <div className="text-[10px] text-indigo-300/80 mt-0.5">Awaiting 3-month supplementary landlord vouchers.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live System Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[10px] text-slate-400 font-mono-numbers">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>FASTAPI v2.0 • DETERMINISTIC</span>
        </div>

        {/* Authenticated User Session & Sign Out */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <Link
              to="/privacy-security"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              title="Open Privacy & Security Center"
            >
              <KeyRound className="h-3.5 w-3.5 text-indigo-400" />
              <span className="truncate max-w-[100px]">{user.fullName}</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded font-mono-numbers bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {user.role}
              </span>
            </Link>
            <button
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setShowLogoutModal(false);
          await logout();
          navigate('/login', { replace: true });
        }}
        userName={user?.fullName || 'Prashasti Pandey'}
      />
    </header>
  );
}
