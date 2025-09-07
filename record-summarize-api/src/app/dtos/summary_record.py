import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class SummaryRecordDto(BaseModel):
    id: uuid.UUID
    title: str
    summary_content: str
    published: bool
    record: Optional[object]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]