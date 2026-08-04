from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.enums import SellerAccountStatus, SellerVerificationStatus
from app.models.seller import SellerProfile
from app.models.store import Store
from app.repositories.seller_repository import SellerRepository
from app.schemas.admin_seller import (
    AdminSellerDetail,
    AdminSellerListItem,
    AdminSellerListResponse,
)
from app.schemas.user import StoreResponse, UserResponse


class AdminSellerService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.sellers = SellerRepository(session)

    @staticmethod
    def _list_item(seller: SellerProfile) -> AdminSellerListItem:
        store = seller.store
        return AdminSellerListItem(
            seller_profile_id=seller.id,
            user_id=seller.user_id,
            full_name=seller.user.full_name,
            email=seller.user.email,
            phone=seller.user.phone,
            verification_status=seller.verification_status,
            account_status=seller.account_status,
            verification_reason=seller.verification_reason,
            store_id=store.id if store is not None else None,
            store_name=store.name if store is not None else None,
            store_slug=store.slug if store is not None else None,
            store_is_active=store.is_active if store is not None else None,
            region=store.region if store is not None else None,
            city=store.city if store is not None else None,
            created_at=seller.created_at,
            joined_at=seller.joined_at,
        )

    @staticmethod
    def _detail(seller: SellerProfile) -> AdminSellerDetail:
        return AdminSellerDetail(
            seller_profile_id=seller.id,
            user=UserResponse.model_validate(seller.user),
            store=(
                StoreResponse.model_validate(seller.store)
                if seller.store is not None
                else None
            ),
            verification_status=seller.verification_status,
            account_status=seller.account_status,
            verification_reason=seller.verification_reason,
            created_at=seller.created_at,
            updated_at=seller.updated_at,
            joined_at=seller.joined_at,
        )

    def _get_seller(self, seller_id: str) -> SellerProfile:
        seller = self.sellers.get_by_id(seller_id)
        if seller is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Seller was not found.",
            )
        return seller

    @staticmethod
    def _require_store(seller: SellerProfile) -> Store:
        if seller.store is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Seller does not have a store to update.",
            )
        return seller.store

    def list_sellers(
        self,
        *,
        search: str | None,
        verification_status: SellerVerificationStatus | None,
        account_status: SellerAccountStatus | None,
        page: int,
        page_size: int,
    ) -> AdminSellerListResponse:
        normalized_search = search.strip() if search and search.strip() else None
        total = self.sellers.count_sellers(
            search=normalized_search,
            verification_status=verification_status,
            account_status=account_status,
        )
        sellers = self.sellers.list_sellers(
            search=normalized_search,
            verification_status=verification_status,
            account_status=account_status,
            offset=(page - 1) * page_size,
            limit=page_size,
        )
        return AdminSellerListResponse(
            items=[self._list_item(seller) for seller in sellers],
            page=page,
            page_size=page_size,
            total=total,
            total_pages=(total + page_size - 1) // page_size,
        )

    def seller_detail(self, seller_id: str) -> AdminSellerDetail:
        return self._detail(self._get_seller(seller_id))

    def verify_seller(
        self,
        seller_id: str,
        *,
        note: str | None,
    ) -> AdminSellerDetail:
        seller = self._get_seller(seller_id)
        store = self._require_store(seller)
        if seller.account_status in {
            SellerAccountStatus.SUSPENDED,
            SellerAccountStatus.BANNED,
        }:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Restore the seller account before verification.",
            )

        if (
            seller.verification_status == SellerVerificationStatus.VERIFIED
            and seller.verification_reason is None
            and store.is_active
        ):
            return self._detail(seller)

        try:
            self.sellers.update_verification_status(
                seller,
                verification_status=SellerVerificationStatus.VERIFIED,
                reason=None,
            )
            seller.account_status = SellerAccountStatus.ACTIVE
            store.is_active = True
            self.session.commit()
        except SQLAlchemyError as exc:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to verify the seller at this time.",
            ) from exc

        # Notes are accepted for API compatibility; verification_reason must remain null.
        _ = note
        return self._detail(seller)

    def reject_seller(self, seller_id: str, *, reason: str) -> AdminSellerDetail:
        seller = self._get_seller(seller_id)
        store = self._require_store(seller)
        if seller.account_status == SellerAccountStatus.BANNED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A banned seller cannot be changed through verification review.",
            )

        try:
            self.sellers.update_verification_status(
                seller,
                verification_status=SellerVerificationStatus.REJECTED,
                reason=reason,
            )
            store.is_active = False
            self.session.commit()
        except SQLAlchemyError as exc:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to reject the seller at this time.",
            ) from exc

        return self._detail(seller)
