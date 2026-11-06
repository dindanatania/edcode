from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base


class LessonContentType(str, enum.Enum):
    VIDEO = "video"
    ARTICLE = "article"
    QUIZ = "quiz"


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

    courses = relationship("Course", back_populates="category")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    price = Column(Float, default=0.0)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)

    instructor = relationship("User", back_populates="courses_taught")
    category = relationship("Category", back_populates="courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan", order_by="Module.order")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=1)

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan", order_by="Lesson.order")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content_type = Column(Enum(LessonContentType), default=LessonContentType.ARTICLE)
    content = Column(Text, nullable=True)  # Markdown or rich text
    video_url = Column(String(500), nullable=True)
    duration_minutes = Column(Integer, default=0)
    order = Column(Integer, default=1)
    is_free_preview = Column(Boolean, default=False)

    module = relationship("Module", back_populates="lessons")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")

