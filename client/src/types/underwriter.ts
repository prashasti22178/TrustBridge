export type ReviewStatus = 'PENDING_REVIEW' | 'NEEDS_INFO' | 'APPROVED' | 'PAUSED';

export type RiskTrajectory = 'IMPROVING' | 'STABLE' | 'DETERIORATING';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ProofDocument {
  id: string;
  name: string;
  category: 'Rent' | 'Supplier' | 'Utility' | 'Identity' | 'Business Photo';
  status: 'VERIFIED' | 'PENDING' | 'NEEDS_REVIEW';
  issuedBy: string;
  verifiedAt?: string;
  summary: string;
  ocrExtracted?: boolean;
  dateConsistencyPass?: boolean;
  amountConsistencyPass?: boolean;
  duplicateCheckPass?: boolean;
  anomalyFlags?: string[];
}

export interface SignalDetail {
  name: string;
  rawMetric: string;
  pillar: 'Ability (40%)' | 'Willingness (35%)' | 'Stability (25%)';
  contribution: number; // e.g. points
  status: 'VERIFIED' | 'SELF_REPORTED' | 'DOCUMENTED';
  insight: string;
}

export interface BehavioralMonthRecord {
  month: string;
  income: number;
  rent: string;
  supplier: string;
  utility: string;
  consistencyPct: number;
}

export interface RiskAlertRecord {
  date: string;
  severity: RiskSeverity;
  signal: string;
  change: string;
  impact: string;
}

export interface FeatureAttributionItem {
  feature: string;
  contribution: number;
  direction: 'POSITIVE' | 'NEGATIVE';
  rawMetric: string;
  category: string;
}

export interface CounterfactualPathItem {
  leverName: string;
  currentValue: string;
  targetValue: string;
  projectedScore: number;
  projectedScoreDelta: number;
  confidence: string;
  actionItem: string;
}

export interface Applicant {
  id: string;
  name: string;
  businessType: string;
  location: string;
  stallTenureMonths: number;
  weeklyRevenue: number;
  requestedAmount: number;
  repaymentWeeks: number;
  trustScore: number;
  confidenceTier: 'High Confidence' | 'Medium-High Confidence' | 'Review Required';
  pillars: {
    ability: number;
    willingness: number;
    stability: number;
  };
  signals: SignalDetail[];
  proofDocuments: ProofDocument[];
  verificationRatio: string; // e.g. '5/5 Verified'
  status: ReviewStatus;
  appliedDate: string;
  aiExplanation: {
    summary: string;
    strengths: string[];
    riskFactors: string[];
    underwritingRecommendation: string;
  };
  sanctionNotes?: string;
  decisionTimestamp?: string;

  // Extended Research-Backed Attributes
  riskTrajectory?: RiskTrajectory;
  riskTier?: string;
  behavioralConsistencyIndex?: number;
  documentTrustScore?: number;
  anomalyScore?: number;
  suggestedLendingMin?: number;
  suggestedLendingMax?: number;
  behaviorTimeline?: BehavioralMonthRecord[];
  riskAlerts?: RiskAlertRecord[];
  featureAttributions?: FeatureAttributionItem[];
  counterfactualPaths?: CounterfactualPathItem[];
}

export interface AuditLogItem {
  id: string;
  applicantId: string;
  applicantName: string;
  action: string;
  decision: ReviewStatus;
  amount?: number;
  note: string;
  timestamp: string;
  underwriterId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
}
