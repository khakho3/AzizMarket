from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import SellerAccountStatus, SellerVerificationStatus
from app.schemas.user import StoreResponse, UserResponse


class AdminSellerListItem(BaseModel):
    seller_profile_id: str
    user_id: str
    full_name: str
    email: str
    phone: str | None
    verification_status: SellerVerificationStatus
    account_status: SellerAccountStatus
    verification_reason: str | None
    store_id: str | None
    store_name: str | None
    store_slug: str | None
    store_is_active: bool | None
    region: str | None
    city: str | None
    created_at: datetime
    joined_at: datetime


class AdminSellerDetail(BaseModel):
    seller_profile_id: str
    user: UserResponse
    store: StoreResponse | None
    verification_status: SellerVerificationStatus
    account_status: SellerAccountStatus
    verification_reason: str | None
    created_at: datetime
    updated_at: datetime
    joined_at: datetime


class AdminSellerListResponse(BaseModel):
    items: list[AdminSellerListItem]
    page: int
    page_size: int
    total: int
    total_pages: int


class VerifySellerRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    note: str | None = Field(default=None, max_length=500)

    @field_validator("note", mode="before")
    @classmethod
    def empty_note_is_none(cls, value: object) -> object:
        if isinstance(value, str) and not value.strip():
            return None
        return value


class RejectSellerRequest(BaseModel):
    reason: str = Field(min_length=10, max_length=500)

    @field_validator("reason", mode="before")
    @classmethod
    def trim_reason(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value
