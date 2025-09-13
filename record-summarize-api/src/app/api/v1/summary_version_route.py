from fastapi import APIRouter, Depends
from typing import Annotated, cast
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import noload
from ...core.db.database import async_get_db
from ...dtos.summary_record import SummaryRecordDto
from ...models import SummaryVersionModel, RecordModel
from sqlalchemy import and_
router = APIRouter(tags=["Summary Version"])

@router.get("/summary-versions/by-record/{record_id}", status_code=200)
async def get_summary_versions(record_id: str, db: Annotated[AsyncSession, Depends(async_get_db)]):
    result = await db.execute(
        select(SummaryVersionModel)
        .options(noload(SummaryVersionModel.record))
        .where(SummaryVersionModel.is_deleted == False and RecordModel.id == record_id)
        .order_by(desc(SummaryVersionModel.created_at))
    )
    return cast(SummaryRecordDto, result.scalars().all())


@router.get("/summary-versions/{version_id}", status_code=200)
async def get_version_by_id(version_id: str, db: Annotated[AsyncSession, Depends(async_get_db)]):
    result = await db.execute(
        select(SummaryVersionModel)
        .options(noload(SummaryVersionModel.record))
        .where(
            and_(
                SummaryVersionModel.is_deleted.is_(False),
                SummaryVersionModel.id == version_id
            )
        )
    )
    record = result.scalar_one_or_none()
    return cast(SummaryRecordDto, record)

