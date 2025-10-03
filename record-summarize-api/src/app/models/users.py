from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.app.constants.table_names import USER_TABLE_NAME
from ..core.db.database import Base, BaseMixin
from typing import Optional
from dataclasses import dataclass


@dataclass(init=True, repr=True)
class UserModel(Base, BaseMixin):
    __tablename__ = USER_TABLE_NAME
    first_name: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default=None)

    last_name: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default=None)

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default=None)

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default=list)

    avatar: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        default=None
    )

    records = relationship("RecordModel", back_populates="creator", default_factory=lambda: [])
    conversations = relationship("ConversationModel", default_factory=lambda: [])
    messages = relationship("MessageModel", default_factory=lambda: [])
