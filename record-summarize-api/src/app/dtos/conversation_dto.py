from typing import List, Optional
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
    is_pinned: Optional[bool]
    pinned_at: Optional[datetime]


class PinConversationBody(BaseModel):
    is_pinned: bool

class UpdateConversationBody(BaseModel):
    title: str

class RecordInsideConversation(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    description: Optional[str]
    record_content_type: Optional[str]
    url: Optional[str]
    lang: Optional[str]
    emails: List[str]
    source_type: str
    thumbnail: Optional[str]
    current_version_id: Optional[uuid.UUID]


class ConversationRecordDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    record_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    record: RecordInsideConversation
    is_pinned: Optional[bool]
    pinned_at: Optional[datetime]


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