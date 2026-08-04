from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root_endpoint() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "name": "Seller Marketplace API",
        "status": "running",
        "docs": "/docs",
    }


def test_health_endpoint_does_not_require_database() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "Seller Marketplace API",
        "environment": "development",
    }
