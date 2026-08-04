from collections.abc import Generator
from datetime import UTC, datetime, timedelta

import jwt
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import app.models
from app.core.config import settings
from app.core.security import create_access_token, decode_token, hash_password
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.enums import SellerAccountStatus, UserRole
from app.models.refresh_token import RefreshToken
from app.models.seller import SellerProfile
from app.models.store import Store
from app.models.user import User


BUYER_PAYLOAD = {
    "full_name": "Ama Mensah",
    "email": "AMA.BUYER@example.com",
    "phone": "+233240000001",
    "password": "StrongBuyer123!",
    "confirm_password": "StrongBuyer123!",
}

SELLER_PAYLOAD = {
    "full_name": "Kwame Asante",
    "email": "seller@example.com",
    "phone": "+233240000002",
    "password": "StrongSeller123!",
    "confirm_password": "StrongSeller123!",
    "store_name": "Accra Quality Store",
    "store_description": "Quality products from a local seller.",
    "region": "Greater Accra",
    "city": "Accra",
    "address": "Market Street",
}


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


def bearer(access_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {access_token}"}


def register_buyer(client: TestClient) -> dict[str, object]:
    response = client.post("/api/v1/auth/register/buyer", json=BUYER_PAYLOAD)
    assert response.status_code == 201
    return response.json()


def register_seller(client: TestClient) -> dict[str, object]:
    response = client.post("/api/v1/auth/register/seller", json=SELLER_PAYLOAD)
    assert response.status_code == 201
    return response.json()


def create_admin(session_factory: sessionmaker[Session]) -> User:
    with session_factory() as session:
        admin = User(
            full_name="Test Administrator",
            email="admin@test.example",
            password_hash=hash_password("StrongAdmin123!"),
            role=UserRole.ADMIN,
            is_active=True,
            email_verified=True,
        )
        session.add(admin)
        session.commit()
        session.refresh(admin)
        return admin


def test_buyer_registration_hashes_password_and_stores_only_refresh_hash(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    payload = register_buyer(client)

    assert payload["user"]["email"] == "ama.buyer@example.com"
    assert payload["user"]["role"] == "buyer"
    assert payload["token_type"] == "bearer"
    assert payload["access_token_expires_in"] == 1800

    with session_factory() as session:
        user = session.scalar(select(User).where(User.email == "ama.buyer@example.com"))
        stored_token = session.scalar(select(RefreshToken))
        assert user is not None and user.password_hash is not None
        assert user.password_hash.startswith("$argon2")
        assert user.password_hash != BUYER_PAYLOAD["password"]
        assert stored_token is not None
        assert stored_token.token_hash != payload["refresh_token"]
        assert len(stored_token.token_hash) == 64


def test_duplicate_buyer_email_and_password_mismatch_are_rejected(
    client: TestClient,
) -> None:
    register_buyer(client)
    duplicate = client.post("/api/v1/auth/register/buyer", json=BUYER_PAYLOAD)
    mismatch = client.post(
        "/api/v1/auth/register/buyer",
        json={**BUYER_PAYLOAD, "email": "other@example.com", "confirm_password": "Different123!"},
    )

    assert duplicate.status_code == 409
    assert mismatch.status_code == 400


def test_seller_registration_creates_atomic_pending_seller_and_inactive_store(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    payload = register_seller(client)

    assert payload["user"]["role"] == "seller"
    assert payload["seller_profile"]["verification_status"] == "pending"
    assert payload["seller_profile"]["account_status"] == "active"
    assert payload["store"]["slug"] == "accra-quality-store"
    assert payload["store"]["is_active"] is False

    with session_factory() as session:
        assert len(session.scalars(select(User)).all()) == 1
        assert len(session.scalars(select(SellerProfile)).all()) == 1
        assert len(session.scalars(select(Store)).all()) == 1


def test_login_succeeds_and_wrong_password_uses_safe_error(client: TestClient) -> None:
    register_buyer(client)
    success = client.post(
        "/api/v1/auth/login",
        json={"email": "AMA.BUYER@EXAMPLE.COM", "password": "StrongBuyer123!"},
    )
    failure = client.post(
        "/api/v1/auth/login",
        json={"email": "ama.buyer@example.com", "password": "incorrect-password"},
    )
    missing = client.post(
        "/api/v1/auth/login",
        json={"email": "missing@example.com", "password": "incorrect-password"},
    )

    assert success.status_code == 200
    assert success.json()["user"]["role"] == "buyer"
    assert failure.status_code == 401
    assert missing.status_code == 401
    assert failure.json() == missing.json()


def test_current_user_and_buyer_role_permissions(client: TestClient) -> None:
    payload = register_buyer(client)
    headers = bearer(str(payload["access_token"]))

    current = client.get("/api/v1/auth/me", headers=headers)
    buyer = client.get("/api/v1/protected/buyer", headers=headers)
    seller = client.get("/api/v1/protected/seller", headers=headers)
    admin = client.get("/api/v1/protected/admin", headers=headers)

    assert current.status_code == 200
    assert current.json()["email"] == "ama.buyer@example.com"
    assert buyer.status_code == 200
    assert buyer.json() == {"message": "Buyer access granted"}
    assert seller.status_code == 403
    assert admin.status_code == 403


def test_seller_can_access_seller_route_but_not_admin_route(client: TestClient) -> None:
    payload = register_seller(client)
    headers = bearer(str(payload["access_token"]))

    assert client.get("/api/v1/protected/seller", headers=headers).status_code == 200
    assert client.get("/api/v1/protected/admin", headers=headers).status_code == 403
    current = client.get("/api/v1/auth/me", headers=headers)
    assert current.status_code == 200
    assert current.json()["store"]["name"] == "Accra Quality Store"


def test_admin_can_access_only_admin_route(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    admin = create_admin(session_factory)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": admin.email, "password": "StrongAdmin123!"},
    )
    headers = bearer(login.json()["access_token"])

    assert login.status_code == 200
    assert client.get("/api/v1/protected/admin", headers=headers).status_code == 200
    assert client.get("/api/v1/protected/buyer", headers=headers).status_code == 403
    assert client.get("/api/v1/protected/seller", headers=headers).status_code == 403


def test_refresh_rotates_tokens_and_revokes_old_token(client: TestClient) -> None:
    initial = register_buyer(client)
    old_refresh = str(initial["refresh_token"])
    rotated = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh},
    )
    reuse = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh},
    )

    assert rotated.status_code == 200
    assert rotated.json()["refresh_token"] != old_refresh
    assert rotated.json()["access_token"] != initial["access_token"]
    assert reuse.status_code == 401
    assert reuse.json()["detail"] == "Refresh token has been revoked."


def test_logout_is_idempotent_and_revoked_token_cannot_refresh(client: TestClient) -> None:
    initial = register_buyer(client)
    refresh_token = str(initial["refresh_token"])

    first = client.post("/api/v1/auth/logout", json={"refresh_token": refresh_token})
    second = client.post("/api/v1/auth/logout", json={"refresh_token": refresh_token})
    reuse = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})

    assert first.status_code == 200
    assert second.status_code == 200
    assert reuse.status_code == 401


def test_inactive_user_cannot_log_in(
    client: TestClient,
    session_factory: sessionmaker[Session],
) -> None:
    register_buyer(client)
    with session_factory() as session:
        user = session.scalar(select(User).where(User.email == "ama.buyer@example.com"))
        assert user is not None
        user.is_active = False
        session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ama.buyer@example.com", "password": "StrongBuyer123!"},
    )
    assert response.status_code == 403


@pytest.mark.parametrize(
    "account_status",
    [SellerAccountStatus.SUSPENDED, SellerAccountStatus.BANNED],
)
def test_suspended_or_banned_seller_cannot_log_in(
    client: TestClient,
    session_factory: sessionmaker[Session],
    account_status: SellerAccountStatus,
) -> None:
    register_seller(client)
    with session_factory() as session:
        profile = session.scalar(select(SellerProfile))
        assert profile is not None
        profile.account_status = account_status
        session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "seller@example.com", "password": "StrongSeller123!"},
    )
    assert response.status_code == 403


def test_missing_header_and_wrong_token_types_are_rejected(client: TestClient) -> None:
    payload = register_buyer(client)

    missing = client.get("/api/v1/auth/me")
    refresh_as_access = client.get(
        "/api/v1/auth/me",
        headers=bearer(str(payload["refresh_token"])),
    )
    access_as_refresh = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": payload["access_token"]},
    )

    assert missing.status_code == 401
    assert refresh_as_access.status_code == 401
    assert access_as_refresh.status_code == 401


def test_expired_access_token_is_rejected(client: TestClient) -> None:
    payload = register_buyer(client)
    claims = decode_token(str(payload["access_token"]), "access")
    now = datetime.now(UTC)
    expired = jwt.encode(
        {
            "sub": claims.user_id,
            "role": claims.role.value,
            "type": "access",
            "jti": "expired-test-token",
            "iat": now - timedelta(minutes=10),
            "exp": now - timedelta(minutes=5),
        },
        settings.SECRET_KEY.get_secret_value(),
        algorithm=settings.JWT_ALGORITHM,
    )

    response = client.get("/api/v1/auth/me", headers=bearer(expired))
    assert response.status_code == 401
    assert response.json()["detail"] == "Access token has expired."


def test_access_token_creation_preserves_admin_role(
    session_factory: sessionmaker[Session],
) -> None:
    admin = create_admin(session_factory)
    claims = decode_token(create_access_token(admin.id, admin.role).token, "access")
    assert claims.role == UserRole.ADMIN
