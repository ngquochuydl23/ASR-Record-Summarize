from sqlalchemy import ForeignKey, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from dataclasses import dataclass

from src.app.constants.table_names import USER_TABLE_NAME, RECORD_TABLE_NAME
from src.app.core.db.database import BaseMixin, Base
from src.app.models.messages import MessageModel
from ..constants.table_names import CONVERSATION_TABLE_NAME
import uuid
import datetime

@dataclass(init=True, repr=True)
class ConversationModel(Base, BaseMixin):
    __tablename__ = CONVERSATION_TABLE_NAME

    title: Mapped[str] = mapped_column(String, nullable=False, default=None)
    start_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True, default=None)
    end_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True, default=None)

    messages: Mapped[list["MessageModel"]] = relationship(
        "MessageModel",
        back_populates="conversation",
        cascade="all, delete-orphan",
        default_factory=lambda: [],
        lazy="selectin",
    )
    owner = relationship("UserModel", back_populates="conversations")
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{USER_TABLE_NAME}.id"), default=None)
    record = relationship("RecordModel", back_populates="conversations")
    record_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{RECORD_TABLE_NAME}.id"), default=None)