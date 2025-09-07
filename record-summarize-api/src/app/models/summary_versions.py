import uuid

from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.app.constants.table_names import SUMMARY_VERSION, RECORD_TABLE_NAME
from ..core.db.database import Base, BaseMixin
from dataclasses import dataclass

@dataclass(init=True, repr=True)
class SummaryVersionModel(Base, BaseMixin):
    __tablename__ = SUMMARY_VERSION
    title: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default=None)

    summary_content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default=None
    )

    published: Mapped[bool] = mapped_column(Boolean, nullable=True, default=False)
    record_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{RECORD_TABLE_NAME}.id", ondelete="RESTRICT"),
        nullable=False,
        default=None
    )
    record: Mapped[object] = relationship(
        "RecordModel",
        back_populates="summary_versions",
        foreign_keys=[record_id],
        default=None,
        lazy=False
    )
