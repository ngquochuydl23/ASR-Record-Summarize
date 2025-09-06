from datetime import UTC, datetime, timedelta
from enum import Enum
from typing import Any
import jwt
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import AsyncSession
from .config import settings
from .schemas import TokenData
from ..core.logger import logging

SECRET_KEY: SecretStr = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


async def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC).replace(tzinfo=None) + expires_delta
    else:
        expire = datetime.now(UTC).replace(tzinfo=None) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "token_type": TokenType.ACCESS})
    encoded_jwt: str = jwt.encode(to_encode, SECRET_KEY.get_secret_value())
    return encoded_jwt


async def create_refresh_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC).replace(tzinfo=None) + expires_delta
    else:
        expire = datetime.now(UTC).replace(tzinfo=None) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "token_type": TokenType.REFRESH})
    encoded_jwt: str = jwt.encode(to_encode, SECRET_KEY.get_secret_value(), algorithm=settings.ALGORITHM)
    return encoded_jwt


async def verify_token(token: str, expected_token_type: TokenType, db: AsyncSession) -> TokenData | None:
    """Verify a JWT token and return TokenData if valid.

    Parameters
    ----------
    token: str
        The JWT token to be verified.
    expected_token_type: TokenType
        The expected type of token (access or refresh)
    db: AsyncSession
        Database session for performing database operations.

    Returns
    -------
    TokenData | None
        TokenData instance if the token is valid, None otherwise.
    """

    try:
        payload = jwt.decode(token, SECRET_KEY.get_secret_value(), algorithms=[ALGORITHM])
        token_type: str | None = payload.get("token_type")
        return TokenData(
            id=payload.get("id"),
            email=payload.get("sub"),
            first_name=payload.get("first_name"),
            last_name=payload.get("last_name"),
            full_name=payload.get("full_name"),
            avatar=payload.get("avatar")
        )
    except Exception as exc:
        logging.error(f"Unhandled error: {str(exc)}")
        return None
