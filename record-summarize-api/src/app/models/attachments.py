from sqlalchemy import String, ForeignKey, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from dataclasses import dataclass

from src.app.constants.table_names import USER_TABLE_NAME, RECORD_TABLE_NAME
from src.app.core.db.database import BaseMixin, Base
from ..constants.table_names import ATTACHMENT_TABLE_NAME
import uuid


@dataclass(init=True, repr=True)
class AttachmentModel(Base, BaseMixin):
    __tablename__ = ATTACHMENT_TABLE_NAME

    filename: Mapped[str] = mapped_column(String, nullable=False, default=None)
    url: Mapped[str] = mapped_column(String, nullable=False, default=None)
    mime: Mapped[str] = mapped_column(String, nullable=False, default=None)
    size: Mapped[int] = mapped_column(Integer, nullable=True, default=0)

    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{USER_TABLE_NAME}.id"), default=None)
    record_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{RECORD_TABLE_NAME}.id"), default=None)

    owner = relationship("UserModel")
    record = relationship("RecordModel", back_populates="attachments")
    document = relationship("RagDocumentModel", back_populates="attachment", uselist=False)

    is_rag: Mapped[bool] = mapped_column(Boolean, nullable=True, default=False)
