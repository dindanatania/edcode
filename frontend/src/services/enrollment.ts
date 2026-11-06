import { apiFetch } from '@/lib/api';
import { Enrollment } from '@/types/enrollment';

export const enrollmentService = {
  async enroll(courseId: number): Promise<Enrollment> {
    return apiFetch<Enrollment>('/enrollments/', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
  },

  async getMyEnrollments(): Promise<Enrollment[]> {
    return apiFetch<Enrollment[]>('/enrollments/my');
  },

  async updateLessonProgress(lessonId: number, isCompleted: boolean = true): Promise<Enrollment> {
    return apiFetch<Enrollment>('/enrollments/progress', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId, is_completed: isCompleted }),
    });
  },
};

