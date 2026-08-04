from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.product import Product


class ProductSpecification(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "product_specifications"
    __table_args__ = (
        CheckConstraint(
            "sort_order >= 0",
            name="product_specifications_sort_order_non_negative",
        ),
        Index("ix_product_specifications_product_id", "product_id"),
    )

    product_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(nullable=False, default=0, server_default="0")

    product: Mapped[Product] = relationship(back_populates="specifications")
