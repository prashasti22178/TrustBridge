import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Applicant, ReviewStatus } from '../../types/underwriter';

interface ReviewQueueViewProps {
  applicants: Applicant[];
  activeApplicant: Applicant;
  onSelectApplicant: (applicant: Applicant) => void;
  onOpenDossier: () => void;
}

export default function ReviewQueueView({
  applicants,
  activeApplicant,
  onSelectApplicant,
  onOpenDossier
}: ReviewQueueViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReviewStatus>('ALL');

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Underwriting Review Queue
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 02
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritized review pipeline for micro-working capital applications awaiting human underwriter assessment.
          </p>
        </div>

        <div className="text-xs font-mono-numbers text-slate-400 self-start sm:self-auto">
          {filteredApplicants.length} of {applicants.length} applications
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by borrower name, stall, city or application ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'PENDING_REVIEW', 'NEEDS_INFO', 'APPROVED', 'PAUSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All Applications' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Applicant</th>
                <th className="pb-3 font-semibold">Micro-Enterprise</th>
                <th className="pb-3 font-semibold">Tenure</th>
                <th className="pb-3 font-semibold">Weekly Income</th>
                <th className="pb-3 font-semibold">Requested</th>
                <th className="pb-3 font-semibold">Trust Score</th>
                <th className="pb-3 font-semibold">Verification</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApplicants.map((appl) => {
                const isCurrent = appl.id === activeApplicant.id;
                return (
                  <tr
                    key={appl.id}
                    onClick={() => onSelectApplicant(appl)}
                    className={`cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600/15 text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 pr-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0">
                          {appl.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-slate-100 font-bold">{appl.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono-numbers">{appl.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 pr-3 text-slate-400">
                      <div>{appl.businessType}</div>
                      <div className="text-[10px] text-slate-400">{appl.location}</div>
                    </td>

                    <td className="py-3 pr-3 font-mono-numbers text-slate-300">
                      {appl.stallTenureMonths} mo
                    </td>

                    <td className="py-3 pr-3 font-mono-numbers text-slate-300">
                      ₹{appl.weeklyRevenue.toLocaleString()}
                    </td>

                    <td className="py-3 pr-3 font-mono-numbers text-slate-300 font-semibold">
                      ₹{appl.requestedAmount.toLocaleString()}
                    </td>

                    <td className="py-3 pr-3 font-mono-numbers">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        appl.trustScore >= 80 ? 'text-emerald-400 bg-emerald-500/10' :
                        appl.trustScore >= 70 ? 'text-indigo-400 bg-indigo-500/10' :
                        'text-amber-400 bg-amber-500/10'
                      }`}>
                        {appl.trustScore}
                      </span>
                    </td>

                    <td className="py-3 pr-3 font-mono-numbers text-slate-300 text-[11px]">
                      {appl.verificationRatio}
                    </td>

                    <td className="py-3 pr-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        appl.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        appl.status === 'PAUSED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        appl.status === 'NEEDS_INFO' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {appl.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApplicant(appl);
                          onOpenDossier();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
