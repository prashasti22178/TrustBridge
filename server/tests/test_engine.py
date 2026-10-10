"""Unit tests for TrustBridge Scoring Engine and Invariants."""

import pytest
from app.models import SignalInput
from app.engine import (
    calculate_ability_score,
    calculate_willingness_score,
    calculate_stability_score,
    calculate_trust_score,
)


def test_ravi_kumar_benchmark():
    """Test 1: Verify Ravi Kumar's benchmark signals calculate to exactly 78 (+/- 1) score.
    
    Ravi Kumar Ground Truth Benchmark:
    - Weekly Turnover: ₹7,500/wk -> Ability: min(100, round((7500/1000)*11)) = 82
    - Stall Tenure: 18 Months -> Stability: min(100, round((18/24)*100)) = 75
    - Willingness: Rent 80%, Supplier 75%, Utility 70% -> Willingness = round(0.5*80 + 0.3*75 + 0.2*70) = 76
    - Composite = round(0.40 * 82 + 0.35 * 76 + 0.25 * 75) = round(32.8 + 26.6 + 18.75) = round(78.15) = 78
    """
    ravi_signals = SignalInput(
        stall_tenure_months=18,
        weekly_income=7500.0,
        stall_rent_timeliness=80.0,
        supplier_repayment_pct=75.0,
        utility_recharge_pct=70.0,
        chit_shg_active=True,
        requested_loan=10000.0,
        repayment_weeks=12
    )

    result = calculate_trust_score(ravi_signals)

    # Assert benchmark score is 78 (+/- 1)
    assert abs(result.composite_score - 78) <= 1, (
        f"Expected composite score to be within 78 +/- 1, got {result.composite_score}"
    )

    # Check Ability is ~82
    assert result.ability_score == 82

    # Check Stability is 75
    assert result.stability_score == 75

    # Check Confidence tier
    assert result.confidence_tier == "Medium-High Confidence"

    # Check that what_helped includes 18 months tenure
    assert any("18 months" in h for h in result.what_helped)


def test_tenure_sensitivity():
    """Test 2: Test tenure sensitivity.
    
    Dropping tenure from 18 to 6 months must drop the stability score significantly
    (from 75 down to 25).
    """
    base_signals_18m = SignalInput(
        stall_tenure_months=18,
        weekly_income=7500.0,
        stall_rent_timeliness=90.0,
        supplier_repayment_pct=85.0,
        utility_recharge_pct=80.0
    )
    result_18m = calculate_trust_score(base_signals_18m)

    base_signals_6m = SignalInput(
        stall_tenure_months=6,
        weekly_income=7500.0,
        stall_rent_timeliness=90.0,
        supplier_repayment_pct=85.0,
        utility_recharge_pct=80.0
    )
    result_6m = calculate_trust_score(base_signals_6m)

    # 18 months stability should be 75, 6 months stability should be 25
    assert result_18m.stability_score == 75
    assert result_6m.stability_score == 25

    # Difference in stability must be 50 points
    stability_drop = result_18m.stability_score - result_6m.stability_score
    assert stability_drop >= 40, f"Expected stability drop of >=40, got {stability_drop}"

    # Composite score must drop accordingly by 0.25 * 50 = 12.5 (~12-13 points)
    composite_drop = result_18m.composite_score - result_6m.composite_score
    assert composite_drop >= 10, f"Expected composite drop of >=10, got {composite_drop}"

    # 6m should warn about low tenure in what_needs_attention
    assert any("under 12 months" in a for a in result_6m.what_needs_attention)


def test_ability_score_boundary_capping():
    """Test 3: Test ability score boundary capping at 100.
    
    Weekly income of ₹25,000 would produce (25000 / 1000) * 11 = 275,
    which MUST be strictly capped at 100.
    Zero weekly income should produce 0.
    """
    # Extremely high revenue (e.g. ₹50,000 / week)
    high_revenue = calculate_ability_score(50000.0)
    assert high_revenue == 100, f"Expected high revenue to be capped at 100, got {high_revenue}"

    # ₹25,000 / week
    upper_bracket = calculate_ability_score(25000.0)
    assert upper_bracket == 100, f"Expected ₹25,000/wk to be capped at 100, got {upper_bracket}"

    # ₹0 / week
    zero_revenue = calculate_ability_score(0.0)
    assert zero_revenue == 0, f"Expected ₹0/wk to yield 0, got {zero_revenue}"


def test_willingness_calculation():
    """Test willingness score weights (0.50*rent + 0.30*supplier + 0.20*utility)."""
    # 100% across all
    perfect = calculate_willingness_score(100.0, 100.0, 100.0)
    assert perfect == 100

    # 0% across all
    zero = calculate_willingness_score(0.0, 0.0, 0.0)
    assert zero == 0

    # 90% rent, 80% supplier, 70% utility -> 45 + 24 + 14 = 83
    score = calculate_willingness_score(90.0, 80.0, 70.0)
    assert score == 83
