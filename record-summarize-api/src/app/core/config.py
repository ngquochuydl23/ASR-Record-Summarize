import os
from enum import Enum
from pydantic import SecretStr
from pydantic_settings import BaseSettings
from starlette.config import Config

current_file_dir = os.path.dirname(os.path.realpath(__file__))
env_path = os.path.join(current_file_dir, "..", "..", "..", ".env")
config = Config(env_path)


class AppSettings(BaseSettings):
    APP_NAME: str = config("APP_NAME", default="FastAPI app")
    APP_DESCRIPTION: str | None = config("APP_DESCRIPTION", default=None)
    APP_VERSION: str | None = config("APP_VERSION", default=None)
    LICENSE_NAME: str | None = config("LICENSE", default=None)
    CONTACT_NAME: str | None = config("CONTACT_NAME", default=None)
    CONTACT_EMAIL: str | None = config("CONTACT_EMAIL", default=None)


class PostgresSettings(BaseSettings):
    POSTGRES_USER: str = config("DB_USERNAME", default="postgres")
    POSTGRES_PASSWORD: str = config("DB_PASSWORD", default=None)
    POSTGRES_SERVER: str = config("DB_HOST", default="localhost")
    POSTGRES_PORT: int = config("DB_PORT", default=5432)
    POSTGRES_DB: str = config("DB_NAME", default="postgres")
    POSTGRES_SYNC_PREFIX: str = config("POSTGRES_SYNC_PREFIX", default="postgresql://")
    POSTGRES_ASYNC_PREFIX: str = config("POSTGRES_ASYNC_PREFIX", default="postgresql+asyncpg://")
    POSTGRES_URI: str = f"{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    POSTGRES_URL: str | None = config("POSTGRES_URL", default=None)


class EnvironmentOption(Enum):
    LOCAL = "local"
    STAGING = "staging"
    PRODUCTION = "production"


class EnvironmentSettings(BaseSettings):
    ENVIRONMENT: EnvironmentOption = config("ENVIRONMENT", default=EnvironmentOption.LOCAL)


class DefaultRateLimitSettings(BaseSettings):
    DEFAULT_RATE_LIMIT_LIMIT: int = config("DEFAULT_RATE_LIMIT_LIMIT", default=10)
    DEFAULT_RATE_LIMIT_PERIOD: int = config("DEFAULT_RATE_LIMIT_PERIOD", default=3600)


class CryptSettings(BaseSettings):
    SECRET_KEY: SecretStr = config("SECRET_KEY", cast=SecretStr)
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = config("REFRESH_TOKEN_EXPIRE_DAYS", default=7)


class FirstUserSettings(BaseSettings):
    ADMIN_NAME: str = config("ADMIN_NAME", default="admin")
    ADMIN_EMAIL: str = config("ADMIN_EMAIL", default="admin@admin.com")
    ADMIN_USERNAME: str = config("ADMIN_USERNAME", default="admin")
    ADMIN_PASSWORD: str = config("ADMIN_PASSWORD", default="!Ch4ng3Th1sP4ssW0rd!")


class TestSettings(BaseSettings): ...


class EmailSettings(BaseSettings):
    MAIL_FROM: str = config("MAIL_FROM", default=None)
    MAIL_USERNAME: str = config("MAIL_USERNAME", default=None)
    MAIL_PASSWORD: str = config("MAIL_PASSWORD", default=None)
    MAIL_PORT: str = config("MAIL_PORT", default=587)
    MAIL_SERVER: str = config("MAIL_SERVER", default="smtp.gmail.com")
    MAIL_SSL_TLS: bool = config("MAIL_SSL_TLS", default=False)
    MAIL_STARTTLS: bool = config("MAIL_STARTTLS", default=True)


class S3StorageSettings(BaseSettings):
    AWS_ACCESS_KEY_ID: str = config("AWS_ACCESS_KEY_ID", default=None)
    AWS_SECRET_ACCESS_KEY: str = config("AWS_SECRET_ACCESS_KEY", default=None)
    S3_BUCKET_NAME: str = config("S3_BUCKET_NAME", default=None)
    S3_REGION_NAME: str = config("S3_REGION_NAME", default=None)
    MAX_FILE_SIZE_MB: int = config("MAX_FILE_SIZE_MB", default=10000)
    MAX_FILE_SIZE_BYTES: int = int(MAX_FILE_SIZE_MB) * 1024 * 1024


class GoogleSSOSettings(BaseSettings):
    GOOGLE_CLIENT_ID: str = config("GOOGLE_CLIENT_ID", default=None)
    GOOGLE_CLIENT_SECRET: str = config("GOOGLE_CLIENT_SECRET", default=None)
    GOOGLE_REDIRECT_URI: str = config("GOOGLE_REDIRECT_URI", default=None)
    GOOGLE_APP_ID: str = config("GOOGLE_APP_ID", default="asr-meeting-app")
    FRONTEND_URL: str=config("FRONTEND_URL", default=None)


class GeminiSettings(BaseSettings):
    GEMINI_MODEL: str = config("GEMINI_MODEL", default="gemini-2.0-flash")
    GEMINI_API_KEY: str = config("GEMINI_API_KEY", default=None)


class OpenAISettings(BaseSettings):
    OPENAI_API_KEY: str = config("OPENAI_API_KEY", default=None)
    OPENAI_EMBEDDING_MODEL: str = config("OPENAI_EMBEDDING_MODEL", default="text-embedding-3-small")


class RedisCacheSettings(BaseSettings):
    REDIS_CACHED_HOST: str = config("REDIS_CACHED_HOST", default='localhost')
    REDIS_CACHED_PORT: str = config("REDIS_CACHED_PORT", default=6379)
    REDIS_PASSWORD: str = config("REDIS_PASSWORD", default=None)
    REDIS_URL: str = f"redis://default:{REDIS_PASSWORD}@{REDIS_CACHED_HOST}:{REDIS_CACHED_PORT}/"

class Settings(
    AppSettings,
    PostgresSettings,
    CryptSettings,
    FirstUserSettings,
    TestSettings,
    DefaultRateLimitSettings,
    EnvironmentSettings,
    EmailSettings,
    S3StorageSettings,
    GoogleSSOSettings,
    GeminiSettings,
    OpenAISettings,
    RedisCacheSettings
):
    pass


settings = Settings()
