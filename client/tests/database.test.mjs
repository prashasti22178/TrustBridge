import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('database enforces ownership, atomic writes, server scores and staff-only decisions', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users(id uuid PRIMARY KEY);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
      GRANT USAGE ON SCHEMA auth TO anon,authenticated;
      INSERT INTO auth.users VALUES ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222'), ('33333333-3333-3333-3333-333333333333');
    `);
    for (const filename of ['schema.sql', 'migration_v2.sql', 'migration_v3_security_rls.sql', 'migration_v4_integrity.sql']) {
      const source = await readFile(new URL(`../../database/${filename}`, import.meta.url), 'utf8');
      await db.exec(source.replace(/^CREATE EXTENSION[^;]+;/gm, ''));
    }
    await db.exec('GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated,anon');
    async function identity(id = '', role = 'borrower', sqlRole = 'authenticated') {
      await db.exec('RESET ROLE');
      await db.query("SELECT set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claims',$2,false)", [id, JSON.stringify({ app_metadata: { role } })]);
      await db.exec(`SET ROLE ${sqlRole}`);
    }
    const borrower = '11111111-1111-1111-1111-111111111111';
    const staff = '33333333-3333-3333-3333-333333333333';
    const payload = { explicitConsentGiven: true, fullName: 'Test Merchant', businessType: 'Fruit Stall', location: 'Mathura', stallTenureMonths: 18, weeklyIncome: 7500, stallRentTimeliness: 95, supplierRepaymentPct: 90, utilityRechargePct: 85, chitShgActive: true, requestedAmount: 10000, repaymentWeeks: 16, composite_score: 100 };
    await identity(borrower);
    assert.equal((await db.query('SELECT * FROM borrowers')).rows.length, 0, 'seeded null-owner records are private');
    const submitted = (await db.query('SELECT public.submit_trustbridge_application($1::jsonb) AS result', [JSON.stringify(payload)])).rows[0].result;
    assert.equal(submitted.composite_score, 84, 'browser score is ignored and Python rounding is matched');
    assert.equal((await db.query('SELECT * FROM borrowers')).rows.length, 1);
    assert.equal((await db.query('SELECT repayment_weeks FROM loan_applications')).rows[0].repayment_weeks, 16);
    assert.equal((await db.query('SELECT * FROM consents')).rows.length, 1);
    assert.equal((await db.query('SELECT * FROM document_verifications')).rows.length, 0);
    await db.query('UPDATE trust_scores SET composite_score=100');
    assert.equal((await db.query('SELECT composite_score FROM trust_scores')).rows[0].composite_score, 84, 'RLS prevents direct score tampering');
    await assert.rejects(db.query('SELECT public.record_trustbridge_decision($1,$2,$3,$4)', [submitted.application_id, 'APPROVED', 'Spoofed staff decision', 10000]), /Underwriter access/);
    await assert.rejects(db.query('SELECT public.submit_trustbridge_application($1::jsonb)', [JSON.stringify({ ...payload, explicitConsentGiven: false })]), /consent/);
    assert.equal((await db.query('SELECT * FROM borrowers')).rows.length, 1, 'invalid submission creates no partial records');
    await identity('22222222-2222-2222-2222-222222222222');
    for (const table of ['borrowers', 'signals', 'trust_scores', 'loan_applications', 'consents']) {
      assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length, 0, `${table} must not leak across owners`);
    }
    await identity('', 'borrower', 'anon');
    assert.equal((await db.query('SELECT * FROM borrowers')).rows.length, 0);
    await assert.rejects(db.query('SELECT public.submit_trustbridge_application($1::jsonb)', [JSON.stringify(payload)]), /permission denied/);
    await identity(staff, 'underwriter');
    await assert.rejects(db.query('SELECT public.record_trustbridge_decision($1,$2,$3,$4)', [submitted.application_id, 'APPROVED', 'Too much capital', 50000]), /Approved amount/);
    assert.equal((await db.query('SELECT status FROM loan_applications WHERE id=$1', [submitted.application_id])).rows[0].status, 'PENDING_REVIEW');
    await db.query('SELECT public.record_trustbridge_decision($1,$2,$3,$4)', [submitted.application_id, 'APPROVED', 'Manual review completed for test', 9000]);
    assert.equal((await db.query('SELECT status FROM loan_applications WHERE id=$1', [submitted.application_id])).rows[0].status, 'APPROVED');
    const audit = (await db.query('SELECT * FROM underwriter_actions WHERE application_id=$1', [submitted.application_id])).rows;
    assert.equal(audit.length, 1);
    assert.equal(audit[0].underwriter_id, staff);
    // Force the second statement to fail: the earlier UPDATE must roll back too.
    await db.exec('RESET ROLE');
    await db.exec(`CREATE FUNCTION public.reject_test_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test audit failure'; END $$;
      CREATE TRIGGER reject_test_audit BEFORE INSERT ON public.underwriter_actions FOR EACH ROW EXECUTE FUNCTION public.reject_test_audit();`);
    await identity(staff, 'underwriter');
    await assert.rejects(db.query('SELECT public.record_trustbridge_decision($1,$2,$3,$4)', [submitted.application_id, 'PAUSED', 'Test transaction rollback', null]), /test audit failure/);
    assert.equal((await db.query('SELECT status FROM loan_applications WHERE id=$1', [submitted.application_id])).rows[0].status, 'APPROVED');
  } finally { await db.close(); }
});
