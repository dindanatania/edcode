from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Float, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    DROPPED = "dropped"


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_user_course_enrollment"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.ACTIVE)
    progress_percentage = Column(Float, default=0.0)
    enrolled_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    lesson_progresses = relationship("LessonProgress", back_populates="enrollment", cascade="all, delete-orphan")


class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (UniqueConstraint("enrollment_id", "lesson_id", name="uq_enrollment_lesson"),)

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    enrollment = relationship("Enrollment", back_populates="lesson_progresses")
    lesson = relationship("Lesson", back_populates="progress_records")

