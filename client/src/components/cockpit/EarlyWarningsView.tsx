import {
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import type { Applicant, RiskSeverity } from '../../types/underwriter';

interface EarlyWarningsViewProps {
  applicant: Applicant;
  onOpenSimulator: () => void;
}

export default function EarlyWarningsView({
  applicant,
  onOpenSimulator
}: EarlyWarningsViewProps) {
  // Deterioration trajectory
  const trajectory = applicant.riskTrajectory || 'STABLE';
  const isDeteriorating = trajectory === 'DETERIORATING';

  // Severity count badges
  const alerts = applicant.riskAlerts || [];
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;
  const mediumCount = alerts.filter(a => a.severity === 'MEDIUM').length;
  const lowCount = alerts.filter(a => a.severity === 'LOW').length;

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Early Warning & Deterioration System
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Module 04
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous portfolio risk surveillance detecting payment slippage and cashflow distress signals before default.
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Simulate Stress Shocks</span>
        </button>
      </div>

      {/* Trajectory Tracker Card: e.g. Suresh Patel 78 -> 74 -> 69 */}
      <div className={`p-5 rounded-2xl border ${
        isDeteriorating 
          ? 'bg-rose-950/20 border-rose-500/30' 
          : 'bg-slate-900/80 border-slate-800/80'
      } space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Risk Trajectory Profile: {applicant.name}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isDeteriorating 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : trajectory === 'IMPROVING'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {trajectory}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Current Trust Score: <strong className="text-white font-mono-numbers">{applicant.trustScore}/100</strong> • Tier: {applicant.confidenceTier}
            </p>
          </div>

          {/* Historical Score Path */}
          {isDeteriorating ? (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-rose-500/30 self-start sm:self-auto">
              <span className="text-[10px] font-semibold text-slate-400">90-Day Trend:</span>
              <div className="flex items-center gap-1 text-xs font-mono-numbers font-bold">
                <span className="text-slate-400">78</span>
                <span className="text-rose-400">→</span>
                <span className="text-slate-400">74</span>
                <span className="text-rose-400">→</span>
                <span className="text-rose-400 font-extrabold underline">{applicant.trustScore}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 self-start sm:self-auto">
              <span className="text-[10px] font-semibold text-slate-400">90-Day Trend:</span>
              <span className="text-xs font-mono-numbers font-bold text-emerald-400">
                {trajectory === 'IMPROVING' ? '78 → 82 → 84 (Positive)' : '78 → 78 → 78 (Stable)'}
              </span>
            </div>
          )}
        </div>

        {/* Deteriorating Alert Box if active */}
        {isDeteriorating && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="h-4 w-4" />
              <span>DETERIORATION WARNING: Immediate Underwriter Intervention Advised</span>
            </div>
            <ul className="text-rose-200/90 list-disc list-inside space-y-1 text-[11px]">
              <li>Supplier repayment punctuality declined from 90% down to 68% over 60 days.</li>
              <li>Income cashflow volatility increased 38% month-over-month.</li>
              <li>Two recent late stall rental payments logged in August & September.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Severity Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-400">Critical Flags</span>
          <div className="text-xl font-bold font-mono-numbers text-white">{criticalCount}</div>
          <span className="text-[10px] text-slate-400">Immediate default hazard</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">High Severity</span>
          <div className="text-xl font-bold font-mono-numbers text-white">{highCount}</div>
          <span className="text-[10px] text-slate-400">Liquidity / vendor lags</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-400">Medium Severity</span>
          <div className="text-xl font-bold font-mono-numbers text-white">{mediumCount}</div>
          <span className="text-[10px] text-slate-400">Operational gaps / tenure</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Low Severity</span>
          <div className="text-xl font-bold font-mono-numbers text-white">{lowCount}</div>
          <span className="text-[10px] text-slate-400">Seasonal / margin buffers</span>
        </div>
      </div>

      {/* Risk Alert Timeline Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Risk Signal Event Timeline
            </h2>
            <p className="text-[11px] text-slate-400">
              Logged events triggering score adjustments and underwriter notifications.
            </p>
          </div>
          <span className="text-[10px] font-mono-numbers text-slate-400">
            {alerts.length} Event{alerts.length === 1 ? '' : 's'} recorded
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800/80">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-xs font-semibold text-slate-200">Zero Active Early Warnings</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {applicant.name} exhibits consistent payment discipline with no documented default triggers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-2.5 font-semibold">Date</th>
                  <th className="pb-2.5 font-semibold">Severity</th>
                  <th className="pb-2.5 font-semibold">Signal</th>
                  <th className="pb-2.5 font-semibold">Change Description</th>
                  <th className="pb-2.5 font-semibold">Impact on Underwriting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {alerts.map((al, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 pr-3 font-mono-numbers text-slate-400 whitespace-nowrap">
                      {al.date}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {getSeverityBadge(al.severity)}
                    </td>
                    <td className="py-3 pr-3 font-semibold text-slate-200">
                      {al.signal}
                    </td>
                    <td className="py-3 pr-3 text-slate-300">
                      {al.change}
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {al.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Ongoing Portfolio Monitoring Perspective:</strong> Early warning indicators run continuously in background micro-services. When a borrower slips past threshold tolerances, automated alerts trigger an underwriter review rather than sudden aggressive collection.
          </span>
        </div>
      </div>
    </div>
  );
}
