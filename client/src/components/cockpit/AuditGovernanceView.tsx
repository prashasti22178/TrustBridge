import { useState } from 'react';
import { Search } from 'lucide-react';
import type { AuditLogItem } from '../../types/underwriter';

interface AuditGovernanceViewProps {
  auditLog: AuditLogItem[];
}

export default function AuditGovernanceView({ auditLog }: AuditGovernanceViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLog.filter(
    (item) =>
      item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.underwriterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applicantId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Audit Trail & Underwriting Governance
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 14
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable regulatory audit log tracking every underwriter sanction, document verification, explanation query, and state transition.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono-numbers px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            Audit Ledger: CRYPTOGRAPHICALLY SEQUENCED
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search actor ID, applicant, action, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono-numbers">
          Showing {filteredLogs.length} logged actions
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Timestamp (UTC)</th>
                <th className="pb-3 font-semibold">Actor / Underwriter</th>
                <th className="pb-3 font-semibold">Action Performed</th>
                <th className="pb-3 font-semibold">Target Applicant</th>
                <th className="pb-3 font-semibold">Decision / State</th>
                <th className="pb-3 font-semibold">Regulatory Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pr-3 font-mono-numbers text-slate-400 whitespace-nowrap">
                    {item.timestamp}
                  </td>

                  <td className="py-3 pr-3 font-mono-numbers font-semibold text-indigo-400 whitespace-nowrap">
                    {item.underwriterId}
                  </td>

                  <td className="py-3 pr-3 font-semibold text-slate-200">
                    {item.action}
                  </td>

                  <td className="py-3 pr-3">
                    <div className="font-semibold text-slate-100">{item.applicantName}</div>
                    <div className="text-[10px] text-slate-400 font-mono-numbers">{item.applicantId}</div>
                  </td>

                  <td className="py-3 pr-3 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.decision === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.decision === 'PAUSED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      item.decision === 'NEEDS_INFO' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {item.decision.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 text-slate-400 text-[11px] max-w-xs">
                    {item.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
