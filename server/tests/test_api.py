"""API integration tests for FastAPI scoring, Gemini explainability, and enterprise endpoints."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app, headers={"Authorization": "Bearer demo-underwriter-token"})


def test_health_check_endpoint():
    """Verify GET /health returns 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "trustbridge-scoring-engine"
    assert data["version"] == "2.0.0"


def test_calculate_score_api():
    """Verify POST /api/v1/score/calculate returns valid deterministic scoring payload."""
    payload = {
        "stall_tenure_months": 18,
        "weekly_income": 7500.0,
        "stall_rent_timeliness": 80.0,
        "supplier_repayment_pct": 75.0,
        "utility_recharge_pct": 70.0,
        "chit_shg_active": True,
        "requested_loan": 10000.0,
        "repayment_weeks": 12
    }
    response = client.post("/api/v1/score/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "composite_score" in data
    assert abs(data["composite_score"] - 78) <= 1
    assert data["ability_score"] == 82
    assert data["willingness_score"] == 76
    assert data["stability_score"] == 75
    assert len(data["what_helped"]) > 0


def test_explain_underwriting_api():
    """Verify POST /api/v1/explain returns structured explainability dossier."""
    applicant_payload = {
        "name": "Ravi Kumar",
        "business_type": "Fruit Stall",
        "location": "Bengaluru, KA",
        "stall_tenure_months": 18,
        "weekly_income": 7500.0,
        "requested_amount": 10000.0,
        "repayment_weeks": 12,
        "trust_score": 78,
        "pillars": {
            "ability": 82,
            "willingness": 85,
            "stability": 65
        }
    }
    response = client.post("/api/v1/explain", json=applicant_payload)
    assert response.status_code == 200
    data = response.json()

    assert "summary" in data
    assert "strengths" in data
    assert "risk_factors" in data
    assert "underwriting_recommendation" in data
    assert isinstance(data["strengths"], list)
    assert isinstance(data["risk_factors"], list)
    assert len(data["strengths"]) > 0


def test_get_borrowers_api():
    """Verify multi-borrower list endpoint returns all synthetic profiles."""
    response = client.get("/api/v1/borrowers")
    assert response.status_code == 200
    data = response.json()
    assert "borrowers" in data
    assert data["count"] >= 7
    names = [b["name"] for b in data["borrowers"]]
    assert "Ravi Kumar" in names
    assert "Meena Devi" in names
    assert "Arjun Singh" in names
    assert "Priya Sharma" in names
    assert "Suresh Patel" in names
    assert "Rajesh Verma" in names
    assert "Vikram Joshi" in names


def test_get_borrower_detail_api():
    """Verify single borrower deep dossier with attributions and counterfactuals."""
    response = client.get("/api/v1/borrowers/TB-2026-0142")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Ravi Kumar"
    assert "feature_attributions" in data
    assert "counterfactual_paths" in data
    assert len(data["feature_attributions"]) > 0


def test_what_if_simulation_api():
    """Verify non-destructive What-If simulation calculates score delta and narrative."""
    payload = {
        "baseline_signals": {
            "stall_tenure_months": 18,
            "weekly_income": 7500.0,
            "stall_rent_timeliness": 95.0,
            "supplier_repayment_pct": 90.0,
            "utility_recharge_pct": 85.0,
            "chit_shg_active": True,
            "requested_loan": 10000.0,
            "repayment_weeks": 12
        },
        "income_delta_pct": -30.0
    }
    response = client.post("/api/v1/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["baseline_score"] >= 78
    assert data["simulated_score"] < data["baseline_score"]
    assert data["score_delta"] < 0
    assert "scenario_explanation" in data
    assert data["is_simulated_data"] is True


def test_portfolio_analytics_api():
    """Verify portfolio KPI endpoint returns management metrics."""
    response = client.get("/api/v1/portfolio")
    assert response.status_code == 200
    data = response.json()
    assert data["total_active_applications"] == 1284
    assert data["average_trust_score"] == 71.4
    assert "portfolio_risk_distribution" in data


def test_fairness_api():
    """Verify Fairness Lab endpoint returns Disparate Impact and feature governance."""
    response = client.get("/api/v1/fairness")
    assert response.status_code == 200
    data = response.json()
    assert data["disparate_impact_ratio"] == 0.94
    assert len(data["allowed_features"]) > 0
    assert len(data["monitored_proxies"]) > 0


def test_audit_trail_api():
    """Verify audit log retrieval and event recording."""
    get_res = client.get("/api/v1/audit")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["count"] >= 3

    # Test recording new action
    new_event = {
        "applicant_id": "TB-2026-0142",
        "applicant_name": "Ravi Kumar",
        "action": "Sanctioned ₹10,000 Working Capital Loan",
        "previous_state": "PENDING_REVIEW",
        "new_state": "APPROVED",
        "reason": "Test underwriter sanction decision.",
        "amount": 10000.0
    }
    post_res = client.post("/api/v1/audit", json=new_event)
    assert post_res.status_code == 201
    created = post_res.json()
    assert created["action"] == new_event["action"]


def test_document_anomaly_check_api():
    """Metadata alone must not claim OCR, duplicate detection or authenticity."""
    payload = {
        "document_name": "APMC Vendor Slip",
        "document_type": "SUPPLIER_INVOICE",
        "invoice_number": "INV-4091",
        "amount": 12000.0
    }
    response = client.post("/api/v1/documents/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["duplicate_check_pass"] is None
    assert data["verification_status"] == "PENDING"
    assert data["ocr_extracted"] is False
    assert data["document_trust_score"] is None
    assert data["anomaly_flags"] == []


def test_research_matrix_api():
    """Verify research evidence matrix returns academic citations and mappings."""
    response = client.get("/api/v1/research")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 6
    assert any("SHAP" in item["paper_title"] for item in data["evidence_matrix"])
