-- ============================================================
-- TrustBridge Database Migration V2: Enterprise Credit Intelligence
-- Research-Backed FinTech Platform Extension
-- ============================================================

-- 1. CONSENTS TABLE (Data Privacy & GDPR/DPDP Compliance)
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    consent_version TEXT NOT NULL DEFAULT 'v2.1',
    data_points_evaluated TEXT[] NOT NULL DEFAULT ARRAY['business_identity', 'income_turnover', 'payment_behavior', 'uploaded_evidence'],
    purpose TEXT NOT NULL DEFAULT 'Alternative creditworthiness assessment for micro-working-capital.',
    ip_address TEXT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    withdrawn_at TIMESTAMPTZ NULL
);
CREATE INDEX IF NOT EXISTS idx_consents_borrower ON consents(borrower_id);

-- 2. BEHAVIORAL EVENTS & TIMELINE (Temporal Financial Discipline)
CREATE TABLE IF NOT EXISTS behavioral_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    period_label TEXT NOT NULL, -- e.g. 'Apr 2026', 'May 2026'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    monthly_income NUMERIC(12, 2) NOT NULL,
    rent_status TEXT NOT NULL CHECK (rent_status IN ('ON_TIME', 'GRACE_PERIOD', 'LATE', 'DEFAULT')),
    supplier_status TEXT NOT NULL CHECK (supplier_status IN ('ON_TIME', 'GRACE_PERIOD', 'LATE', 'DEFAULT')),
    utility_status TEXT NOT NULL CHECK (utility_status IN ('ON_TIME', 'LATE', 'UNPAID')),
    consistency_score INTEGER NOT NULL CHECK (consistency_score >= 0 AND consistency_score <= 100),
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_behavioral_events_borrower ON behavioral_events(borrower_id);

-- 3. RISK ALERTS & EARLY WARNINGS (Portfolio Monitoring)
CREATE TABLE IF NOT EXISTS risk_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    signal_name TEXT NOT NULL,
    change_description TEXT NOT NULL,
    impact_narrative TEXT NOT NULL,
    trajectory TEXT NOT NULL CHECK (trajectory IN ('IMPROVING', 'STABLE', 'DETERIORATING')),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMPTZ NULL
);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_borrower ON risk_alerts(borrower_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_severity ON risk_alerts(severity);

-- 4. DOCUMENT VERIFICATIONS & ANOMALY CHECKS
CREATE TABLE IF NOT EXISTS document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('RENT_RECEIPT', 'SUPPLIER_INVOICE', 'UTILITY_BILL', 'TRANSACTION_LOG', 'BUSINESS_PHOTO')),
    document_name TEXT NOT NULL,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('VERIFIED', 'PENDING', 'REVIEW_REQUIRED')),
    ocr_extracted BOOLEAN NOT NULL DEFAULT true,
    date_consistency_pass BOOLEAN NOT NULL DEFAULT true,
    amount_consistency_pass BOOLEAN NOT NULL DEFAULT true,
    duplicate_check_pass BOOLEAN NOT NULL DEFAULT true,
    business_info_pass BOOLEAN NOT NULL DEFAULT true,
    transaction_consistency_pass BOOLEAN NOT NULL DEFAULT true,
    anomaly_score INTEGER NOT NULL CHECK (anomaly_score >= 0 AND anomaly_score <= 100),
    document_trust_score INTEGER NOT NULL CHECK (document_trust_score >= 0 AND document_trust_score <= 100),
    anomaly_flags TEXT[] NOT NULL DEFAULT '{}',
    verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_document_verifications_borrower ON document_verifications(borrower_id);

-- 5. WHAT-IF SIMULATION RUNS (Non-Destructive Scenario Testing)
CREATE TABLE IF NOT EXISTS simulation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    underwriter_id TEXT NOT NULL DEFAULT 'UW-BANGALORE-09',
    baseline_score INTEGER NOT NULL,
    simulated_score INTEGER NOT NULL,
    score_delta INTEGER NOT NULL,
    modified_parameters JSONB NOT NULL,
    scenario_explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_simulations_borrower ON simulation_runs(borrower_id);

-- 6. FAIRNESS SNAPSHOTS (Audit & Compliance)
CREATE TABLE IF NOT EXISTS fairness_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_period TEXT NOT NULL,
    disparate_impact_ratio NUMERIC(5, 3) NOT NULL,
    approval_rate_difference NUMERIC(5, 3) NOT NULL,
    false_positive_rate_diff NUMERIC(5, 3) NOT NULL,
    false_negative_rate_diff NUMERIC(5, 3) NOT NULL,
    total_evaluations INTEGER NOT NULL,
    notes TEXT NOT NULL DEFAULT 'Synthetic demonstration dataset - real production deployment requires statistically significant validation.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- SEED DATA FOR MULTI-BORROWER ARCHITECTURE (7 DISTINCT APPLICANTS)
-- ============================================================

DO $$
DECLARE
    v_b1 UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; -- Ravi Kumar
    v_b2 UUID := 'b2c3d4e5-f6a7-8901-bcde-f12345678902'; -- Meena Devi
    v_b3 UUID := 'c3d4e5f6-a7b8-9012-cdef-123456789033'; -- Arjun Singh
    v_b4 UUID := 'd4e5f6a7-b8c9-0123-def1-234567890444'; -- Priya Sharma
    v_b5 UUID := 'e5f6a7b8-c9d0-1234-ef12-345678905555'; -- Suresh Patel (Deteriorating)
    v_b6 UUID := 'f6a7b8c9-d0e1-2345-f123-456789066666'; -- Rajesh Verma (Doc Issues)
    v_b7 UUID := 'a7b8c9d0-e1f2-3456-1234-567890777777'; -- Vikram Joshi (High Rev, Low Willingness)
BEGIN
    -- 1. Insert Borrowers
    INSERT INTO borrowers (id, full_name, business_type, location, stall_tenure_months, weekly_income)
    VALUES 
        (v_b2, 'Meena Devi', 'Tailoring & Alterations Kiosk', 'Bapu Bazaar, Jaipur, RJ', 28, 9200.00),
        (v_b3, 'Arjun Singh', 'Mobile Repair Kiosk', 'Budhwar Peth, Pune, MH', 8, 5200.00),
        (v_b4, 'Priya Sharma', 'Chai & Snacks Kiosk', 'Sarafa Bazaar, Indore, MP', 32, 8800.00),
        (v_b5, 'Suresh Patel', 'Kirana General Store', 'Maninagar, Ahmedabad, GJ', 22, 11000.00),
        (v_b6, 'Rajesh Verma', 'Leather Footwear Stall', 'Sadar Bazaar, Agra, UP', 14, 6400.00),
        (v_b7, 'Vikram Joshi', 'Electronics Accessories', 'Abids Market, Hyderabad, TS', 14, 18500.00)
    ON CONFLICT (id) DO NOTHING;

    -- 2. Insert Signals
    INSERT INTO signals (borrower_id, stall_rent_timeliness, supplier_repayment_pct, utility_recharge_pct, chit_shg_active)
    VALUES 
        (v_b2, 98.00, 94.00, 92.00, true),
        (v_b3, 80.00, 75.00, 70.00, false),
        (v_b4, 99.00, 96.00, 94.00, true),
        (v_b5, 78.00, 68.00, 72.00, true),
        (v_b6, 82.00, 78.00, 76.00, false),
        (v_b7, 71.00, 62.00, 65.00, false)
    ON CONFLICT DO NOTHING;

    -- 3. Insert Trust Scores
    INSERT INTO trust_scores (borrower_id, composite_score, ability_score, willingness_score, stability_score, confidence_tier, what_helped, what_needs_attention)
    VALUES 
        (v_b2, 84, 88, 89, 74, 'High Confidence', 
         ARRAY['28 continuous months at Bapu Bazaar kiosk exceeds 24-month stability cap', 'Flawless 98% rent timeliness over 2 years', 'Treasurer of Mahila Vikas SHG'], 
         ARRAY['Slightly higher expansion loan request (₹15,000)']),
        (v_b3, 62, 66, 72, 44, 'Review Required',
         ARRAY['Active high-footfall electronics repair location in Pune', 'Healthy ₹5,200/wk gross revenue services requested ₹8,000 loan'],
         ARRAY['Stall tenure is 8 months (under 12 months benchmark)', 'Missing 3 months handwritten rent receipts']),
        (v_b4, 86, 85, 92, 79, 'High Confidence',
         ARRAY['32 months established tea stall presence', '99% rent promptness and 96% supplier settlements', 'Consistent daily UPI settlement volume'],
         ARRAY['Maintain inventory cash reserves for winter milk cost spikes']),
        (v_b5, 69, 92, 72, 60, 'Review Required',
         ARRAY['High gross turnover of ₹11,000/week across general provisions', 'Established 22-month shop presence'],
         ARRAY['Wholesale supplier repayment dropped to 68% in recent 60 days', 'Late stall rent payment detected in August', 'Income volatility increased']),
        (v_b6, 67, 70, 74, 58, 'Review Required',
         ARRAY['14 months established presence in Sadar Bazaar', 'Positive retail footfall for leather goods'],
         ARRAY['Document date mismatch in sub-lease agreement slip', 'Duplicate supplier invoice #INV-4091 flagged in anomaly screening']),
        (v_b7, 77, 100, 66, 58, 'Medium-High Confidence',
         ARRAY['Exceptional weekly turnover of ₹18,500 comfortably supports debt service', 'Established 14-month store footprint'],
         ARRAY['Vendor settlement punctuality is only 62% despite high cashflow', 'Rent timeliness of 71% reflects cashflow timing indiscipline', 'No verified SHG or community savings membership'])
    ON CONFLICT DO NOTHING;

    -- 4. Insert Loan Applications
    INSERT INTO loan_applications (id, borrower_id, requested_amount, status, sanctioned_amount, underwriter_notes)
    VALUES 
        (gen_random_uuid(), v_b2, 15000.00, 'APPROVED', 15000.00, 'Sanctioned prime working capital loan. Full municipal stamp lease verified.'),
        (gen_random_uuid(), v_b3, 8000.00, 'MORE_INFO_REQUESTED', NULL, 'Awaiting 3 months supplementary landlord rental confirmation slips.'),
        (gen_random_uuid(), v_b4, 12000.00, 'APPROVED', 12000.00, 'Exemplary behavioral consistency. Instant sanction supported.'),
        (gen_random_uuid(), v_b5, 25000.00, 'PAUSED', NULL, 'Paused due to deteriorating supplier repayment trajectory and vendor arrears.'),
        (gen_random_uuid(), v_b6, 15000.00, 'MORE_INFO_REQUESTED', NULL, 'Anomaly screening flagged invoice duplicate; requires physical field officer re-check.'),
        (gen_random_uuid(), v_b7, 30000.00, 'PENDING_REVIEW', NULL, 'High revenue applicant; evaluate structured weekly auto-debit mechanism.')
    ON CONFLICT DO NOTHING;

END $$;
