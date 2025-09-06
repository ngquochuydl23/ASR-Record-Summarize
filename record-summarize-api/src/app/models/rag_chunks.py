import uuid
from typing import Optional
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from sqlalchemy import String, Text, Integer
from dataclasses import dataclass
from src.app.constants.table_names import RAG_CHUNKS_TABLE_NAME, RAG_DOCUMENT_TABLE_NAME
from src.app.core.db.database import BaseMixin, Base
from sqlalchemy import ForeignKey


@dataclass(init=True, repr=True)
class RagChunkModel(Base, BaseMixin):
    __tablename__ = RAG_CHUNKS_TABLE_NAME


    source_name: Mapped[Optional[str]] = mapped_column(String, nullable=True, default=None)

    content: Mapped[str] = mapped_column(Text, nullable=False, default=None)
    embedding: Mapped[list[float]] = mapped_column(Vector(dim=1536), nullable=False, default=None)
    additional_data: Mapped[dict] = mapped_column(JSONB, default=dict)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    document = relationship("RagDocumentModel", back_populates="chunks")
    document_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(f"{RAG_DOCUMENT_TABLE_NAME}.id"),
        nullable=True,
        default=None
    )