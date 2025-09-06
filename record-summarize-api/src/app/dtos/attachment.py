from typing import Optional
from pydantic import BaseModel, ConfigDict
import uuid

class AttachmentCreateDto(BaseModel):
    url: str
    filename: str
    mime: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class AttachmentDto(BaseModel):
    id: uuid.UUID
    url: str
    filename: str
    mime: str
    owner_id: uuid.UUID