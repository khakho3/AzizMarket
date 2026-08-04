from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    BuyerRegistrationRequest,
    LoginRequest,
    LogoutRequest,
    MessageResponse,
    RefreshRequest,
    SellerRegistrationRequest,
    SellerRegistrationResponse,
    TokenResponse,
)
from app.schemas.user import (
    CurrentUserResponse,
    SellerProfileResponse,
    StoreResponse,
    UserResponse,
)
from app.services.auth_service import (
    AuthService,
    AuthenticationResult,
    access_token_expiry_seconds,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])


def token_response(result: AuthenticationResult) -> TokenResponse:
    return TokenResponse(
        user=UserResponse.model_validate(result.user),
        access_token=result.access_token.token,
        refresh_token=result.refresh_token.token,
        access_token_expires_in=access_token_expiry_seconds(),
        access_token_expires_at=result.access_token.expires_at,
    )


@router.post(
    "/register/buyer",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a buyer",
    description="Create an active buyer account and issue an access/refresh token pair.",
)
def register_buyer(
    request: BuyerRegistrationRequest,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    return token_response(AuthService(db).register_buyer(request))


@router.post(
    "/register/seller",
    response_model=SellerRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a seller",
    description="Create a seller user, pending profile, and inactive store atomically.",
)
def register_seller(
    request: SellerRegistrationRequest,
    db: Annotated[Session, Depends(get_db)],
) -> SellerRegistrationResponse:
    result = AuthService(db).register_seller(request)
    assert result.seller_profile is not None
    assert result.store is not None
    base = token_response(result)
    return SellerRegistrationResponse(
        **base.model_dump(),
        seller_profile=SellerProfileResponse.model_validate(result.seller_profile),
        store=StoreResponse.model_validate(result.store),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in",
    description="Verify email credentials and issue a new access/refresh token pair.",
)
def login(
    request: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    return token_response(AuthService(db).login(request))


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Rotate a refresh token",
    description="Revoke the submitted refresh token and issue a completely new pair.",
)
def refresh(
    request: RefreshRequest,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    return token_response(AuthService(db).rotate_refresh_token(request.refresh_token))


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Log out",
    description="Revoke a refresh token. Repeating logout with the same token is safe.",
)
def logout(
    request: LogoutRequest,
    db: Annotated[Session, Depends(get_db)],
) -> MessageResponse:
    return MessageResponse(message=AuthService(db).logout(request.refresh_token))


@router.get(
    "/me",
    response_model=CurrentUserResponse,
    summary="Get the current user",
    description="Return the active user represented by the Bearer access token.",
)
def current_user(
    user: Annotated[User, Depends(get_current_active_user)],
) -> CurrentUserResponse:
    profile = user.seller_profile
    return CurrentUserResponse(
        **UserResponse.model_validate(user).model_dump(),
        seller_profile=(
            SellerProfileResponse.model_validate(profile) if profile is not None else None
        ),
        store=(
            StoreResponse.model_validate(profile.store)
            if profile is not None and profile.store is not None
            else None
        ),
    )
