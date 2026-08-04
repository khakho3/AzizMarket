from __future__ import annotations

import re
import secrets
from dataclasses import dataclass
from hmac import compare_digest

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    DUMMY_PASSWORD_HASH,
    EncodedToken,
    ExpiredTokenError,
    InvalidTokenError,
    TokenClaims,
    WrongTokenTypeError,
    create_access_token,
    create_refresh_token,
    decode_token,
    ensure_utc,
    hash_password,
    hash_refresh_token,
    utc_now,
    verify_password,
)
from app.models.enums import SellerAccountStatus, SellerVerificationStatus, UserRole
from app.models.refresh_token import RefreshToken
from app.models.seller import SellerProfile
from app.models.store import Store
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.store_repository import StoreRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import BuyerRegistrationRequest, LoginRequest, SellerRegistrationRequest


@dataclass(frozen=True)
class AuthenticationResult:
    user: User
    access_token: EncodedToken
    refresh_token: EncodedToken
    seller_profile: SellerProfile | None = None
    store: Store | None = None


class AuthService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.refresh_tokens = RefreshTokenRepository(session)
        self.stores = StoreRepository(session)

    def _validate_password_confirmation(self, password: str, confirmation: str) -> None:
        if password != confirmation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password and confirmation do not match.",
            )

    def _ensure_email_available(self, email: str) -> None:
        if self.users.get_by_email(email) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

    def _create_unique_store_slug(self, store_name: str) -> str:
        base = re.sub(r"[^a-z0-9]+", "-", store_name.casefold()).strip("-")
        base = (base or "store")[:160].rstrip("-")
        if not self.stores.slug_exists(base):
            return base

        while True:
            candidate = f"{base}-{secrets.token_hex(3)}"
            if not self.stores.slug_exists(candidate):
                return candidate

    def _issue_tokens(self, user: User) -> tuple[EncodedToken, EncodedToken]:
        access = create_access_token(user.id, user.role)
        refresh = create_refresh_token(user.id, user.role)
        self.refresh_tokens.add(
            RefreshToken(
                user_id=user.id,
                token_hash=hash_refresh_token(refresh.token),
                jti=refresh.jti,
                expires_at=refresh.expires_at,
            )
        )
        return access, refresh

    def _commit_registration(self) -> None:
        try:
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="The email or store identifier is already in use.",
            ) from exc

    def register_buyer(self, request: BuyerRegistrationRequest) -> AuthenticationResult:
        self._validate_password_confirmation(request.password, request.confirm_password)
        email = str(request.email).lower()
        self._ensure_email_available(email)

        user = User(
            full_name=request.full_name.strip(),
            email=email,
            phone=request.phone.strip() if request.phone else None,
            password_hash=hash_password(request.password),
            role=UserRole.BUYER,
            is_active=True,
            email_verified=False,
        )
        self.users.add(user)
        try:
            self.session.flush()
            access, refresh = self._issue_tokens(user)
            self._commit_registration()
        except Exception:
            self.session.rollback()
            raise
        return AuthenticationResult(user=user, access_token=access, refresh_token=refresh)

    def register_seller(self, request: SellerRegistrationRequest) -> AuthenticationResult:
        self._validate_password_confirmation(request.password, request.confirm_password)
        email = str(request.email).lower()
        self._ensure_email_available(email)
        store_slug = self._create_unique_store_slug(request.store_name)

        user = User(
            full_name=request.full_name.strip(),
            email=email,
            phone=request.phone.strip(),
            password_hash=hash_password(request.password),
            role=UserRole.SELLER,
            is_active=True,
            email_verified=False,
        )
        seller_profile = SellerProfile(
            user=user,
            verification_status=SellerVerificationStatus.PENDING,
            account_status=SellerAccountStatus.ACTIVE,
        )
        store = Store(
            seller=seller_profile,
            name=request.store_name.strip(),
            slug=store_slug,
            description=request.store_description,
            email=email,
            phone=request.phone.strip(),
            region=request.region.strip(),
            city=request.city.strip(),
            address=request.address.strip() if request.address else None,
            is_active=False,
        )
        self.users.add(user)
        try:
            self.session.flush()
            access, refresh = self._issue_tokens(user)
            self._commit_registration()
        except Exception:
            self.session.rollback()
            raise
        return AuthenticationResult(
            user=user,
            access_token=access,
            refresh_token=refresh,
            seller_profile=seller_profile,
            store=store,
        )

    def login(self, request: LoginRequest) -> AuthenticationResult:
        email = str(request.email).lower()
        user = self.users.get_by_email(email, with_seller=True)
        if user is None or user.password_hash is None:
            verify_password(request.password, DUMMY_PASSWORD_HASH)
            raise self._invalid_credentials()
        if not verify_password(request.password, user.password_hash):
            raise self._invalid_credentials()
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account is inactive.",
            )
        self._validate_seller_account(user)

        user.last_login_at = utc_now()
        access, refresh = self._issue_tokens(user)
        self.session.commit()
        return AuthenticationResult(user=user, access_token=access, refresh_token=refresh)

    def rotate_refresh_token(self, raw_token: str) -> AuthenticationResult:
        claims = self._decode_refresh_token(raw_token)
        stored = self.refresh_tokens.get_by_jti_for_update(claims.jti)
        if stored is None or not compare_digest(
            stored.token_hash,
            hash_refresh_token(raw_token),
        ):
            raise self._invalid_refresh_token()
        if stored.revoked_at is not None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked.",
            )
        if ensure_utc(stored.expires_at) <= utc_now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has expired.",
            )

        user = self.users.get_by_id(claims.user_id, with_seller=True)
        self._validate_token_user(user, claims.role)
        assert user is not None
        self._validate_seller_account(user)

        self.refresh_tokens.revoke(stored, utc_now())
        access, refresh = self._issue_tokens(user)
        self.session.commit()
        return AuthenticationResult(user=user, access_token=access, refresh_token=refresh)

    def logout(self, raw_token: str) -> str:
        claims = self._decode_refresh_token(raw_token)
        stored = self.refresh_tokens.get_by_jti_for_update(claims.jti)
        if stored is None or not compare_digest(
            stored.token_hash,
            hash_refresh_token(raw_token),
        ):
            raise self._invalid_refresh_token()
        if stored.revoked_at is not None:
            return "Logout completed."

        user = self.users.get_by_id(claims.user_id)
        self._validate_token_user(user, claims.role)
        self.refresh_tokens.revoke(stored, utc_now())
        self.session.commit()
        return "Logout completed."

    @staticmethod
    def _invalid_credentials() -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    @staticmethod
    def _invalid_refresh_token() -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    @classmethod
    def _decode_refresh_token(cls, raw_token: str) -> TokenClaims:
        try:
            return decode_token(raw_token, "refresh")
        except ExpiredTokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has expired.",
            ) from exc
        except (InvalidTokenError, WrongTokenTypeError) as exc:
            raise cls._invalid_refresh_token() from exc

    @staticmethod
    def _validate_token_user(user: User | None, claimed_role: UserRole) -> None:
        if user is None or not user.is_active or user.role != claimed_role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token does not belong to an active account.",
            )

    @staticmethod
    def _validate_seller_account(user: User) -> None:
        if user.role != UserRole.SELLER or user.seller_profile is None:
            return
        seller_status = user.seller_profile.account_status
        if seller_status == SellerAccountStatus.SUSPENDED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This seller account is suspended.",
            )
        if seller_status == SellerAccountStatus.BANNED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This seller account is banned.",
            )


def access_token_expiry_seconds() -> int:
    return settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
