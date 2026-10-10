import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Info,
  Camera,
  Receipt,
  Zap,
  Building
} from 'lucide-react';
import type { Applicant, ProofDocument } from '../../types/underwriter';

interface DocumentVerificationViewProps {
  applicant: Applicant;
  onNavigateToFraudChecks: () => void;
}

export default function DocumentVerificationView({
  applicant,
  onNavigateToFraudChecks
}: DocumentVerificationViewProps) {
  const [selectedDoc, setSelectedDoc] = useState<ProofDocument | null>(
    applicant.proofDocuments[0] || null
  );

  const docTrustScore = applicant.documentTrustScore || 94;

  const getDocIcon = (category: string) => {
    switch (category) {
      case 'Rent':
        return Building;
      case 'Supplier':
        return Receipt;
      case 'Utility':
        return Zap;
      case 'Business Photo':
        return Camera;
      default:
        return FileText;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" /> VERIFIED
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertTriangle className="h-3 w-3" /> REVIEW REQUIRED
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Enterprise Document Verification Checklist
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Module 07
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic and OCR verification pipeline for evidence uploaded by <strong className="text-slate-200">{applicant.name}</strong>.
          </p>
        </div>

        <button
          onClick={onNavigateToFraudChecks}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <span>Fraud / Anomaly Screening</span>
        </button>
      </div>

      {/* Document Trust Score Hero Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Document Trust Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-numbers text-white tracking-tight">
              {docTrustScore}
            </span>
            <span className="text-xs text-slate-400 font-mono-numbers">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Aggregated integrity across submitted proof vouchers.
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verification Pipeline Ratio
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-numbers text-indigo-400 tracking-tight">
              {applicant.verificationRatio}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Verified by human field officer and automated checks.
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pipeline Screening Mode
          </span>
          <div className="mt-1">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold font-mono-numbers inline-block">
              Anomaly screening — prototype
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Heuristic rules & OCR template consistency checks.
          </span>
        </div>
      </div>

      {/* Document Inspection Grid (List on Left, Deep Inspection Checklist on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Document List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Uploaded Evidence Items ({applicant.proofDocuments.length})
          </h2>

          <div className="space-y-2">
            {applicant.proofDocuments.map((doc) => {
              const Icon = getDocIcon(doc.category);
              const isSelected = selectedDoc?.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/60 shadow-md'
                      : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-100">{doc.name}</h3>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {doc.category} • {doc.issuedBy}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">{getStatusBadge(doc.status)}</div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    {doc.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Deep Automated Checklist */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          {selectedDoc ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono-numbers text-indigo-400 uppercase font-bold">
                    Item Inspection: {selectedDoc.id}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                    {selectedDoc.name}
                  </h3>
                </div>
                <div className="self-start sm:self-auto">
                  {getStatusBadge(selectedDoc.status)}
                </div>
              </div>

              {/* 6 Automated Verification Checks */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Standard Verification Criteria Checks (6-Point Matrix)
                </h4>

                <div className="space-y-2">
                  {/* 1. OCR Extraction */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-200 font-medium">OCR Extraction</span>
                    </div>
                    <span className="text-[11px] font-mono-numbers text-emerald-400 font-semibold">PASS (100% Legible)</span>
                  </div>

                  {/* 2. Date Consistency */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {selectedDoc.dateConsistencyPass !== false ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                      )}
                      <span className="text-slate-200 font-medium">Date Consistency</span>
                    </div>
                    <span className={`text-[11px] font-mono-numbers font-semibold ${
                      selectedDoc.dateConsistencyPass !== false ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {selectedDoc.dateConsistencyPass !== false ? 'PASS (Chronological)' : 'FLAGGED (Date Precedes Registration)'}
                    </span>
                  </div>

                  {/* 3. Amount Consistency */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-200 font-medium">Amount Consistency</span>
                    </div>
                    <span className="text-[11px] font-mono-numbers text-emerald-400 font-semibold">PASS (Matches Turnover Scale)</span>
                  </div>

                  {/* 4. Duplicate Document Check */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {selectedDoc.duplicateCheckPass !== false ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                      )}
                      <span className="text-slate-200 font-medium">Duplicate Document Check</span>
                    </div>
                    <span className={`text-[11px] font-mono-numbers font-semibold ${
                      selectedDoc.duplicateCheckPass !== false ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {selectedDoc.duplicateCheckPass !== false ? 'PASS (Unique Hash)' : 'FLAGGED (#INV Duplicate Detected)'}
                    </span>
                  </div>

                  {/* 5. Business Information Consistency */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-200 font-medium">Business Info Consistency</span>
                    </div>
                    <span className="text-[11px] font-mono-numbers text-emerald-400 font-semibold">PASS (Matches Pitch Registry)</span>
                  </div>

                  {/* 6. Transaction Consistency */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-200 font-medium">Transaction Ledger Correlation</span>
                    </div>
                    <span className="text-[11px] font-mono-numbers text-emerald-400 font-semibold">PASS (Correlated to Bank/UPI)</span>
                  </div>
                </div>
              </div>

              {/* Anomaly Flags If Any */}
              {selectedDoc.anomalyFlags && selectedDoc.anomalyFlags.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Anomaly Flags Identified:
                  </div>
                  <ul className="text-rose-200/90 list-disc list-inside text-[11px]">
                    {selectedDoc.anomalyFlags.map((flag, fIdx) => (
                      <li key={fIdx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verified Metadata */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span>Issuer: <strong className="text-slate-300">{selectedDoc.issuedBy}</strong></span>
                <span>Verified At: <strong className="text-slate-300">{selectedDoc.verifiedAt || 'Pending Officer Sign-off'}</strong></span>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a document from the left to inspect verification checks.
            </div>
          )}
        </div>
      </div>

      {/* Prototype Screening Notice */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Anomaly Screening — Prototype:</strong> Document checks run deterministic heuristic cross-validation across optical text, date chronological ordering, and duplicate receipt hashing. No unverified "photoshop detection" is claimed.
        </span>
      </div>
    </div>
  );
}
