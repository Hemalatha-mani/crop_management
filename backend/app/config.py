"""
Application configuration.

All secrets and environment-specific values are read from environment
variables (see .env.example). For local development sensible defaults are
provided (SQLite database, dev JWT secret) so the app runs with zero setup.
In production (ENVIRONMENT=production) a real DATABASE_URL and JWT secret
are mandatory.
"""
from functools import lru_cache
from typing import List

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEV_JWT_SECRET = "dev-only-secret-change-me"


class Settings(BaseSettings):
    # --- App ---
    APP_NAME: str = "Crop Disease Detection API"
    ENVIRONMENT: str = "development"  # development | production

    # --- Database ---
    # Default = local SQLite file so the backend runs without installing Postgres.
    # Production example: postgresql://user:password@host:5432/dbname
    DATABASE_URL: str = "sqlite:///./crop_disease.db"

    # --- Auth ---
    JWT_SECRET_KEY: str = DEV_JWT_SECRET
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # --- CORS ---
    # Comma-separated list of allowed origins, e.g.
    # "https://your-app.vercel.app,http://localhost:5173"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # --- AI Model ---
    MODEL_PATH: str = "ml_models/crop_disease_model_final.keras"
    MODEL_INPUT_SIZE: int = 224

    # --- Uploads ---
    MAX_UPLOAD_SIZE_MB: int = 10

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @model_validator(mode="after")
    def _normalize_and_validate(self):
        # Render / Heroku sometimes hand out "postgres://" which SQLAlchemy 2.x rejects.
        if self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)

        if self.ENVIRONMENT == "production":
            if self.JWT_SECRET_KEY == DEV_JWT_SECRET:
                raise ValueError("JWT_SECRET_KEY must be set to a strong secret in production.")
            if self.DATABASE_URL.startswith("sqlite"):
                raise ValueError("Set DATABASE_URL to a PostgreSQL URL in production.")
        return self

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def is_dev(self) -> bool:
        return self.ENVIRONMENT != "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
