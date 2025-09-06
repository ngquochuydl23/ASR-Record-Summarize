from sqlalchemy import String, DateTime, ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.app.core.db.database import Base, BaseMixin
from .record_pipeline_items import PipelineItemType
from ..constants.table_names import RECORD_TABLE_NAME, USER_TABLE_NAME
from dataclasses import dataclass
import uuid
import datetime
import enum
from sqlalchemy.dialects.postgresql import ARRAY


class PermissionLevel(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    INVITE_ONLY = "invite_only"


class RecordContentType(str, enum.Enum):
    MEETING = "Meeting"
    LECTURE_CLASS = "Lecture-Class"
    TUTORIAL_TRAINING = "Tutorial-Training"
    INTERVIEW = "Interview"
    TALKSHOW = "Talkshow"
    NEWS = "News"
    DOCUMENTARY = "Documentary"
    ENTERTAINMENT = "Entertainment"


@dataclass(init=True, repr=True)
class RecordModel(Base, BaseMixin):
    __tablename__ = RECORD_TABLE_NAME

    title: Mapped[str] = mapped_column(String, nullable=False, default=None)
    description: Mapped[str] = mapped_column(Text, nullable=True, default=None)
    start_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True, default=None)
    end_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True, default=None)

    emails: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default_factory=lambda: [],
        nullable=False
    )
    url: Mapped[str] = mapped_column(String, nullable=False, default=None)
    permission: Mapped[PermissionLevel] = mapped_column(
        Enum(PermissionLevel),
        default=PermissionLevel.PRIVATE,
        nullable=False
    )
    creator_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{USER_TABLE_NAME}.id", ondelete="RESTRICT"),
        nullable=False,
        default=None
    )
    creator = relationship("UserModel", back_populates="records")
    attachments: Mapped[list[object]] = relationship(
        "AttachmentModel",
        back_populates="record",
        cascade="all, delete-orphan",
        default_factory=lambda: [],
        lazy="select"
    )
    pipeline_items: Mapped[list[object]] = relationship(
        "RecordPipelineItemModel",
        back_populates="record",
        cascade="all, delete-orphan",
        default_factory=lambda: [],
        lazy="select"
    )

    published: Mapped[bool] = mapped_column(Boolean, nullable=True, default=False)
    current_step: Mapped[PipelineItemType] = mapped_column(
        Enum(PipelineItemType),
        default=PipelineItemType.CREATE_RECORD,
        nullable=True
    )
    record_content_type: Mapped[RecordContentType] = mapped_column(
        Enum(RecordContentType),
        nullable=True,
        default=None
    )

    # conversations: Mapped[list[object]] = relationship(
    #     "ConversationModel",
    #     back_populates="record",
    #     cascade="all, delete-orphan",
    #     default_factory=lambda: [],
    #     lazy="select"
    # )

    rag_documents: Mapped[list[object]] = relationship(
        "RagDocumentModel",
        back_populates="record",
        cascade="all, delete-orphan",
        default_factory=lambda: [],
        lazy="select"
    )