# TrustBridge

An explainable credit assessment **college project prototype** for micro-entrepreneurs without a formal credit history. Borrowers enter business signals; an underwriter reviews the resulting score and supporting evidence. The project does not issue credit or guarantee approval.

## Review verdict

The problem and borrower/underwriter split make this a strong major-project idea. The previous implementation mixed useful deterministic scoring with bypassable authentication, public database policies, invented verification, hardcoded portfolio metrics and silent save failures. This revision addresses those concrete defects. It is still a prototype, not a bank-ready underwriting system.

## What changed

- Missing and invalid API sessions are rejected. Supabase Auth validates real access tokens; decoded unsigned JWTs, `role:admin`, and user-editable role metadata cannot grant staff access.
- New accounts are borrowers. Staff roles come from administrator-controlled `app_metadata.role` in Supabase Auth.
- Demo mode is explicit and isolated from remote database writes. Local development without Supabase supports synthetic demo identities. Demo submissions and decisions last only for the current page session.
- The dashboard calculates totals, median, average, score/risk distributions and review counts from the loaded queue. Empty counts remain zero. Illustrative trend charts are replaced with current application status counts; advanced fixture views are labelled.
- Real queues no longer merge in seed applicants or invent verified documents. Application and loan UUIDs are preserved without prefix truncation or partial text matching.
- Submissions require affirmative consent and use one atomic database RPC. Database scoring ignores browser-supplied score claims. Decisions and their audit entries commit together, with the verified staff identity.
- Failed submissions and decisions show an error; UI status changes only after a confirmed save.
- Document metadata intake no longer claims OCR, duplicate detection, or authenticity. Those checks remain unimplemented.
- ML failure leaves deterministic scoring available. Browser fallbacks no longer invent default probabilities or SHAP attributions. Synthetic model outputs are labelled experimental.
- Offline whole-number rounding matches Python's nearest-even behavior; scoring.md now describes the actual implemented policy.

## Run locally

Use Node.js 24 and Python 3.11 or 3.12. Start two terminals from the project root.

Frontend:

```bash
cd client
npm ci
npm run dev
```

Open http://localhost:5173/login and choose a demo role. Without `client/.env`, local development enables the isolated demo. You can inspect the public simulator without signing in, but persistent submission requires a real authenticated Supabase session.

Backend (optional for the offline demo):

```bash
cd server
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Copy `server/.env.example` to `server/.env`. For local demo API access, set **both** `ENVIRONMENT=development` and `ENABLE_DEMO_AUTH=true`. Production rejects demo tokens even if that flag is true. With demo auth disabled, protected API routes need a valid Supabase access token. Scoring itself remains public.

## Connect a real database

For a **new empty development project**, apply SQL in this order:

1. `database/schema.sql` — this initial setup script DROPS existing core tables. Never rerun it against existing data.
2. `database/migration_v2.sql`
3. `database/migration_v3_security_rls.sql`
4. `database/migration_v4_integrity.sql`

For a project already at v3, apply **v4 only**. It is transactional and preserves records. It replaces legacy permissive RLS policies and introduces two narrow authenticated write RPCs. Null-owner seeded records are visible to staff only; there is no anonymous read/write fallback.

Copy `client/.env.example` to `client/.env`, enter your Supabase project URL and public anon key, and leave `VITE_ENABLE_DEMO=false`. Configure the same project URL and anon key on the backend. Never put a service role key or Gemini key in client variables.

Create a real borrower account and confirm its email. Assign staff access using the Supabase administrative Auth API by setting `app_metadata.role` to `underwriter` or `admin`; the user must refresh their session afterward. The old `user_roles` table is no longer an authorization source. Set `CORS_ALLOWED_ORIGINS` to your actual client origin when hosting elsewhere.

Gemini is optional. Keep `GEMINI_API_KEY` on the server. Review consent and data handling before enabling transmission of borrower details to any external model provider.

## Verification

```bash
cd server
python -m pytest -q
```

```bash
cd client
npm test
npm run test:db
npm run build
npm run lint
```

The database test runs the schema and all migrations in isolated PostgreSQL via PGlite. It verifies ownership isolation, anonymous access denial, nearest-even scoring, consent, staff permissions, exact UUID updates, audit identity and rollback when audit insertion fails. It does not use or modify your Supabase project.

## Remaining work before a real pilot

- Validate scoring policy and model accuracy on consented real outcomes. The Random Forest learns synthetic labels; its metrics do not establish real-world predictive accuracy or fairness.
- Replace remaining research/portfolio/fairness/behavioral fixtures with measured data and historical snapshots. The FastAPI borrower/portfolio endpoints still expose labelled prototype fixtures; the connected frontend queue uses Supabase.
- Wire durable database audit history into the cockpit. The connected decision RPC writes the real audit entry; the current cockpit audit panel combines illustrative entries and current-session actions. FastAPI's separate audit store is in memory.
- Implement document storage, evidence-to-application linking, manual verification, retention/deletion and a real consent-withdrawal workflow. Current upload validation only checks file headers, extension and size; it does not prove authenticity or persist evidence.
- Assess disposable income, expenses, existing debts and loan pricing before treating turnover as repayment capacity. The deterministic score is a prototype policy, not an affordability guarantee.
- Add rate limits, deployment monitoring, account-recovery completion and full browser regression coverage. A browser executable could not be downloaded in this review environment, so interactive/visual QA remains unverified.
- The committed model artifact was produced with scikit-learn 1.9.0. Other versions can warn or fail to load. Retrain with `python train_model.py` in your target environment to generate compatible artifacts; do not treat a successfully loaded old pickle as validation.

No database migration, deployment or GitHub push is performed merely by opening this revised source.
