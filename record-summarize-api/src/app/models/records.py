from typing import Optional

from sqlalchemy import String, Float, ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.app.core.db.database import Base, BaseMixin
from .record_pipeline_items import PipelineItemType
from ..constants.table_names import RECORD_TABLE_NAME, USER_TABLE_NAME, SUMMARY_VERSION
from dataclasses import dataclass
import uuid
import enum
from sqlalchemy.dialects.postgresql import ARRAY


class PermissionLevel(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    INVITE_ONLY = "invite_only"


class RecordLang(str, enum.Enum):
    EN = "en"
    VIE = "vie"


class RecordSourceType(str, enum.Enum):
    LOCAL = "local"
    YOUTUBE = "youtube"


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
    duration: Mapped[float] = mapped_column(Float, nullable=True, default=0)

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
        order_by="RecordPipelineItemModel.type.asc()",
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
    subtitle_url: Mapped[Optional[str]] = mapped_column(String, nullable=True, default=None)
    lang: Mapped[RecordLang] = mapped_column(
        Enum(RecordLang),
        nullable=True,
        default=RecordLang.VIE
    )

    source_type: Mapped[RecordSourceType] = mapped_column(
        Enum(RecordSourceType),
        nullable=True,
        default=RecordSourceType.LOCAL
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
        lazy=False
    )

    current_version_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey(f"{SUMMARY_VERSION}.id", ondelete="SET NULL"),
        default=None,
        nullable=True
    )

    current_version: Mapped[Optional[object]] = relationship(
        "SummaryVersionModel",
        foreign_keys=[current_version_id],
        post_update=True,
        uselist=False,
        default=None,
        lazy="select",
    )

    summary_versions: Mapped[list[object]] = relationship(
        "SummaryVersionModel",
        back_populates="record",
        cascade="all, delete-orphan",
        lazy="select",
        foreign_keys="SummaryVersionModel.record_id",
        default_factory=lambda: [],
        order_by="SummaryVersionModel.created_at.desc()",
    )