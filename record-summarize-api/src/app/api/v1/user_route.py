import uuid
from typing import Annotated, cast
from fastapi import APIRouter, Depends, Request
from fastcrud.exceptions.http_exceptions import NotFoundException, ForbiddenException
from sqlalchemy.ext.asyncio import AsyncSession
from ...core.db.database import async_get_db
from ...dtos.user import UserDto
from ...services.user_service import user_service
from ..dependencies import get_current_user


router = APIRouter(tags=["Users"])

@router.get("/users/me", response_model=UserDto)
async def read_users_me(request: Request, current_user: Annotated[dict, Depends(get_current_user)]) -> dict:
    return current_user


@router.get("/users/{userId}", response_model=UserDto)
async def read_user(
        request: Request,
        userId: str,
        db: Annotated[AsyncSession, Depends(async_get_db)]
) -> UserDto:
    db_user = await user_service.get(db=db, id=uuid.UUID(userId), is_deleted=False, schema_to_select=UserDto)
    if db_user is None:
        raise NotFoundException("User not found")
    return cast(UserDto, db_user)


@router.delete("/users/{userId}")
async def delete_user(
        request: Request,
        userId: str,
        current_user: Annotated[dict, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, str]:
    db_user = await user_service.get(db=db, id=uuid.UUID(userId), is_deleted=False, schema_to_select=UserDto)
    if not db_user:
        raise NotFoundException("User not found")

    if userId != current_user["id"]:
        raise ForbiddenException()

    await user_service.delete(db=db, id=uuid.UUID(userId))
    return {"message": "User deleted"}
