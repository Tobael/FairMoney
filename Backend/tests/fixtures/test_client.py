import pytest


@pytest.fixture
def test_client():
    from src.main import app
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        yield client
