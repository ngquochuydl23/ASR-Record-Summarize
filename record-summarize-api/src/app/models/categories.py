from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.app.core.db.database import Base, BaseMixin
from ..constants.table_names import CATEGORY_TABLE_NAME, USER_TABLE_NAME
from dataclasses import dataclass
import uuid


@dataclass(init=True, repr=True)
class CategoryModel(Base, BaseMixin):
    __tablename__ = CATEGORY_TABLE_NAME

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Self-referential relationship for parent-child categories
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey(f"{CATEGORY_TABLE_NAME}.id", ondelete="CASCADE"),
        nullable=True,
        default=None
    )
    
    # Creator relationship
    creator_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{USER_TABLE_NAME}.id", ondelete="RESTRICT"),
        nullable=False
    )
    
    # Relationships
    creator = relationship("UserModel", back_populates="categories")
    parent = relationship("CategoryModel", remote_side="CategoryModel.id", back_populates="children")
    children = relationship("CategoryModel", back_populates="parent", cascade="all, delete-orphan")
    
    # Count of records in this category (computed field)
    record_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
