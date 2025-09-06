from typing import Annotated, cast
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ...core.db.database import async_get_db
from ..dependencies import get_current_user
from ...core.exceptions.app_exception import AppException
from ...dtos.record_pipeline_item import RecordPipelineItemDto
from ...dtos.user import UserDto
from ...models import RecordPipelineItemModel
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

router = APIRouter(tags=["PipelineItems"])

@router.get("/pipelines/{pipeline_id}", response_model=RecordPipelineItemDto, status_code=200)
async def get_pipeline_by_id(
        pipeline_id: str,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)]
) -> RecordPipelineItemDto:
    result = await db.execute(
        select(RecordPipelineItemModel)
        .options(selectinload(RecordPipelineItemModel.record))
        .where(RecordPipelineItemModel.id == pipeline_id)
    )
    record_pipeline_item = result.scalar_one_or_none()
    if (record_pipeline_item.record.creator_id != current_user["id"]
            or (current_user["email"] not in record_pipeline_item.record.emails)):
        raise AppException("Record is not owned or shared.")

    if record_pipeline_item.record.is_deleted:
        raise AppException("Record is deleted.")

    return cast(RecordPipelineItemDto, record_pipeline_item)
