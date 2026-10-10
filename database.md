# Database & RLS Schema — Supabase PostgreSQL

## Tables:
1. `borrowers`: Profile data, stall location, tenure, business category, `user_id` foreign key.
2. `signals`: Weekly income, rent status, supplier repayment percentage, utility recharge consistency, chit fund status.
3. `trust_scores`: Ability, willingness, stability, composite score (0-100), confidence tier, positive factors, flags.
4. `loan_applications`: Requested amount, status (`PENDING_REVIEW`, `APPROVED`, `MORE_INFO_REQUESTED`, `PAUSED`), sanctioned amount, underwriter notes.
5. `underwriter_actions`: Timestamped immutable audit trail of actions taken by credit underwriters.
6. `user_roles`: Role-Based Access Control mapping `auth.users(id)` to `borrower`, `underwriter`, `admin`.
7. `consents`: Explicit affirmative borrower consent records (`v2.1`), purpose limitation, timestamps, and revocation logs.
8. `behavioral_events`: 6-month temporal timeline telemetry of income, vendor repayments, rent, and utilities.
9. `risk_alerts`: Early warning trajectory alerts with severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
10. `document_verifications`: 6-point document check matrix (OCR, date consistency, amount bounds, duplicate invoice check).
11. `simulation_runs`: What-If risk stress test records with non-destructive guarantees.
12. `fairness_snapshots`: Disparate Impact Ratio (0.94), FPR/FNR parity, and feature governance audit logs.

## Security & Row Level Security (RLS):
- Hardened RLS policies defined in `database/migration_v3_security_rls.sql`.
- **Borrowers:** Restricted to querying/updating rows matching their own `user_id = auth.uid()` or benchmark demo IDs.
- **Underwriters:** Authorized to read the review queue, evaluate dossiers, run simulations, and record decisions into `underwriter_actions`.
- **Admins:** Full access to audit governance, system monitoring, fairness parameters, and role administration.
- **Service Secrets:** Supabase service-role keys and Gemini API secret keys are strictly isolated on the backend server and never sent to the browser.