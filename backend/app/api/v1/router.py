from fastapi import APIRouter
from app.api.v1.endpoints import auth, courses, enrollments

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(enrollments.router, prefix="/enrollments", tags=["Enrollments"])

