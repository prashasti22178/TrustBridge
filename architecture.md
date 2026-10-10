# Architecture Specification — TrustBridge

## 1. High-Level Flow
Borrower App / Underwriter App (React + TypeScript + Tailwind + shadcn/ui)
                     │
                     ▼ (REST API)
          FastAPI Backend (Python)
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
Trust Engine   Evidence Engine   AI Layer (Gemini)
(Deterministic) (OCR/Validation) (Explainable Dossier)
     │               │               │
     └───────────────┼───────────────┘
                     ▼
         PostgreSQL (Supabase)
      (Auth, RLS, Storage, Tables)

## 2. Invariant Rules
- Deterministic Scoring: LLM will NEVER compute the Trust Score (0-100). Math is calculated by Python engine.
- LLM Role: Gemini Flash generates natural language summaries and audits based only on verified facts.
- Human-in-the-Loop: Lenders make final loan sanctions; algorithms propose recommendations.