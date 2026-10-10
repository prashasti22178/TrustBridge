#!/usr/bin/env python3
"""Train and evaluate Machine Learning Credit Risk Model for TrustBridge.

Model: Random Forest Classifier (scikit-learn) with SHAP TreeExplainer.
Target: Probability of Default (default_90dpd within loan repayment horizon).
Outputs: credit_model.joblib containing the trained model, explainer, feature metadata,
and calibration metrics.
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, Tuple

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    accuracy_score,
    f1_score,
    brier_score_loss,
    classification_report
)
import shap

# Feature definitions and friendly labels
FEATURE_METADATA: Dict[str, Tuple[str, str]] = {
    "stall_tenure_months": ("Stall Operating Longevity", "Stability"),
    "weekly_income": ("Gross Weekly Turnover", "Ability"),
    "stall_rent_timeliness": ("Stall Rent Consistency", "Willingness"),
    "supplier_repayment_pct": ("Wholesale Supplier Repayment", "Willingness"),
    "utility_recharge_pct": ("Utility & Recharge Regularity", "Willingness"),
    "chit_shg_active": ("Community SHG / Chit Mutual Aid", "Social Collateral"),
    "requested_loan": ("Requested Starter Loan Amount", "Leverage"),
    "repayment_weeks": ("Loan Repayment Duration", "Leverage"),
    "weekly_installment": ("Weekly Debt Service Installment", "Ability"),
    "debt_service_coverage": ("Debt-Service Coverage Ratio (DSCR)", "Ability"),
    "loan_to_income_ratio": ("Loan-to-Income Exposure", "Leverage")
}

FEATURE_NAMES = list(FEATURE_METADATA.keys())


def generate_synthetic_credit_dataset(
    n_samples: int = 5000, 
    random_seed: int = 42
) -> Tuple[pd.DataFrame, pd.Series]:
    """Generate realistic synthetic credit portfolio dataset for informal micro-enterprises.

    Calibrated against RBI/IFC microfinance benchmarks, informal mandi supply-chain credit,
    and TrustBridge borrower archetypes.
    """
    rng = np.random.RandomState(random_seed)

    # 1. Primary Behavioral & Cashflow Signals
    # Operating tenure: log-gamma distribution (mostly 6-36 months, up to 60+ months)
    stall_tenure_months = rng.gamma(shape=3.0, scale=6.0, size=n_samples).clip(1, 60).round().astype(int)

    # Weekly income: lognormal distribution (median ~Rs 8,000, min Rs 2,500, max Rs 45,000)
    weekly_income = rng.lognormal(mean=9.0, sigma=0.45, size=n_samples).clip(2500, 45000).round(2)

    # Rental timeliness: skewed toward promptness, with a tail of distressed kiosk tenants
    stall_rent_timeliness = (100.0 - rng.exponential(scale=8.0, size=n_samples)).clip(35.0, 100.0).round(1)

    # Supplier repayment: vital indicator of vendor trust and cashflow management
    supplier_repayment_pct = (100.0 - rng.exponential(scale=10.0, size=n_samples)).clip(30.0, 100.0).round(1)

    # Utility recharge: consistency of phone/electricity commercial recharges
    utility_recharge_pct = (100.0 - rng.exponential(scale=9.0, size=n_samples)).clip(40.0, 100.0).round(1)

    # Active SHG or Chit fund participant (~65% participation rate)
    chit_shg_active = rng.binomial(n=1, p=0.65, size=n_samples)

    # Loan parameters
    loan_options = [5000.0, 8000.0, 10000.0, 12000.0, 15000.0, 20000.0, 25000.0, 30000.0]
    requested_loan = rng.choice(loan_options, size=n_samples)
    repayment_weeks = rng.choice([8, 12, 16, 24], size=n_samples)

    # 2. Derived Financial Ratios
    weekly_installment = (requested_loan / repayment_weeks).round(2)
    debt_service_coverage = (weekly_income / np.maximum(1.0, weekly_installment)).round(2)
    loan_to_income_ratio = (requested_loan / weekly_income).round(3)

    # 3. Ground Truth Latent Default Risk (Logit Formulation)
    # Reflects underwriting empirical realities:
    # - Low supplier discipline (<75%) & rent arrears are the biggest predictors of vendor default.
    # - Inadequate coverage (DSCR < 2.0x) makes loan unserviceable.
    # - New tenure (<12m) elevates business failure risk.
    # - Chit/SHG provides peer mutual support, reducing default risk.
    z = (
        -3.00
        + 0.048 * (100.0 - stall_rent_timeliness)
        + 0.058 * (100.0 - supplier_repayment_pct)
        + 0.022 * (100.0 - utility_recharge_pct)
        - 0.042 * np.minimum(stall_tenure_months, 36)
        - 0.380 * np.minimum(debt_service_coverage, 8.0)
        + 0.650 * loan_to_income_ratio
        - 0.580 * chit_shg_active
        + rng.normal(0, 0.35, size=n_samples)
    )

    # Convert logit to true probability of default
    prob_default = 1.0 / (1.0 + np.exp(-z))
    default_label = rng.binomial(n=1, p=prob_default)

    df = pd.DataFrame({
        "stall_tenure_months": stall_tenure_months,
        "weekly_income": weekly_income,
        "stall_rent_timeliness": stall_rent_timeliness,
        "supplier_repayment_pct": supplier_repayment_pct,
        "utility_recharge_pct": utility_recharge_pct,
        "chit_shg_active": chit_shg_active,
        "requested_loan": requested_loan,
        "repayment_weeks": repayment_weeks,
        "weekly_installment": weekly_installment,
        "debt_service_coverage": debt_service_coverage,
        "loan_to_income_ratio": loan_to_income_ratio
    })

    return df, pd.Series(default_label, name="default_label")


def train_credit_risk_model(
    n_samples: int = 5000, 
    n_estimators: int = 100,
    random_seed: int = 42
) -> Dict[str, Any]:
    """Train Random Forest model and initialize SHAP TreeExplainer."""
    print(f"Generating synthetic credit portfolio dataset ({n_samples} samples)...")
    X, y = generate_synthetic_credit_dataset(n_samples=n_samples, random_seed=random_seed)

    base_rate = float(y.mean())
    print(f"Dataset summary: Default rate = {base_rate:.2%} ({y.sum()} defaults out of {len(y)} loans)")

    # Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=random_seed, stratify=y
    )

    print(f"Training Random Forest Classifier (n_estimators={n_estimators}, max_depth=6)...")
    rf_model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=6,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=random_seed,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)

    # Evaluation on holdout test set
    y_pred_proba = rf_model.predict_proba(X_test)[:, 1]
    y_pred_class = rf_model.predict(X_test)

    roc_auc = float(roc_auc_score(y_test, y_pred_proba))
    pr_auc = float(average_precision_score(y_test, y_pred_proba))
    accuracy = float(accuracy_score(y_test, y_pred_class))
    f1 = float(f1_score(y_test, y_pred_class))
    brier = float(brier_score_loss(y_test, y_pred_proba))

    print("\n" + "=" * 55)
    print("MODEL EVALUATION METRICS (Holdout Test Set)")
    print("=" * 55)
    print(f"  ROC-AUC Score          : {roc_auc:.4f}")
    print(f"  Precision-Recall AUC   : {pr_auc:.4f}")
    print(f"  Classification F1      : {f1:.4f}")
    print(f"  Accuracy               : {accuracy:.4f}")
    print(f"  Brier Score (Loss)     : {brier:.4f}")
    print("=" * 55)

    print("\nFeature Importances:")
    importances = rf_model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    for idx in sorted_idx:
        f_name = FEATURE_NAMES[idx]
        label, cat = FEATURE_METADATA[f_name]
        print(f"  - {label:<35} ({cat:<14}): {importances[idx]:.4f}")

    print("\nInitializing SHAP TreeExplainer...")
    explainer = shap.TreeExplainer(rf_model)
    expected_value = explainer.expected_value
    base_default_rate = float(expected_value[1] if isinstance(expected_value, (list, np.ndarray)) else expected_value)
    print(f"SHAP TreeExplainer initialized. Base default rate E[f(x)] = {base_default_rate:.4f}")

    # Benchmark test on Ravi Kumar profile
    ravi_vector = pd.DataFrame([{
        "stall_tenure_months": 18,
        "weekly_income": 7500.0,
        "stall_rent_timeliness": 95.0,
        "supplier_repayment_pct": 90.0,
        "utility_recharge_pct": 85.0,
        "chit_shg_active": 1,
        "requested_loan": 10000.0,
        "repayment_weeks": 12,
        "weekly_installment": round(10000.0 / 12.0, 2),
        "debt_service_coverage": round(7500.0 / (10000.0 / 12.0), 2),
        "loan_to_income_ratio": round(10000.0 / 7500.0, 3)
    }])
    ravi_proba = float(rf_model.predict_proba(ravi_vector)[0, 1])
    print(f"\nRavi Kumar Benchmark Prediction: Probability of Default = {ravi_proba:.2%}")

    bundle = {
        "model": rf_model,
        "explainer": explainer,
        "feature_names": FEATURE_NAMES,
        "feature_metadata": FEATURE_METADATA,
        "target_name": "default_90dpd",
        "model_type": "RandomForestClassifier",
        "version": "1.0.0",
        "trained_timestamp": datetime.now(timezone.utc).isoformat(),
        "base_default_rate": base_default_rate,
        "metrics": {
            "roc_auc": roc_auc,
            "pr_auc": pr_auc,
            "accuracy": accuracy,
            "f1_score": f1,
            "brier_score": brier,
            "dataset_samples": n_samples,
            "dataset_default_rate": base_rate
        }
    }

    return bundle


def save_model(bundle: Dict[str, Any], output_path: Path) -> Path:
    """Save model bundle using joblib."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, output_path, compress=3)
    print(f"Model successfully saved to: {output_path} ({output_path.stat().st_size / 1024:.1f} KB)")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Train TrustBridge Credit Risk ML Model")
    parser.add_argument("--samples", type=int, default=5000, help="Number of training samples")
    parser.add_argument("--estimators", type=int, default=100, help="Number of trees in Random Forest")
    parser.add_argument("--output", type=str, default=None, help="Output path for credit_model.joblib")
    args = parser.parse_args()

    bundle = train_credit_risk_model(n_samples=args.samples, n_estimators=args.estimators)

    # Determine default paths: save to both server and server/app locations for universal availability
    script_dir = Path(__file__).resolve().parent

    paths_to_save = []
    if args.output:
        paths_to_save.append(Path(args.output))
    else:
        # Default save targets
        paths_to_save.append(script_dir / "credit_model.joblib")
        paths_to_save.append(script_dir / "app" / "credit_model.joblib")

    for p in paths_to_save:
        save_model(bundle, p)

    print("\nTraining and serialization complete.")


if __name__ == "__main__":
    main()
