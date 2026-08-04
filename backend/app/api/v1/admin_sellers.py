from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_admin
from app.db.session import get_db
from app.models.enums import SellerAccountStatus, SellerVerificationStatus
from app.schemas.admin_seller import (
    AdminSellerDetail,
    AdminSellerListResponse,
    RejectSellerRequest,
    VerifySellerRequest,
)
from app.services.admin_seller_service import AdminSellerService


router = APIRouter(
    prefix="/admin/sellers",
    tags=["Admin Sellers"],
    dependencies=[Depends(require_admin)],
)


@router.get(
    "",
    response_model=AdminSellerListResponse,
    summary="List registered sellers",
    description="Search, filter, and paginate seller profiles for administrator review.",
    responses={403: {"description": "Administrator access is required."}},
)
def list_sellers(
    db: Annotated[Session, Depends(get_db)],
    search: Annotated[str | None, Query(max_length=200)] = None,
    verification_status: SellerVerificationStatus | None = None,
    account_status: SellerAccountStatus | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> AdminSellerListResponse:
    return AdminSellerService(db).list_sellers(
        search=search,
        verification_status=verification_status,
        account_status=account_status,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{seller_id}",
    response_model=AdminSellerDetail,
    summary="Get seller details",
    description="Return a seller profile with safe user and store information.",
    responses={
        403: {"description": "Administrator access is required."},
        404: {"description": "Seller was not found."},
    },
)
def seller_detail(
    seller_id: str,
    db: Annotated[Session, Depends(get_db)],
) -> AdminSellerDetail:
    return AdminSellerService(db).seller_detail(seller_id)


@router.patch(
    "/{seller_id}/verify",
    response_model=AdminSellerDetail,
    status_code=status.HTTP_200_OK,
    summary="Verify a seller",
    description="Verify an eligible seller and activate their store atomically.",
    responses={
        400: {"description": "The seller account state prevents verification."},
        403: {"description": "Administrator access is required."},
        404: {"description": "Seller was not found."},
    },
)
def verify_seller(
    seller_id: str,
    request: VerifySellerRequest,
    db: Annotated[Session, Depends(get_db)],
) -> AdminSellerDetail:
    return AdminSellerService(db).verify_seller(seller_id, note=request.note)


@router.patch(
    "/{seller_id}/reject",
    response_model=AdminSellerDetail,
    status_code=status.HTTP_200_OK,
    summary="Reject a seller",
    description="Reject seller verification, retain the account, and deactivate the store.",
    responses={
        400: {"description": "The seller account state prevents rejection."},
        403: {"description": "Administrator access is required."},
        404: {"description": "Seller was not found."},
        422: {"description": "A meaningful rejection reason is required."},
    },
)
def reject_seller(
    seller_id: str,
    request: RejectSellerRequest,
    db: Annotated[Session, Depends(get_db)],
) -> AdminSellerDetail:
    return AdminSellerService(db).reject_seller(seller_id, reason=request.reason)
