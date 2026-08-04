from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import (
    SellerAccountStatus,
    SellerVerificationStatus,
    UserRole,
)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    email: EmailStr
    phone: str | None
    role: UserRole
    is_active: bool
    email_verified: bool
    created_at: datetime


class SellerProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    verification_status: SellerVerificationStatus
    account_status: SellerAccountStatus
    verification_reason: str | None
    joined_at: datetime


class StoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    description: str | None
    email: EmailStr | None
    phone: str | None
    region: str | None
    city: str | None
    address: str | None
    is_active: bool


class CurrentUserResponse(UserResponse):
    seller_profile: SellerProfileResponse | None = None
    store: StoreResponse | None = None
