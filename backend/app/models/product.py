from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    Enum as SQLEnum,
    ForeignKey,
    Index,
    JSON,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import ProductCondition, ProductStatus, enum_values
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.product_image import ProductImage
    from app.models.product_specification import ProductSpecification
    from app.models.store import Store


class Product(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "products"
    __table_args__ = (
        UniqueConstraint("store_id", "slug", name="uq_products_store_slug"),
        CheckConstraint("price >= 0", name="products_price_non_negative"),
        CheckConstraint(
            "previous_price IS NULL OR previous_price >= 0",
            name="products_previous_price_non_negative",
        ),
        CheckConstraint("stock >= 0", name="products_stock_non_negative"),
        CheckConstraint(
            "low_stock_threshold >= 0",
            name="products_low_stock_threshold_non_negative",
        ),
        CheckConstraint(
            "minimum_order_quantity >= 1",
            name="products_minimum_order_quantity_positive",
        ),
        Index("ix_products_store_id", "store_id"),
        Index("ix_products_category_id", "category_id"),
        Index("ix_products_subcategory_id", "subcategory_id"),
        Index("ix_products_status", "status"),
    )

    store_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("stores.id", ondelete="CASCADE"),
        nullable=False,
    )
    category_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
    )
    subcategory_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=True,
    )
    name: Mapped[str] = mapped_column(String(240), nullable=False)
    slug: Mapped[str] = mapped_column(String(240), nullable=False)
    short_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    previous_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    stock: Mapped[int] = mapped_column(nullable=False, default=0, server_default="0")
    low_stock_threshold: Mapped[int] = mapped_column(nullable=False, default=5, server_default="5")
    minimum_order_quantity: Mapped[int] = mapped_column(nullable=False, default=1, server_default="1")
    condition: Mapped[ProductCondition] = mapped_column(
        SQLEnum(
            ProductCondition,
            name="product_condition",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=enum_values,
        ),
        nullable=False,
        default=ProductCondition.NEW,
        server_default=ProductCondition.NEW.value,
    )
    status: Mapped[ProductStatus] = mapped_column(
        SQLEnum(
            ProductStatus,
            name="product_status",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=enum_values,
        ),
        nullable=False,
        default=ProductStatus.DRAFT,
        server_default=ProductStatus.DRAFT.value,
    )
    location: Mapped[str | None] = mapped_column(String(180), nullable=True)
    payment_types: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    delivery_information: Mapped[dict[str, object] | None] = mapped_column(JSON, nullable=True)

    store: Mapped[Store] = relationship(back_populates="products")
    category: Mapped[Category] = relationship(
        back_populates="products",
        foreign_keys=[category_id],
    )
    subcategory: Mapped[Category | None] = relationship(
        back_populates="subcategory_products",
        foreign_keys=[subcategory_id],
    )
    images: Mapped[list[ProductImage]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="ProductImage.sort_order",
    )
    specifications: Mapped[list[ProductSpecification]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="ProductSpecification.sort_order",
    )
