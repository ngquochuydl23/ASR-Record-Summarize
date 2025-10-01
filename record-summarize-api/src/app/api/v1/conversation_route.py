from .llm_route import llm_service
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, BackgroundTasks, Query
from typing import Annotated, cast, List, Optional
from jinja2 import Environment, FileSystemLoader, select_autoescape
from sqlalchemy import select, and_, desc, asc, func, or_, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import noload, selectinload, joinedload
from .record_route import rag_index_service
from ...core.exceptions.app_exception import AppException
from ...core.logger import logging
from ...dtos.conversation_dto import ConversationDto, CreateConversationDto, PaginatedConversationsDto
from ...dtos.message_dto import CreateMessageDto, MessageDto
from ...dtos.user import UserDto
from ...models import RecordModel, UserModel
from ...models.conversations import ConversationModel
from ..dependencies import get_current_user
from ...conversation_cmanager import manager
from ...models.messages import MessageModel, SenderEnum, AgentMsgStatus
from ...services.llm_service import LLMService
from ...core.db.database import async_get_db, local_session
from ...services.rag_index_service import RagIndexService
from datetime import datetime
from google.genai import types
from ...utils.apply_paginate import apply_paginate
import uuid
import os

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "templates", 'prompts')
router = APIRouter(tags=["Conversations"])
llm_service = LLMService()
rag_index_service = RagIndexService()


@router.get("/conversations/by-record/{record_id}", status_code=200, response_model=PaginatedConversationsDto)
async def get_conversations_by_record_id(
        record_id: str,
        db: Annotated[AsyncSession, Depends(async_get_db)],
        current_user: Annotated[UserDto, Depends(get_current_user)],
        s: Optional[str] = None,
        page: int = Query(1, ge=1),
        limit: int = Query(10, gt=0, le=100),
):
    offset, limit = apply_paginate(page, limit)
    conditions = [
        ConversationModel.is_deleted == False,
        ConversationModel.record_id == record_id,
        ConversationModel.owner_id == current_user["id"]
    ]
    if s:
        search = f"%{s.lower()}%"
        conditions.append(func.lower(ConversationModel.title).like(search))
    query = (
        select(ConversationModel)
        .options(noload(ConversationModel.record))
        .options(noload(ConversationModel.messages))
        .where(and_(*conditions))
        .order_by(desc(ConversationModel.created_at))
    )

    result = await db.execute(query.offset(offset).limit(limit))
    conversations = result.unique().scalars().all()
    count_stmt = select(func.count()).select_from(ConversationModel).where(and_(*conditions))
    total = (await db.execute(count_stmt)).scalar_one()

    return PaginatedConversationsDto(
        total=total,
        page=page,
        limit=limit,
        items=[ConversationDto.model_validate(c) for c in conversations]
    )


@router.delete("/conversations", status_code=200)
async def delete_items(
        current_user: Annotated[UserDto, Depends(get_current_user)],
        db: Annotated[AsyncSession, Depends(async_get_db)],
        ids: List[uuid.UUID] = Query(..., description="IDs to delete"),
):
    if not ids:
        raise AppException("No ids provided")

    stmt = (
        update(ConversationModel)
        .where(ConversationModel.id.in_(ids))
        .values(is_deleted=True)
    )
    result = await db.execute(stmt)
    await db.commit()
    return {"deleted": result.rowcount}

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
        start_time=datetime.now(),
        title=generated_title,
        messages=[
            MessageModel(
                id=uuid.uuid4(),
                sender=SenderEnum.USER,
                msg_content=body.message.msg_content,
                owner_id=current_user["id"],
                created_at=datetime.now()
            )
        ]
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)

    background_tasks.add_task(
        _ask_llm,
        conversation.id,
        record.id,
        conversation.messages[0].id
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
        id=body.id,
        sender=SenderEnum.USER,
        msg_content=body.msg_content,
        conversation_id=conversation.id,
        owner_id=current_user["id"],
        agent_msg_status=None,
        reply_from_id=None,
        web_search=False,
        created_at=datetime.now()
    )

    if body.reply_from_id and body.web_search:
        stmt = select(MessageModel).where(MessageModel.id == body.reply_from_id)
        result = await db.execute(stmt)
        reply_msg = result.scalar_one_or_none()
        if not reply_msg:
            raise AppException("Reply message not found")

        message.reply_from_id = reply_msg.id
        message.web_search = body.web_search

    db.add(message)
    await db.commit()
    await db.refresh(message)

    background_tasks.add_task(_ask_llm, conversation.id, record.id, message.id)
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
        .options(noload(MessageModel.reply_from))
        .where(and_(
            MessageModel.is_deleted == False,
            MessageModel.conversation_id == conversation.id
        ))
        .order_by(asc(MessageModel.created_at))
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


async def _ask_llm(conversation_id: uuid.UUID, record_id: uuid.UUID, message_id: uuid.UUID):
    async with local_session() as db:
        message = await _get_msg_by_id(db, message_id)
        chunks = await rag_index_service.search_similar_chunks(db, message.msg_content,
                                                               record_id, top_k=5, threshold=0.1)
        context = "\n\n".join([f"{chunk['content']}" for i, chunk in enumerate(chunks)])
        if message.web_search and message.reply_from_id:
            reply_from_msg = await _get_msg_by_id(db, message.reply_from_id)
            prompt = _get_prompt_template("chatbot_answer_allow_search.text").render(
                context=context,
                question=message.msg_content,
                previous_question=reply_from_msg.msg_content
            )
        else:
            prompt = _get_prompt_template("chatbot_answer_non_search.text").render(
                context=context,
                question=message.msg_content
            )
        full_answer = ""
        grounding_tool = types.Tool(google_search=types.GoogleSearch())
        config = types.GenerateContentConfig(tools=[grounding_tool])
        try:
            for chunk in llm_service.gemini_client.models.generate_content_stream(
                    model='gemini-2.0-flash',
                    contents=prompt,
                    config=config if message.web_search else None
            ):
                await manager.broadcast(str(conversation_id), {
                    "type": "chunk",
                    "content": chunk.text,
                    "agent_msg_status": AgentMsgStatus.SUCCESS
                })
                full_answer += chunk.text
            await manager.broadcast(str(conversation_id), {
                "type": "done",
                "content": full_answer,
                "agent_msg_status": AgentMsgStatus.SUCCESS
            })

            ai_msg = MessageModel(
                id=uuid.uuid4(),
                conversation_id=conversation_id,
                sender=SenderEnum.AI,
                msg_content=full_answer,
                owner_id=None,
                agent_msg_status=AgentMsgStatus.SUCCESS,
                reply_from_id=None,
                web_search=False,
                created_at=datetime.now()
            )
            db.add(ai_msg)
            await db.commit()
            await db.refresh(ai_msg)
        except Exception as e:
            logging.error("Error", str(e))
            ai_msg = MessageModel(
                id=uuid.uuid4(),
                conversation_id=conversation_id,
                sender=SenderEnum.AI,
                msg_content=str(e),
                owner_id=None,
                agent_msg_status=AgentMsgStatus.FAILED,
                reply_from_id=None,
                web_search=False,
                created_at=datetime.now()
            )
            await manager.broadcast(str(conversation_id), {
                "type": "error",
                "content": str(e),
                "agent_msg_status": AgentMsgStatus.FAILED
            })
            db.add(ai_msg)
            await db.commit()
            await db.refresh(ai_msg)


def _get_prompt_template(path: str):
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR), autoescape=select_autoescape())
    return env.get_template(path)

async def _get_msg_by_id(db, id: uuid) -> MessageModel:
    result = await db.execute(
        select(MessageModel)
        .options(selectinload(MessageModel.reply_from))
        .where(MessageModel.id == id)
    )
    return result.scalar_one_or_none()
