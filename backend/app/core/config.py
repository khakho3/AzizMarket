from functools import lru_cache

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed application settings."""

    APP_NAME: str = "Seller Marketplace API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = (
        "mysql+pymysql://marketplace_user:CHANGE_ME@localhost:3306/"
        "seller_marketplace?charset=utf8mb4"
    )
    FRONTEND_URL: str = "http://localhost:3000"
    SECRET_KEY: SecretStr = SecretStr("development-only-change-me")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ADMIN_NAME: str = "Marketplace Administrator"
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: SecretStr = SecretStr("CHANGE_ME")
    ADMIN_PHONE: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug_mode(cls, value: object) -> object:
        """Accept common environment labels in addition to boolean strings."""

        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"debug", "development", "dev"}:
                return True
            if normalized in {"release", "production", "prod"}:
                return False
        return value


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings instance for consistent application configuration."""

    return Settings()


settings = get_settings()
