import { useState, useRef, useEffect } from 'react';
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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredApplicants = applicants.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 70) return 'text-indigo-400';
    return 'text-amber-400';
  };

  return (
    <header className="w-full h-14 px-6 flex items-center justify-between overflow-x-hidden border-b border-slate-800 bg-[#090d16] shrink-0 z-20">
      
      {/* ================= ZONE 1: LEFT (APPLICANT SELECTOR) ================= */}
      <div className="flex items-center flex-shrink-0">
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-8 flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-colors text-left shadow-sm group whitespace-nowrap flex-shrink-0"
            aria-expanded={dropdownOpen}
            aria-label="Select active borrower"
          >
            <div className="h-5 w-5 rounded bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
              {activeApplicant.name.charAt(0)}
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
              <span className="text-xs font-semibold text-white tracking-tight whitespace-nowrap">
                {activeApplicant.name}
              </span>
              <span className="text-slate-500 text-xs whitespace-nowrap">•</span>
              <span className="whitespace-nowrap font-mono text-xs text-slate-400">
                {activeApplicant.id}
              </span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 group-hover:text-slate-200 transition-transform ml-0.5 flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Borrower Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-80 rounded-xl bg-[#0f172a] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-slate-800/80 mb-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Multi-Borrower Review Queue ({applicants.length})
                </div>
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search applicant name, stall, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors whitespace-nowrap ${
                        isCurrent
                          ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                          : 'hover:bg-slate-800 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-300 shrink-0 text-xs">
                          {appl.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-slate-100 truncate flex items-center gap-1.5">
                            <span className="whitespace-nowrap">{appl.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 font-normal whitespace-nowrap">{appl.id}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate whitespace-nowrap">
                            {appl.businessType} • {appl.location.split(',')[0]}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] border border-slate-700/80 bg-slate-800/50 ${getScoreColor(appl.trustScore)} whitespace-nowrap`}>
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
      </div>

      {/* ================= ZONE 2: CENTER / ACTION ZONE ================= */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Quick Action: Full Dossier Button */}
        <button
          onClick={() => {
            if (onOpenDossier) onOpenDossier();
            navigate('/underwriter?tab=applicants');
          }}
          className="h-8 inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium flex-shrink-0 cursor-pointer"
          title="Open Applicant Full Dossier (Ravi Kumar)"
          aria-label="Open Full Dossier"
        >
          <FileText className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
          <span className="whitespace-nowrap">Full Dossier</span>
        </button>

        {/* Quick Action: Simulate Button */}
        <button
          onClick={onOpenSimulator}
          className="h-8 inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium flex-shrink-0"
          title="Simulate shock scenario on active applicant"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
          <span className="whitespace-nowrap">Simulate</span>
        </button>

        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors flex-shrink-0"
          title="Refresh queue from Supabase / Backend"
          aria-label="Refresh Queue"
        >
          <RefreshCw className={`h-3.5 w-3.5 flex-shrink-0 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>

      {/* ================= ZONE 3: RIGHT (NOTIFICATIONS + USER PROFILE) ================= */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Risk Alerts Popover */}
        <div className="relative flex-shrink-0" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors relative flex-shrink-0"
            title="Early warning risk notifications"
            aria-label="Notifications"
          >
            <Bell className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 rounded-xl bg-[#0f172a] border border-slate-800 shadow-2xl p-3 z-50 text-xs animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
                  <span>Active Risk Alerts (3)</span>
                </span>
                <span className="text-[10px] text-slate-400">Real-time</span>
              </div>
              <div className="space-y-2 py-2">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                  <div className="font-bold text-[11px] text-rose-400">Suresh Patel • Deteriorating</div>
                  <div className="text-[10px] text-rose-300/80 mt-0.5">Supplier repayment slipped to 68%. Application paused.</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                  <div className="font-bold text-[11px] text-amber-400">Rajesh Verma • Doc Mismatch</div>
                  <div className="text-[10px] text-amber-300/80 mt-0.5">Duplicate supplier invoice reference #INV-4091 flagged.</div>
                </div>
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                  <div className="font-bold text-[11px] text-indigo-400">Arjun Singh • Missing Receipts</div>
                  <div className="text-[10px] text-indigo-300/80 mt-0.5">Awaiting 3-month supplementary landlord vouchers.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Session Sign-Out */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 flex-shrink-0">
          <Link
            to="/privacy-security"
            className="h-8 inline-flex items-center gap-2 px-2.5 rounded-md bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-colors whitespace-nowrap font-medium flex-shrink-0"
            title="Open Privacy & Security Center"
          >
            <KeyRound className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
            <span className="text-slate-200 whitespace-nowrap">
              {user?.fullName || 'Vikramaditya Rao'}
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium whitespace-nowrap">
              {user?.role || 'Admin'}
            </span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            title="Sign Out"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-slate-800/50 hover:bg-rose-950/40 border border-slate-700/80 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors flex-shrink-0"
            aria-label="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
          </button>
        </div>
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
        userName={user?.fullName || 'Vikramaditya Rao'}
      />
    </header>
  );
}
