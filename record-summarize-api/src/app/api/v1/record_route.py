import uuid
import asyncio
import re
import json
from datetime import datetime
from typing import Annotated, cast, List, Callable, Awaitable
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from sqlalchemy.orm import selectinload, noload
from .llm_route import llm_service
from .transcription_route import transcription_service
from ...connection_manager import manager
from ...constants.record_constants import RECORD_SUMMARIZE_STRUCTURES
from ...core.db.database import async_get_db, local_session
from ...core.exceptions.app_exception import AppException
from ...dtos.llm import RequestRAGSearch
from ...dtos.record import RecordDto, RecordCreateDto, RequestGenerateFormRecordDto
from ...dtos.user import UserDto
from ...models import RecordModel, UserModel, AttachmentModel, RecordPipelineItemModel, SummaryVersionModel
from ...models.record_pipeline_items import PipelineItemType, PipelineItemStatus
from ...models.records import PermissionLevel, RecordContentType, RecordSourceType
from ...services.ffmpeg_service import FFMpegService
from ...services.rag_index_service import RagIndexService
from ...services.s3_service import S3Service
from ..dependencies import get_current_user
from ...core.logger import logging
from ...services.transcription_service import TranscriptionService
from ...utils.extract_text_from_file import extract_text

s3_service = S3Service()
rag_index_service = RagIndexService()
transcription_service = TranscriptionService()
router = APIRouter(tags=["Record"])


@router.post("/records", status_code=201)
async def create_records(
        body: RecordCreateDto,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
        background_tasks: BackgroundTasks
) -> dict:
    duration = await FFMpegService.get_duration_video(body.url)
    record = RecordModel(
        id=uuid.uuid4(),
        title=body.title,
        description=body.description,
        url=body.url,
        duration=duration,
        permission=PermissionLevel.PRIVATE,
        creator_id=current_user["id"],
        emails=body.emails,
        lang=body.lang,
        source_type=body.source_type,
        record_content_type=body.record_content_type,
        attachments=[
            AttachmentModel(
                id=uuid.uuid4(),
                url=attachment.url,
                size=attachment.size,
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
        ],
        summary_versions=[]
    )
    db.add(record)
    await db.commit()
    background_tasks.add_task(_record_creating_task, record.id)
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
            selectinload(RecordModel.pipeline_items),
            noload(RecordModel.rag_documents),
            noload(RecordModel.current_version),
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
            noload(RecordModel.rag_documents),
            noload(RecordModel.current_version),
            selectinload(RecordModel.pipeline_items)
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
            selectinload(RecordModel.creator),
            selectinload(RecordModel.pipeline_items),
            noload(RecordModel.attachments),
            noload(RecordModel.rag_documents),
            noload(RecordModel.current_version),
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


@router.post("/records/{record_id}/publish/last")
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
            selectinload(RecordModel.pipeline_items),
            selectinload(RecordModel.summary_versions),
            noload(RecordModel.rag_documents),
            noload(RecordModel.current_version)
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

    last_version = record.summary_versions[0]
    record.current_version_id = last_version.id
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


@router.post("/records/helper/generate-form")
async def generate_form_helper(body: RequestGenerateFormRecordDto):
    record_content_types = ", ".join([e.value for e in RecordContentType])
    prompt = f"""
        Bạn là một trợ lý AI. Nhiệm vụ của bạn là **tạo metadata cho một Record** ở dạng JSON.
        Dựa trên nội dung đó, hãy sinh ra JSON với cấu trúc sau:
    
        {{
          "title": "tiêu đề ngắn gọn, xúc tích, tối đa 100 ký tự",
          "description": "mô tả ngắn gọn, dễ hiểu, 2–3 câu",
          "record_content_type": "một trong các loại: {record_content_types}"
        }}
        Chỉ trả về JSON hợp lệ, không thêm giải thích.

        Nội dung dữ liệu:
            {body.prompt}
        """
    response = llm_service.generate_text_gemini(prompt)
    match = re.search(r"\{.*\}", response, re.DOTALL)
    json_str = match.group(0) if match else response.strip()
    return json.loads(json_str)


@router.websocket("/records/ws/{record_id}")
async def websocket_task_endpoint(websocket: WebSocket, record_id: str):
    await manager.connect(record_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect as e:
        manager.disconnect(record_id, websocket)


async def _record_creating_task(record_id: uuid.UUID):
    async with local_session() as db:
        try:
            result = await db.execute(
                select(RecordModel)
                .options(
                    selectinload(RecordModel.attachments),
                    selectinload(RecordModel.creator),
                    selectinload(RecordModel.pipeline_items),
                    selectinload(RecordModel.rag_documents),
                    selectinload(RecordModel.summary_versions),
                )
                .where(RecordModel.id == record_id, RecordModel.is_deleted.is_(False))
            )
            record = result.scalar_one_or_none()
            if not record:
                return

            transcribe_result = await _execute_step(record, record.pipeline_items[1], transcribe_stage, db)
            await _execute_step(record, record.pipeline_items[2], store_vectordb_stage, db)

            summary_result = await _execute_step(record, record.pipeline_items[3], llm_summarize_stage, db)
            record.subtitle_url = transcribe_result["subtitle_s3_key"]
            record.summary_versions.append(SummaryVersionModel(
                id=uuid.uuid4(),
                title=f"v{len(record.summary_versions) + 1}",
                summary_content=summary_result["summary"],
                published=False
            ))
            db.add(record)
            await db.commit()

        except Exception as e:
            logging.error("Error", str(e))
            await db.rollback()
            raise


async def _execute_step(
        record: RecordModel,
        pipeline_item: RecordPipelineItemModel,
        func: Callable[[RecordModel, AsyncSession], Awaitable[dict[str, str] | None]],
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
        extra_data = await func(record, db)
        pipeline_item.status = PipelineItemStatus.SUCCESS
        pipeline_item.finished_at = datetime.utcnow()
        pipeline_item.extra = extra_data if extra_data is not None else {}
        db.add(record)
        db.add(pipeline_item)

        await db.commit()
        await db.refresh(pipeline_item)
        await manager.broadcast(str(record.id), pipeline_item.to_dict())
        logging.info(f"Record-{str(record.id)} - {pipeline_item.type} SUCCESS")

        return extra_data

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
        raise Exception(f"Record-{str(record.id)} - {pipeline_item.type} ERROR")


async def transcribe_stage(record: RecordModel, db: Annotated[AsyncSession, Depends(async_get_db)]):
    if record.source_type == RecordSourceType.LOCAL:
        extract_audio_result = await FFMpegService.extract_audio(record.url, f'wavs/record-{str(record.id)}.wav')
        subtitle_file = f'vtts/record-{record.lang}-{str(record.id)}.vtt'
        transcribe_result = await transcription_service.generate_subtitle(
            wav_path=extract_audio_result['output'],
            output_path=subtitle_file,
            lang=record.lang
        )
        uploaded_result = await s3_service.upload_file_from_path(subtitle_file, folder='vtts')
        return {
            "subtitle_s3_key": uploaded_result.url,
            "transcribe_result": transcribe_result,
            "extract_audio_result": extract_audio_result
        }
    else:
        # generate vtt with youtube - gemini
        # save
        # upload
        raise NotImplementedError()


async def store_vectordb_stage(record: RecordModel, db: Annotated[AsyncSession, Depends(async_get_db)]):
    await rag_index_service.execute_rag_index(db, record)
    return None


async def llm_summarize_stage(record: RecordModel, db: Annotated[AsyncSession, Depends(async_get_db)]):
    transcribe_output = record.pipeline_items[1].extra.get("transcribe_result", {}).get("output_path")
    with open(transcribe_output, "r", encoding="utf-8") as f:
        subtitle = f.read()
    context = "\n".join([extract_text(item.url) for item in record.attachments])
    prompt = f"""
       Bạn là một trợ lý thông minh. Tôi sẽ cung cấp cho bạn các đoạn thông tin (chunks) được trích xuất từ:
       1. Video bài giảng (transcript, phụ đề)
       2. Tài liệu PDF liên quan (slide, handout, sách tham khảo)

       Nội dung transcript:
       {subtitle}
       Nội dung tệp đính kèm: 
       {context}
       
       {RECORD_SUMMARIZE_STRUCTURES[record.record_content_type]}
       """
    response_llm = await asyncio.to_thread(llm_service.generate_text_gemini, prompt)
    return {
        "system_prompt": prompt,
        "summary": response_llm
    }
