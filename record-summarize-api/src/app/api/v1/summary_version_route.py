from fastapi import APIRouter, Depends
from typing import Annotated, cast
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import noload, selectinload
from ...core.db.database import async_get_db
from ...core.exceptions.app_exception import AppException
from ...dtos.summary_record import SummaryRecordDto
from ...models import SummaryVersionModel, RecordModel
from sqlalchemy import and_
router = APIRouter(tags=["Summary Version"])

@router.get("/summary-versions/by-record/{record_id}", status_code=200)
async def get_summary_versions(record_id: str, db: Annotated[AsyncSession, Depends(async_get_db)]):
    result = await db.execute(
        select(SummaryVersionModel)
        .options(selectinload(SummaryVersionModel.record))
        .where(and_(SummaryVersionModel.is_deleted == False, SummaryVersionModel.record_id == record_id))
        .order_by(desc(SummaryVersionModel.created_at))
    )
    summaries = result.scalars().all()
    return [SummaryRecordDto.model_validate(summary, from_attributes=True) for summary in summaries]


@router.get("/summary-versions/by-record/{record_id}/lastest", status_code=200, response_model=SummaryRecordDto)
async def get_lastest_version(record_id: str, db: Annotated[AsyncSession, Depends(async_get_db)]):
    stmt = (
        select(SummaryVersionModel)
        .options(selectinload(SummaryVersionModel.record))
        .where(and_(SummaryVersionModel.is_deleted == False, SummaryVersionModel.record_id == record_id))
        .order_by(desc(SummaryVersionModel.created_at))
        .limit(1)
    )
    result = await db.execute(stmt)
    summary = result.scalar_one_or_none()
    if not summary:
        raise AppException(f"No summary version found for record {record_id}")
    return cast(SummaryRecordDto, summary)


@router.get("/summary-versions/{version_id}", status_code=200, response_model=SummaryRecordDto)
async def get_version_by_id(version_id: str, db: Annotated[AsyncSession, Depends(async_get_db)]):
    result = await db.execute(
        select(SummaryVersionModel)
        .options(selectinload(SummaryVersionModel.record))
        .where(and_(SummaryVersionModel.is_deleted.is_(False), SummaryVersionModel.id == version_id))
    )
    summary = result.scalar_one_or_none()
    if not summary:
        raise AppException(f"No summary version found with id {version_id}")
    return cast(SummaryRecordDto, summary)


@router.delete("/summary-versions/{version_id}",  status_code=200)
async def delete_version_by_id(version_id: str, db: Annotated[AsyncSession, Depends(async_get_db)]):
    result = await db.execute(
        select(SummaryVersionModel)
        .options(selectinload(SummaryVersionModel.record))
        .where(and_(SummaryVersionModel.is_deleted.is_(False), SummaryVersionModel.id == version_id))
    )
    summary = result.scalar_one_or_none()
    if not summary:
        raise AppException(f"No summary version found with id {version_id}")

    if summary.published:
        raise AppException(f"Cannot delete published summary version {version_id}")

    summary.is_deleted = True
    await db.commit()
    await db.refresh(summary)
    return True


@router.post("/summary-versions/{version_id}/publish", status_code=201, response_model=SummaryRecordDto)
async def publish_summary_version(version_id: str, db: Annotated[AsyncSession, Depends(async_get_db)]):
    result = await db.execute(
        select(SummaryVersionModel)
        .options(selectinload(SummaryVersionModel.record))
        .where(and_(SummaryVersionModel.is_deleted.is_(False), SummaryVersionModel.id == version_id))
    )
    summary = result.scalar_one_or_none()
    if not summary:
        raise AppException(f"No summary version found with id {version_id}")

    record_result = await db.execute(
        select(RecordModel)
        .options(
            noload(RecordModel.attachments),
            noload(RecordModel.creator),
            noload(RecordModel.pipeline_items),
            noload(RecordModel.summary_versions),
            noload(RecordModel.rag_documents),
            noload(RecordModel.current_version)
        )
        .where(and_(RecordModel.is_deleted.is_(False), RecordModel.id == summary.record_id))
    )
    record = record_result.scalar_one_or_none()
    record.current_version_id = summary.id
    record.published = True
    record_result.published = True
    summary.published = True

    await db.commit()
    await db.refresh(record)
    return cast(SummaryRecordDto, summary)

