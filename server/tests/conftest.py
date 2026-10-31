import pytest

@pytest.fixture(autouse=True)
def explicit_test_demo_mode(monkeypatch):
    # Demo tokens are enabled only in tests that deliberately opt in.
    monkeypatch.setenv("ENVIRONMENT", "test")
    monkeypatch.setenv("ENABLE_DEMO_AUTH", "true")
