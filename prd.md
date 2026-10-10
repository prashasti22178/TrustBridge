# Product Requirement Document (PRD) — TrustBridge
**Project:** TrustBridge  
**Tagline:** "No credit history does not mean no trust."  
**Team:** Infinitix  
**Target:** Explainable Alternative Credit Scoring & Micro-Underwriting Platform

---

## 1. Executive Summary
In India, over 40 Crore (400M+) micro-entrepreneurs, street vendors, and gig workers have zero formal credit history and are 100% auto-rejected by traditional banks due to a 0 CIBIL score. Traditional banking equates "No Credit History" with "Bad Credit". TrustBridge analyzes everyday, consent-based behavioral and financial signals across Three Pillars to compute an explainable Trust Score (0–100) paired with a Human-in-the-Loop decision matrix for NBFC lenders.

---

## 2. Core Pillars & Everyday Signals
### The Three Scoring Pillars:
1. **Ability to Repay (40% Weight):** Cashflow coverage ratio (Weekly Net Profit vs Weekly Loan Installment).
2. **Willingness to Repay (35% Weight):** Promptness across stall rent, utility recharges, and supplier debts.
3. **Stability of Activity (25% Weight):** Continuity and physical tenure at the same operational location.

### Six Everyday Signals:
1. **Weekly Business Income:** Stable turnover tracked over 6 months via QR/UPI or daily records.
2. **Stall Rent Payments:** Monthly on-time rent receipts.
3. **Utility & Mobile Recharges:** Predictable, non-delinquent payments.
4. **Supplier Repayment History:** Continuous 6-month repayment discipline with wholesale vendors.
5. **Community Chit / SHG Participation:** Social accountability and financial pooling.
6. **Business Continuity:** Physical permanence (e.g., 18+ months operating at the same spot).

---

## 3. Benchmark Persona (Ravi Kumar)
- **Profile:** Street fruit vendor in Bengaluru.
- **Tenure:** 18 months continuous operation at the same stall.
- **Need:** ₹10,000 working capital loan for seasonal inventory and a digital weighing scale.
- **Bank Outcome:** Auto-rejected (0 CIBIL).
- **TrustBridge Outcome:** 78/100 composite Trust Score (Medium-High Confidence).
- **Explanation:** 
  - *What Helped:* On-time supplier & rent payments; 18 months stable operation.
  - *What Needs Attention:* Slightly lower activity stability; deeper digital transaction history advised.

---

## 4. Human-in-the-Loop Governance
The scoring algorithm never auto-rejects applicants. It equips the lender with three actionable paths:
1. **Offer Starter Loan:** E.g., Sanction ₹10,000 working capital with weekly repayment schedules.
2. **Request More Info:** Ask for 3 additional months of supplier bills or rent slips.
3. **Pause Application:** Temporarily pause until financial telemetry deepens.

---

## 5. Architectural Guardrails
- **Deterministic Math:** The Trust Score must ALWAYS be calculated deterministically in Python/FastAPI. Never use an LLM to predict scores.
- **AI Explanation Layer:** Gemini Flash is used solely to generate plain-language dossiers and explanations grounded in verified facts.
- **Fairness & Privacy Charter:** 100% explicit consent; zero collection of caste, religion, gender, or social media scraping.