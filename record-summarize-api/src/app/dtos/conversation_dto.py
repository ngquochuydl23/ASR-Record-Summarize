from typing import List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
import uuid
from src.app.dtos.message_dto import CreateMessageDto


class ConversationDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    record_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CreateConversationDto(BaseModel):
    record_id: uuid.UUID
    message: CreateMessageDto


class PaginatedConversationsDto(BaseModel):
    total: int
    page: int
    limit: int
    items: List[ConversationDto]


class DeleteItemsDto(BaseModel):
    ids: List[uuid.UUID]