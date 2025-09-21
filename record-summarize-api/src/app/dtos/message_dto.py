from typing import Optional
from datetime import datetime
from pydantic import BaseModel
import uuid


class CreateMessageDto(BaseModel):
    msg_content: str
    #attachments: list[str]


class MessageDto(BaseModel):
    id: uuid.UUID
    msg_content: str
    sender: str
    conversation_id: uuid.UUID
    owner_id: uuid.UUID