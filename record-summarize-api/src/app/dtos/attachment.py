from typing import Optional
from pydantic import BaseModel, ConfigDict
import uuid

class AttachmentCreateDto(BaseModel):
    url: str
    filename: str
    mime: Optional[str] = None
    size: int
    model_config = ConfigDict(from_attributes=True)

class AttachmentDto(BaseModel):
    id: uuid.UUID
    url: str
    filename: str
    mime: str
    size: int
    owner_id: uuid.UUID