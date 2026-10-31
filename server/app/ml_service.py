"""Machine Learning Credit Risk Inference and Explainability Service.

Loads the Random Forest credit model and SHAP TreeExplainer to predict
Probability of Default (PD) and compute game-theoretic feature attributions.
"""

import os
import logging
from pathlib import Path
from typing import Optional, Dict, Any, List

import numpy as np
import pandas as pd
import joblib

from app.models import SignalInput, ScoreOutput, FeatureAttributionItem, MLDefaultPrediction

logger = logging.getLogger("trustbridge.ml")

# Global in-memory cache for loaded model bundle
_MODEL_BUNDLE: Optional[Dict[str, Any]] = None


def find_model_path() -> Optional[Path]:
    """Locate credit_model.joblib from standard candidates."""
    candidates = [
        Path(__file__).resolve().parent / "credit_model.joblib",
        Path(__file__).resolve().parent.parent / "credit_model.joblib",
        Path.cwd() / "credit_model.joblib",
        Path.cwd() / "server" / "credit_model.joblib",
        Path.cwd() / "server" / "app" / "credit_model.joblib",
    ]
    for p in candidates:
        if p.exists() and p.is_file():
            return p
    return None


def get_model_bundle() -> Dict[str, Any]:
    """Load and cache the trained ML credit risk model and SHAP explainer."""
    global _MODEL_BUNDLE
    if _MODEL_BUNDLE is not None:
        return _MODEL_BUNDLE

    model_path = find_model_path()

    if model_path is None or not model_path.exists():
        raise RuntimeError("ML artifact is unavailable. Run server/train_model.py explicitly.")

    logger.info(f"Loading ML credit risk model from: {model_path}")
    _MODEL_BUNDLE = joblib.load(model_path)
    return _MODEL_BUNDLE


def build_feature_dataframe(signals: SignalInput) -> pd.DataFrame:
    """Transform SignalInput into calibrated model feature DataFrame."""
    repayment_weeks = max(1, signals.repayment_weeks)
    weekly_installment = round(signals.requested_loan / float(repayment_weeks), 2)
    debt_service_coverage = round(
        signals.weekly_income / max(1.0, weekly_installment), 2
    )
    loan_to_income_ratio = round(
        signals.requested_loan / max(1.0, signals.weekly_income), 3
    )

    feature_dict = {
        "stall_tenure_months": float(signals.stall_tenure_months),
        "weekly_income": float(signals.weekly_income),
        "stall_rent_timeliness": float(signals.stall_rent_timeliness),
        "supplier_repayment_pct": float(signals.supplier_repayment_pct),
        "utility_recharge_pct": float(signals.utility_recharge_pct),
        "chit_shg_active": 1 if signals.chit_shg_active else 0,
        "requested_loan": float(signals.requested_loan),
        "repayment_weeks": float(signals.repayment_weeks),
        "weekly_installment": float(weekly_installment),
        "debt_service_coverage": float(debt_service_coverage),
        "loan_to_income_ratio": float(loan_to_income_ratio)
    }

    return pd.DataFrame([feature_dict])


def format_raw_metric(col: str, signals: SignalInput, df: pd.DataFrame) -> str:
    """Format human-friendly raw metrics for SHAP contribution items."""
    if col == "stall_tenure_months":
        return f"{signals.stall_tenure_months} continuous months"
    elif col == "weekly_income":
        return f"₹{signals.weekly_income:,.0f} / week"
    elif col == "stall_rent_timeliness":
        return f"{signals.stall_rent_timeliness:.0f}% on-time receipts"
    elif col == "supplier_repayment_pct":
        return f"{signals.supplier_repayment_pct:.0f}% timely settlements"
    elif col == "utility_recharge_pct":
        return f"{signals.utility_recharge_pct:.0f}% recharge cadence"
    elif col == "chit_shg_active":
        return "Active Contributor" if signals.chit_shg_active else "Non-Participant"
    elif col == "requested_loan":
        return f"₹{signals.requested_loan:,.0f} requested"
    elif col == "repayment_weeks":
        return f"{signals.repayment_weeks} weeks tenure"
    elif col == "weekly_installment":
        installment = df["weekly_installment"].iloc[0]
        return f"₹{installment:,.0f} / week"
    elif col == "debt_service_coverage":
        dscr = df["debt_service_coverage"].iloc[0]
        return f"{dscr:.1f}x cashflow coverage"
    elif col == "loan_to_income_ratio":
        lti = df["loan_to_income_ratio"].iloc[0]
        return f"{lti:.2f}x weekly turnover"
    return str(df[col].iloc[0])


def predict_credit_risk(
    signals: SignalInput, 
    score_output: Optional[ScoreOutput] = None
) -> MLDefaultPrediction:
    """Compute ML predicted probability of default and SHAP feature contributions.

    Args:
        signals: The borrower's alternative credit signals.
        score_output: Optional deterministic pillar calculation result for context.

    Returns:
        MLDefaultPrediction with default probability, risk band, base rate, and SHAP items.
    """
    bundle = get_model_bundle()
    model = bundle["model"]
    explainer = bundle["explainer"]
    feature_metadata = bundle.get("feature_metadata", {})
    base_default_rate = float(bundle.get("base_default_rate", 0.50))
    version = str(bundle.get("version", "1.0.0"))

    # 1. Prepare Feature Vector
    df = build_feature_dataframe(signals)

    # Ensure columns match model's expected order
    feature_names = bundle.get("feature_names", list(df.columns))
    df = df[feature_names]

    # 2. Predict Probability of Default (Class 1 = Default)
    proba = model.predict_proba(df)[0]
    default_prob = float(proba[1])

    # 3. Compute SHAP Values via TreeExplainer
    shap_vals = explainer.shap_values(df)

    # In shap 0.52+, TreeExplainer on binary RandomForestClassifier returns (N, n_features, n_classes)
    if isinstance(shap_vals, np.ndarray) and len(shap_vals.shape) == 3:
        sample_shap = shap_vals[0, :, 1]
    elif isinstance(shap_vals, list) and len(shap_vals) == 2:
        sample_shap = shap_vals[1][0]
    elif isinstance(shap_vals, np.ndarray) and len(shap_vals.shape) == 2:
        sample_shap = shap_vals[0]
    else:
        sample_shap = np.array(shap_vals).flatten()

    # 4. Construct SHAP Feature Attribution Items
    shap_items: List[FeatureAttributionItem] = []
    for col_idx, col_name in enumerate(feature_names):
        shap_delta = float(sample_shap[col_idx])
        meta = feature_metadata.get(col_name, (col_name.replace("_", " ").title(), "General"))
        feature_label, category = meta

        # Convert delta into percentage points impact on default probability
        contrib_pts = round(shap_delta * 100.0, 2)
        raw_metric = format_raw_metric(col_name, signals, df)

        # Direction: POSITIVE increases default risk; NEGATIVE reduces default risk
        direction = "POSITIVE" if contrib_pts >= 0 else "NEGATIVE"

        shap_items.append(FeatureAttributionItem(
            feature=feature_label,
            contribution=contrib_pts,
            direction=direction,
            raw_metric=raw_metric,
            category=category
        ))

    # Sort feature attributions by magnitude of impact (most decisive first)
    shap_items.sort(key=lambda x: abs(x.contribution), reverse=True)

    # 5. Calibrate Risk Band
    if default_prob < 0.05:
        risk_band = "VERY_LOW_RISK"
    elif default_prob < 0.12:
        risk_band = "LOW_RISK"
    elif default_prob < 0.25:
        risk_band = "MODERATE_RISK"
    else:
        risk_band = "HIGH_RISK"

    return MLDefaultPrediction(
        probability_of_default=round(default_prob, 4),
        risk_band=risk_band,
        model_version=f"RandomForest-v{version}",
        base_default_rate=round(base_default_rate, 4),
        shap_contributions=shap_items
    )
