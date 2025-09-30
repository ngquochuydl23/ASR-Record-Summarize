import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional

class MinimalRecordDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    record_content_type: Optional[str]
    lang: Optional[str]
    source_type: str

class SummaryRecordDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    summary_content: str
    published: bool
    record: Optional[MinimalRecordDto]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


