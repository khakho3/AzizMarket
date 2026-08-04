from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, String, func, text
from sqlalchemy.orm import Mapped, mapped_column


def generate_uuid() -> str:
    """Return a UUID4 value formatted for a String(36) primary key."""

    return str(uuid4())


class UUIDPrimaryKeyMixin:
    """Provide a UUID string primary key to a mapped model."""

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )


class TimestampMixin:
    """Provide database-backed creation and update timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=func.now(),
    )
