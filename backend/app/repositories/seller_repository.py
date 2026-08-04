from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import Select

from app.models.enums import SellerAccountStatus, SellerVerificationStatus
from app.models.seller import SellerProfile
from app.models.store import Store
from app.models.user import User


class SellerRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    @staticmethod
    def _filtered_statement(
        *,
        search: str | None,
        verification_status: SellerVerificationStatus | None,
        account_status: SellerAccountStatus | None,
    ) -> Select[tuple[SellerProfile]]:
        statement = select(SellerProfile).join(SellerProfile.user).outerjoin(
            SellerProfile.store
        )
        if search:
            pattern = f"%{search.strip()}%"
            statement = statement.where(
                or_(
                    User.full_name.ilike(pattern),
                    User.email.ilike(pattern),
                    User.phone.ilike(pattern),
                    Store.name.ilike(pattern),
                )
            )
        if verification_status is not None:
            statement = statement.where(
                SellerProfile.verification_status == verification_status
            )
        if account_status is not None:
            statement = statement.where(SellerProfile.account_status == account_status)
        return statement

    def get_by_id(self, seller_id: str) -> SellerProfile | None:
        statement = (
            select(SellerProfile)
            .where(SellerProfile.id == seller_id)
            .options(
                joinedload(SellerProfile.user),
                joinedload(SellerProfile.store),
            )
        )
        return self.session.scalar(statement)

    def list_sellers(
        self,
        *,
        search: str | None,
        verification_status: SellerVerificationStatus | None,
        account_status: SellerAccountStatus | None,
        offset: int,
        limit: int,
    ) -> list[SellerProfile]:
        statement = (
            self._filtered_statement(
                search=search,
                verification_status=verification_status,
                account_status=account_status,
            )
            .options(
                joinedload(SellerProfile.user),
                joinedload(SellerProfile.store),
            )
            .order_by(SellerProfile.created_at.desc(), SellerProfile.id)
            .offset(offset)
            .limit(limit)
        )
        return list(self.session.scalars(statement).all())

    def count_sellers(
        self,
        *,
        search: str | None,
        verification_status: SellerVerificationStatus | None,
        account_status: SellerAccountStatus | None,
    ) -> int:
        filtered = self._filtered_statement(
            search=search,
            verification_status=verification_status,
            account_status=account_status,
        ).with_only_columns(SellerProfile.id).order_by(None)
        statement = select(func.count()).select_from(filtered.subquery())
        return int(self.session.scalar(statement) or 0)

    @staticmethod
    def update_verification_status(
        seller: SellerProfile,
        *,
        verification_status: SellerVerificationStatus,
        reason: str | None,
    ) -> None:
        seller.verification_status = verification_status
        seller.verification_reason = reason
