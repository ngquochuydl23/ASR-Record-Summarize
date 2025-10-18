from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import Annotated, List, Optional
from sqlalchemy import select, func, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload
from ..core.db.database import async_get_db
from ..dtos.category_dto import (
    CategoryCreateDto, 
    CategoryUpdateDto, 
    CategoryDto, 
    PaginatedCategoriesDto,
    CategoryHierarchyDto,
    CategoryWithChildrenDto
)
from ..dtos.user import UserDto
from ..models import CategoryModel, UserModel
from ..api.dependencies import get_current_user
import uuid


router = APIRouter(tags=["Categories"])


@router.post("/categories", status_code=201, response_model=CategoryDto)
async def create_category(
    body: CategoryCreateDto,
    current_user: Annotated[UserDto, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> CategoryDto:
    """Create a new category"""
    
    # Check if slug already exists
    existing_category = await db.execute(
        select(CategoryModel).where(CategoryModel.slug == body.slug)
    )
    if existing_category.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this slug already exists"
        )
    
    # Validate parent category exists if provided
    if body.parent_id:
        parent_category = await db.execute(
            select(CategoryModel).where(CategoryModel.id == body.parent_id)
        )
        if not parent_category.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent category not found"
            )
    
    category = CategoryModel(
        id=uuid.uuid4(),
        title=body.title,
        slug=body.slug,
        description=body.description,
        parent_id=body.parent_id,
        creator_id=current_user["id"]
    )
    
    db.add(category)
    await db.commit()
    await db.refresh(category)
    
    return CategoryDto.model_validate(category)


@router.get("/categories", response_model=PaginatedCategoriesDto)
async def get_categories(
    current_user: Annotated[UserDto, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    s: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, gt=0, le=100),
    mode: Optional[str] = Query(None, description="hierarchy for hierarchical view")
) -> PaginatedCategoriesDto:
    """Get categories with pagination and search"""
    
    offset = (page - 1) * limit
    
    base_query = select(CategoryModel).where(CategoryModel.is_deleted == False)
    
    # Search functionality
    if s:
        search = f"%{s.lower()}%"
        base_query = base_query.where(or_(
            func.lower(CategoryModel.title).like(search),
            func.lower(CategoryModel.description).like(search)
        ))
    
    # If hierarchy mode, return hierarchical structure
    if mode == "hierachy":
        query = (base_query
            .options(
                selectinload(CategoryModel.children),
                joinedload(CategoryModel.creator),
                joinedload(CategoryModel.parent)
            )
            .where(CategoryModel.parent_id.is_(None))  # Only root categories
            .order_by(CategoryModel.title)
        )
        
        result = await db.execute(query)
        root_categories = result.unique().scalars().all()
        
        # Convert to hierarchical DTOs
        hierarchical_categories = []
        for category in root_categories:
            hierarchical_categories.append(
                CategoryWithChildrenDto.model_validate(category)
            )
        
        return CategoryHierarchyDto(categories=hierarchical_categories)
    
    # Regular paginated query
    query = (base_query
        .options(
            joinedload(CategoryModel.creator),
            joinedload(CategoryModel.parent)
        )
        .order_by(desc(CategoryModel.created_at))
    )
    
    result = await db.execute(query.offset(offset).limit(limit))
    count_stmt = select(func.count()).select_from(base_query.subquery())
    total = (await db.execute(count_stmt)).scalar_one()
    categories = result.unique().scalars().all()
    
    return PaginatedCategoriesDto(
        total=total,
        page=page,
        limit=limit,
        count=len(categories),
        items=[CategoryDto.model_validate(c) for c in categories]
    )


@router.get("/categories/{category_id}", response_model=CategoryDto)
async def get_category_by_id(
    category_id: str,
    current_user: Annotated[UserDto, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> CategoryDto:
    """Get category by ID"""
    
    result = await db.execute(
        select(CategoryModel)
        .options(
            joinedload(CategoryModel.creator),
            joinedload(CategoryModel.parent)
        )
        .where(CategoryModel.id == category_id)
        .where(CategoryModel.is_deleted == False)
    )
    
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return CategoryDto.model_validate(category)


@router.get("/categories/by-slug/{slug}", response_model=CategoryDto)
async def get_category_by_slug(
    slug: str,
    current_user: Annotated[UserDto, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> CategoryDto:
    """Get category by slug"""
    
    result = await db.execute(
        select(CategoryModel)
        .options(
            joinedload(CategoryModel.creator),
            joinedload(CategoryModel.parent)
        )
        .where(CategoryModel.slug == slug)
        .where(CategoryModel.is_deleted == False)
    )
    
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return CategoryDto.model_validate(category)


@router.put("/categories/{category_id}", response_model=CategoryDto)
async def update_category(
    category_id: str,
    body: CategoryUpdateDto,
    current_user: Annotated[UserDto, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> CategoryDto:
    """Update category"""
    
    result = await db.execute(
        select(CategoryModel).where(CategoryModel.id == category_id)
    )
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if user is the creator
    if category.creator_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own categories"
        )
    
    # Check if slug already exists (if being updated)
    if body.slug and body.slug != category.slug:
        existing_category = await db.execute(
            select(CategoryModel).where(CategoryModel.slug == body.slug)
        )
        if existing_category.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this slug already exists"
            )
    
    # Update fields
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    
    await db.commit()
    await db.refresh(category)
    
    return CategoryDto.model_validate(category)


@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    current_user: Annotated[UserDto, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict:
    """Delete category (soft delete)"""
    
    result = await db.execute(
        select(CategoryModel).where(CategoryModel.id == category_id)
    )
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if user is the creator
    if category.creator_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own categories"
        )
    
    # Soft delete
    category.is_deleted = True
    await db.commit()
    
    return {"message": "Category deleted successfully"}
