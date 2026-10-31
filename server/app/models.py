from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class SignalInput(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)
    """Borrower input signals for deterministic alternative credit calculation."""
    stall_tenure_months: int = Field(
        default=18, 
        ge=1, 
        le=120, 
        description="Continuous months operating at the same stall location"
    )
    weekly_income: float = Field(
        default=7500.0, 
        ge=0.0, 
        description="Average recurring weekly gross business revenue in INR"
    )
    stall_rent_timeliness: float = Field(
        default=95.0, 
        ge=0.0, 
        le=100.0, 
        description="Percentage of on-time stall rent payments"
    )
    supplier_repayment_pct: float = Field(
        default=90.0, 
        ge=0.0, 
        le=100.0, 
        description="Punctuality percentage for wholesale supplier credit settlements"
    )
    utility_recharge_pct: float = Field(
        default=85.0, 
        ge=0.0, 
        le=100.0, 
        description="Consistency percentage of commercial electricity and phone recharges"
    )
    chit_shg_active: bool = Field(
        default=True, 
        description="Active participation in community Self-Help Group or verified chit fund"
    )
    requested_loan: float = Field(
        default=10000.0, 
        ge=1000.0, 
        le=50000.0, 
        description="Requested working capital starter loan in INR"
    )
    repayment_weeks: int = Field(
        default=12, 
        ge=4, 
        le=52, 
        description="Configured loan repayment period in weeks"
    )


class FeatureAttributionItem(BaseModel):
    """SHAP-compatible feature contribution."""
    feature: str
    contribution: float
    direction: str # POSITIVE | NEGATIVE
    raw_metric: str
    category: str


class MLDefaultPrediction(BaseModel):
    """Machine Learning credit default probability prediction with SHAP explainability."""
    probability_of_default: float = Field(
        ge=0.0, le=1.0,
        description="Machine Learning predicted probability of default within repayment period (0.0 to 1.0)"
    )
    risk_band: str = Field(
        description="Calibrated ML risk band: VERY_LOW_RISK | LOW_RISK | MODERATE_RISK | HIGH_RISK"
    )
    training_data: str = "synthetic"
    validation_scope: str = "Educational model; not validated on real borrower outcomes."
    model_version: str = Field(
        default="RandomForest-v1.0",
        description="Version/algorithm of the ML credit risk model"
    )
    base_default_rate: float = Field(
        description="Population expected default rate (SHAP base value E[f(x)])"
    )
    shap_contributions: List[FeatureAttributionItem] = Field(
        default_factory=list,
        description="SHAP game-theoretic feature contributions towards probability of default"
    )


class ScoreOutput(BaseModel):
    """Deterministic 3-pillar composite score output enriched with ML default prediction."""
    composite_score: int = Field(ge=0, le=100, description="Overall Trust Score (0-100)")
    ability_score: int = Field(ge=0, le=100, description="Pillar 1: Ability to Repay (40% Weight)")
    willingness_score: int = Field(ge=0, le=100, description="Pillar 2: Willingness to Repay (35% Weight)")
    stability_score: int = Field(ge=0, le=100, description="Pillar 3: Stability of Activity (25% Weight)")
    confidence_tier: str = Field(description="Confidence Tier: High, Medium-High, or Review Required")
    what_helped: List[str] = Field(default_factory=list, description="Positive driver points")
    what_needs_attention: List[str] = Field(default_factory=list, description="Attention / gap points")
    weekly_installment: float = Field(description="Derived weekly repayment installment in INR")
    debt_service_coverage: float = Field(description="Ratio of weekly turnover to weekly installment")
    calculation_timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    # Machine Learning Credit Risk Predictions & SHAP Explainability
    probability_of_default: Optional[float] = Field(
        default=None,
        description="ML predicted probability of default (0.0 to 1.0)"
    )
    ml_risk_band: Optional[str] = Field(
        default=None,
        description="Calibrated ML risk band: VERY_LOW_RISK | LOW_RISK | MODERATE_RISK | HIGH_RISK"
    )
    shap_feature_contributions: Optional[List[FeatureAttributionItem]] = Field(
        default_factory=list,
        description="SHAP game-theoretic feature contributions towards default risk"
    )
    ml_model_details: Optional[MLDefaultPrediction] = Field(
        default=None,
        description="Detailed ML credit risk model prediction and explainability payload"
    )


class BorrowerCreate(BaseModel):
    """Payload for submitting a new borrower application with consent."""
    full_name: str = Field(min_length=2, max_length=100)
    business_type: str = Field(min_length=2, max_length=100)
    location: str = Field(min_length=2, max_length=100)
    signals: SignalInput
    explicit_consent_given: bool = Field(
        default=False,
        description="Affirmative borrower consent is mandatory"
    )


class LoanDecisionRequest(BaseModel):
    """Payload for human underwriter recording an action."""
    application_id: str
    decision: str = Field(description="APPROVED | MORE_INFO_REQUESTED | PAUSED")
    sanctioned_amount: Optional[float] = None
    notes: Optional[str] = None
    underwriter_id: str = "UW-BANGALORE-09"


# ============================================================
# NEW ENTERPRISE EXTENSION MODELS
# ============================================================

class SimulationRequest(BaseModel):
    """What-If Simulation scenario parameters."""
    applicant_id: Optional[str] = None
    baseline_signals: SignalInput
    income_delta_pct: float = Field(default=0.0, ge=-90.0, le=200.0, description="Percentage change in weekly turnover")
    supplier_delta_pct: float = Field(default=0.0, ge=-100.0, le=100.0, description="Percentage change in supplier timeliness")
    rent_delta_pct: float = Field(default=0.0, ge=-100.0, le=100.0, description="Percentage change in rent punctuality")
    tenure_months_override: Optional[int] = Field(default=None, ge=1, le=120)
    chit_shg_override: Optional[bool] = None


class SimulationResponse(BaseModel):
    """Non-destructive simulation result."""
    baseline_score: int
    simulated_score: int
    score_delta: int
    baseline_pillars: Dict[str, int]
    simulated_pillars: Dict[str, int]
    baseline_risk_tier: str
    simulated_risk_tier: str
    risk_trajectory_label: str
    scenario_explanation: str
    is_simulated_data: bool = True
    guarantee: str = "Real borrower records remained untouched."


class CounterfactualPath(BaseModel):
    """Actionable improvement path for borrower."""
    lever_name: str
    current_value: str
    target_value: str
    projected_score: int
    projected_score_delta: int
    confidence: str
    action_item: str



class DocumentCheckRequest(BaseModel):
    """Document anomaly screening payload."""
    document_name: str
    document_type: str = "SUPPLIER_INVOICE"
    amount: Optional[float] = None
    invoice_number: Optional[str] = None
    issue_date: Optional[str] = None


class DocumentCheckResponse(BaseModel):
    """Metadata intake only; document authenticity has not been established."""
    document_name: str
    verification_status: str = "PENDING"
    ocr_extracted: bool = False
    date_consistency_pass: Optional[bool] = None
    amount_consistency_pass: Optional[bool] = None
    duplicate_check_pass: Optional[bool] = None
    business_info_pass: Optional[bool] = None
    transaction_consistency_pass: Optional[bool] = None
    document_trust_score: Optional[int] = Field(default=None, ge=0, le=100)
    anomaly_score: Optional[int] = Field(default=None, ge=0, le=100)
    anomaly_flags: List[str] = Field(default_factory=list)
    screening_mode: str = "Metadata intake only; OCR, duplicate checks and authenticity verification are not implemented."


class AuditEventCreate(BaseModel):
    """Event payload for underwriter audit trail."""
    applicant_id: str
    applicant_name: str
    action: str
    previous_state: Optional[str] = None
    new_state: Optional[str] = None
    reason: str
    underwriter_id: str = "UW-BANGALORE-09"
    amount: Optional[float] = None


class AuditEventItem(AuditEventCreate):
    id: str
    timestamp: str


class FairnessMetricsResponse(BaseModel):
    """Statistical fairness and feature governance audit."""
    disparate_impact_ratio: float
    four_fifths_threshold: float = 0.80
    compliance_status: str
    approval_rate_difference: float
    false_positive_rate_difference: float
    false_negative_rate_difference: float
    allowed_features: List[str]
    monitored_proxies: List[str]
    group_distributions: List[Dict[str, Any]]
    dataset_disclaimer: str = "Synthetic demonstration dataset — production deployment requires statistically significant real-world validation."


class PortfolioAnalyticsResponse(BaseModel):
    """Portfolio-level management KPIs and distributions."""
    total_active_applications: int
    pending_reviews_count: int
    average_trust_score: float
    verification_flags_pct: float
    overall_approval_rate_pct: float
    average_requested_loan: float
    average_recommended_loan: float
    portfolio_risk_distribution: Dict[str, int]
    trust_score_distribution: Dict[str, int]
    portfolio_risk_trend: str # Improving | Stable | Deteriorating
    sector_breakdown: Dict[str, int]


# ============================================================
# PRODUCTION HARDENING & SECURITY EXTENSION MODELS
# ============================================================

from enum import Enum

class UserRole(str, Enum):
    BORROWER = "borrower"
    UNDERWRITER = "underwriter"
    ADMIN = "admin"


class UserProfile(BaseModel):
    user_id: str
    email: str
    full_name: str
    role: UserRole
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class DocumentUploadResponse(BaseModel):
    document_id: str
    original_name: str
    sanitized_name: str
    file_size_bytes: int
    mime_type: str
    sha256_hash: str
    status: str # "UPLOADED_FOR_INSPECTION" | "REJECTED"
    allowed: bool
    message: str


class AssistantMessage(BaseModel):
    role: str # "user" | "assistant" | "system"
    content: str = Field(min_length=1, max_length=4000)
    timestamp: Optional[str] = None


class AssistantContext(BaseModel):
    applicant_id: Optional[str] = None
    applicant_name: Optional[str] = None
    business_type: Optional[str] = None
    trust_score: Optional[int] = None
    pillars: Optional[Dict[str, int]] = None
    risk_tier: Optional[str] = None
    risk_trajectory: Optional[str] = None
    anomaly_flags: Optional[List[str]] = None
    current_route: Optional[str] = None
    user_role: Optional[str] = "borrower"


class AssistantChatRequest(BaseModel):
    messages: List[AssistantMessage] = Field(min_length=1)
    context: Optional[AssistantContext] = None
    quick_action: Optional[str] = None


class AssistantChatResponse(BaseModel):
    reply: str
    model_used: str
    suggested_actions: List[str]
    human_decision_required: bool = True
    confidence: str = "High"
    context_applicant_id: Optional[str] = None


class SecurityStatusResponse(BaseModel):
    service: str = "TrustBridge FinTech Security Core"
    rls_enforced: bool = True
    rbac_active: bool = True
    supported_roles: List[str] = ["borrower", "underwriter", "admin"]
    secret_storage: str = "Backend server-side only"
    consent_version: str = "v2.1"
    audit_logging: str = "Immutable append-only"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

