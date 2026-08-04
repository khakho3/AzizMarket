from enum import Enum


class UserRole(str, Enum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"


class SellerVerificationStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class SellerAccountStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    BANNED = "banned"


class ProductCondition(str, Enum):
    NEW = "new"
    USED = "used"
    REFURBISHED = "refurbished"


class ProductStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    PENDING_CHANGES = "pending_changes"
    ACTIVE = "active"
    INACTIVE = "inactive"
    REJECTED = "rejected"
    SUSPENDED = "suspended"
    OUT_OF_STOCK = "out_of_stock"


def enum_values(enum_class: type[Enum]) -> list[str]:
    """Persist enum values rather than Python member names."""

    return [str(member.value) for member in enum_class]
