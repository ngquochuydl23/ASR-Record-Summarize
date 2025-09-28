from typing import Optional
from datetime import datetime
from pydantic import BaseModel
import uuid


class CreateMessageDto(BaseModel):
    id: uuid.UUID
    msg_content: str
    #attachments: list[str]
    reply_from_id: Optional[uuid.UUID]
    web_search: Optional[bool]


class MessageDto(BaseModel):
    id: uuid.UUID
    msg_content: str
    sender: str
    conversation_id: uuid.UUID
    owner_id: uuid.UUID