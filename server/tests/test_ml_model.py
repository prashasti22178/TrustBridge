"""Tests for Machine Learning Credit Risk Model and SHAP Explainability."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import SignalInput
from app.ml_service import predict_credit_risk, get_model_bundle

client = TestClient(app)


def test_ml_model_bundle_loading():
    """Verify credit_model.joblib is loaded with model, explainer, and metadata."""
    bundle = get_model_bundle()
    assert "model" in bundle
    assert "explainer" in bundle
    assert "feature_names" in bundle
    assert "metrics" in bundle
    assert bundle["metrics"]["roc_auc"] > 0.80
    assert len(bundle["feature_names"]) == 11


def test_score_calculate_outputs_ml_probability_and_shap():
    """Verify /api/v1/score/calculate outputs both deterministic scores and ML SHAP results."""
    payload = {
        "stall_tenure_months": 18,
        "weekly_income": 7500.0,
        "stall_rent_timeliness": 80.0,
        "supplier_repayment_pct": 75.0,
        "utility_recharge_pct": 70.0,
        "chit_shg_active": True,
        "requested_loan": 10000.0,
        "repayment_weeks": 12
    }
    response = client.post("/api/v1/score/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    # 1. Deterministic Pillar Outputs
    assert "composite_score" in data
    assert abs(data["composite_score"] - 78) <= 1
    assert data["ability_score"] == 82
    assert data["willingness_score"] == 76
    assert data["stability_score"] == 75

    # 2. ML Probability of Default
    assert "probability_of_default" in data
    assert isinstance(data["probability_of_default"], (float, int))
    assert 0.0 <= data["probability_of_default"] <= 1.0
    assert data["probability_of_default"] < 0.25
    assert data["ml_risk_band"] in ["VERY_LOW_RISK", "LOW_RISK", "MODERATE_RISK", "HIGH_RISK"]

    # 3. SHAP Feature Contributions
    assert "shap_feature_contributions" in data
    shap_items = data["shap_feature_contributions"]
    assert len(shap_items) == 11

    # Check structure of SHAP attribution items
    for item in shap_items:
        assert "feature" in item
        assert "contribution" in item
        assert isinstance(item["contribution"], (float, int))
        assert item["direction"] in ["POSITIVE", "NEGATIVE"]
        assert "raw_metric" in item
        assert "category" in item
        assert item["category"] in ["Ability", "Willingness", "Stability", "Social Collateral", "Leverage"]

    # 4. Detailed ML Model Object
    assert "ml_model_details" in data
    details = data["ml_model_details"]
    assert details["model_version"].startswith("RandomForest")
    assert "base_default_rate" in details
    assert len(details["shap_contributions"]) == 11


def test_ml_prediction_risk_differentiation():
    """Verify model differentiates between a prime borrower and a distressed borrower."""
    # Prime borrower: high tenure, high income, flawless payment discipline
    prime_signals = SignalInput(
        stall_tenure_months=36,
        weekly_income=12000.0,
        stall_rent_timeliness=99.0,
        supplier_repayment_pct=98.0,
        utility_recharge_pct=95.0,
        chit_shg_active=True,
        requested_loan=8000.0,
        repayment_weeks=16
    )

    # Distressed borrower: low tenure, poor payment discipline, high loan request
    distressed_signals = SignalInput(
        stall_tenure_months=4,
        weekly_income=4000.0,
        stall_rent_timeliness=55.0,
        supplier_repayment_pct=45.0,
        utility_recharge_pct=50.0,
        chit_shg_active=False,
        requested_loan=35000.0,
        repayment_weeks=8
    )

    prime_pred = predict_credit_risk(prime_signals)
    distressed_pred = predict_credit_risk(distressed_signals)

    # Prime borrower must have significantly lower default probability than distressed borrower
    assert prime_pred.probability_of_default < 0.10
    assert prime_pred.risk_band in ["VERY_LOW_RISK", "LOW_RISK"]

    assert distressed_pred.probability_of_default > 0.60
    assert distressed_pred.risk_band == "HIGH_RISK"

    assert prime_pred.probability_of_default < distressed_pred.probability_of_default


def test_shap_additivity_property():
    """Verify SHAP local accuracy: sum of contributions + base value matches predicted probability."""
    signals = SignalInput(
        stall_tenure_months=18,
        weekly_income=7500.0,
        stall_rent_timeliness=95.0,
        supplier_repayment_pct=90.0,
        utility_recharge_pct=85.0,
        chit_shg_active=True,
        requested_loan=10000.0,
        repayment_weeks=12
    )

    pred = predict_credit_risk(signals)
    # Contributions are stored in percentage points (scaled by 100)
    sum_contributions = sum(item.contribution for item in pred.shap_contributions) / 100.0
    reconstructed_prob = pred.base_default_rate + sum_contributions

    # Should match predicted probability within small rounding tolerance
    assert abs(reconstructed_prob - pred.probability_of_default) < 0.02
