from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.models.enrollment import EnrollmentStatus
from app.schemas.course import CourseListItem


class EnrollmentCreate(BaseModel):
    course_id: int


class LessonProgressResponse(BaseModel):
    id: int
    lesson_id: int
    is_completed: bool
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EnrollmentResponse(BaseModel):
    id: int
    course_id: int
    status: EnrollmentStatus
    progress_percentage: float
    enrolled_at: datetime
    completed_at: Optional[datetime] = None
    course: CourseListItem
    lesson_progresses: List[LessonProgressResponse] = []

    class Config:
        from_attributes = True


class ProgressUpdate(BaseModel):
    lesson_id: int
    is_completed: bool = True

