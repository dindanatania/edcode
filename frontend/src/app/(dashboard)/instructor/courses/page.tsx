'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { courseService } from '@/services/course';
import { Course } from '@/types/course';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService
      .getInstructorCourses()
      .then(setCourses)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Dashboard Instruktur
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Kelola materi, modul, video, dan kuis kursus yang Anda ajar.
            </p>
          </div>
          <button
            onClick={() => alert('Fitur Course Builder Modal/Form bisa Anda kembangkan selanjutnya.')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
          >
            + Buat Kursus Baru
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        course.is_published
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {course.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                    {course.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-xs font-medium text-zinc-500">
                    Slug: /{course.slug}
                  </span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Pratinjau →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-5xl">✍️</span>
            <h2 className="mt-4 text-lg font-bold text-zinc-800 dark:text-zinc-200">
              Belum ada kursus yang Anda buat
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              Bagikan ilmu dan pengalaman Anda kepada ribuan siswa dengan membuat kursus pertama Anda.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

