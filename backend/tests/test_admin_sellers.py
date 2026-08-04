from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import app.models
from app.core.security import create_access_token
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.enums import SellerAccountStatus, SellerVerificationStatus, UserRole
from app.models.seller import SellerProfile
from app.models.store import Store
from app.models.user import User


@pytest.fixture
def session_factory() -> Generator[sessionmaker[Session], None, None]:
    engine = create_engine(
        "sqlite+pysqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)
    try:
        yield factory
    finally:
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture
def client(
    session_factory: sessionmaker[Session],
) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def bearer(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def create_role_user(
    session_factory: sessionmaker[Session],
    *,
    role: UserRole,
    email: str,
) -> tuple[str, str]:
    with session_factory() as session:
        user = User(
            full_name=f"Test {role.value.title()}",
            email=email,
            role=role,
            is_active=True,
            email_verified=True,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return user.id, create_access_token(user.id, user.role).token


def create_seller(
    session_factory: sessionmaker[Session],
    *,
    suffix: str = "one",
    verification_status: SellerVerificationStatus = SellerVerificationStatus.PENDING,
    account_status: SellerAccountStatus = SellerAccountStatus.ACTIVE,
    store_active: bool = False,
) -> tuple[str, str]:
    with session_factory() as session:
        user = User(
            full_name=f"Seller {suffix.title()}",
            email=f"seller-{suffix}@test.example",
            phone=f"02400000{len(suffix):02d}",
            role=UserRole.SELLER,
            is_active=True,
            email_verified=False,
        )
        profile = SellerProfile(
            user=user,
            verification_status=verification_status,
            account_status=account_status,
        )
        store = Store(
            seller=profile,
            name=f"{suffix.title()} Quality Store",
            slug=f"{suffix}-quality-store",
            region="Greater Accra",
            city="Tema",
            is_active=store_active,
        )
        session.add(user)
        session.commit()
        session.refresh(profile)
        return profile.id, create_access_token(user.id, user.role).token


def admin_headers(session_factory: sessionmaker[Session]) -> dict[str, str]:
    _, token = create_role_user(
        session_factory,
        role=UserRole.ADMIN,
        email="admin@test.example",
    )
    return bearer(token)


def test_admin_can_list_sellers(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(session_factory)
    headers = admin_headers(session_factory)
    response = client.get(
        "/api/v1/admin/sellers?search=Quality&verification_status=pending&page=1&page_size=10",
        headers=headers,
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] == 1
    assert payload["total_pages"] == 1
    assert payload["items"][0]["seller_profile_id"] == seller_id
    assert payload["items"][0]["store_name"] == "One Quality Store"
    assert client.get(
        "/api/v1/admin/sellers?page=0", headers=headers
    ).status_code == 422


def test_buyer_cannot_list_sellers(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    _, token = create_role_user(
        session_factory,
        role=UserRole.BUYER,
        email="buyer@test.example",
    )
    response = client.get("/api/v1/admin/sellers", headers=bearer(token))
    assert response.status_code == 403


def test_seller_cannot_list_sellers(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    _, token = create_seller(session_factory)
    response = client.get("/api/v1/admin/sellers", headers=bearer(token))
    assert response.status_code == 403


def test_admin_can_view_seller_details(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(session_factory)
    response = client.get(
        f"/api/v1/admin/sellers/{seller_id}",
        headers=admin_headers(session_factory),
    )
    assert response.status_code == 200
    assert response.json()["user"]["email"] == "seller-one@test.example"
    assert response.json()["store"]["slug"] == "one-quality-store"
    assert "password_hash" not in response.text


def test_missing_seller_returns_404(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    response = client.get(
        "/api/v1/admin/sellers/missing-seller",
        headers=admin_headers(session_factory),
    )
    assert response.status_code == 404


def test_admin_can_verify_a_pending_seller(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(session_factory)
    response = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/verify",
        json={"note": "Seller documents reviewed and approved."},
        headers=admin_headers(session_factory),
    )
    assert response.status_code == 200
    assert response.json()["verification_status"] == "verified"
    assert response.json()["verification_reason"] is None


def test_verifying_activates_the_seller_store(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(session_factory)
    response = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/verify",
        json={},
        headers=admin_headers(session_factory),
    )
    assert response.status_code == 200
    assert response.json()["store"]["is_active"] is True


def test_admin_can_reject_a_pending_seller(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(session_factory)
    reason = "The submitted business information could not be verified."
    response = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/reject",
        json={"reason": f"  {reason}  "},
        headers=admin_headers(session_factory),
    )
    assert response.status_code == 200
    assert response.json()["verification_status"] == "rejected"
    assert response.json()["verification_reason"] == reason


def test_rejecting_requires_a_reason(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(session_factory)
    headers = admin_headers(session_factory)
    assert client.patch(
        f"/api/v1/admin/sellers/{seller_id}/reject", json={}, headers=headers
    ).status_code == 422
    assert client.patch(
        f"/api/v1/admin/sellers/{seller_id}/reject",
        json={"reason": "   "},
        headers=headers,
    ).status_code == 422


def test_rejecting_deactivates_the_store(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(
        session_factory,
        verification_status=SellerVerificationStatus.VERIFIED,
        store_active=True,
    )
    response = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/reject",
        json={"reason": "Verification evidence is no longer acceptable."},
        headers=admin_headers(session_factory),
    )
    assert response.status_code == 200
    assert response.json()["store"]["is_active"] is False


def test_buyer_cannot_verify_a_seller(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(session_factory)
    _, buyer_token = create_role_user(
        session_factory,
        role=UserRole.BUYER,
        email="buyer@test.example",
    )
    response = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/verify",
        json={},
        headers=bearer(buyer_token),
    )
    assert response.status_code == 403


def test_seller_cannot_verify_another_seller(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    _, first_token = create_seller(session_factory, suffix="first")
    second_id, _ = create_seller(session_factory, suffix="second")
    response = client.patch(
        f"/api/v1/admin/sellers/{second_id}/verify",
        json={},
        headers=bearer(first_token),
    )
    assert response.status_code == 403


def test_seller_me_shows_updated_verification_status(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, seller_token = create_seller(session_factory)
    verified = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/verify",
        json={"note": "Identity and business records reviewed."},
        headers=admin_headers(session_factory),
    )
    current = client.get("/api/v1/auth/me", headers=bearer(seller_token))

    assert verified.status_code == 200
    assert current.status_code == 200
    assert current.json()["seller_profile"]["verification_status"] == "verified"
    assert current.json()["seller_profile"]["verification_reason"] is None
    assert current.json()["store"]["is_active"] is True


@pytest.mark.parametrize(
    "account_status",
    [SellerAccountStatus.SUSPENDED, SellerAccountStatus.BANNED],
)
def test_suspended_or_banned_seller_cannot_be_verified(
    client: TestClient,
    session_factory: sessionmaker[Session],
    account_status: SellerAccountStatus,
) -> None:
    seller_id, _ = create_seller(
        session_factory,
        account_status=account_status,
    )
    response = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/verify",
        json={},
        headers=admin_headers(session_factory),
    )
    assert response.status_code == 400


def test_already_verified_seller_is_idempotent(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    seller_id, _ = create_seller(
        session_factory,
        verification_status=SellerVerificationStatus.VERIFIED,
        store_active=True,
    )
    headers = admin_headers(session_factory)
    first = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/verify", json={}, headers=headers
    )
    second = client.patch(
        f"/api/v1/admin/sellers/{seller_id}/verify", json={}, headers=headers
    )
    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json()["store"]["is_active"] is True
