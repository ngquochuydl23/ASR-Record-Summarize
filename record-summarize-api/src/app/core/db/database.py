import uuid
from collections.abc import AsyncGenerator
from datetime import datetime, date, time
from sqlalchemy import DateTime, Boolean, JSON, UUID
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass, Mapped, mapped_column
from sqlalchemy.dialects import postgresql
from typing import Union
from ..config import settings

json_list = list[int] | list[str]
json_scalar = Union[float, str, bool]

class Base(DeclarativeBase, MappedAsDataclass):
    __abstract__ = True
    __dataclass_kwargs__ = {"kw_only": True}
    type_annotation_map = {
        json_list: postgresql.JSONB,
        json_scalar: JSON,
    }

    def to_dict(self):
        result = {}
        for c in self.__table__.columns:
            val = getattr(self, c.name)
            if isinstance(val, (datetime, date, time)):
                result[c.name] = val.isoformat()
            elif isinstance(val, uuid.UUID):
                result[c.name] = str(val)
            else:
                result[c.name] = val
        return result


class BaseMixin(object):
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime | None] = mapped_column(DateTime, default=datetime.utcnow())
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, default=datetime.utcnow())


DATABASE_URI = settings.POSTGRES_URI
DATABASE_PREFIX = settings.POSTGRES_ASYNC_PREFIX
DATABASE_URL = f"{DATABASE_PREFIX}{DATABASE_URI}"

async_engine = create_async_engine(DATABASE_URL, echo=False, future=True)
local_session = async_sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)


async def async_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with local_session() as db:
        yield db
