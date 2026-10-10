-- ============================================================
-- TrustBridge Database Schema (Supabase PostgreSQL)
-- Multi-Tenant Alternative Credit Scoring Platform
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing tables if migrating (safe drop in reverse dependency order)
DROP TABLE IF EXISTS underwriter_actions CASCADE;
DROP TABLE IF EXISTS loan_applications CASCADE;
DROP TABLE IF EXISTS trust_scores CASCADE;
DROP TABLE IF EXISTS signals CASCADE;
DROP TABLE IF EXISTS borrowers CASCADE;

-- ------------------------------------------------------------
-- 1. BORROWERS TABLE
-- ------------------------------------------------------------
CREATE TABLE borrowers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    location TEXT NOT NULL,
    stall_tenure_months INTEGER NOT NULL CHECK (stall_tenure_months >= 0),
    weekly_income NUMERIC(12, 2) NOT NULL CHECK (weekly_income >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for searching borrowers
CREATE INDEX idx_borrowers_full_name ON borrowers(full_name);
CREATE INDEX idx_borrowers_location ON borrowers(location);

-- ------------------------------------------------------------
-- 2. SIGNALS TABLE
-- ------------------------------------------------------------
CREATE TABLE signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    stall_rent_timeliness NUMERIC(5, 2) NOT NULL CHECK (stall_rent_timeliness >= 0 AND stall_rent_timeliness <= 100),
    supplier_repayment_pct NUMERIC(5, 2) NOT NULL CHECK (supplier_repayment_pct >= 0 AND supplier_repayment_pct <= 100),
    utility_recharge_pct NUMERIC(5, 2) NOT NULL CHECK (utility_recharge_pct >= 0 AND utility_recharge_pct <= 100),
    chit_shg_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_signals_borrower_id ON signals(borrower_id);

-- ------------------------------------------------------------
-- 3. TRUST SCORES TABLE (Deterministic 3-Pillar Results)
-- ------------------------------------------------------------
CREATE TABLE trust_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    composite_score INTEGER NOT NULL CHECK (composite_score >= 0 AND composite_score <= 100),
    ability_score INTEGER NOT NULL CHECK (ability_score >= 0 AND ability_score <= 100),
    willingness_score INTEGER NOT NULL CHECK (willingness_score >= 0 AND willingness_score <= 100),
    stability_score INTEGER NOT NULL CHECK (stability_score >= 0 AND stability_score <= 100),
    confidence_tier TEXT NOT NULL CHECK (confidence_tier IN ('High Confidence', 'Medium-High Confidence', 'Review Required')),
    what_helped TEXT[] NOT NULL DEFAULT '{}',
    what_needs_attention TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_trust_scores_borrower_id ON trust_scores(borrower_id);
CREATE INDEX idx_trust_scores_composite ON trust_scores(composite_score);

-- ------------------------------------------------------------
-- 4. LOAN APPLICATIONS TABLE
-- ------------------------------------------------------------
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    requested_amount NUMERIC(12, 2) NOT NULL CHECK (requested_amount > 0),
    status TEXT NOT NULL CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'MORE_INFO_REQUESTED', 'PAUSED')) DEFAULT 'PENDING_REVIEW',
    sanctioned_amount NUMERIC(12, 2) NULL CHECK (sanctioned_amount >= 0),
    underwriter_notes TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_loan_applications_borrower_id ON loan_applications(borrower_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);

-- ------------------------------------------------------------
-- 5. UNDERWRITER ACTIONS (Immutable Audit Trail)
-- ------------------------------------------------------------
CREATE TABLE underwriter_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    decision TEXT NOT NULL CHECK (decision IN ('APPROVED', 'MORE_INFO_REQUESTED', 'PAUSED')),
    notes TEXT NULL,
    underwriter_id TEXT NOT NULL DEFAULT 'UW-BANGALORE-09',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_underwriter_actions_application_id ON underwriter_actions(application_id);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE underwriter_actions ENABLE ROW LEVEL SECURITY;

-- Anonymous public read for prototype / demo showcase
CREATE POLICY "Public read for borrowers" ON borrowers FOR SELECT USING (true);
CREATE POLICY "Public insert for borrowers" ON borrowers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for signals" ON signals FOR SELECT USING (true);
CREATE POLICY "Public insert for signals" ON signals FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for trust_scores" ON trust_scores FOR SELECT USING (true);
CREATE POLICY "Public insert for trust_scores" ON trust_scores FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for loan_applications" ON loan_applications FOR SELECT USING (true);
CREATE POLICY "Public insert for loan_applications" ON loan_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for loan_applications" ON loan_applications FOR UPDATE USING (true);

CREATE POLICY "Public read for underwriter_actions" ON underwriter_actions FOR SELECT USING (true);
CREATE POLICY "Public insert for underwriter_actions" ON underwriter_actions FOR INSERT WITH CHECK (true);

-- ============================================================
-- BENCHMARK SEED DATA: RAVI KUMAR (Fruit Stall, Bengaluru)
-- ============================================================
DO $$
DECLARE
    v_borrower_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    v_app_id UUID := 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
BEGIN
    -- 1. Seed Borrower
    INSERT INTO borrowers (id, full_name, business_type, location, stall_tenure_months, weekly_income)
    VALUES (
        v_borrower_id,
        'Ravi Kumar',
        'Fruit Stall',
        'Malleshwaram, Bengaluru, KA',
        18,
        7500.00
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Seed Signals
    INSERT INTO signals (borrower_id, stall_rent_timeliness, supplier_repayment_pct, utility_recharge_pct, chit_shg_active)
    VALUES (
        v_borrower_id,
        95.00,
        90.00,
        85.00,
        true
    );

    -- 3. Seed Trust Score
    INSERT INTO trust_scores (
        borrower_id,
        composite_score,
        ability_score,
        willingness_score,
        stability_score,
        confidence_tier,
        what_helped,
        what_needs_attention
    )
    VALUES (
        v_borrower_id,
        78,
        82,
        85,
        65,
        'Medium-High Confidence',
        ARRAY[
            '18 months continuous business operation at same stall location.',
            'Strong wholesale supplier credit discipline (90% punctuality).',
            'Exemplary stall rent consistency (95% on-time receipts).',
            'Stable weekly sales (₹7,500) comfortably cover weekly debt service.',
            'Active verified community savings-group (SHG/Chit) participant.'
        ],
        ARRAY[
            'Stall tenure under 24 months benchmark; additional continuity builds prime stability.',
            'Additional digital bank transaction volume would strengthen automated verification.'
        ]
    );

    -- 4. Seed Loan Application
    INSERT INTO loan_applications (id, borrower_id, requested_amount, status, sanctioned_amount, underwriter_notes)
    VALUES (
        v_app_id,
        v_borrower_id,
        10000.00,
        'PENDING_REVIEW',
        NULL,
        'Initial submission received via TrustBridge simulator. Awaiting field agent geo-photo confirmation.'
    ) ON CONFLICT (id) DO NOTHING;

END $$;
