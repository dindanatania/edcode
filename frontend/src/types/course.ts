import { User } from './auth';

export type LessonContentType = 'video' | 'article' | 'quiz';

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content_type: LessonContentType;
  content?: string | null;
  video_url?: string | null;
  duration_minutes: number;
  order: number;
  is_free_preview: boolean;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description?: string | null;
  order: number;
  lessons: Lesson[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  thumbnail_url?: string | null;
  price: number;
  is_published: boolean;
  created_at: string;
  instructor: User;
  category?: Category | null;
  modules?: Module[];
}
