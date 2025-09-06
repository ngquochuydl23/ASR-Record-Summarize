import enum
from sqlalchemy import String, Enum, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from src.app.constants.table_names import RAG_DOCUMENT_TABLE_NAME, RECORD_TABLE_NAME, ATTACHMENT_TABLE_NAME
from src.app.core.db.database import BaseMixin, Base
from dataclasses import dataclass
import uuid


class RAGSourceTypeEnum(str, enum.Enum):
    ATTACHMENT = "Attachment"
    TRANSCRIPT = "Transcript"


@dataclass(init=True, repr=True)
class RagDocumentModel(Base, BaseMixin):
    __tablename__ = RAG_DOCUMENT_TABLE_NAME

    source_type: Mapped[RAGSourceTypeEnum] = mapped_column(
        Enum(RAGSourceTypeEnum),
        default=None,
        nullable=True
    )

    chunks: Mapped[list[object]] = relationship(
        "RagChunkModel",
        back_populates="document",
        default_factory=lambda: [],
        lazy="select"
    )
    attachment = relationship("AttachmentModel", back_populates="document", uselist=False)
    attachment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{ATTACHMENT_TABLE_NAME}.id", ondelete="RESTRICT"),
        nullable=False,
        default=None
    )

    record = relationship("RecordModel")
    record_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{RECORD_TABLE_NAME}.id", ondelete="RESTRICT"),
        nullable=False,
        default=None
    )
