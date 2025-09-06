from typing import Annotated, Any, cast
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from ..constants.http_msgs import NOT_AUTHENTICATED, MISSING_OR_INVALID_BEARER
from ..core.config import settings
from ..core.db.database import async_get_db
from ..core.exceptions.http_exceptions import ForbiddenException, UnauthorizedException
from ..core.logger import logging
from ..core.security import TokenType, verify_token
from ..dtos.user import UserDto
from ..services.user_service import user_service

logger = logging.getLogger(__name__)

DEFAULT_LIMIT = settings.DEFAULT_RATE_LIMIT_LIMIT
DEFAULT_PERIOD = settings.DEFAULT_RATE_LIMIT_PERIOD


async def get_bearer_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise UnauthorizedException(MISSING_OR_INVALID_BEARER)
    return auth_header.removeprefix("Bearer ").strip()


async def get_current_user(
        token: Annotated[str, Depends(get_bearer_token)],
        db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, Any] | None:
    token_data = await verify_token(token, TokenType.ACCESS, db)
    if token_data is None:
        raise UnauthorizedException(NOT_AUTHENTICATED)
    user = await user_service.get(db=db, id=token_data.id, is_deleted=False)
    if user:
        return cast(UserDto, user)
    raise UnauthorizedException(NOT_AUTHENTICATED)


async def get_current_superuser(current_user: Annotated[dict, Depends(get_current_user)]) -> dict:
    if not current_user["is_superuser"]:
        raise ForbiddenException("You do not have enough privileges.")
    return current_user
