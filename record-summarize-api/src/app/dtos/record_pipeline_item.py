from typing import Optional
from pydantic import BaseModel, ConfigDict
import uuid

class RecordPipelineItemDto(BaseModel):
    id: uuid.UUID
    type: str
    status: str
    error_message: Optional[str]
    extra: dict