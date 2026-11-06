from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.models.course import LessonContentType
from app.schemas.user import UserResponse


# Lesson Schemas
class LessonBase(BaseModel):
    title: str
    content_type: LessonContentType = LessonContentType.ARTICLE
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: int = 0
    order: int = 1
    is_free_preview: bool = False


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    content_type: Optional[LessonContentType] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    order: Optional[int] = None
    is_free_preview: Optional[bool] = None


class LessonResponse(LessonBase):
    id: int
    module_id: int

    class Config:
        from_attributes = True


# Module Schemas
class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: int = 1


class ModuleCreate(ModuleBase):
    pass


class ModuleResponse(ModuleBase):
    id: int
    course_id: int
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# Course Schemas
class CourseBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: float = 0.0
    category_id: Optional[int] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    is_published: Optional[bool] = None


class CourseListItem(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: float
    is_published: bool
    created_at: datetime
    instructor: UserResponse
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


class CourseDetailResponse(CourseListItem):
    modules: List[ModuleResponse] = []

