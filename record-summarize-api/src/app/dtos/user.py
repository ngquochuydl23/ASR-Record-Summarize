from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema
import uuid


class UserBase(BaseModel):
    id: uuid.UUID
    first_name: Annotated[str, Field(min_length=2, max_length=10, examples=["Trầm"])]
    last_name: Annotated[str, Field(min_length=2, max_length=10, examples=["Hồ"])]
    full_name: Annotated[str, Field(min_length=2, max_length=30, examples=["Hồ Trầm"])]
    email: Annotated[EmailStr, Field(examples=["hotram@gmail.com"])]
    avatar: str | None
    created_at: str | None
    updated_at: str | None


class User(TimestampSchema, UserBase, UUIDSchema, PersistentDeletion):
    avatar: str | None
    hashed_password: str
    is_superuser: bool = False


class UserDto(BaseModel):
    id: Optional[uuid.UUID] = None
    first_name: Annotated[str, Field(min_length=2, max_length=10, examples=["Trầm"])]
    last_name: Annotated[str, Field(min_length=2, max_length=10, examples=["Hồ"])]
    full_name: Annotated[str, Field(min_length=2, max_length=30, examples=["Hồ Trầm"])]
    email: Annotated[EmailStr, Field(examples=["hotram@gmail.com"])]
    avatar: str | None
    created_at: Optional[datetime] | None = datetime.utcnow()
    updated_at: Optional[datetime] | None = datetime.utcnow()


class UserCreateDto(BaseModel):
    id: Optional[uuid.UUID] = None
    first_name: Annotated[str, Field(min_length=2, max_length=10, examples=["Trầm"])]
    last_name: Annotated[str, Field(min_length=2, max_length=10, examples=["Hồ"])]
    full_name: Annotated[str, Field(min_length=2, max_length=30, examples=["Hồ Trầm"])]
    email: Annotated[EmailStr, Field(examples=["hotram@gmail.com"])]
    avatar: str | None


class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: Annotated[str | None, Field(min_length=2, max_length=30, examples=["User Userberg"], default=None)]
    username: Annotated[
        str | None, Field(min_length=2, max_length=20, pattern=r"^[a-z0-9]+$", examples=["userberg"], default=None)
    ]
    email: Annotated[EmailStr | None, Field(examples=["user.userberg@example.com"], default=None)]
    profile_image_url: Annotated[
        str | None,
        Field(
            pattern=r"^(https?|ftp)://[^\s/$.?#].[^\s]*$", examples=["https://www.profileimageurl.com"], default=None
        ),
    ]


class UserUpdateInternal(UserUpdate):
    updated_at: datetime



class UserDelete(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_deleted: bool
    deleted_at: datetime


class UserRestoreDeleted(BaseModel):
    is_deleted: bool
