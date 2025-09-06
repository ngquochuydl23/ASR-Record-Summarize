import uuid
from datetime import datetime
import asyncio
from typing import Annotated, cast, List, Callable, Awaitable
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, BackgroundTasks

from .llm_route import llm_service
from ...connection_manager import manager
from ...constants.record_constants import RECORD_SUMMARIZE_STRUCTURES
from ...core.db.database import async_get_db
from ...core.exceptions.app_exception import AppException
from ...dtos.llm import RequestRAGSearch, SummarizeRecord
from ...dtos.record import RecordDto, RecordCreateDto
from ...dtos.user import UserDto
from fastapi.encoders import jsonable_encoder
from ...models import RecordModel, UserModel, AttachmentModel, RecordPipelineItemModel, RagDocumentModel
from ...models.record_pipeline_items import PipelineItemType, PipelineItemStatus
from ...models.records import PermissionLevel
from ...services.ffmpeg_service import FFMpegService
from ...services.rag_index_service import RagIndexService
from ...services.s3_service import S3Service
from ..dependencies import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from sqlalchemy.orm import selectinload, noload
from ...core.logger import logging
from ...utils.extract_text_from_file import extract_text

s3_service = S3Service()
rag_index_service = RagIndexService()
router = APIRouter(tags=["Record"])


@router.post("/records", status_code=201)
async def create_records(
        body: RecordCreateDto,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
        background_tasks: BackgroundTasks
) -> dict:
    record = RecordModel(
        id=uuid.uuid4(),
        title=body.title,
        description=body.description,
        url=body.url,
        permission=PermissionLevel.PRIVATE,
        creator_id=current_user["id"],
        emails=body.emails,
        record_content_type=body.record_content_type,
        attachments=[
            AttachmentModel(
                id=uuid.uuid4(),
                url=attachment.url,
                filename=attachment.filename,
                mime=attachment.mime,
                owner_id=current_user["id"]
            )
            for attachment in body.attachments
        ],
        pipeline_items=[
            RecordPipelineItemModel(
                id=uuid.uuid4(),
                type=PipelineItemType.CREATE_RECORD,
                status=PipelineItemStatus.SUCCESS,
                start_time=datetime.utcnow(),
                finished_at=datetime.utcnow(),
                extra={}
            ),
            RecordPipelineItemModel(
                id=uuid.uuid4(),
                type=PipelineItemType.TRANSCRIBE,
                status=PipelineItemStatus.PENDING,
                extra={}
            ),
            RecordPipelineItemModel(
                id=uuid.uuid4(),
                type=PipelineItemType.RAG_INDEX,
                status=PipelineItemStatus.PENDING,
                extra={}
            ),
            RecordPipelineItemModel(
                id=uuid.uuid4(),
                type=PipelineItemType.GENERATE_SUM,
                status=PipelineItemStatus.PENDING,
                extra={}
            )
        ]
    )
    db.add(record)
    await db.commit()
    background_tasks.add_task(_record_creating_task, record, db, current_user)
    return record.to_dict()


@router.get("/records/{record_id}", response_model=RecordDto)
async def get_record_by_id(
        record_id: str,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)]
) -> RecordDto:
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.attachments),
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items)
        )
        .where(RecordModel.id == record_id
               and UserModel.id == current_user.id
               and not RecordModel.is_deleted)
    )
    record = result.scalar_one_or_none()
    return cast(RecordDto, record)


@router.get("/records", response_model=List[RecordDto])
async def get_records(
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)]
) -> RecordDto:
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.creator),
            noload(RecordModel.attachments),
            selectinload(RecordModel.pipeline_items),
        )
        .where(RecordModel.is_deleted == False)
        .order_by(desc(RecordModel.created_at))
    )
    return cast(RecordDto, result.scalars().all())


# @router.put("/records/{record_id}", response_model=RecordDto)
# async def update_meeting(
#     request: Request,
#     record_id: str,
#     body: Rec,
#     db: Annotated[AsyncSession, Depends(async_get_db)]
# ) -> MeetingDto:
#     meeting = dict({})
#     return cast(MeetingDto, meeting)


@router.delete("/records/{record_id}")
async def delete_user(
        record_id: str,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.attachments),
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items)
        )
        .where(RecordModel.id == record_id
               and UserModel.id == current_user.id
               and not RecordModel.is_deleted)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise AppException("record is null")

    record.is_deleted = True
    await db.commit()
    return {"message": "Record deleted."}


@router.post("/records/{record_id}/publish")
async def publish_record(
        record_id: str,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.attachments),
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items)
        )
        .where(RecordModel.id == record_id
               and UserModel.id == current_user.id
               and not RecordModel.is_deleted)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise AppException("Record is null")

    if not all(item.status == PipelineItemStatus.SUCCESS for item in record.pipeline_items):
        raise AppException("Cannot publish unsuccessful record.")

    if record.published:
        raise AppException("Cannot execute with published record.")

    record.published = True
    await db.commit()
    return {"message": "Published."}


@router.delete("/records/{record_id}/cancel")
async def cancel_record(
        record_id: str,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.attachments),
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items)
        )
        .where(RecordModel.id == record_id
               and UserModel.id == current_user.id
               and not RecordModel.is_deleted)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise AppException("Record is null")

    if (all(item.status == PipelineItemStatus.SUCCESS for item in record.pipeline_items)
            or any(
                item.status not in [PipelineItemStatus.FAILED, PipelineItemStatus.CANCELLED]
                for item in record.pipeline_items)
    ):
        raise AppException("Cannot cancel SUCCESS or FAILED record.")
    return {"message": "Cancelled."}


@router.post("/records/{record_id}/rag-index")
async def rag_index_record(
        record_id: str,
        # current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.attachments),
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items),
            selectinload(RecordModel.rag_documents)
        )
        .where(RecordModel.id == record_id
               # and UserModel.id == current_user.id
               and not RecordModel.is_deleted)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise AppException("Record is null")

    await rag_index_service.execute_rag_index(db, record)
    return {"message": "Rag Index."}


@router.post("/records/{record_id}/search-similar")
async def search_similar(
        record_id: str,
        body: RequestRAGSearch,
        # current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
):
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.attachments),
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items),
            selectinload(RecordModel.rag_documents)
        )
        .where(RecordModel.id == record_id
               # and UserModel.id == current_user.id
               and not RecordModel.is_deleted)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise AppException("Record is null")

    chunks = await rag_index_service.search_similar_chunks(
        db,
        body.text,
        record.id,
        top_k=body.top_k,
        threshold=body.threshold
    )
    return chunks


@router.post("/records/{record_id}/summarize")
async def summarize_record(
        record_id: str,
        body: SummarizeRecord,
        # current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
):
    result = await db.execute(
        select(RecordModel)
        .options(
            selectinload(RecordModel.attachments),
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items)
        )
        .where(RecordModel.id == record_id
               # and UserModel.id == current_user.id
               and not RecordModel.is_deleted)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise AppException("Record is null")

    context = "\n".join([extract_text(item.url) for item in record.attachments])
    prompt = f"""
    Bạn là một trợ lý thông minh. Tôi sẽ cung cấp cho bạn các đoạn thông tin (chunks) được trích xuất từ:
    1. Video bài giảng (transcript, phụ đề)
    2. Tài liệu PDF liên quan (slide, handout, sách tham khảo)
    
    Nội dung các chunks:
    {context}
    
    {RECORD_SUMMARIZE_STRUCTURES[record.record_content_type]}
    """
    return llm_service.generate_text_gemini(prompt)


@router.websocket("/records/ws/{record_id}")
async def websocket_task_endpoint(websocket: WebSocket, record_id: str):
    await manager.connect(record_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect as e:
        manager.disconnect(record_id, websocket)


async def _record_creating_task(
        record: RecordModel,
        db: Annotated[AsyncSession, Depends(async_get_db)],
        current_user: Annotated[UserDto, Depends(get_current_user)]):
    pipeline_items = record.pipeline_items
    await _execute_step(record, pipeline_items[1], generate_ffmpeg, db)
    await _execute_step(record, pipeline_items[2], store_vectordb, db)
    await _execute_step(record, pipeline_items[3], llm_summarize, db)

    # send email notification


async def _execute_step(
        record: RecordModel,
        pipeline_item: RecordPipelineItemModel,
        func: Callable[[RecordModel, RecordPipelineItemModel, AsyncSession], Awaitable[dict[str, str] | None]],
        db: Annotated[AsyncSession, Depends(async_get_db)]
):
    logging.info(f"Record-{str(record.id)} - {pipeline_item.type} RUNNING")
    record.current_step = pipeline_item.type
    pipeline_item.status = PipelineItemStatus.RUNNING
    pipeline_item.start_time = datetime.utcnow()

    db.add(record)
    db.add(pipeline_item)
    await db.commit()
    await db.refresh(pipeline_item)
    await manager.broadcast(str(record.id), pipeline_item.to_dict())

    try:
        extra_data = await func(record, pipeline_item, db)
        pipeline_item.status = PipelineItemStatus.SUCCESS
        pipeline_item.finished_at = datetime.utcnow()
        pipeline_item.extra = extra_data if extra_data is not None else {}
        db.add(record)
        db.add(pipeline_item)

        await db.commit()
        await db.refresh(pipeline_item)
        await manager.broadcast(str(record.id), pipeline_item.to_dict())
        logging.info(f"Record-{str(record.id)} - {pipeline_item.type} SUCCESS")

    except (RuntimeError, AppException, Exception) as e:
        logging.error(f"Record-{str(record.id)} - {pipeline_item.type} ERROR")
        pipeline_item.status = PipelineItemStatus.FAILED
        pipeline_item.finished_at = datetime.utcnow()
        pipeline_item.error_message = str(e)
        db.add(record)
        db.add(pipeline_item)

        await db.commit()
        await db.refresh(pipeline_item)
        await manager.broadcast(str(record.id), pipeline_item.to_dict())


async def generate_ffmpeg(
        record: RecordModel,
        pipeline_item: RecordPipelineItemModel,
        db: Annotated[AsyncSession, Depends(async_get_db)]
):
    # generate vtt
    # generate transcribe
    return await FFMpegService.extract_audio(record.url, f'wavs/record-{str(record.id)}.wav')


async def store_vectordb(
        record: RecordModel,
        pipeline_item: RecordPipelineItemModel,
        db: Annotated[AsyncSession, Depends(async_get_db)]
):
    await rag_index_service.execute_rag_index(db, record)
    return None


async def llm_summarize(
        record: RecordModel,
        pipeline_item: RecordPipelineItemModel,
        db: Annotated[AsyncSession, Depends(async_get_db)]
):
    context = "\n".join([extract_text(item.url) for item in record.attachments])
    prompt = f"""
       Bạn là một trợ lý thông minh. Tôi sẽ cung cấp cho bạn các đoạn thông tin (chunks) được trích xuất từ:
       1. Video bài giảng (transcript, phụ đề)
       2. Tài liệu PDF liên quan (slide, handout, sách tham khảo)

       Nội dung các chunks:
       {context}

       {RECORD_SUMMARIZE_STRUCTURES[record.record_content_type]}
       """
    response_llm = await asyncio.to_thread(llm_service.generate_text_gemini, prompt)


    #store to version-summarization
    return {
        "system_prompt": prompt,
        "summary": response_llm
    }
