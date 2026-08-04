import sys

from pydantic import EmailStr, TypeAdapter, ValidationError
from app.core.config import settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.enums import UserRole
from app.models.user import User
from app.repositories.user_repository import UserRepository


def validated_admin_values() -> tuple[str, str, str, str | None]:
    name = settings.ADMIN_NAME.strip()
    email_value = settings.ADMIN_EMAIL.strip().lower()
    password = settings.ADMIN_PASSWORD.get_secret_value()
    phone = settings.ADMIN_PHONE.strip() if settings.ADMIN_PHONE else None

    if not name or not email_value or not password:
        raise ValueError("ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required.")
    if password == "CHANGE_ME" or len(password) < 8:
        raise ValueError("Set ADMIN_PASSWORD to a secure value of at least 8 characters.")
    try:
        email = str(TypeAdapter(EmailStr).validate_python(email_value)).lower()
    except ValidationError as exc:
        raise ValueError("ADMIN_EMAIL must be a valid email address.") from exc
    return name, email, password, phone


def main() -> None:
    try:
        name, email, password, phone = validated_admin_values()
    except ValueError as exc:
        print(f"Admin creation stopped: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc

    session = SessionLocal()
    try:
        users = UserRepository(session)
        existing = users.get_by_email(email)
        if existing is not None:
            if existing.role == UserRole.ADMIN:
                print("Admin account already exists; no duplicate was created.")
                return
            raise ValueError("The configured admin email already belongs to another account.")

        users.add(
            User(
                full_name=name,
                email=email,
                phone=phone,
                password_hash=hash_password(password),
                role=UserRole.ADMIN,
                is_active=True,
                email_verified=True,
            )
        )
        session.commit()
        print("Administrator account created successfully.")
    except Exception as exc:
        session.rollback()
        print(
            f"Admin creation failed safely ({type(exc).__name__}). No changes were committed.",
            file=sys.stderr,
        )
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()
