import { useState } from 'react';
import {
  Users,
  Award,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Activity
} from 'lucide-react';
import BarChart from '../charts/BarChart';
import DonutChart from '../charts/DonutChart';
import { summarizePortfolio } from '../../lib/portfolio';
import type { Applicant, ReviewStatus } from '../../types/underwriter';

interface OverviewViewProps {
  applicants: Applicant[];
  activeApplicant: Applicant;
  onSelectApplicant: (applicant: Applicant) => void;
  onNavigateToQueue: () => void;
  onNavigateToDossier: () => void;
  onNavigateToRisk: () => void;
}

export default function OverviewView({
  applicants,
  activeApplicant,
  onSelectApplicant,
  onNavigateToQueue,
  onNavigateToDossier,
  onNavigateToRisk
}: OverviewViewProps) {
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'LOW' | 'MODERATE' | 'HIGH'>('ALL');

  const metrics = summarizePortfolio(applicants);
  const totalApplicants = metrics.total;
  const avgTrustScore = metrics.averageScore;
  const lowRiskPct = metrics.lowRiskPercentage;
  const reviewRequiredCount = metrics.pending;
  const scoreDistributionData = metrics.scoreDistribution;
  const riskDonutData = metrics.riskDistribution;
  const alerts = applicants.filter(a => a.riskTrajectory === 'DETERIORATING' || (a.anomalyScore ?? 0) >= 50);

  // Filtered recent applications
  const filteredApplicants = applicants.filter(app => {
    if (filterRisk === 'ALL') return true;
    return app.riskTier === filterRisk;
  });

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" /> Sanctioned
          </span>
        );
      case 'NEEDS_INFO':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> Needs Info
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertTriangle className="h-3 w-3" /> Paused
          </span>
        );
      case 'PENDING_REVIEW':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> In Review
          </span>
        );
    }
  };

  const getRiskBadge = (tier?: string) => {
    switch (tier) {
      case 'LOW':
        return <span className="text-[11px] font-bold text-emerald-400 font-mono-numbers">LOW</span>;
      case 'MODERATE':
        return <span className="text-[11px] font-bold text-indigo-300 font-mono-numbers">MODERATE</span>;
      case 'HIGH':
      default:
        return <span className="text-[11px] font-bold text-rose-400 font-mono-numbers">HIGH</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================================================== */}
      {/* TOP: PAGE HEADER + FILTERS */}
      {/* ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Good morning, Prashasti
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Here's today's underwriting overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono-numbers px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            Node: KA-BANGALORE-HUB
          </span>
          <span className="text-[11px] font-mono-numbers px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            Telemetry: LIVE
          </span>
          <span className="text-[11px] font-mono-numbers px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
            Demo Dataset (NBFC Seed Cohort)
          </span>
        </div>
      </div>

      {/* ================================================== */}
      {/* ROW 1: 4 COMPACT KPI CARDS */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applicants */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Applicants</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-numbers text-white tracking-tight">
              {totalApplicants.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            Applications in the loaded queue
          </div>
        </div>

        {/* Average Trust Score */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Average Trust Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-numbers text-white tracking-tight">
              {avgTrustScore}
            </span>
            <span className="text-xs text-slate-400 font-mono-numbers">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            Calculated from loaded applicant scores
          </div>
        </div>

        {/* Low Risk % */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Low Risk %</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-numbers text-emerald-400 tracking-tight">
              {lowRiskPct}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            {metrics.riskCounts.LOW} applicants in the low risk band
          </div>
        </div>

        {/* Applications Requiring Review */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Applications Requiring Review</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-numbers text-amber-400 tracking-tight">
              {reviewRequiredCount}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Awaiting underwriter sign-off</span>
            <button
              onClick={onNavigateToQueue}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Open Queue →
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* ROW 2: LARGE TRUST SCORE DISTRIBUTION + RISK DISTRIBUTION */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Large Trust Score Distribution Histogram (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                A. Trust Score Distribution
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Applicant frequency counts across deterministic score tiers (0–100 scale)
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Median: {metrics.median}
            </span>
          </div>

          <div className="pt-2">
            <BarChart
              data={scoreDistributionData}
              height={220}
              showGrid={true}
              unit=" applicants"
            />
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Counts update with the loaded review queue</span>
            <span className="font-mono-numbers text-slate-400">Total: {metrics.total} Profiles</span>
          </div>
        </div>

        {/* Clean Risk Distribution Donut (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                B. Risk Distribution
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Proportional breakdown by underwriting risk band
              </p>
            </div>
            <button
              onClick={onNavigateToRisk}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              Risk Details <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="py-2 flex items-center justify-center">
            <DonutChart
              data={riskDonutData}
              size={190}
              strokeWidth={28}
              centerLabel="Active Book"
              centerSub={String(metrics.total)}
            />
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Low Risk: <strong className="text-emerald-400 font-mono-numbers">{metrics.lowRiskPercentage}%</strong></span>
            <span>Moderate: <strong className="text-indigo-300 font-mono-numbers">{metrics.total ? Math.round(metrics.riskCounts.MODERATE / metrics.total * 100) : 0}%</strong></span>
            <span>High: <strong className="text-rose-400 font-mono-numbers">{metrics.total ? Math.round(metrics.riskCounts.HIGH / metrics.total * 100) : 0}%</strong></span>
          </div>
        </div>
      </div>

      <section className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
        <h2 className="text-sm font-semibold text-white">Application status</h2>
        <p className="text-xs text-slate-400">Current queue snapshot. Historical trends require recorded snapshots over time.</p>
        <BarChart data={metrics.statusDistribution} horizontal />
      </section>

      {/* ================================================== */}
      {/* ROW 4: RECENT APPLICATIONS TABLE + COMPACT ALERTS PANEL */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Applications Table (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                E. Recent Applications
              </h2>
              <p className="text-[11px] text-slate-400">
                Select a borrower to inspect live evidence, behavioral trajectory, and counterfactuals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Filter className="h-3 w-3" />
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="ALL">All Risk Tiers</option>
                  <option value="LOW">Low Risk</option>
                  <option value="MODERATE">Moderate Risk</option>
                  <option value="HIGH">High Risk</option>
                </select>
              </div>

              <button
                onClick={onNavigateToQueue}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
              >
                All Queue <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Applicant</th>
                  <th className="pb-3 font-semibold">Business</th>
                  <th className="pb-3 font-semibold">Trust Score</th>
                  <th className="pb-3 font-semibold">Risk</th>
                  <th className="pb-3 font-semibold">Verification</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApplicants.slice(0, 6).map((app) => {
                  const isSelected = activeApplicant?.id === app.id;
                  const verifiedDocs = app.proofDocuments.filter(d => d.status === 'VERIFIED').length;
                  const totalDocs = app.proofDocuments.length;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => onSelectApplicant(app)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? 'bg-indigo-600/10 hover:bg-indigo-600/15'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {app.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-numbers">
                          {app.id} • {app.location}
                        </div>
                      </td>

                      <td className="py-3 pr-3 text-slate-300">
                        <span className="block truncate max-w-[140px]">{app.businessType}</span>
                        <span className="text-[10px] text-slate-400">{app.stallTenureMonths} mo tenure</span>
                      </td>

                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold font-mono-numbers text-white text-sm">
                            {app.trustScore}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono-numbers">/100</span>
                        </div>
                      </td>

                      <td className="py-3 pr-3">
                        {getRiskBadge(app.riskTier)}
                      </td>

                      <td className="py-3 pr-3">
                        <span className="font-mono-numbers text-[11px] text-slate-300">
                          {verifiedDocs}/{totalDocs} Verified
                        </span>
                      </td>

                      <td className="py-3 pr-3">
                        {getStatusBadge(app.status)}
                      </td>

                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectApplicant(app);
                            onNavigateToDossier();
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-400 hover:text-white hover:bg-indigo-600 transition-colors border border-indigo-500/30"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact Alerts & Surveillance Panel (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Early Warnings & Alerts
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono-numbers">
                {alerts.length} Flagged
              </span>
            </div>

            <div className="space-y-3 pt-3">
              {alerts.length === 0 && <p className="text-xs text-slate-400">No flagged applicants in the loaded queue.</p>}
              {alerts.map(applicant => (
                <div key={applicant.id} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex justify-between text-xs"><strong>{applicant.name}</strong><span>Score {applicant.trustScore}</span></div>
                  <p className="text-xs text-slate-400">{applicant.riskTrajectory === 'DETERIORATING' ? 'Deteriorating signal trajectory. Review supporting evidence.' : 'Anomaly flag requires manual review.'}</p>
                  <button className="text-xs text-indigo-300 underline" onClick={() => { onSelectApplicant(applicant); onNavigateToRisk(); }}>Inspect applicant</button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              Review status
            </span>
            <span className="text-emerald-400 font-semibold font-mono-numbers">On demand</span>
          </div>
        </div>
      </div>
    </div>
  );
}
