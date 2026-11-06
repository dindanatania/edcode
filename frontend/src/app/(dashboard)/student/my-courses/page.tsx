'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { enrollmentService } from '@/services/enrollment';
import { Enrollment } from '@/types/enrollment';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enrollmentService
      .getMyEnrollments()
      .then(setEnrollments)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Kursus Saya
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Pantau progres belajar Anda dan lanjutkan materi yang belum selesai.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-60 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {item.status}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {item.course?.title || 'Kursus'}
                  </h3>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>Progres Belajar</span>
                      <span className="font-semibold">{item.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <Link
                    href={`/courses/${item.course?.slug || ''}`}
                    className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Lanjutkan Belajar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-5xl">🎯</span>
            <h2 className="mt-4 text-lg font-bold text-zinc-800 dark:text-zinc-200">
              Anda belum terdaftar di kelas manapun
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              Kunjungi katalog kursus dan mulai daftarkan diri Anda pada materi yang diminati.
            </p>
            <Link
              href="/courses"
              className="mt-5 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
            >
              Lihat Katalog Kursus
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

