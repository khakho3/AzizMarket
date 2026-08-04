from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import (
    SellerAccountStatus,
    SellerVerificationStatus,
    enum_values,
)
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.store import Store
    from app.models.user import User


class SellerProfile(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "seller_profiles"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    verification_status: Mapped[SellerVerificationStatus] = mapped_column(
        SQLEnum(
            SellerVerificationStatus,
            name="seller_verification_status",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=enum_values,
        ),
        nullable=False,
        default=SellerVerificationStatus.PENDING,
        server_default=SellerVerificationStatus.PENDING.value,
    )
    account_status: Mapped[SellerAccountStatus] = mapped_column(
        SQLEnum(
            SellerAccountStatus,
            name="seller_account_status",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=enum_values,
        ),
        nullable=False,
        default=SellerAccountStatus.ACTIVE,
        server_default=SellerAccountStatus.ACTIVE.value,
    )
    verification_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    user: Mapped[User] = relationship(back_populates="seller_profile")
    store: Mapped[Store | None] = relationship(
        back_populates="seller",
        cascade="all, delete-orphan",
        single_parent=True,
        uselist=False,
    )
