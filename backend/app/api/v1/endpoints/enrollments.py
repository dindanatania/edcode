from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.course import Course, Lesson, Module
from app.models.enrollment import Enrollment, LessonProgress, EnrollmentStatus
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse, ProgressUpdate

router = APIRouter()


@router.post("/", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
def enroll_course(
    enroll_in: EnrollmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == enroll_in.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == enroll_in.course_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")

    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=enroll_in.course_id,
        status=EnrollmentStatus.ACTIVE,
        progress_percentage=0.0
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/my", response_model=List[EnrollmentResponse])
def get_my_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.course),
            joinedload(Enrollment.lesson_progresses)
        )
        .filter(Enrollment.user_id == current_user.id)
        .all()
    )


@router.post("/progress", response_model=EnrollmentResponse)
def update_lesson_progress(
    progress_in: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lesson = db.query(Lesson).join(Module).join(Course).filter(Lesson.id == progress_in.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    course_id = lesson.module.course_id
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="You are not enrolled in this course")

    progress = db.query(LessonProgress).filter(
        LessonProgress.enrollment_id == enrollment.id,
        LessonProgress.lesson_id == progress_in.lesson_id
    ).first()

    now = datetime.now(timezone.utc)
    if not progress:
        progress = LessonProgress(
            enrollment_id=enrollment.id,
            lesson_id=progress_in.lesson_id,
            is_completed=progress_in.is_completed,
            completed_at=now if progress_in.is_completed else None
        )
        db.add(progress)
    else:
        progress.is_completed = progress_in.is_completed
        progress.completed_at = now if progress_in.is_completed else None

    db.commit()

    # Recalculate percentage
    total_lessons = (
        db.query(Lesson)
        .join(Module)
        .filter(Module.course_id == course_id)
        .count()
    )
    completed_lessons = (
        db.query(LessonProgress)
        .filter(LessonProgress.enrollment_id == enrollment.id, LessonProgress.is_completed == True)
        .count()
    )

    if total_lessons > 0:
        enrollment.progress_percentage = round((completed_lessons / total_lessons) * 100, 2)
        if enrollment.progress_percentage >= 100.0:
            enrollment.status = EnrollmentStatus.COMPLETED
            enrollment.completed_at = now
    
    db.commit()
    db.refresh(enrollment)
    return enrollment

