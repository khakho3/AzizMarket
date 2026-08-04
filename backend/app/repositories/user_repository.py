from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.seller import SellerProfile
from app.models.user import User


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_email(self, email: str, *, with_seller: bool = False) -> User | None:
        statement = select(User).where(User.email == email)
        if with_seller:
            statement = statement.options(
                selectinload(User.seller_profile).selectinload(SellerProfile.store)
            )
        return self.session.scalar(statement)

    def get_by_id(self, user_id: str, *, with_seller: bool = False) -> User | None:
        statement = select(User).where(User.id == user_id)
        if with_seller:
            statement = statement.options(
                selectinload(User.seller_profile).selectinload(SellerProfile.store)
            )
        return self.session.scalar(statement)

    def add(self, user: User) -> User:
        self.session.add(user)
        return user
