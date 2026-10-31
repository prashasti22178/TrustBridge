"""Regression tests for the authentication bypasses and optional ML isolation."""
import base64
import json
import httpx
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app import main

client = TestClient(app)

@pytest.mark.parametrize('path', ['/api/v1/auth/me', '/api/v1/borrowers', '/api/v1/borrowers/TB-2026-0142', '/api/v1/portfolio', '/api/v1/audit'])
def test_guests_cannot_read_staff_data(path):
    assert client.get(path).status_code == 401

@pytest.mark.parametrize('token', ['role:admin', 'role:underwriter', 'arbitrary-token'])
def test_arbitrary_tokens_do_not_become_staff(token, monkeypatch):
    monkeypatch.delenv('SUPABASE_URL', raising=False)
    monkeypatch.delenv('SUPABASE_ANON_KEY', raising=False)
    response = client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code in {401, 503}

@pytest.mark.parametrize('environment,enabled', [('production', 'true'), ('development', 'false')])
def test_demo_tokens_rejected_outside_explicit_local_demo(environment, enabled, monkeypatch):
    monkeypatch.setenv('ENVIRONMENT', environment)
    monkeypatch.setenv('ENABLE_DEMO_AUTH', enabled)
    assert client.get('/api/v1/borrowers', headers={'Authorization': 'Bearer demo-admin-token'}).status_code == 401

def mock_auth(monkeypatch, payload, status=200):
    original = httpx.AsyncClient
    monkeypatch.setenv('SUPABASE_URL', 'https://example.supabase.co')
    monkeypatch.setenv('SUPABASE_ANON_KEY', 'test-public-key')
    def handle(request):
        assert request.url.path == '/auth/v1/user'
        assert request.headers['apikey'] == 'test-public-key'
        assert request.headers['Authorization'].startswith('Bearer ')
        return httpx.Response(status, json=payload)
    monkeypatch.setattr(httpx, 'AsyncClient', lambda **kw: original(transport=httpx.MockTransport(handle), **kw))

def test_unsigned_admin_jwt_is_rejected_by_auth_provider(monkeypatch):
    mock_auth(monkeypatch, {'error': 'invalid JWT'}, 401)
    payload = base64.urlsafe_b64encode(json.dumps({'sub': 'attacker', 'app_metadata': {'role': 'admin'}}).encode()).decode().rstrip('=')
    assert client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer fake.{payload}.fake'}).status_code == 401

def test_user_editable_metadata_cannot_grant_staff_access(monkeypatch):
    mock_auth(monkeypatch, {'id': 'real-user', 'email': 'a@example.test', 'user_metadata': {'role': 'admin'}})
    headers = {'Authorization': 'Bearer provider-validated-token'}
    assert client.get('/api/v1/auth/me', headers=headers).json()['role'] == 'borrower'
    assert client.get('/api/v1/borrowers', headers=headers).status_code == 403

def test_administrator_metadata_grants_staff_access(monkeypatch):
    mock_auth(monkeypatch, {'id': 'staff-user', 'email': 'staff@example.test', 'app_metadata': {'role': 'underwriter'}})
    assert client.get('/api/v1/borrowers', headers={'Authorization': 'Bearer provider-validated-token'}).status_code == 200

def test_borrower_cannot_read_other_borrowers_or_write_audit():
    headers = {'Authorization': 'Bearer demo-borrower-token'}
    assert client.get('/api/v1/borrowers', headers=headers).status_code == 403
    assert client.post('/api/v1/audit', headers=headers, json={}).status_code == 403

def test_missing_ml_does_not_break_deterministic_score(monkeypatch):
    def unavailable(*args):
        raise RuntimeError('Model artifact not available')
    monkeypatch.setattr(main, 'predict_credit_risk', unavailable)
    response = client.post('/api/v1/score/calculate', json={'weekly_income': 7500})
    assert response.status_code == 200
    score = response.json()
    assert score['ability_score'] == 82
    assert score['composite_score'] == 84
    assert score['probability_of_default'] is None
    assert score['shap_feature_contributions'] == []

def test_audit_identity_is_taken_from_verified_session():
    headers = {'Authorization': 'Bearer demo-underwriter-token'}
    response = client.post('/api/v1/audit', headers=headers, json={
        'applicant_id': 'TB-TEST', 'applicant_name': 'Example', 'action': 'Review',
        'reason': 'Regression test', 'underwriter_id': 'spoofed-admin'
    })
    assert response.status_code == 201
    assert response.json()['underwriter_id'] == 'usr-underwriter-09'
