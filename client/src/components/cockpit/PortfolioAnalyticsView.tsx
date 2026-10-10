import { useState } from 'react';
import {
  Filter,
  Calendar
} from 'lucide-react';
import LineAreaChart from '../charts/LineAreaChart';
import BarChart from '../charts/BarChart';
import DonutChart from '../charts/DonutChart';

export default function PortfolioAnalyticsView() {
  const [businessFilter, setBusinessFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timePeriod, setTimePeriod] = useState('Q3-2026');

  // Chart 1: Applicant Volume Over Time
  const volumeLabels = ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'];
  const volumeSeries = [
    {
      name: 'Monthly Intake Volume',
      data: [180, 210, 245, 290, 312, 345],
      color: '#6366f1'
    },
    {
      name: 'Sanctioned Applications',
      data: [120, 145, 172, 201, 218, 242],
      color: '#10b981'
    }
  ];

  // Chart 2: Risk Distribution
  const riskDonutData = [
    { label: 'Low Risk', value: 542, color: '#10b981' },
    { label: 'Moderate Risk', value: 586, color: '#6366f1' },
    { label: 'High Risk', value: 156, color: '#f43f5e' }
  ];

  // Chart 3: Average Trust Score by Business Type
  const businessScoreData = [
    { label: 'Mandi Vendors', value: 74, color: '#10b981' },
    { label: 'Tailoring Kiosks', value: 78, color: '#6366f1' },
    { label: 'Kirana Stores', value: 69, color: '#f59e0b' },
    { label: 'Mobile Repair', value: 65, color: '#06b6d4' },
    { label: 'Food / Chai', value: 76, color: '#8b5cf6' }
  ];

  // Chart 4: Application Status Distribution
  const statusDonutData = [
    { label: 'Sanctioned / Approved', value: 876, color: '#10b981' },
    { label: 'In Underwriter Review', value: 142, color: '#6366f1' },
    { label: 'Needs Proofs / Info', value: 198, color: '#f59e0b' },
    { label: 'Paused / Withdrawn', value: 68, color: '#f43f5e' }
  ];

  // Chart 5: Recommended vs Requested Loan Amounts (Ticket size comparison)
  const ticketComparisonData = [
    { label: 'Fruit Vendors', value: 10000, secondaryValue: 8500, color: '#6366f1' },
    { label: 'Tailoring', value: 15000, secondaryValue: 13500, color: '#6366f1' },
    { label: 'Kirana Store', value: 20000, secondaryValue: 16000, color: '#6366f1' },
    { label: 'Mobile Repair', value: 12000, secondaryValue: 9500, color: '#6366f1' },
    { label: 'Food Stalls', value: 8000, secondaryValue: 7500, color: '#6366f1' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Portfolio Intelligence & Risk Analytics
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Institutional Book
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Macro underwriting metrics, risk tier composition, and loan size calibration across 1,284 micro-borrowers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-numbers px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
            Demo / Synthetic Portfolio Dataset
          </span>
        </div>
      </div>

      {/* Useful Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <span>Filters:</span>
        </div>

        {/* Business Type */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Business:</span>
          <select
            value={businessFilter}
            onChange={(e) => setBusinessFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All Business Types</option>
            <option value="MANDI">Mandi & Fruit Vendors</option>
            <option value="TAILOR">Tailoring & Garments</option>
            <option value="KIRANA">Kirana & Provisions</option>
            <option value="REPAIR">Electronics Repair</option>
            <option value="FOOD">Food & Chai Kiosks</option>
          </select>
        </div>

        {/* Region */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Region:</span>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All Regions</option>
            <option value="BLR">Bengaluru (KA)</option>
            <option value="JPR">Jaipur (RJ)</option>
            <option value="PUN">Pune (MH)</option>
            <option value="IDR">Indore (MP)</option>
          </select>
        </div>

        {/* Risk Tier */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Risk Tier:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All Risk Bands</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="SANCTIONED">Sanctioned</option>
            <option value="REVIEW">In Review</option>
            <option value="NEEDS_INFO">Needs Info</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>

        {/* Date Period */}
        <div className="flex items-center gap-1 ml-auto">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium font-mono-numbers"
          >
            <option value="Q3-2026">Q3 2026</option>
            <option value="Q2-2026">Q2 2026</option>
            <option value="FY-2026">FY 2025-26</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Borrowers Underwritten</span>
          <div className="text-2xl font-bold font-mono-numbers text-white tracking-tight">1,284</div>
          <div className="text-[11px] text-emerald-400 font-medium">+18.4% YoY Book Growth</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Overall Sanction Rate</span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-400 tracking-tight">68.2%</div>
          <div className="text-[11px] text-slate-400">876 approved facilities</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Average Requested Amount</span>
          <div className="text-2xl font-bold font-mono-numbers text-white tracking-tight">₹11,400</div>
          <div className="text-[11px] text-slate-400">Working capital starter ticket</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Average Recommended Amount</span>
          <div className="text-2xl font-bold font-mono-numbers text-indigo-400 tracking-tight">₹9,850</div>
          <div className="text-[11px] text-slate-400">Prudent risk-calibrated buffer</div>
        </div>
      </div>

      {/* Row 1: Volume Over Time (7 Cols) + Risk Donut (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. Applicant Volume Over Time */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Applicant Volume & Sanctions Over Time
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Monthly intake vs sanctioned credit applications
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-indigo-400 font-semibold">
              6-Month Trend
            </span>
          </div>

          <div>
            <LineAreaChart
              labels={volumeLabels}
              series={volumeSeries}
              height={220}
              unit=" files"
            />
          </div>
        </div>

        {/* 2. Risk Distribution Donut */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Portfolio Risk Distribution
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Proportion of active book across risk tiers
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">1,284 Total</span>
          </div>

          <div className="py-2 flex items-center justify-center">
            <DonutChart
              data={riskDonutData}
              size={190}
              strokeWidth={28}
              centerLabel="Risk Bands"
              centerSub="100%"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Low: 42.2%</span>
            <span>Moderate: 45.6%</span>
            <span>High: 12.2%</span>
          </div>
        </div>
      </div>

      {/* Row 2: Average Score by Business Type (6 Cols) + Status Distribution (6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3. Average Trust Score by Business Type */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Average Trust Score by Business Type
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sector performance across micro-enterprise categories
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-emerald-400 font-semibold">
              Highest: Tailoring (78)
            </span>
          </div>

          <div>
            <BarChart
              data={businessScoreData}
              height={210}
              benchmarkValue={70}
              benchmarkLabel="Portfolio Avg (70)"
              unit=" pts"
            />
          </div>
        </div>

        {/* 4. Application Status Distribution */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Application Status Distribution
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Operational pipeline state of all registered micro-borrowers
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-emerald-400 font-semibold">
              68.2% Sanctioned
            </span>
          </div>

          <div className="py-2 flex items-center justify-center">
            <DonutChart
              data={statusDonutData}
              size={190}
              strokeWidth={28}
              centerLabel="Pipeline"
              centerSub="1,284"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Approved: 876</span>
            <span>Review: 142</span>
            <span>Needs Info: 198</span>
            <span>Paused: 68</span>
          </div>
        </div>
      </div>

      {/* Row 3: 5. Recommended vs Requested Loan Amounts */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              5. Requested vs Recommended Loan Amounts by Sector
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Comparison between borrower loan requests and risk-adjusted underwritten credit lines
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              Requested Amount (₹)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Recommended Limit (₹)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {ticketComparisonData.map((item, idx) => {
            const requested = item.value;
            const recommended = item.secondaryValue || item.value * 0.85;
            const variancePct = Math.round(((recommended - requested) / requested) * 100);

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="text-xs font-semibold text-slate-300 truncate">
                  {item.label}
                </div>
                <div className="space-y-1 text-xs font-mono-numbers">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Req:</span>
                    <span className="text-white font-bold">₹{requested.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rec:</span>
                    <span className="text-emerald-400 font-bold">₹{recommended.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-1 text-[10px] text-slate-400 flex justify-between border-t border-slate-800">
                  <span>Prudence:</span>
                  <span className="text-indigo-400 font-semibold">{variancePct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
