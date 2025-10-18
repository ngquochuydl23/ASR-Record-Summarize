from typing import Optional, List
from pydantic import BaseModel, Field
import uuid
from datetime import datetime


class CategoryBaseDto(BaseModel):
    title: str = Field(..., description="Category title")
    slug: str = Field(..., description="Category slug")
    description: Optional[str] = Field(None, description="Category description")
    parent_id: Optional[uuid.UUID] = Field(None, description="Parent category ID")


class CategoryCreateDto(CategoryBaseDto):
    pass


class CategoryUpdateDto(BaseModel):
    title: Optional[str] = Field(None, description="Category title")
    slug: Optional[str] = Field(None, description="Category slug")
    description: Optional[str] = Field(None, description="Category description")
    parent_id: Optional[uuid.UUID] = Field(None, description="Parent category ID")


class CategoryDto(CategoryBaseDto):
    id: uuid.UUID = Field(..., description="Category ID")
    creator_id: uuid.UUID = Field(..., description="Creator user ID")
    record_count: int = Field(0, description="Number of records in this category")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    class Config:
        from_attributes = True


class CategoryWithChildrenDto(CategoryDto):
    children: List['CategoryDto'] = Field(default_factory=list, description="Child categories")
    creator: Optional[dict] = Field(None, description="Creator information")
    parent: Optional['CategoryDto'] = Field(None, description="Parent category")


class PaginatedCategoriesDto(BaseModel):
    total: int = Field(..., description="Total number of categories")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Items per page")
    count: int = Field(..., description="Number of items in current page")
    items: List[CategoryDto] = Field(..., description="List of categories")


class CategoryHierarchyDto(BaseModel):
    categories: List[CategoryWithChildrenDto] = Field(..., description="Hierarchical list of categories")
