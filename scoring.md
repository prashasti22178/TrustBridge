# TrustBridge scoring policy (implemented prototype)

The canonical deterministic implementation is `server/app/engine.py`.
Weights: Ability 40%, Willingness 35%, Stability 25%.

- Ability = min(100, round((gross weekly turnover / 1000) * 11)).
- Willingness = round(0.50 * rent timeliness + 0.30 * supplier punctuality + 0.20 * utility consistency).
- Stability = min(100, round((business tenure in months / 24) * 100)).
- Composite = round(0.40 * Ability + 0.35 * Willingness + 0.25 * Stability).
- Rounding uses nearest-even, matching Python's `round` for whole-number scores.
- Community savings participation is contextual; it adds no deterministic score points.

Ravi at 18 months, ₹7,500 gross weekly turnover, and 95/90/85 payment percentages has Ability 82, Willingness 92, Stability 75, Composite **84**. Legacy fixtures showing 78 are illustrative, not outputs from those same inputs.

These are prototype policy choices, not empirically validated credit criteria. Gross revenue is not disposable income. The turnover-to-installment ratio excludes business expenses, household expenses, interest and existing debts; it must not be treated as verified repayment capacity. Loan approval remains a human decision.

The separate Random Forest model is trained on synthetic labels. Its output and SHAP values are experimental; neither establishes a real default probability or a validated lending policy. If ML is unavailable, the deterministic score is still returned without invented model results.
