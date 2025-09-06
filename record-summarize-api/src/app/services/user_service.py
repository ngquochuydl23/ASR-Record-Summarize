from fastcrud import FastCRUD
from ..models.users import UserModel
from ..dtos.user import UserDelete, UserCreateDto, UserUpdate, UserUpdateInternal, UserDto
from sqlalchemy.ext.asyncio import AsyncSession


class UserService(FastCRUD[UserModel, UserCreateDto, UserUpdate, UserUpdateInternal, UserDelete, UserDto]):
    async def upsert_by_email(self, db: AsyncSession, data: UserCreateDto) -> UserDto:
        user = await self.get(
            db=db,
            email=data.email,
            one_or_none=True,
            is_deleted=False,
            schema_to_select=UserDto)

        if user:
            merged_instance = user
            merged_instance.update(data.model_dump(exclude_unset=True))
            merged_instance = UserModel(**merged_instance)
        else:
            merged_instance = UserModel(**data.model_dump())

        await db.merge(merged_instance)
        await db.commit()

        return await self.get(
            db=db,
            email=data.email,
            one_or_none=True,
            is_deleted=False,
            schema_to_select=UserDto)

user_service = UserService(UserModel)
