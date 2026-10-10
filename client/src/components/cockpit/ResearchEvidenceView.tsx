import { useState, useEffect } from 'react';
import { getResearchEvidenceApi, type ResearchEvidenceItem } from '../../lib/api';

export default function ResearchEvidenceView() {
  const [evidenceList, setEvidenceList] = useState<ResearchEvidenceItem[]>([]);

  useEffect(() => {
    getResearchEvidenceApi().then((data) => {
      setEvidenceList(data);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IMPLEMENTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            IMPLEMENTED
          </span>
        );
      case 'PROTOTYPE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            PROTOTYPE
          </span>
        );
      case 'FUTURE RESEARCH':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            FUTURE RESEARCH
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
              Research Evidence & Literature Foundation
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Module 18
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent mapping between peer-reviewed academic literature in credit intelligence and TrustBridge architectural implementations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono-numbers px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            Peer-Reviewed Citations: 6
          </span>
        </div>
      </div>

      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {evidenceList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    {item.concept}
                  </span>
                  <h2 className="text-sm font-bold text-slate-100 mt-1 leading-snug">
                    {item.paper_title}
                  </h2>
                </div>
                <div className="shrink-0">{getStatusBadge(item.status)}</div>
              </div>

              <div className="mt-3 text-xs text-slate-400 font-mono-numbers">
                {item.authors} • <span className="text-slate-300">{item.venue}</span>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Core Scientific Finding:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {item.core_finding}
                </p>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                  TrustBridge Architecture Implementation:
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {item.trustbridge_implementation}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono-numbers flex items-center justify-between">
              <span>Ref: {item.citation}</span>
              <span className="text-slate-400 font-semibold">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
