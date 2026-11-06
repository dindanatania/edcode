from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user, get_current_instructor
from app.models.user import User, UserRole
from app.models.course import Course, Module, Lesson
from app.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseListItem,
    CourseDetailResponse,
    ModuleCreate,
    ModuleResponse,
    LessonCreate,
    LessonResponse,
)

router = APIRouter()


@router.get("/", response_model=List[CourseListItem])
def list_courses(
    category_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Course).filter(Course.is_published == True)
    if category_id:
        query = query.filter(Course.category_id == category_id)
    return query.offset(skip).limit(limit).all()


@router.get("/instructor/my-courses", response_model=List[CourseListItem])
def list_instructor_courses(
    current_user: User = Depends(get_current_instructor),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.ADMIN:
        return db.query(Course).all()
    return db.query(Course).filter(Course.instructor_id == current_user.id).all()


@router.post("/", response_model=CourseListItem, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate,
    current_user: User = Depends(get_current_instructor),
    db: Session = Depends(get_db)
):
    existing = db.query(Course).filter(Course.slug == course_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Course slug already taken")
    
    course = Course(
        title=course_in.title,
        slug=course_in.slug,
        description=course_in.description,
        thumbnail_url=course_in.thumbnail_url,
        price=course_in.price,
        category_id=course_in.category_id,
        instructor_id=current_user.id,
        is_published=False
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/{slug}", response_model=CourseDetailResponse)
def get_course_by_slug(slug: str, db: Session = Depends(get_db)):
    course = (
        db.query(Course)
        .options(joinedload(Course.modules).joinedload(Module.lessons))
        .filter(Course.slug == slug)
        .first()
    )
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.put("/{course_id}", response_model=CourseListItem)
def update_course(
    course_id: int,
    course_in: CourseUpdate,
    current_user: User = Depends(get_current_instructor),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to edit this course")

    update_data = course_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)
    return course


@router.post("/{course_id}/modules", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
def add_module(
    course_id: int,
    module_in: ModuleCreate,
    current_user: User = Depends(get_current_instructor),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to modify this course")

    module = Module(
        course_id=course_id,
        title=module_in.title,
        description=module_in.description,
        order=module_in.order
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


@router.post("/{course_id}/modules/{module_id}/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def add_lesson(
    course_id: int,
    module_id: int,
    lesson_in: LessonCreate,
    current_user: User = Depends(get_current_instructor),
    db: Session = Depends(get_db)
):
    module = db.query(Module).filter(Module.id == module_id, Module.course_id == course_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found in this course")
    
    course = module.course
    if course.instructor_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to modify this course")

    lesson = Lesson(
        module_id=module_id,
        title=lesson_in.title,
        content_type=lesson_in.content_type,
        content=lesson_in.content,
        video_url=lesson_in.video_url,
        duration_minutes=lesson_in.duration_minutes,
        order=lesson_in.order,
        is_free_preview=lesson_in.is_free_preview
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

