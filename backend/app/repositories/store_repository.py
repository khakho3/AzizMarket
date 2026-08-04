from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.store import Store


class StoreRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def slug_exists(self, slug: str) -> bool:
        return self.session.scalar(select(Store.id).where(Store.slug == slug)) is not None
