import os
import tempfile

# Use a throw-away SQLite database for tests (must be set before the app is imported).
_tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp.name}"
os.environ["ENVIRONMENT"] = "development"

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def auth_headers(client):
    creds = {"username": "tester", "email": "tester@example.com", "password": "password123"}
    assert client.post("/api/auth/register", json=creds).status_code == 201
    res = client.post("/api/auth/login", json={"username": "tester", "password": "password123"})
    assert res.status_code == 200
    return {"Authorization": f"Bearer {res.json()['access_token']}"}
