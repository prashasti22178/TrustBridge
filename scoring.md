# Trust Engine Scoring Model (v1.0)

## Mathematical Formula
Trust Score = (0.40 * Ability) + (0.35 * Willingness) + (0.25 * Stability)

### 1. Ability to Repay (40%)
- Inputs: Weekly Net Income, Proposed Weekly Installment.
- Formula: min(100, (Weekly Revenue / Loan Installment) * 20)

### 2. Willingness to Repay (35%)
- Inputs: Stall Rent Promptness (50%), Supplier Debt Regularity (30%), Utility Consistency (20%).
- Formula: (0.5 * Rent_Score) + (0.3 * Supplier_Score) + (0.2 * Utility_Score)

### 3. Stability of Activity (25%)
- Inputs: Months at Current Stall Location.
- Formula: min(100, (Stall_Months / 24) * 100)

### Benchmark Test Case (Ravi Kumar):
- Tenure: 18 months -> Stability = 75
- Rent/Supplier: 90% promptness -> Willingness = 85
- Ability: 80
- Composite Score: ~78/100 (Medium-High Confidence)