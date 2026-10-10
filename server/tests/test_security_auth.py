"""Automated tests for FinTech Security, Authentication, RBAC, and File Upload Validation."""

import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ------------------------------------------------------------
# 1. SCORING BOUNDARIES & EDGE CASES (Part 20)
# ------------------------------------------------------------

def test_scoring_zero_income():
    """Verify engine handles zero weekly income gracefully without division by zero."""
    payload = {
        "stall_tenure_months": 12,
        "weekly_income": 0.0,
        "stall_rent_timeliness": 80.0,
        "supplier_repayment_pct": 75.0,
        "utility_recharge_pct": 70.0,
        "chit_shg_active": False,
        "requested_loan": 10000.0,
        "repayment_weeks": 12
    }
    response = client.post("/api/v1/score/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["ability_score"] == 0
    assert data["composite_score"] >= 0
    assert data["debt_service_coverage"] == 0.0


def test_scoring_boundary_values():
    """Verify maximum scores, tenure caps, and boundary constraints."""
    # Maximum possible inputs
    max_payload = {
        "stall_tenure_months": 60, # Above 24-month cap
        "weekly_income": 50000.0,
        "stall_rent_timeliness": 100.0,
        "supplier_repayment_pct": 100.0,
        "utility_recharge_pct": 100.0,
        "chit_shg_active": True,
        "requested_loan": 5000.0,
        "repayment_weeks": 12
    }
    response = client.post("/api/v1/score/calculate", json=max_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["composite_score"] <= 100
    assert data["stability_score"] == 100
    assert data["willingness_score"] == 100
    assert data["ability_score"] == 100


def test_scoring_invalid_negative_values():
    """Verify Pydantic validation rejects negative values and out-of-range inputs."""
    invalid_payload = {
        "stall_tenure_months": -5,
        "weekly_income": -100.0,
        "stall_rent_timeliness": 150.0 # > 100%
    }
    response = client.post("/api/v1/score/calculate", json=invalid_payload)
    assert response.status_code == 422 # Unprocessable Entity


# ------------------------------------------------------------
# 2. AUTHENTICATION & RBAC (Part 3, 4, 8)
# ------------------------------------------------------------

def test_auth_me_default_guest():
    """Verify unauthenticated request receives safe evaluation session."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert "user_id" in data
    assert "role" in data


def test_auth_me_demo_borrower_token():
    """Verify demo borrower bearer token resolves to BORROWER role."""
    headers = {"Authorization": "Bearer demo-borrower-token"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "borrower"
    assert data["email"] == "borrower@trustbridge.dev"


def test_auth_me_demo_underwriter_token():
    """Verify demo underwriter bearer token resolves to UNDERWRITER role."""
    headers = {"Authorization": "Bearer demo-underwriter-token"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "underwriter"
    assert "Underwriter" in data["full_name"] or "09" in data["full_name"]


def test_auth_me_demo_admin_token():
    """Verify demo admin bearer token resolves to ADMIN role."""
    headers = {"Authorization": "Bearer demo-admin-token"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "admin"


def test_security_status_endpoint():
    """Verify GET /api/v1/security/status confirms RLS and encryption status."""
    response = client.get("/api/v1/security/status")
    assert response.status_code == 200
    data = response.json()
    assert data["rls_enforced"] is True
    assert data["rbac_active"] is True
    assert "borrower" in data["supported_roles"]
    assert "underwriter" in data["supported_roles"]
    assert "admin" in data["supported_roles"]


# ------------------------------------------------------------
# 3. SECURE FILE UPLOAD SCREENING (Part 9)
# ------------------------------------------------------------

def test_upload_valid_pdf_file():
    """Verify valid PDF document with %PDF magic bytes is accepted."""
    pdf_content = b"%PDF-1.5 fake pdf content for testing invoice"
    files = {"file": ("vendor_invoice.pdf", io.BytesIO(pdf_content), "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["allowed"] is True
    assert data["mime_type"] == "application/pdf"
    assert len(data["sha256_hash"]) == 64
    assert data["document_id"].startswith("DOC-")


def test_upload_valid_png_file():
    """Verify valid PNG image with \x89PNG magic bytes is accepted."""
    png_content = b"\x89PNG\r\n\x1a\nfake png stall photo"
    files = {"file": ("stall_photo.png", io.BytesIO(png_content), "image/png")}
    response = client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["allowed"] is True
    assert data["mime_type"] == "image/png"


def test_upload_rejects_unsupported_extension():
    """Verify script files (.exe, .sh) are rejected."""
    bad_content = b"echo 'malicious script'"
    files = {"file": ("script.sh", io.BytesIO(bad_content), "text/plain")}
    response = client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 400
    assert "Unsupported file extension" in response.json()["detail"]


def test_upload_rejects_spoofed_content():
    """Verify file named .pdf with executable/text content is rejected by magic byte check."""
    fake_pdf = b"This is plain text pretending to be a PDF"
    files = {"file": ("fake_invoice.pdf", io.BytesIO(fake_pdf), "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 400
    assert "Binary signature does not match" in response.json()["detail"]


def test_upload_rejects_oversized_file():
    """Verify files exceeding 5MB are rejected."""
    oversized = b"%PDF-1.4 " + (b"0" * (5 * 1024 * 1024 + 100))
    files = {"file": ("large_doc.pdf", io.BytesIO(oversized), "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 400
    assert "exceeds 5MB limit" in response.json()["detail"]
