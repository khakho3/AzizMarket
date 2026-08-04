from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.dependencies import require_admin, require_buyer, require_seller
from app.models.user import User
from app.schemas.auth import MessageResponse


router = APIRouter(prefix="/protected", tags=["Protected development routes"])


@router.get(
    "/buyer",
    response_model=MessageResponse,
    summary="Verify buyer access",
)
def buyer_access(
    _user: Annotated[User, Depends(require_buyer)],
) -> MessageResponse:
    return MessageResponse(message="Buyer access granted")


@router.get(
    "/seller",
    response_model=MessageResponse,
    summary="Verify seller access",
)
def seller_access(
    _user: Annotated[User, Depends(require_seller)],
) -> MessageResponse:
    return MessageResponse(message="Seller access granted")


@router.get(
    "/admin",
    response_model=MessageResponse,
    summary="Verify admin access",
)
def admin_access(
    _user: Annotated[User, Depends(require_admin)],
) -> MessageResponse:
    return MessageResponse(message="Admin access granted")
