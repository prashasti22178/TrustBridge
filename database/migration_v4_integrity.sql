-- Apply after v2 and v3. Additive migration; does not delete existing records.
BEGIN;
ALTER TABLE public.loan_applications ADD COLUMN IF NOT EXISTS repayment_weeks integer NOT NULL DEFAULT 12 CHECK (repayment_weeks BETWEEN 4 AND 52);
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS text LANGUAGE sql STABLE SET search_path = '' AS $$
 SELECT CASE WHEN auth.jwt()->'app_metadata'->>'role' IN ('underwriter','admin')
 THEN auth.jwt()->'app_metadata'->>'role' ELSE 'borrower' END;
$$;
-- Permissive policies combine with OR. Drop every old policy before replacing them.
DO $$ DECLARE p record; t text; BEGIN
 FOREACH t IN ARRAY ARRAY['borrowers','signals','trust_scores','loan_applications','underwriter_actions','consents','user_roles','behavioral_events','risk_alerts','document_verifications','simulation_runs','fairness_snapshots'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
   EXECUTE format('DROP POLICY %I ON public.%I',p.policyname,t);
  END LOOP;
 END LOOP;
END $$;
CREATE POLICY borrower_read ON public.borrowers FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.get_current_role() IN ('underwriter','admin'));
CREATE POLICY application_read ON public.loan_applications FOR SELECT TO authenticated USING (borrower_id IN (SELECT id FROM public.borrowers WHERE user_id=auth.uid()) OR public.get_current_role() IN ('underwriter','admin'));
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['signals','trust_scores','consents','behavioral_events','risk_alerts','document_verifications','simulation_runs'] LOOP
  EXECUTE format('CREATE POLICY owner_or_staff_read ON public.%I FOR SELECT TO authenticated USING (borrower_id IN (SELECT id FROM public.borrowers WHERE user_id=auth.uid()) OR public.get_current_role() IN (''underwriter'',''admin''))',t);
 END LOOP;
END $$;
CREATE POLICY staff_audit_read ON public.underwriter_actions FOR SELECT TO authenticated USING (public.get_current_role() IN ('underwriter','admin'));
CREATE POLICY own_role_read ON public.user_roles FOR SELECT TO authenticated USING (user_id=auth.uid());
CREATE POLICY staff_fairness_read ON public.fairness_snapshots FOR SELECT TO authenticated USING (public.get_current_role() IN ('underwriter','admin'));
-- No direct browser writes. Narrow RPCs compute scores and audit identities.
CREATE OR REPLACE FUNCTION public.submit_trustbridge_application(p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 b uuid; a uuid; ability integer; willingness integer; stability integer; composite integer;
 tenure integer := (p_payload->>'stallTenureMonths')::integer;
 income double precision := (p_payload->>'weeklyIncome')::double precision;
 rent double precision := (p_payload->>'stallRentTimeliness')::double precision;
 supplier double precision := (p_payload->>'supplierRepaymentPct')::double precision;
 utility double precision := (p_payload->>'utilityRechargePct')::double precision;
 amount numeric := (p_payload->>'requestedAmount')::numeric;
 weeks integer := (p_payload->>'repaymentWeeks')::integer;
 shg boolean := (p_payload->>'chitShgActive')::boolean;
 tier text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in before submitting an application'; END IF;
 IF (p_payload->>'explicitConsentGiven')::boolean IS DISTINCT FROM true THEN RAISE EXCEPTION 'Explicit consent is required'; END IF;
 IF NOT (coalesce(length(trim(p_payload->>'fullName')) BETWEEN 2 AND 100,false) AND coalesce(length(trim(p_payload->>'businessType')) BETWEEN 2 AND 100,false) AND coalesce(length(trim(p_payload->>'location')) BETWEEN 2 AND 100,false)) THEN RAISE EXCEPTION 'Name, business and location must contain 2 to 100 characters'; END IF;
 IF tenure IS NULL OR income IS NULL OR rent IS NULL OR supplier IS NULL OR utility IS NULL OR amount IS NULL OR weeks IS NULL OR shg IS NULL OR NOT (tenure BETWEEN 1 AND 120 AND income BETWEEN 0 AND 9999999999.99 AND rent BETWEEN 0 AND 100 AND supplier BETWEEN 0 AND 100 AND utility BETWEEN 0 AND 100 AND amount BETWEEN 1000 AND 50000 AND weeks BETWEEN 4 AND 52) THEN RAISE EXCEPTION 'Signals or loan terms are outside the supported range'; END IF;
 -- Float8 round uses nearest-even on supported PostgreSQL, matching Python.
 ability := least(100,greatest(0,round((income/1000.0)*11)));
 willingness := round(0.50*rent+0.30*supplier+0.20*utility);
 stability := least(100,round((tenure/24.0::double precision)*100));
 composite := round(0.40*ability::double precision+0.35*willingness::double precision+0.25*stability::double precision);
 tier := CASE WHEN composite>=80 THEN 'High Confidence' WHEN composite>=70 THEN 'Medium-High Confidence' ELSE 'Review Required' END;
 INSERT INTO public.borrowers(user_id,full_name,business_type,location,stall_tenure_months,weekly_income) VALUES(auth.uid(),trim(p_payload->>'fullName'),trim(p_payload->>'businessType'),trim(p_payload->>'location'),tenure,income) RETURNING id INTO b;
 INSERT INTO public.signals(borrower_id,stall_rent_timeliness,supplier_repayment_pct,utility_recharge_pct,chit_shg_active) VALUES(b,rent,supplier,utility,shg);
 INSERT INTO public.trust_scores(borrower_id,composite_score,ability_score,willingness_score,stability_score,confidence_tier,what_needs_attention) VALUES(b,composite,ability,willingness,stability,tier,ARRAY['Self-reported signals; supporting evidence and affordability require manual review.']);
 INSERT INTO public.loan_applications(borrower_id,requested_amount,repayment_weeks,status) VALUES(b,amount,weeks,'PENDING_REVIEW') RETURNING id INTO a;
 INSERT INTO public.consents(borrower_id,consent_version,data_points_evaluated,purpose) VALUES(b,'v2.1',ARRAY['business_identity','income_turnover','payment_behavior'],'Alternative credit assessment');
 RETURN jsonb_build_object('application_id',a,'borrower_id',b,'composite_score',composite);
END $$;
CREATE OR REPLACE FUNCTION public.record_trustbridge_decision(p_application_id uuid,p_decision text,p_notes text,p_amount numeric DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE target public.loan_applications%ROWTYPE;
BEGIN
 IF auth.uid() IS NULL OR public.get_current_role() NOT IN ('underwriter','admin') THEN RAISE EXCEPTION 'Underwriter access is required'; END IF;
 IF p_decision IS NULL OR p_decision NOT IN ('APPROVED','MORE_INFO_REQUESTED','PAUSED') THEN RAISE EXCEPTION 'Unsupported decision'; END IF;
 IF coalesce(length(trim(p_notes)),0)<3 THEN RAISE EXCEPTION 'Provide a decision reason'; END IF;
 SELECT * INTO target FROM public.loan_applications WHERE id=p_application_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Application was not found'; END IF;
 IF p_decision='APPROVED' AND (p_amount IS NULL OR NOT(p_amount>0 AND p_amount<=target.requested_amount)) THEN RAISE EXCEPTION 'Approved amount must be positive and no greater than the requested amount'; END IF;
 UPDATE public.loan_applications SET status=p_decision,underwriter_notes=p_notes,sanctioned_amount=CASE WHEN p_decision='APPROVED' THEN p_amount ELSE NULL END,updated_at=now() WHERE id=p_application_id;
 INSERT INTO public.underwriter_actions(application_id,decision,notes,underwriter_id) VALUES(p_application_id,p_decision,p_notes,auth.uid()::text);
 RETURN jsonb_build_object('application_id',p_application_id,'status',p_decision);
END $$;
REVOKE ALL ON FUNCTION public.submit_trustbridge_application(jsonb) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.record_trustbridge_decision(uuid,text,text,numeric) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.submit_trustbridge_application(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_trustbridge_decision(uuid,text,text,numeric) TO authenticated;
COMMIT;
