import { apiFetch } from '@/lib/api';
import { Course } from '@/types/course';

export const courseService = {
  async getCourses(categoryId?: number): Promise<Course[]> {
    const query = categoryId ? `?category_id=${categoryId}` : '';
    return apiFetch<Course[]>(`/courses/${query}`);
  },

  async getCourseBySlug(slug: string): Promise<Course> {
    return apiFetch<Course>(`/courses/${slug}`);
  },

  async getInstructorCourses(): Promise<Course[]> {
    return apiFetch<Course[]>('/courses/instructor/my-courses');
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    return apiFetch<Course>('/courses/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

