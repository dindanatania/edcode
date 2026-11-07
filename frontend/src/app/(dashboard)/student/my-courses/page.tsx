'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { enrollmentService } from '@/services/enrollment';
import { Enrollment } from '@/types/enrollment';
import { useLearningProgress } from '@/services/learningProgress';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const progress = useLearningProgress();

  const isPretestDone = progress.pretestCompleted;
  const isStackDone = progress.stackLessonsCompleted.length >= 10;
  const stackPercent = Math.min(100, Math.round((progress.stackLessonsCompleted.length / 10) * 100));
  const queuePercent = Math.min(100, Math.round((progress.queueLessonsCompleted.length / 10) * 100));

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
            Kursus & Modul Saya
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Pantau progres belajar Anda dan lanjutkan modul pembelajaran yang sedang berlangsung.
          </p>
        </div>

        {/* ── MODUL UTAMA SMK PPLG: STACK & QUEUE ── */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <span>📚</span>
            <span>Kurikulum Utama: Struktur Data</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Stack */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Modul 01 • LIFO
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    {progress.stackLessonsCompleted.length}/10 Modul
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Struktur Data: Stack
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Pelajari prinsip tumpukan data Last-In First-Out, operasi push, pop, peek, dan evaluasi postfix.
                </p>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5 font-medium">
                    <span>Progres Modul</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{stackPercent}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${stackPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ⭐ {progress.stackScore} Poin
                </span>

                <Link
                  href={isPretestDone ? '/courses/stack' : '/courses'}
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition shadow-xs"
                >
                  {isPretestDone ? 'Lanjutkan Belajar →' : 'Mulai Pre-Test ➔'}
                </Link>
              </div>
            </div>

            {/* Card 2: Queue */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Modul 02 • FIFO
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    {progress.queueLessonsCompleted.length}/10 Modul
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Struktur Data: Queue
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Pelajari prinsip antrean data First-In First-Out, operasi enqueue, dequeue, front, dan buffer sirkular.
                </p>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5 font-medium">
                    <span>Progres Modul</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{queuePercent}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${queuePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ⭐ {progress.queueScore} Poin
                </span>

                <Link
                  href={isStackDone ? '/courses/queue' : '/courses'}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition shadow-xs"
                >
                  {isStackDone ? 'Lanjutkan Belajar →' : 'Selesaikan Stack ➔'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── KELAS TAMBAHAN DARI BACKEND LMS (JIKA ADA) ── */}
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Kelas Tambahan Terdaftar
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
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
            <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-3xl">💡</span>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Belum ada kelas tambahan. Anda sedang aktif mengikuti Modul Kurikulum Struktur Data di atas.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

