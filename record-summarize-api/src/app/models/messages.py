import enum
from typing import Optional
from sqlalchemy import ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from dataclasses import dataclass
from src.app.constants.table_names import USER_TABLE_NAME, RECORD_TABLE_NAME, MESSAGE_TABLE_NAME
from src.app.core.db.database import BaseMixin, Base
from ..constants.table_names import CONVERSATION_TABLE_NAME
import uuid

class SenderEnum(str, enum.Enum):
    AI = "AI"
    USER = "USER"


class AgentMsgStatus(str, enum.Enum):
    SUCCESS = "Success"
    FAILED = "Failed"


@dataclass(init=True, repr=True)
class MessageModel(Base, BaseMixin):
    __tablename__ = MESSAGE_TABLE_NAME

    msg_content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    sender: Mapped[SenderEnum] = mapped_column(Enum(SenderEnum), default=None, nullable=True)
    agent_msg_status: Mapped[AgentMsgStatus] = mapped_column(Enum(AgentMsgStatus), default=None, nullable=True)
    conversation = relationship("ConversationModel", back_populates="messages")
    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{CONVERSATION_TABLE_NAME}.id"), default=None)

    owner = relationship("UserModel", back_populates="messages")
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{USER_TABLE_NAME}.id"), default=None, nullable=True)

    reply_from_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{MESSAGE_TABLE_NAME}.id"), default=None, nullable=True)
    reply_from: Mapped[Optional[object]] = relationship(
        "MessageModel",
        foreign_keys=[reply_from_id],
        post_update=True,
        uselist=False,
        default=None,
        lazy="selectin",
    )
    web_search: Mapped[bool] = mapped_column(Boolean, nullable=True, default=None)