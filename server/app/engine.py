"""Deterministic Mathematical Scoring Engine for TrustBridge.

Invariants:
- 100% deterministic calculation (No black-box ML/LLMs).
- Reproducible from input signals.
- Formula: Trust Score = (0.40 * Ability) + (0.35 * Willingness) + (0.25 * Stability)
"""

from typing import List, Tuple, Dict, Any
from app.models import (
    SignalInput, 
    ScoreOutput, 
    SimulationRequest, 
    SimulationResponse,
    FeatureAttributionItem,
    CounterfactualPath
)


def calculate_ability_score(weekly_income: float) -> int:
    """Calculate Ability to Repay (40% Weight).

    Formula from SPEC.md:
    ability_score = min(100, round((weekly_income / 1000) * 11))
    """
    return min(100, max(0, round((weekly_income / 1000.0) * 11)))


def calculate_willingness_score(
    rent_timeliness: float, 
    supplier_repay: float, 
    utility_recharge: float
) -> int:
    """Calculate Willingness to Repay (35% Weight).

    Formula from SPEC.md:
    willingness_score = round(0.50 * rent + 0.30 * supplier + 0.20 * utility)
    """
    raw = (0.50 * rent_timeliness) + (0.30 * supplier_repay) + (0.20 * utility_recharge)
    return min(100, max(0, round(raw)))


def calculate_stability_score(stall_tenure_months: int) -> int:
    """Calculate Stability of Activity (25% Weight).

    Formula from SPEC.md:
    stability_score = min(100, round((stall_months / 24) * 100))
    """
    raw = (stall_tenure_months / 24.0) * 100.0
    return min(100, max(0, round(raw)))


def generate_explainability_narratives(
    signals: SignalInput,
    weekly_installment: float
) -> Tuple[List[str], List[str]]:
    """Generate dynamic 'What Helped' and 'What Needs Attention' cards from boundary values."""
    what_helped: List[str] = []
    what_needs_attention: List[str] = []

    # 1. Stall Tenure
    if signals.stall_tenure_months >= 12:
        what_helped.append(
            f"{signals.stall_tenure_months} months continuous business operation at same stall location."
        )
    else:
        what_needs_attention.append(
            f"Stall tenure is {signals.stall_tenure_months} months (under 12 months benchmark); longer continuity builds stability."
        )

    # 2. Supplier Repayment
    if signals.supplier_repayment_pct >= 85:
        what_helped.append(
            f"Strong wholesale supplier credit discipline ({signals.supplier_repayment_pct:.0f}% punctuality)."
        )
    else:
        what_needs_attention.append(
            f"Wholesale supplier repayment punctuality is {signals.supplier_repayment_pct:.0f}%; vendor credit continuity needs improvement."
        )

    # 3. Stall Rent Punctuality
    if signals.stall_rent_timeliness >= 85:
        what_helped.append(
            f"Exemplary stall rent consistency ({signals.stall_rent_timeliness:.0f}% on-time receipts)."
        )
    else:
        what_needs_attention.append(
            f"Stall rent punctuality is {signals.stall_rent_timeliness:.0f}%; occasional delays affect willingness assessment."
        )

    # 4. Weekly Cashflow vs Loan Installment Coverage
    coverage = signals.weekly_income / max(1.0, weekly_installment)
    if coverage >= 4.0:
        what_helped.append(
            f"Stable weekly sales (₹{signals.weekly_income:,.0f}) comfortably cover weekly debt service (₹{weekly_installment:,.0f}) by {coverage:.1f}x."
        )
    else:
        what_needs_attention.append(
            f"Debt-to-turnover coverage is tight ({coverage:.1f}x); weekly installment of ₹{weekly_installment:,.0f} requires cashflow monitoring."
        )

    # 5. Utility & Phone Recharges
    if signals.utility_recharge_pct >= 80:
        what_helped.append(
            f"Punctual commercial electricity and telecom recharges ({signals.utility_recharge_pct:.0f}% consistency)."
        )

    # 6. Community Chit / SHG
    if signals.chit_shg_active:
        what_helped.append(
            "Active verified community savings-group (SHG/Chit) participant demonstrating peer endorsement."
        )
    else:
        what_needs_attention.append(
            "No verified participation in community savings (SHG / Chit fund); missing social collateral signal."
        )

    return what_helped, what_needs_attention


def calculate_trust_score(signals: SignalInput) -> ScoreOutput:
    """Calculate the complete deterministic alternative credit score."""
    # Derived weekly loan installment
    repayment_weeks = max(1, signals.repayment_weeks)
    weekly_installment = round(signals.requested_loan / float(repayment_weeks), 2)
    debt_service_coverage = round(
        signals.weekly_income / max(1.0, weekly_installment), 2
    )

    # 3 Pillar Calculations
    ability = calculate_ability_score(signals.weekly_income)
    willingness = calculate_willingness_score(
        signals.stall_rent_timeliness,
        signals.supplier_repayment_pct,
        signals.utility_recharge_pct
    )
    stability = calculate_stability_score(signals.stall_tenure_months)

    # Composite Score (0.40 * Ability + 0.35 * Willingness + 0.25 * Stability)
    raw_composite = (0.40 * ability) + (0.35 * willingness) + (0.25 * stability)
    composite = min(100, max(0, round(raw_composite)))

    # Determine confidence tier
    if composite >= 80:
        tier = "High Confidence"
    elif composite >= 70:
        tier = "Medium-High Confidence"
    else:
        tier = "Review Required"

    # Explainability narratives
    what_helped, what_needs_attention = generate_explainability_narratives(
        signals, weekly_installment
    )

    return ScoreOutput(
        composite_score=composite,
        ability_score=ability,
        willingness_score=willingness,
        stability_score=stability,
        confidence_tier=tier,
        what_helped=what_helped,
        what_needs_attention=what_needs_attention,
        weekly_installment=weekly_installment,
        debt_service_coverage=debt_service_coverage
    )


# ============================================================
# EXTENDED INTELLIGENCE MODULES: SIMULATION, SHAP, COUNTERFACTUALS
# ============================================================

def simulate_what_if_scenario(req: SimulationRequest) -> SimulationResponse:
    """Non-destructive simulation calculating impact of hypothetical macro or behavioral shocks."""
    baseline = calculate_trust_score(req.baseline_signals)

    # Apply deltas to create hypothetical signal profile
    new_income = max(500.0, req.baseline_signals.weekly_income * (1.0 + (req.income_delta_pct / 100.0)))
    new_supplier = min(100.0, max(0.0, req.baseline_signals.supplier_repayment_pct * (1.0 + (req.supplier_delta_pct / 100.0))))
    new_rent = min(100.0, max(0.0, req.baseline_signals.stall_rent_timeliness * (1.0 + (req.rent_delta_pct / 100.0))))
    new_tenure = req.tenure_months_override if req.tenure_months_override is not None else req.baseline_signals.stall_tenure_months
    new_chit = req.chit_shg_override if req.chit_shg_override is not None else req.baseline_signals.chit_shg_active

    simulated_signals = SignalInput(
        stall_tenure_months=new_tenure,
        weekly_income=new_income,
        stall_rent_timeliness=new_rent,
        supplier_repayment_pct=new_supplier,
        utility_recharge_pct=req.baseline_signals.utility_recharge_pct,
        chit_shg_active=new_chit,
        requested_loan=req.baseline_signals.requested_loan,
        repayment_weeks=req.baseline_signals.repayment_weeks
    )

    simulated = calculate_trust_score(simulated_signals)
    delta = simulated.composite_score - baseline.composite_score

    # Determine risk tier labels
    def get_risk_label(score: int) -> str:
        if score >= 80:
            return "LOW RISK"
        elif score >= 70:
            return "LOW-MODERATE RISK"
        elif score >= 60:
            return "MODERATE RISK"
        else:
            return "HIGH RISK"

    base_risk = get_risk_label(baseline.composite_score)
    sim_risk = get_risk_label(simulated.composite_score)

    if delta > 2:
        trajectory = "IMPROVING (+)"
    elif delta < -2:
        trajectory = "DETERIORATING (-)"
    else:
        trajectory = "STABLE (~)"

    # Synthesize neutral causal narrative
    explanations: List[str] = []
    if abs(req.income_delta_pct) >= 5:
        direction = "increase" if req.income_delta_pct > 0 else "reduction"
        ability_delta = simulated.ability_score - baseline.ability_score
        explanations.append(
            f"Income {direction} of {abs(req.income_delta_pct):.0f}% shifts the Ability component by {ability_delta:+d} points."
        )

    if abs(req.supplier_delta_pct) >= 5 or abs(req.rent_delta_pct) >= 5:
        willingness_delta = simulated.willingness_score - baseline.willingness_score
        explanations.append(
            f"Adjustment in payment timeliness moves Willingness by {willingness_delta:+d} points."
        )

    if req.tenure_months_override is not None and req.tenure_months_override != req.baseline_signals.stall_tenure_months:
        stability_delta = simulated.stability_score - baseline.stability_score
        explanations.append(
            f"Modifying continuous tenure from {req.baseline_signals.stall_tenure_months} to {new_tenure} months alters Stability by {stability_delta:+d} points."
        )

    if not explanations:
        explanations.append("Parameters match baseline with negligible variance.")

    return SimulationResponse(
        baseline_score=baseline.composite_score,
        simulated_score=simulated.composite_score,
        score_delta=delta,
        baseline_pillars={
            "ability": baseline.ability_score,
            "willingness": baseline.willingness_score,
            "stability": baseline.stability_score
        },
        simulated_pillars={
            "ability": simulated.ability_score,
            "willingness": simulated.willingness_score,
            "stability": simulated.stability_score
        },
        baseline_risk_tier=base_risk,
        simulated_risk_tier=sim_risk,
        risk_trajectory_label=trajectory,
        scenario_explanation=" ".join(explanations)
    )


def generate_feature_attributions(signals: SignalInput, score: ScoreOutput) -> List[FeatureAttributionItem]:
    """SHAP-inspired illustrative feature contributions relative to population baseline (50.0)."""
    items: List[FeatureAttributionItem] = []

    # 1. Stall Tenure (Stability 25%)
    tenure_pts = (signals.stall_tenure_months / 24.0) * 25.0
    tenure_contrib = round(tenure_pts - 12.5, 1) # relative to 12m midpoint
    items.append(FeatureAttributionItem(
        feature="Business Tenure Longevity",
        contribution=tenure_contrib,
        direction="POSITIVE" if tenure_contrib >= 0 else "NEGATIVE",
        raw_metric=f"{signals.stall_tenure_months} continuous months",
        category="Stability"
    ))

    # 2. Stall Rent Timeliness (Willingness 17.5% effective)
    rent_pts = (signals.stall_rent_timeliness / 100.0) * 17.5
    rent_contrib = round(rent_pts - 12.0, 1)
    items.append(FeatureAttributionItem(
        feature="Stall Rent Consistency",
        contribution=rent_contrib,
        direction="POSITIVE" if rent_contrib >= 0 else "NEGATIVE",
        raw_metric=f"{signals.stall_rent_timeliness:.0f}% on-time receipts",
        category="Willingness"
    ))

    # 3. Wholesale Supplier Punctuality (Willingness 10.5% effective)
    supp_pts = (signals.supplier_repayment_pct / 100.0) * 10.5
    supp_contrib = round(supp_pts - 7.5, 1)
    items.append(FeatureAttributionItem(
        feature="Wholesale Supplier Repayment",
        contribution=supp_contrib,
        direction="POSITIVE" if supp_contrib >= 0 else "NEGATIVE",
        raw_metric=f"{signals.supplier_repayment_pct:.0f}% timeliness",
        category="Willingness"
    ))

    # 4. Weekly Business Revenue (Ability 40%)
    ability_contrib = round((score.ability_score * 0.40) - 20.0, 1)
    items.append(FeatureAttributionItem(
        feature="Gross Weekly Turnover",
        contribution=ability_contrib,
        direction="POSITIVE" if ability_contrib >= 0 else "NEGATIVE",
        raw_metric=f"₹{signals.weekly_income:,.0f} / week",
        category="Ability"
    ))

    # 5. Utility & SIM Regularity (Willingness 7% effective)
    util_pts = (signals.utility_recharge_pct / 100.0) * 7.0
    util_contrib = round(util_pts - 4.5, 1)
    items.append(FeatureAttributionItem(
        feature="Utility & Commercial SIM Cadence",
        contribution=util_contrib,
        direction="POSITIVE" if util_contrib >= 0 else "NEGATIVE",
        raw_metric=f"{signals.utility_recharge_pct:.0f}% active recharges",
        category="Willingness"
    ))

    # 6. SHG / Chit Fund Social Collateral (Stability bonus)
    shg_contrib = 5.0 if signals.chit_shg_active else -4.0
    items.append(FeatureAttributionItem(
        feature="Community SHG / Chit Participation",
        contribution=shg_contrib,
        direction="POSITIVE" if shg_contrib >= 0 else "NEGATIVE",
        raw_metric="Active Contributor" if signals.chit_shg_active else "Non-Participant",
        category="Social Collateral"
    ))

    return sorted(items, key=lambda x: abs(x.contribution), reverse=True)


def generate_counterfactual_paths(signals: SignalInput, current_score: int) -> List[CounterfactualPath]:
    """Generate deterministic counterfactual scenarios answering 'How can this applicant improve?'"""
    paths: List[CounterfactualPath] = []

    # Lever 1: Supplier Repayment Lift
    if signals.supplier_repayment_pct < 95.0:
        target_supp = min(95.0, signals.supplier_repayment_pct + 15.0)
        sim_supp = SignalInput(**signals.model_dump())
        sim_supp.supplier_repayment_pct = target_supp
        res_supp = calculate_trust_score(sim_supp)
        paths.append(CounterfactualPath(
            lever_name="Wholesale Supplier Credit Discipline",
            current_value=f"{signals.supplier_repayment_pct:.0f}%",
            target_value=f"{target_supp:.0f}%",
            projected_score=res_supp.composite_score,
            projected_score_delta=res_supp.composite_score - current_score,
            confidence="High (Direct willingness weight)",
            action_item="Clear APMC mandi vendor dues weekly on scheduled clearing day."
        ))

    # Lever 2: Tenure Progression (6 months forward)
    if signals.stall_tenure_months < 24:
        target_tenure = min(24, signals.stall_tenure_months + 6)
        sim_tenure = SignalInput(**signals.model_dump())
        sim_tenure.stall_tenure_months = target_tenure
        res_tenure = calculate_trust_score(sim_tenure)
        paths.append(CounterfactualPath(
            lever_name="Stall Operating Longevity",
            current_value=f"{signals.stall_tenure_months} Months",
            target_value=f"{target_tenure} Months",
            projected_score=res_tenure.composite_score,
            projected_score_delta=res_tenure.composite_score - current_score,
            confidence="High (Tenure accumulation)",
            action_item="Maintain uninterrupted kiosk operation at the same declared municipal location."
        ))

    # Lever 3: Social Collateral / SHG
    if not signals.chit_shg_active:
        sim_shg = SignalInput(**signals.model_dump())
        sim_shg.chit_shg_active = True
        res_shg = calculate_trust_score(sim_shg)
        paths.append(CounterfactualPath(
            lever_name="Community Mutual Aid Savings (SHG/Chit)",
            current_value="Inactive",
            target_value="Verified Active Contributor",
            projected_score=res_shg.composite_score,
            projected_score_delta=res_shg.composite_score - current_score,
            confidence="Medium-High",
            action_item="Enroll in a registered neighborhood self-help group or registered chit fund."
        ))

    # Lever 4: Rent Timeliness
    if signals.stall_rent_timeliness < 98.0:
        target_rent = 98.0
        sim_rent = SignalInput(**signals.model_dump())
        sim_rent.stall_rent_timeliness = target_rent
        res_rent = calculate_trust_score(sim_rent)
        paths.append(CounterfactualPath(
            lever_name="Stall Rent Payment Promptness",
            current_value=f"{signals.stall_rent_timeliness:.0f}%",
            target_value=f"{target_rent:.0f}%",
            projected_score=res_rent.composite_score,
            projected_score_delta=res_rent.composite_score - current_score,
            confidence="High (Primary willingness factor)",
            action_item="Transfer rent before the 5th of each month to avoid grace period notes."
        ))

    return paths


def calculate_behavioral_consistency_index(
    rent_pct: float,
    supplier_pct: float,
    utility_pct: float,
    tenure_months: int,
    income_volatility: float = 0.08
) -> Dict[str, Any]:
    """Calculate the 4-component Behavioral Consistency Index (0-100)."""
    payment_consistency = min(100, max(0, round(0.55 * rent_pct + 0.45 * supplier_pct)))
    income_stability = min(100, max(0, round((1.0 - min(0.5, income_volatility)) * 100)))
    business_continuity = min(100, max(0, round(min(1.0, tenure_months / 24.0) * 100)))
    recurring_discipline = min(100, max(0, round(0.50 * utility_pct + 0.50 * rent_pct)))

    composite = round(
        0.35 * payment_consistency +
        0.25 * income_stability +
        0.20 * business_continuity +
        0.20 * recurring_discipline
    )

    return {
        "behavioral_consistency_index": composite,
        "payment_consistency": payment_consistency,
        "income_stability": income_stability,
        "business_continuity": business_continuity,
        "recurring_obligation_discipline": recurring_discipline
    }
