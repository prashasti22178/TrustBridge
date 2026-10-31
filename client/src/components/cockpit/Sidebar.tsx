import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Activity,
  Sparkles,
  FileCheck2,
  BarChart3,
  Scale,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from './LogoutModal';

export type CockpitTab =
  | 'dashboard'
  | 'overview'
  | 'queue'
  | 'applicants'
  | 'dossier'
  | 'risk-intelligence'
  | 'behavioral-signals'
  | 'early-warnings'
  | 'explainability'
  | 'counterfactual'
  | 'verification'
  | 'fraud-checks'
  | 'portfolio'
  | 'fairness'
  | 'settings'
  | 'simulation'
  | 'audit'
  | 'research';

interface SidebarProps {
  activeTab: CockpitTab;
  onSelectTab: (tab: CockpitTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingCount?: number;
  criticalAlertCount?: number;
}

interface NavItem {
  id: CockpitTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  pendingCount = 0,
  criticalAlertCount = 0
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Normalize aliases for active state highlighting
  const normalizedActiveTab = (() => {
    if (activeTab === 'overview') return 'dashboard';
    if (activeTab === 'dossier') return 'applicants';
    if (activeTab === 'behavioral-signals' || activeTab === 'early-warnings') return 'risk-intelligence';
    if (activeTab === 'counterfactual' || activeTab === 'simulation') return 'explainability';
    if (activeTab === 'fraud-checks') return 'verification';
    return activeTab;
  })();

  const sections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'UNDERWRITING',
      items: [
        {
          id: 'queue',
          label: 'Review Queue',
          icon: Inbox,
          badge: pendingCount,
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
        },
        { id: 'applicants', label: 'Applicants', icon: Users }
      ]
    },
    {
      title: 'RISK',
      items: [
        {
          id: 'risk-intelligence',
          label: 'Risk Intelligence',
          icon: Activity,
          badge: criticalAlertCount > 0 ? `${criticalAlertCount} Alerts` : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        },
        { id: 'explainability', label: 'Explainability', icon: Sparkles },
        { id: 'verification', label: 'Verification', icon: FileCheck2 }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
        { id: 'fairness', label: 'Fairness', icon: Scale }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.fullName || 'Prashasti Pandey';
  const displayRole = user?.role ? (user.role === 'underwriter' ? 'Underwriter' : user.role) : 'Underwriter';

  return (
    <>
      <aside
        className={`relative flex flex-col bg-[#0b0f19] border-r border-slate-800/80 transition-all duration-200 z-30 select-none ${
          collapsed ? 'w-[68px]' : 'w-[240px]'
        }`}
        aria-label="Enterprise Underwriter Navigation"
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800/70 shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold tracking-wider text-white block">TRUSTBRIDGE</span>
                <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">Credit Intelligence</span>
              </div>
            </div>
          ) : (
            <div className="mx-auto h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors hidden md:flex items-center justify-center"
            title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Primary Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {!collapsed ? (
                <div className="px-2 pt-1 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {sec.title}
                </div>
              ) : (
                <div className="my-1.5 border-t border-slate-800/60" />
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = normalizedActiveTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left relative group ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono-numbers px-1.5 py-0.2 rounded font-semibold ${
                          item.badgeColor || 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* -------------------------------- */}
        {/* Pinned Bottom User Section */}
        {/* -------------------------------- */}
        <div className="border-t border-slate-800/80 bg-[#090d16]/90 p-3 shrink-0">
          {!collapsed ? (
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-1">
                USER PROFILE
              </div>

              {/* User Info Tile */}
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs font-mono-numbers">
                  PP
                </div>
                <div className="truncate flex-1 min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block truncate capitalize">
                    {displayRole}
                  </span>
                </div>
              </div>

              {/* Action Controls: Settings & Logout */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => onSelectTab('settings')}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors border ${
                    normalizedActiveTab === 'settings'
                      ? 'bg-slate-800 text-white border-slate-700'
                      : 'bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-800/80'
                  }`}
                  title="Underwriter Settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/25 transition-colors"
                  title="Log out of session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Minimal FastAPI System Telemetry Footer Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>FASTAPI v2.0</span>
                </span>
                <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400">
                  DETERMINISTIC
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                type="button"
                onClick={() => onSelectTab('settings')}
                title="Settings"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                title="Log out"
                className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>

              <div className="pt-2 border-t border-slate-800/80 flex justify-center" title="FASTAPI v2.0 • DETERMINISTIC">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        userName={displayName}
      />
    </>
  );
}
