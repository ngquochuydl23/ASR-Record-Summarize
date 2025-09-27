from .llm_route import llm_service
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, BackgroundTasks
from typing import Annotated, cast, List
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import noload, selectinload
from .record_route import rag_index_service
from ...core.exceptions.app_exception import AppException
from ...core.logger import logging
from ...dtos.conversation_dto import ConversationDto, CreateConversationDto
from ...dtos.message_dto import CreateMessageDto, MessageDto
from ...dtos.user import UserDto
from ...models import RecordModel, UserModel
from ...models.conversations import ConversationModel
from ..dependencies import get_current_user
from ...conversation_cmanager import manager
from ...models.messages import MessageModel, SenderEnum
from ...services.llm_service import LLMService
from ...core.db.database import async_get_db, local_session
from datetime import datetime
from google.genai import types
import uuid

from ...services.rag_index_service import RagIndexService

router = APIRouter(tags=["Conversations"])
llm_service = LLMService()
rag_index_service = RagIndexService()


@router.get("/conversations/by-record/{record_id}", status_code=200, response_model=List[ConversationDto])
async def get_conversations_by_record_id(
        record_id: str,
        db: Annotated[AsyncSession, Depends(async_get_db)],
        current_user: Annotated[UserDto, Depends(get_current_user)]):
    result = await db.execute(
        select(ConversationModel)
        .options(noload(ConversationModel.record))
        .options(noload(ConversationModel.messages))
        .where(
            and_(
                ConversationModel.is_deleted == False,
                ConversationModel.record_id == record_id,
                ConversationModel.owner_id == current_user["id"]
            )
        )
    )
    return cast(ConversationDto, result.scalars().all())


@router.post("/conversations", status_code=201)
async def create_conversation(
        body: CreateConversationDto,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
        background_tasks: BackgroundTasks
):
    result = await db.execute(select(RecordModel).where(RecordModel.id == body.record_id))
    record = result.scalars().first()
    if not record:
        raise AppException(f"Record {body.record_id} not found")
    generated_title = llm_service.generate_title_conversation(body.message.msg_content)
    conversation = ConversationModel(
        id=uuid.uuid4(),
        record_id=record.id,
        owner_id=current_user["id"],
        start_time=datetime.utcnow(),
        title=generated_title,
        messages=[
            MessageModel(
                id=uuid.uuid4(),
                sender=SenderEnum.USER,
                msg_content=body.message.msg_content,
                owner_id=current_user["id"]
            )
        ]
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)

    background_tasks.add_task(
        _ask_llm,
        conversation,
        record,
        conversation.messages[0]
    )
    return conversation.to_dict()


@router.post("/conversations/{conversation_id}/send-msg", status_code=201)
async def send_msg(
        body: CreateMessageDto,
        conversation_id: str,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
        background_tasks: BackgroundTasks
):
    conversation = ((await db.execute(select(ConversationModel).where(ConversationModel.id == conversation_id))).
                    scalars().first())
    if not conversation:
        raise AppException(f"Conversation {conversation_id} not found")

    record = (await db.execute(select(RecordModel).where(RecordModel.id == conversation.record_id))).scalars().first()
    if not record:
        raise AppException(f"Record {body.record_id} not found")

    message = MessageModel(
        id=uuid.uuid4(),
        sender=SenderEnum.USER,
        msg_content=body.msg_content,
        conversation_id=conversation.id,
        owner_id=current_user["id"]
    )
    background_tasks.add_task(_ask_llm, conversation, record, message)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message.to_dict()


@router.get("/conversations/{conversation_id}/messages", status_code=200)
async def get_messages(
        conversation_id: str,
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)]
):
    conversation = (
        (await db.execute(select(ConversationModel).where(ConversationModel.id == uuid.UUID(conversation_id)))).
        scalars().first())
    if not conversation:
        raise AppException(f"Conversation {conversation_id} not found")

    result = await db.execute(
        select(MessageModel)
        .where(and_(
            MessageModel.is_deleted == False,
            MessageModel.conversation_id == conversation.id
        ))
    )
    return cast(MessageDto, result.scalars().all())


@router.websocket("/conversations/ws/{conversation_id}")
async def websocket_task_endpoint(websocket: WebSocket, conversation_id: str):
    await manager.connect(conversation_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect as e:
        manager.disconnect(conversation_id, websocket)


async def _ask_llm(
        conversation: ConversationModel,
        record: RecordModel,
        message: MessageModel
):
    async with local_session() as db:
        try:
            chunks = await rag_index_service.search_similar_chunks(
                db,
                message.msg_content,
                record.id,
                top_k=5,
                threshold=0.1
            )
            context = "\n\n".join([f"{chunk['content']}" for i, chunk in enumerate(chunks)])
            prompt = f"""
            Bạn là một trợ lý ảo trong ứng dụng ASR Record.
            Ứng dụng này chuyên ghi âm, nhận dạng giọng nói (ASR), tạo transcript, tóm tắt và trích xuất ý chính từ các buổi họp.

            Nguyên tắc:
            - Chỉ sử dụng transcript và dữ liệu của ứng dụng (tiêu đề cuộc họp, người tham gia, thời gian, nội dung đã lưu).
            - Nếu thông tin không có trong transcript, hãy trả lời chính xác: "Thông tin này không có trong bản ghi."
              Sau đó hỏi người dùng: "Bạn có muốn tôi tìm trong tri thức bên ngoài không?"
            - Câu trả lời cần rõ ràng, ngắn gọn, dễ hiểu.
            - Khi phù hợp, trích dẫn ngắn một đoạn transcript để minh họa.
            - Với câu hỏi phức tạp:
              1. Trả lời trực tiếp trước.
              2. Sau đó liệt kê bằng gạch đầu dòng những bằng chứng (câu hoặc đoạn) từ transcript.
            - Nếu transcript có mâu thuẫn, hãy nêu rõ các khả năng kèm nguồn trích dẫn.

            Khả năng đặc biệt:
            - Tóm tắt toàn bộ hoặc một phần nội dung họp.
            - Trích xuất danh sách nhiệm vụ, quyết định, vấn đề thảo luận, ý kiến từng người.
            - Xác định người tham gia và những gì họ đã nói.
            - Trả lời các câu hỏi như: "Ai nói gì?", "Khi nào thảo luận vấn đề này?", "Kết luận của buổi họp là gì?"

            Không được:
            - Tự thêm nội dung không có trong transcript.
            - Sử dụng kiến thức ngoài phạm vi ứng dụng nếu người dùng chưa đồng ý.

            --- Dữ liệu cuộc họp ---
            {context}

            --- Câu hỏi ---
            {message.msg_content}
            """
            full_answer = ""
            for chunk in llm_service.gemini_client.models.generate_content_stream(
                    model='gemini-2.0-flash',
                    contents=prompt
            ):
                await manager.broadcast(str(conversation.id), {"type": "chunk", "content": chunk.text})
                full_answer += chunk.text
            await manager.broadcast(str(conversation.id), {"type": "done", "content": full_answer})

            ai_msg = MessageModel(
                id=uuid.uuid4(),
                conversation_id=conversation.id,
                sender=SenderEnum.AI,
                msg_content=full_answer,
                owner_id=None
            )
            db.add(ai_msg)
            await db.commit()
        except Exception as e:
            logging.error("Error", str(e))
            await db.rollback()
            raise
