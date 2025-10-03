from typing import Optional
from pydantic import BaseModel, ConfigDict
import uuid

class RecordPipelineItemDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    type: int
    status: str
    error_message: Optional[str]
    extra: dict

class MinimalRecordPipelineItemDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    type: int
    status: str
    error_message: Optional[str]