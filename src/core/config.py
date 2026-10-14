from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Central configuration validated through Pydantic."""
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    # JWT Security
    SECRET_KEY: str = "change-me-to-a-secure-random-secret-key-32-chars-min"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # PostgreSQL Database
    DATABASE_URL: str = "postgresql+asyncpg://urjamitra_user:urjamitra_secure_password@localhost:5432/urjamitra_db"

    # Redis Cache & Queue
    REDIS_URL: str = "redis://localhost:6379/0"

    # Jev System-1 Model Configuration
    JEV_API_BASE_URL: str = "https://api.typesafe.ai/v1"
    JEV_API_KEY: Optional[str] = None

    # LLM API Keys
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # External Utility Integrations
    SAP_ISU_GATEWAY_URL: str = "https://sandbox.tgspdcl.gov.in/sap/bc/bapi"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
