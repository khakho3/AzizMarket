from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import (
    ExpiredTokenError,
    InvalidTokenError,
    WrongTokenTypeError,
    decode_token,
)
from app.db.session import get_db
from app.models.enums import SellerAccountStatus, UserRole
from app.models.user import User
from app.repositories.user_repository import UserRepository


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        claims = decode_token(credentials.credentials, "access")
    except ExpiredTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except WrongTokenTypeError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="An access token is required.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user = UserRepository(db).get_by_id(claims.user_id, with_seller=True)
    if user is None or user.role != claims.role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not belong to an existing account.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not belong to an active account.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if current_user.role == UserRole.SELLER and current_user.seller_profile is not None:
        account_status = current_user.seller_profile.account_status
        if account_status in {
            SellerAccountStatus.SUSPENDED,
            SellerAccountStatus.BANNED,
        }:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This seller account is {account_status.value}.",
            )
    return current_user


RoleDependency = Callable[[User], User]


def require_roles(*allowed_roles: UserRole) -> RoleDependency:
    def role_dependency(
        current_user: Annotated[User, Depends(get_current_active_user)],
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )
        return current_user

    return role_dependency


require_buyer = require_roles(UserRole.BUYER)
require_seller = require_roles(UserRole.SELLER)
require_admin = require_roles(UserRole.ADMIN)
