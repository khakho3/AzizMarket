from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from hashlib import sha256
from typing import Literal
from uuid import uuid4

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError as JWTInvalidTokenError
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.core.config import settings
from app.models.enums import UserRole


TokenType = Literal["access", "refresh"]
password_hasher = PasswordHash((Argon2Hasher(),))
DUMMY_PASSWORD_HASH = password_hasher.hash("azizmarket-dummy-password")


class AuthenticationTokenError(Exception):
    """Base class for safe JWT validation failures."""


class ExpiredTokenError(AuthenticationTokenError):
    """Raised when a JWT has passed its expiration time."""


class InvalidTokenError(AuthenticationTokenError):
    """Raised when a JWT is malformed or has an invalid signature."""


class WrongTokenTypeError(AuthenticationTokenError):
    """Raised when an access token and refresh token are interchanged."""


@dataclass(frozen=True)
class EncodedToken:
    token: str
    jti: str
    expires_at: datetime


@dataclass(frozen=True)
class TokenClaims:
    user_id: str
    role: UserRole
    token_type: TokenType
    jti: str
    issued_at: datetime
    expires_at: datetime


def utc_now() -> datetime:
    return datetime.now(UTC)


def ensure_utc(value: datetime) -> datetime:
    """Restore UTC information stripped by timezone-naive database drivers."""

    return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password, password_hash)
    except (ValueError, TypeError):
        return False


def _create_token(
    user_id: str,
    role: UserRole,
    token_type: TokenType,
    lifetime: timedelta,
) -> EncodedToken:
    issued_at = utc_now()
    expires_at = issued_at + lifetime
    jti = str(uuid4())
    payload = {
        "sub": user_id,
        "role": role.value,
        "type": token_type,
        "jti": jti,
        "iat": issued_at,
        "exp": expires_at,
    }
    token = jwt.encode(
        payload,
        settings.SECRET_KEY.get_secret_value(),
        algorithm=settings.JWT_ALGORITHM,
    )
    return EncodedToken(token=token, jti=jti, expires_at=expires_at)


def create_access_token(user_id: str, role: UserRole) -> EncodedToken:
    return _create_token(
        user_id,
        role,
        "access",
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(user_id: str, role: UserRole) -> EncodedToken:
    return _create_token(
        user_id,
        role,
        "refresh",
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str, expected_type: TokenType) -> TokenClaims:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY.get_secret_value(),
            algorithms=[settings.JWT_ALGORITHM],
            options={"require": ["sub", "role", "type", "jti", "iat", "exp"]},
        )
    except ExpiredSignatureError as exc:
        raise ExpiredTokenError("Token has expired") from exc
    except JWTInvalidTokenError as exc:
        raise InvalidTokenError("Token is invalid") from exc

    token_type = payload.get("type")
    if token_type != expected_type:
        raise WrongTokenTypeError("Token type is not valid for this operation")

    try:
        user_id = str(payload["sub"])
        role = UserRole(str(payload["role"]))
        jti = str(payload["jti"])
        issued_at = datetime.fromtimestamp(int(payload["iat"]), tz=UTC)
        expires_at = datetime.fromtimestamp(int(payload["exp"]), tz=UTC)
    except (KeyError, TypeError, ValueError, OverflowError) as exc:
        raise InvalidTokenError("Token claims are invalid") from exc

    if not user_id or not jti:
        raise InvalidTokenError("Token claims are invalid")

    return TokenClaims(
        user_id=user_id,
        role=role,
        token_type=expected_type,
        jti=jti,
        issued_at=issued_at,
        expires_at=expires_at,
    )


def hash_refresh_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()
