import pytest


def test_login_wrong_password(client, auth_headers):
    res = client.post("/api/auth/login", json={"username": "tester", "password": "nope-nope"})
    assert res.status_code == 401


def test_duplicate_register(client, auth_headers):
    res = client.post(
        "/api/auth/register",
        json={"username": "tester", "email": "other@example.com", "password": "password123"},
    )
    assert res.status_code == 400


def test_protected_routes_need_token(client):
    assert client.get("/api/dashboard").status_code == 401
    assert client.get("/api/predictions").status_code == 401


@pytest.mark.parametrize(
    "path",
    [
        "/api/auth/me",
        "/api/dashboard",
        "/api/diseases",
        "/api/remedies",
        "/api/prevention",
        "/api/farming-guide",
        "/api/crop-management",
        "/api/predictions",
        "/api/chat-history",
    ],
)
def test_endpoints_ok(client, auth_headers, path):
    assert client.get(path, headers=auth_headers).status_code == 200


def test_chat_roundtrip_and_delete(client, auth_headers):
    res = client.post("/api/chat", json={"message": "how to prevent late blight"}, headers=auth_headers)
    assert res.status_code == 200 and "blight" in res.json()["answer"].lower()

    history = client.get("/api/chat-history", headers=auth_headers).json()
    assert len(history) >= 1
    assert history[0]["created_at"].endswith("Z")  # explicit UTC so browsers show local time

    item_id = history[0]["id"]
    assert client.delete(f"/api/chat-history/{item_id}", headers=auth_headers).status_code == 200


def test_predict_rejects_non_image(client, auth_headers):
    res = client.post(
        "/api/predict",
        files={"file": ("x.txt", b"hello", "text/plain")},
        headers=auth_headers,
    )
    assert res.status_code == 400


def test_predict_without_model_is_clear_503(client, auth_headers):
    import io
    from PIL import Image

    buf = io.BytesIO()
    Image.new("RGB", (32, 32), (20, 150, 40)).save(buf, format="JPEG")
    res = client.post(
        "/api/predict",
        files={"file": ("leaf.jpg", buf.getvalue(), "image/jpeg")},
        headers=auth_headers,
    )
    assert res.status_code == 503
    assert "model" in res.json()["detail"].lower()
