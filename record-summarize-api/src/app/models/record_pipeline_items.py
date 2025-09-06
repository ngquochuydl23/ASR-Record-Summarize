from sqlalchemy import DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.app.core.db.database import Base, BaseMixin
from ..constants.table_names import RECORD_TABLE_NAME, RECORD_PIPELINE_ITEM_TABLE_NAME
from dataclasses import dataclass
import uuid
import datetime
import enum
from sqlalchemy import ForeignKey, JSON, Text
from typing import Optional, Dict, Any

class PipelineItemType(int, enum.Enum):
    CREATE_RECORD = 0
    TRANSCRIBE = 1
    RAG_INDEX = 2
    GENERATE_SUM = 3


class PipelineItemStatus(str, enum.Enum):
    PENDING = "Pending"
    RUNNING = "Running"
    SUCCESS = "Success"
    FAILED = "Failed"
    CANCELLED = "Cancelled"


@dataclass(init=True, repr=True)
class RecordPipelineItemModel(Base, BaseMixin):
    __tablename__ = RECORD_PIPELINE_ITEM_TABLE_NAME

    start_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True, default=None)
    finished_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True, default=None)

    type: Mapped[PipelineItemType] = mapped_column(
        Enum(PipelineItemType),
        default=PipelineItemType.CREATE_RECORD,
        nullable=False
    )
    status: Mapped[PipelineItemStatus] = mapped_column(
        Enum(PipelineItemStatus),
        default=PipelineItemStatus.PENDING,
        nullable=False
    )
    record = relationship("RecordModel")
    record_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{RECORD_TABLE_NAME}.id", ondelete="RESTRICT"),
        nullable=False,
        default=None
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        default=None
    )
    extra: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict
    )


