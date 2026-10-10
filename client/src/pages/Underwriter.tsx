import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar, { type CockpitTab } from '../components/cockpit/Sidebar';
import CockpitHeader from '../components/cockpit/CockpitHeader';
import OverviewView from '../components/cockpit/OverviewView';
import ReviewQueueView from '../components/cockpit/ReviewQueueView';
import ApplicantDossierView from '../components/cockpit/ApplicantDossierView';
import RiskIntelligenceView from '../components/cockpit/RiskIntelligenceView';
import ExplainabilityView from '../components/cockpit/ExplainabilityView';
import VerificationView from '../components/cockpit/VerificationView';
import FairnessLabView from '../components/cockpit/FairnessLabView';
import PortfolioAnalyticsView from '../components/cockpit/PortfolioAnalyticsView';
import AuditGovernanceView from '../components/cockpit/AuditGovernanceView';
import ResearchEvidenceView from '../components/cockpit/ResearchEvidenceView';
import SettingsView from '../components/cockpit/SettingsView';
import DossierModal from '../components/DossierModal';
import TrustBridgeAssistant from '../components/assistant/TrustBridgeAssistant';

import { getUnderwriterQueueApi, recordUnderwriterDecisionApi } from '../lib/api';
import { SEED_APPLICANTS } from '../data/seedApplicants';
import type { Applicant, AuditLogItem, ReviewStatus } from '../types/underwriter';

interface UnderwriterProps {
  defaultTab?: CockpitTab;
}

export default function Underwriter({ defaultTab }: UnderwriterProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabParam = searchParams.get('tab') as CockpitTab | null;

  const [applicants, setApplicants] = useState<Applicant[]>(SEED_APPLICANTS);
  const [activeApplicant, setActiveApplicant] = useState<Applicant>(SEED_APPLICANTS[0]);
  const [activeTab, setActiveTab] = useState<CockpitTab>(defaultTab || initialTabParam || 'dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedModalApplicant, setSelectedModalApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const [auditLog, setAuditLog] = useState<AuditLogItem[]>([
    {
      id: 'audit-001',
      applicantId: 'TB-2026-0143',
      applicantName: 'Meena Devi',
      action: 'Sanctioned ₹15,000 Starter Loan',
      decision: 'APPROVED',
      amount: 15000,
      note: 'Verified 28-month municipal stall lease and JVVNL industrial power bill.',
      timestamp: '2026-10-02, 17:35 UTC',
      underwriterId: 'UW-BANGALORE-09'
    },
    {
      id: 'audit-002',
      applicantId: 'TB-2026-0142',
      applicantName: 'Ravi Kumar',
      action: 'Initial Dossier Verification Completed',
      decision: 'PENDING_REVIEW',
      amount: 10000,
      note: 'All 5 proof documents validated: Rent receipts, UPI QR log, wholesale slip, utility, and kiosk photo.',
      timestamp: '2026-10-03, 11:20 UTC',
      underwriterId: 'UW-BANGALORE-09'
    },
    {
      id: 'audit-003',
      applicantId: 'TB-2026-0146',
      applicantName: 'Suresh Patel',
      action: 'Application Processing Paused',
      decision: 'PAUSED',
      amount: 25000,
      note: 'Early warning triggered: Supplier repayment dropped from 90% to 68% with two late rental clearances.',
      timestamp: '2026-10-04, 09:15 UTC',
      underwriterId: 'UW-BANGALORE-09'
    }
  ]);

  // Sync tab with URL search parameter
  const handleSelectTab = (tab: CockpitTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Fetch applicant queue on mount or refresh
  const fetchQueue = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const data = await getUnderwriterQueueApi();
      if (data && data.length > 0) {
        setApplicants(data);
        setActiveApplicant((prev) => data.find((a) => a.id === prev.id) || data[0]);
      }
    } catch (err) {
      console.warn('[TrustBridge] Error querying Supabase queue:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Handle Underwriter Decision Action (Approve / Needs Info / Pause)
  const handleUnderwriterDecision = async (
    applicantId: string,
    decision: ReviewStatus,
    notes: string,
    sanctionedAmount?: number
  ) => {
    const target = applicants.find((a) => a.id === applicantId);
    if (!target) return;

    let actionLabel = '';
    if (decision === 'APPROVED') {
      actionLabel = `Sanctioned ₹${(sanctionedAmount || target.requestedAmount).toLocaleString()} Starter Loan`;
    } else if (decision === 'NEEDS_INFO') {
      actionLabel = 'Requested Additional Verification Receipts';
    } else if (decision === 'PAUSED') {
      actionLabel = 'Paused Application Processing';
    }

    // Update UI state immediately
    const updated = applicants.map((a) =>
      a.id === applicantId ? { ...a, status: decision, sanctionNotes: notes } : a
    );
    setApplicants(updated);
    if (activeApplicant.id === applicantId) {
      setActiveApplicant((prev) => ({ ...prev, status: decision, sanctionNotes: notes }));
    }

    // Add to audit trail
    const auditItem: AuditLogItem = {
      id: `audit-${Date.now()}`,
      applicantId: target.id,
      applicantName: target.name,
      action: actionLabel,
      decision,
      amount: sanctionedAmount || target.requestedAmount,
      note: notes || 'Underwriter recorded action in FinTech cockpit.',
      timestamp: new Date().toISOString(),
      underwriterId: 'UW-BANGALORE-09'
    };
    setAuditLog((prev) => [auditItem, ...prev]);

    // Record to backend / Supabase
    await recordUnderwriterDecisionApi(applicantId, decision, notes, sanctionedAmount);
  };

  // Keyboard shortcut Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#090d16] text-[#f1f5f9] overflow-hidden select-none">
      {/* 1. Persistent Enterprise Sidebar (Part 1) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingCount={applicants.filter((a) => a.status === 'PENDING_REVIEW').length || 142}
        criticalAlertCount={applicants.filter((a) => a.riskTrajectory === 'DETERIORATING').length || 2}
      />

      {/* 2. Main Cockpit Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Cockpit Top Bar & Multi-Borrower Context Selector */}
        <CockpitHeader
          applicants={applicants}
          activeApplicant={activeApplicant}
          onSelectApplicant={(appl) => setActiveApplicant(appl)}
          onRefresh={() => fetchQueue(true)}
          isRefreshing={isRefreshing}
          onOpenDossier={() => handleSelectTab('applicants')}
          onOpenSimulator={() => handleSelectTab('explainability')}
        />

        {/* Dynamic Module View Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {(activeTab === 'dashboard' || activeTab === 'overview') && (
              <OverviewView
                applicants={applicants}
                activeApplicant={activeApplicant}
                onSelectApplicant={(appl) => setActiveApplicant(appl)}
                onNavigateToQueue={() => handleSelectTab('queue')}
                onNavigateToDossier={() => handleSelectTab('applicants')}
                onNavigateToRisk={() => handleSelectTab('risk-intelligence')}
              />
            )}

            {activeTab === 'queue' && (
              <ReviewQueueView
                applicants={applicants}
                activeApplicant={activeApplicant}
                onSelectApplicant={(appl) => setActiveApplicant(appl)}
                onOpenDossier={() => handleSelectTab('applicants')}
              />
            )}

            {(activeTab === 'applicants' || activeTab === 'dossier') && (
              <ApplicantDossierView
                applicant={activeApplicant}
                onUnderwriterDecision={handleUnderwriterDecision}
                onOpenSimulator={() => handleSelectTab('explainability')}
                onOpenCounterfactuals={() => handleSelectTab('explainability')}
              />
            )}

            {(activeTab === 'risk-intelligence' || activeTab === 'behavioral-signals' || activeTab === 'early-warnings') && (
              <RiskIntelligenceView
                applicant={activeApplicant}
                onOpenSimulator={() => handleSelectTab('explainability')}
              />
            )}

            {(activeTab === 'explainability' || activeTab === 'counterfactual' || activeTab === 'simulation') && (
              <ExplainabilityView
                applicant={activeApplicant}
                applicants={applicants}
                onSelectApplicant={(appl) => setActiveApplicant(appl)}
              />
            )}

            {(activeTab === 'verification' || activeTab === 'fraud-checks') && (
              <VerificationView
                applicant={activeApplicant}
                applicants={applicants}
                onSelectApplicant={(appl) => setActiveApplicant(appl)}
              />
            )}

            {activeTab === 'portfolio' && <PortfolioAnalyticsView />}

            {activeTab === 'fairness' && <FairnessLabView />}

            {activeTab === 'audit' && <AuditGovernanceView auditLog={auditLog} />}

            {activeTab === 'research' && <ResearchEvidenceView />}

            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Full Dossier Modal if triggered */}
      {selectedModalApplicant && (
        <DossierModal
          applicant={selectedModalApplicant}
          onClose={() => setSelectedModalApplicant(null)}
          onAction={(id, decision, notes) => handleUnderwriterDecision(id, decision, notes)}
        />
      )}

      {/* Contextual AI Underwriting Assistant */}
      <TrustBridgeAssistant activeApplicant={activeApplicant} />
    </div>
  );
}
