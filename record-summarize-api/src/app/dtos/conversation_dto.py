from typing import Optional
from datetime import datetime
from pydantic import BaseModel
import uuid

from sympy import false

from src.app.dtos.message_dto import CreateMessageDto


class ConversationDto(BaseModel):
    id: uuid.UUID
    title: str
    record_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CreateConversationDto(BaseModel):
    record_id: uuid.UUID
    message: CreateMessageDto
