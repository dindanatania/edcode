import { Course } from './course';

export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface LessonProgress {
  id: number;
  lesson_id: number;
  is_completed: boolean;
  completed_at?: string | null;
}

export interface Enrollment {
  id: number;
  course_id: number;
  status: EnrollmentStatus;
  progress_percentage: number;
  enrolled_at: string;
  completed_at?: string | null;
  course: Course;
  lesson_progresses: LessonProgress[];
}

