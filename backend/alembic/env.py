from __future__ import annotations

from logging.config import fileConfig

from alembic import context
from alembic.runtime.migration import MigrationContext
from sqlalchemy import Column, engine_from_config, pool
from sqlalchemy.schema import DefaultClause

import app.models
from app.core.config import settings
from app.db.base import Base


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Alembic uses the same environment-driven URL as the application. Percent signs
# are escaped because ConfigParser otherwise treats them as interpolation tokens.
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL.replace("%", "%%"))
target_metadata = Base.metadata


def _normalize_server_default(default: str) -> str:
    normalized = default.casefold()
    for character in ("(", ")", "`", "'", '"', " "):
        normalized = normalized.replace(character, "")
    return normalized


def compare_server_defaults(
    _migration_context: MigrationContext,
    _inspected_column: Column[object],
    _metadata_column: Column[object],
    inspected_default: str | None,
    _metadata_default: DefaultClause | None,
    rendered_metadata_default: str | None,
) -> bool | None:
    """Treat MySQL's NOW/CURRENT_TIMESTAMP representations as equivalent."""

    if inspected_default is None or rendered_metadata_default is None:
        return None

    inspected = _normalize_server_default(inspected_default)
    rendered = _normalize_server_default(rendered_metadata_default)
    if inspected == rendered:
        return False
    if {inspected, rendered} <= {"now", "current_timestamp"}:
        return False
    return None


def run_migrations_offline() -> None:
    """Run migrations without creating a database engine."""

    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations using a live database connection."""

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=compare_server_defaults,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
