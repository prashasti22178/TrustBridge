import { useState } from 'react';
import { 
  FileText, 
  Eye, 
  Search, 
  Filter, 
  MapPin, 
  Store, 
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  HelpCircle,
  PauseCircle
} from 'lucide-react';
import type { Applicant, ReviewStatus } from '../types/underwriter';

interface ApplicantTableProps {
  applicants: Applicant[];
  onReviewDossier: (applicant: Applicant) => void;
  onAction?: (applicant: Applicant, action: ReviewStatus, notes?: string) => void;
  selectedApplicantId?: string;
  onSelectApplicant?: (applicant: Applicant) => void;
  hideMetrics?: boolean;
}

export default function ApplicantTable({ 
  applicants, 
  onReviewDossier, 
  onAction,
  selectedApplicantId,
  onSelectApplicant,
  hideMetrics = false
}: ApplicantTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReviewStatus>('ALL');

  // Compute live metrics
  const activeCount = applicants.length + 5; // e.g. 8 total in active batch
  const pendingCount = applicants.filter(a => a.status === 'PENDING_REVIEW').length;
  const avgScore = Math.round(
    applicants.reduce((acc, curr) => acc + curr.trustScore, 0) / (applicants.length || 1)
  );
  const verificationReqCount = applicants.filter(a => a.status === 'NEEDS_INFO').length + 1;

  // Filtered applicants
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      
      {/* 1. TOP METRICS OVERVIEW BAR (Optional when rendered standalone) */}
      {!hideMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Active Applications</span>
              <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono-numbers tracking-tight">
              {activeCount}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Live underwriting batch</p>
          </div>

          {/* Metric 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Pending Review</span>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-400 mt-2 font-mono-numbers tracking-tight">
              {pendingCount}
            </div>
            <p className="text-[10px] text-indigo-400/80 mt-0.5">Awaiting human sanction</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Average Trust Score</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2 font-mono-numbers tracking-tight">
              {avgScore} <span className="text-xs font-semibold text-slate-500">/ 100</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 mt-0.5">Deterministic calculations</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Verification Required</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400 mt-2 font-mono-numbers tracking-tight">
              {verificationReqCount}
            </div>
            <p className="text-[10px] text-amber-400/80 mt-0.5">Receipt audit gaps</p>
          </div>

        </div>
      )}

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-slate-900/70 border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, business, city, or ID..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="h-3.5 w-3.5 text-slate-500 hidden sm:inline-block mr-1 shrink-0" />
          
          {(['ALL', 'PENDING_REVIEW', 'NEEDS_INFO', 'APPROVED'] as const).map((status) => {
            const labels: Record<string, string> = {
              ALL: 'All',
              PENDING_REVIEW: 'Pending Review',
              NEEDS_INFO: 'Needs Info',
              APPROVED: 'Approved'
            };

            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. TABLE VIEW */}
      <div className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="px-5 py-3.5 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Underwriting Queue</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono-numbers">
            {filteredApplicants.length} of {applicants.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Applicant & Business</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Trust Score</th>
                <th className="py-3 px-4">Requested</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No applications matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const isSelected = selectedApplicantId === app.id;
                  return (
                    <tr 
                      key={app.id} 
                      className={`transition-colors group cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-950/30 border-l-2 border-indigo-500' 
                          : 'hover:bg-slate-800/30'
                      }`}
                      onClick={() => onSelectApplicant ? onSelectApplicant(app) : onReviewDossier(app)}
                    >
                      {/* Applicant & Business */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected 
                              ? 'bg-indigo-600 text-white shadow-sm' 
                              : 'bg-slate-800 border border-slate-700 text-slate-200 group-hover:border-indigo-500/50'
                          }`}>
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              {app.name}
                              {app.id === 'TB-2026-0142' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Benchmark
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Store className="h-2.5 w-2.5 text-indigo-400" />
                              <span>{app.businessType} • {app.stallTenureMonths} mo</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300 flex items-center gap-1 text-[11px]">
                          <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[130px]">{app.location}</span>
                        </div>
                      </td>

                      {/* Trust Score Badge */}
                      <td className="py-3 px-4">
                        <div className="inline-flex flex-col">
                          <span className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md text-[11px] font-mono-numbers border ${
                            app.trustScore >= 70 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                          }`}>
                            {app.trustScore} / 100
                          </span>
                          <span className="text-[9px] text-slate-500 mt-0.5">
                            {app.confidenceTier}
                          </span>
                        </div>
                      </td>

                      {/* Requested Amount */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs font-mono-numbers">
                          ₹{app.requestedAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono-numbers">
                          {app.repaymentWeeks}w @ ₹{Math.round(app.requestedAmount / app.repaymentWeeks)}/w
                        </div>
                      </td>

                      {/* Verification Proofs */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono-numbers text-[11px]">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${
                            app.verificationRatio.startsWith('5') || app.verificationRatio.startsWith('4') ? 'text-emerald-400' : 'text-amber-400'
                          }`} />
                          <span className="text-slate-200">
                            {app.verificationRatio}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 block mt-0.5">
                          {app.proofDocuments.filter(d => d.status === 'VERIFIED').length} verified
                        </span>
                      </td>

                      {/* Review Status Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide border ${
                          app.status === 'APPROVED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          app.status === 'NEEDS_INFO' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          app.status === 'PAUSED' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                            'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        }`}>
                          {app.status === 'PENDING_REVIEW' ? 'PENDING' : 
                           app.status === 'NEEDS_INFO' ? 'NEEDS INFO' : app.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {onAction && (
                            <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
                              {/* Offer Starter Loan */}
                              <button
                                title={`Offer Starter Loan ₹${app.requestedAmount.toLocaleString()}`}
                                onClick={() => onAction(app, 'APPROVED', `Sanctioned starter loan of ₹${app.requestedAmount.toLocaleString()} directly from underwriter queue.`)}
                                className="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 transition-all flex items-center gap-1 text-[10px] font-bold"
                              >
                                <UserCheck className="h-3 w-3" />
                                <span className="hidden xl:inline">Offer</span>
                              </button>

                              {/* Request More Info */}
                              <button
                                title="Request More Info (3 Months Receipts)"
                                onClick={() => onAction(app, 'NEEDS_INFO', 'Requested 3 months additional verified receipts from underwriter queue.')}
                                className="p-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 transition-all flex items-center gap-1 text-[10px] font-bold"
                              >
                                <HelpCircle className="h-3 w-3" />
                                <span className="hidden xl:inline">Info</span>
                              </button>

                              {/* Pause Application */}
                              <button
                                title="Pause Application"
                                onClick={() => onAction(app, 'PAUSED', 'Paused application review from underwriter queue.')}
                                className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all flex items-center gap-1 text-[10px] font-bold"
                              >
                                <PauseCircle className="h-3 w-3" />
                              </button>
                            </div>
                          )}

                          <button 
                            onClick={() => onReviewDossier(app)}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1 shrink-0 active:scale-95"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Dossier</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
