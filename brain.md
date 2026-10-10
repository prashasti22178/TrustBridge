# BRAIN.md — Architectural Invariants & Memory State

## 1. Project Invariants
- **Domain Identity:** Alternative credit scoring platform for credit-invisible micro-entrepreneurs (0 CIBIL). NOT a charity, crowdfunding, or donation platform.
- **Scoring Engine Independence:** Scoring logic lives strictly in `server/app/engine.py`. Formula:
  `Trust Score = (0.40 * Ability) + (0.35 * Willingness) + (0.25 * Stability)`
- **LLM Boundary:** Gemini Flash NEVER assigns scores. It only ingests calculated metrics and verified documents to produce explainable plain-English narratives for borrowers and underwriters.
- **Data Integrity:** Separate raw inputs from verified telemetry (`Extraction -> Validation -> Verification -> Signal`).

## 2. Technical Stack Locks
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, shadcn/ui.
- **Backend:** FastAPI (Python 3.11+), Pydantic v2, Pytest.
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) and Storage buckets.
- **AI:** Google GenAI SDK (Gemini 2.5 Flash).

## 3. Benchmark Ground Truth
- **Applicant:** Ravi Kumar (Fruit Stall, Bengaluru).
- **Signals:** 18 months stall tenure, ₹7,500 weekly income, 90% rent timeliness, 95% supplier repayment, regular utility recharges.
- **Target Output:** Score = 78/100, Tier = Medium-High Confidence.