from app import models
from app.db.base import Base


EXPECTED_TABLES = {
    "users",
    "seller_profiles",
    "stores",
    "categories",
    "products",
    "product_images",
    "product_specifications",
    "refresh_tokens",
}


def test_core_marketplace_tables_are_registered() -> None:
    assert EXPECTED_TABLES.issubset(Base.metadata.tables)
    assert models.User.__tablename__ == "users"
