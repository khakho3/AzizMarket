import re
import sys

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.category import Category


CATEGORY_TREE: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("Phones and Tablets", ("Smartphones", "Tablets", "Phone Accessories")),
    ("Computers", ("Laptops", "Desktop Computers", "Computer Accessories")),
    ("Electronics", ("Televisions", "Audio Equipment", "Cameras")),
    ("Fashion", ("Men's Clothing", "Women's Clothing", "Shoes", "Bags")),
    ("Furniture", ("Living Room Furniture", "Bedroom Furniture", "Office Furniture")),
    ("Home Appliances", ("Kitchen Appliances", "Refrigerators", "Washing Machines")),
    ("Beauty", ("Skincare", "Haircare", "Fragrances")),
    ("Food", ("Packaged Food", "Drinks", "Groceries")),
    ("Vehicles", ("Cars", "Motorcycles", "Vehicle Parts")),
    ("Services", ("Repairs", "Delivery Services", "Professional Services")),
)


def slugify(value: str) -> str:
    """Create a stable URL slug for the predefined category names."""

    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def seed_categories(session: Session) -> tuple[int, int]:
    """Insert missing categories and repair seeded parent links."""

    existing_categories = session.scalars(select(Category)).all()
    categories_by_slug = {category.slug: category for category in existing_categories}
    parents: dict[str, Category] = {}
    created = 0
    updated = 0

    for parent_name, _ in CATEGORY_TREE:
        parent_slug = slugify(parent_name)
        parent = categories_by_slug.get(parent_slug)
        if parent is None:
            parent = Category(
                name=parent_name,
                slug=parent_slug,
                description=f"Browse {parent_name.lower()} from marketplace sellers.",
                is_active=True,
            )
            session.add(parent)
            categories_by_slug[parent_slug] = parent
            created += 1
        elif parent.parent_id is not None:
            parent.parent_id = None
            updated += 1
        parents[parent_slug] = parent

    session.flush()

    for parent_name, child_names in CATEGORY_TREE:
        parent = parents[slugify(parent_name)]
        for child_name in child_names:
            child_slug = slugify(child_name)
            child = categories_by_slug.get(child_slug)
            if child is None:
                child = Category(
                    name=child_name,
                    slug=child_slug,
                    description=f"Explore {child_name.lower()} in {parent_name}.",
                    parent_id=parent.id,
                    is_active=True,
                )
                session.add(child)
                categories_by_slug[child_slug] = child
                created += 1
            elif child.parent_id != parent.id:
                child.parent_id = parent.id
                updated += 1

    return created, updated


def main() -> None:
    session = SessionLocal()
    try:
        created, updated = seed_categories(session)
        session.commit()
        total = session.scalar(select(func.count()).select_from(Category))
        print(
            "Category seed completed successfully: "
            f"{created} created, {updated} updated, {total} total."
        )
    except Exception as exc:
        session.rollback()
        print(
            f"Category seed failed safely ({type(exc).__name__}). No changes were committed.",
            file=sys.stderr,
        )
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()
