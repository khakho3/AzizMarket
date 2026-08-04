from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, refresh_token: RefreshToken) -> RefreshToken:
        self.session.add(refresh_token)
        return refresh_token

    def get_by_jti_for_update(self, jti: str) -> RefreshToken | None:
        statement = (
            select(RefreshToken)
            .where(RefreshToken.jti == jti)
            .with_for_update()
        )
        return self.session.scalar(statement)

    def revoke(self, refresh_token: RefreshToken, revoked_at: datetime) -> None:
        refresh_token.revoked_at = revoked_at
