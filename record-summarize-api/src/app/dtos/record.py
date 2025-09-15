import uuid

from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from src.app.dtos.attachment import AttachmentCreateDto, AttachmentDto
from src.app.models.records import PermissionLevel


class RecordBaseDto(BaseModel):
    title: str
    description: Optional[str]
    url: Optional[str] = None
    emails: List[str]
    source_type: str


class RecordCreateDto(BaseModel):
    title: str
    description: Optional[str]
    url: Optional[str] = None
    emails: List[str]
    lang: str
    source_type: str
    attachments: List[AttachmentCreateDto] = []
    record_content_type: Optional[str]


class RecordUpdateDto(BaseModel):
    title: Optional[str]
    content: Optional[str]
    source_type: str
    permission: Optional[PermissionLevel]


class RecordUpdateInternal(RecordUpdateDto):
    updated_at: datetime


class RecordDto(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str]
    record_content_type: Optional[str]
    url: str
    subtitle_url: Optional[str]
    lang: Optional[str]
    emails: List[str]
    source_type: str
    attachments: List[AttachmentDto]
    pipeline_items: List[object]
    published: Optional[bool]
    current_step: Optional[int]
    creator: Optional[object]
    current_version_id: Optional[uuid.UUID]
    current_version: Optional[object]
    duration: Optional[float]
    chatbot_preparation_state: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class RequestGenerateFormRecordDto(BaseModel):
    prompt: str


class ResponseGenerateFormRecordDto(BaseModel):
    title: str
    description: Optional[str]
    record_content_type: Optional[str]


class RecordDelete(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_deleted: bool
    deleted_at: datetime
