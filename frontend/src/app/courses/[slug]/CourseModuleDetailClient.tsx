'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { learningProgressService, PROGRESS_EVENT_NAME, INITIAL_PROGRESS } from '@/services/learningProgress';
import { LearningProgressState } from '@/types/progress';
import PretestModal from '@/components/learning/PretestModal';
import LessonDetailModal from '@/components/learning/LessonDetailModal';
import LockedModuleScreen from '@/components/learning/LockedModuleScreen';
import ToastNotification, { ToastVariant } from '@/components/ui/ToastNotification';

interface CourseModuleDetailClientProps {
  slug: string;
}

interface LessonItem {
  id: string;
  title: string;
  type: string;
  desc?: string;
}

export default function CourseModuleDetailClient({ slug }: CourseModuleDetailClientProps) {
  const isQueue = slug.toLowerCase() === 'queue';
  const moduleName = isQueue ? 'queue' : 'stack';
  const moduleTitle = isQueue ? 'Queue' : 'Stack';

  // Navigation & UI state
  const [activeSidebar, setActiveSidebar] = useState<'beranda' | 'modul' | 'leaderboard'>('modul');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPretestModalOpen, setIsPretestModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    variant: ToastVariant;
    title?: string;
    message: string;
  }>({
    isOpen: false,
    variant: 'info',
    title: 'Information',
    message: '',
  });

  // Learning Progress State initialized safely with INITIAL_PROGRESS
  const [progress, setProgress] = useState<LearningProgressState>(() => {
    try { return learningProgressService.getProgress(); } catch { return INITIAL_PROGRESS; }
  });

  useEffect(() => {
    const updateProgress = () => {
      setProgress(learningProgressService.getProgress());
    };
    window.addEventListener(PROGRESS_EVENT_NAME, updateProgress);
    return () => window.removeEventListener(PROGRESS_EVENT_NAME, updateProgress);
  }, []);

  const showToast = (message: string, variant: ToastVariant = 'info', title?: string) => {
    setToast({
      isOpen: true,
      variant,
      title,
      message,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isOpen: false }));
    }, 4500);
  };

  const isPretestDone = progress.pretestCompleted;
  const isStackDone = progress.stackLessonsCompleted.length >= 10;
  const stackPercent = Math.min(100, Math.round((progress.stackLessonsCompleted.length / 10) * 100));

  // GATING RULE 1: If pre-test is not done, lock access to the module
  if (!isPretestDone) {
    return (
      <>
        <ToastNotification
          isOpen={toast.isOpen}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        />
        <PretestModal
          isOpen={isPretestModalOpen}
          onClose={() => setIsPretestModalOpen(false)}
          onSuccess={() => {
            showToast('Pre-Test selesai! Modul Stack kini dapat diakses.', 'success', 'Success');
          }}
        />
        <LockedModuleScreen
          moduleName={moduleTitle}
          reason="pretest_required"
          onOpenPretest={() => setIsPretestModalOpen(true)}
        />
      </>
    );
  }

  // GATING RULE 2: If user is on /courses/queue before Stack is 100% complete
  if (isQueue && !isStackDone) {
    return (
      <>
        <ToastNotification
          isOpen={toast.isOpen}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        />
        <LockedModuleScreen
          moduleName="Queue"
          reason="stack_required"
          stackProgressPercent={stackPercent}
        />
      </>
    );
  }

  // 10 Modul Lengkap sesuai tahapan pengerjaan materi
  const lessons: LessonItem[] = isQueue
    ? [
        { id: '01', title: 'Konsep Dasar Queue', type: 'concept', desc: 'Prinsip FIFO (First In First Out)' },
        { id: '02', title: 'Operasi Enqueue', type: 'enqueue', desc: 'Menambahkan elemen ke antrean' },
        { id: '03', title: 'Operasi Dequeue', type: 'dequeue', desc: 'Menghapus elemen dari depan' },
        { id: '04', title: 'Operasi Front & Rear', type: 'search', desc: 'Melihat elemen ujung antrean' },
        { id: '05', title: 'Circular Queue', type: 'circular', desc: 'Antrean melingkar hemat memori' },
        { id: '06', title: 'Priority Queue', type: 'priority', desc: 'Elemen berdasar nilai prioritas' },
        { id: '07', title: 'Double-Ended (Deque)', type: 'deque', desc: 'Insert & delete di kedua ujung' },
        { id: '08', title: 'Implementasi Queue', type: 'code', desc: 'Coding Queue dengan Array & List' },
        { id: '09', title: 'Simulasi Antrean Nyata', type: 'app', desc: 'Printer spooler & ticket counter' },
        { id: '10', title: 'Tantangan Akhir Queue', type: 'challenge', desc: 'Uji kompetensi komprehensif' },
      ]
    : [
        { id: '01', title: 'Konsep Dasar Stack', type: 'concept', desc: 'Prinsip LIFO (Last In First Out)' },
        { id: '02', title: 'Operasi Push', type: 'push', desc: 'Menaruh data di tumpukan teratas' },
        { id: '03', title: 'Operasi Pop', type: 'pop', desc: 'Mengambil data tumpukan teratas' },
        { id: '04', title: 'Operasi Peek', type: 'search', desc: 'Melihat data tanpa menghapusnya' },
        { id: '05', title: 'Notasi Prefix & Infix', type: 'math', desc: 'Struktur ekspresi aritmatika' },
        { id: '06', title: 'Infix ke Postfix', type: 'code', desc: 'Algoritma Shunting-yard' },
        { id: '07', title: 'Evaluasi Ekspresi', type: 'eval', desc: 'Kalkulasi postfix via Stack' },
        { id: '08', title: 'Implementasi Stack', type: 'code', desc: 'Coding Stack dengan C++ / Python' },
        { id: '09', title: 'Aplikasi Undo / Redo', type: 'app', desc: 'History navigation & call stack' },
        { id: '10', title: 'Tantangan Akhir Stack', type: 'challenge', desc: 'Uji kompetensi komprehensif' },
      ];

  const currentCompletedList = isQueue ? progress.queueLessonsCompleted : progress.stackLessonsCompleted;
  const currentModuleScore = isQueue ? progress.queueScore : progress.stackScore;
  const currentModulePercent = Math.min(100, Math.round((currentCompletedList.length / 10) * 100));
  const isModuleFullyCompleted = currentCompletedList.length >= 10;

  // Check if a specific lesson is unlocked based on inquiry progression
  const isLessonUnlocked = (lessonId: string, index: number): boolean => {
    // If pre-test is not done, ALL lessons are locked!
    if (!isPretestDone) return false;
    // First lesson is unlocked once pretest is done
    if (index === 0) return true;
    // Next lesson unlocks if previous lesson is completed
    const prevId = lessons[index - 1].id;
    return currentCompletedList.includes(prevId);
  };

  const handleLessonClick = (lesson: LessonItem, unlocked: boolean) => {
    if (!isPretestDone) {
      showToast('Selesaikan Pre-Test terlebih dahulu untuk membuka materi ini.', 'info', 'Information');
      setIsPretestModalOpen(true);
      return;
    }
    if (!unlocked) {
      showToast('Selesaikan tahap materi sebelumnya terlebih dahulu ya!', 'info', 'Information');
      return;
    }
    setSelectedLesson(lesson);
  };

  // Helper untuk render ikon sesuai tahapan belajar
  const renderStageIcon = (type: string) => {
    switch (type) {
      case 'concept':
        return (
          <div className="relative w-16 h-14 flex items-center justify-center">
            <span className="absolute -top-1 -left-2 text-[12px] text-amber-500 animate-pulse">✨</span>
            <div className="w-12 h-13 rounded-xl border-2 border-slate-700 bg-white flex flex-col items-center justify-center relative shadow-sm transition-transform group-hover:scale-105">
              <span className="text-lg font-black text-slate-800">T</span>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border-2 border-white shadow flex items-center justify-center text-white text-[10px]">
                ▶
              </div>
            </div>
          </div>
        );

      case 'push':
      case 'enqueue':
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-0.5">
              <span>fj</span>
              <span className="text-emerald-500 text-xs font-black">↓</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <svg viewBox="0 0 48 32" className="w-11 h-7 text-slate-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 10 L24 2 L42 10 L42 26 L24 32 L6 26 Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 10 L24 16 L42 10" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M24 16 L24 32" />
              </svg>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );

      case 'pop':
      case 'dequeue':
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-0.5 font-mono">
              <span>[ ]</span>
              <span className="text-rose-500 text-xs font-black">↑</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <svg viewBox="0 0 48 32" className="w-11 h-7 text-slate-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 10 L24 2 L42 10 L42 26 L24 32 L6 26 Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 10 L24 16 L42 10" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M24 16 L24 32" />
              </svg>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="relative w-20 h-14 flex items-center justify-center gap-1.5">
            <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-400 bg-slate-50 flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-slate-700 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
          </div>
        );

      case 'circular':
        return (
          <div className="relative w-20 h-14 flex items-center justify-center gap-1.5">
            <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center bg-slate-50">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
          </div>
        );

      case 'priority':
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">Top-P</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-500">
                ★
              </div>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );

      case 'deque':
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-600 mb-0.5">← 2-WAY →</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <svg viewBox="0 0 48 32" className="w-10 h-7 text-slate-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 10 L24 2 L42 10 L42 26 L24 32 L6 26 Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 10 L24 16 L42 10" />
              </svg>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );

      case 'math':
      case 'eval':
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <span className="text-[11px] font-mono font-bold text-slate-700 mb-0.5">A + B * C</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <div className="w-9 h-7 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-mono text-xs font-bold">
                +=
              </div>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <span className="text-[11px] font-mono font-bold text-slate-700 mb-0.5">{'</>'}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <div className="w-9 h-7 rounded bg-slate-900 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shadow-xs">
                {'{ }'}
              </div>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );

      case 'app':
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-slate-700 mb-0.5">{isQueue ? 'Buffer' : 'Stack Mem'}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <div className="w-9 h-7 rounded border border-slate-300 bg-white flex flex-col justify-center items-center gap-0.5 p-1 shadow-xs">
                <div className="w-full h-1 bg-blue-500 rounded-xs" />
                <div className="w-full h-1 bg-slate-300 rounded-xs" />
                <div className="w-full h-1 bg-slate-300 rounded-xs" />
              </div>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );

      case 'challenge':
      default:
        return (
          <div className="relative w-20 h-14 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-amber-600 mb-0.5">Final Goal</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
              <div className="w-9 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-500 flex items-center justify-center text-amber-900 text-xs shadow-xs">
                🏆
              </div>
              <span className="text-[10px] text-slate-300 font-mono select-none">···</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased bg-[#edf4fa] selection:bg-blue-100 text-slate-800 relative overflow-x-hidden">
      
      {/* Alert: Floating Elegant Card matching reference */}
      <ToastNotification
        isOpen={toast.isOpen}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Pretest Modal Component */}
      <PretestModal
        isOpen={isPretestModalOpen}
        onClose={() => setIsPretestModalOpen(false)}
        onSuccess={() => {
          showToast('Pre-Test selesai! Modul Stack kini dapat diakses.', 'success', 'Success');
        }}
      />

      {/* Lesson Inquiry Detail Modal */}
      <LessonDetailModal
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        moduleName={moduleName}
        lesson={selectedLesson}
        onLessonCompleted={(lessonId, score) => {
          showToast(`Tahap ${lessonId} selesai (+${score} poin)!`, 'success', 'Success');
        }}
      />



      {/* ══════════════════════════════════════════════
          BACKGROUND POLYGONAL MOUNTAINS
      ══════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute bottom-0 right-0 w-full h-[600px] text-sky-100/60"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="200,600 550,220 850,600" fill="#d9ecf8" opacity="0.6" />
          <polygon points="500,600 820,180 1200,600" fill="#e2f0fa" opacity="0.75" />
          <polygon points="850,600 1150,320 1440,550 1440,600" fill="#d4e8f7" opacity="0.5" />
          <polygon points="0,600 250,380 520,600" fill="#e4f1fa" opacity="0.5" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════════════════════ */}
      <aside
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-56'
        } shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between py-6 min-h-screen sticky top-0 transition-all duration-300 z-30 shadow-xs`}
      >
        <div>
          {/* Logo Edcode */}
          <div className="px-6 mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/EdcodeLogo.png"
                alt="Edcode Logo"
                width={130}
                height={34}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col text-[15px] font-medium text-slate-600">
            <Link
              href="/courses"
              className="flex items-center gap-3.5 px-6 py-3 transition hover:text-slate-900 hover:bg-slate-50"
            >
              <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {!isSidebarCollapsed && <span>Beranda</span>}
            </Link>

            <button
              onClick={() => setActiveSidebar('modul')}
              className={`flex items-center justify-between px-6 py-3 transition text-left relative ${
                activeSidebar === 'modul'
                  ? 'bg-slate-100/90 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <svg className="w-5 h-5 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                {!isSidebarCollapsed && <span>Modul</span>}
              </div>
              {activeSidebar === 'modul' && (
                <span className="absolute right-0 top-0 bottom-0 w-1 bg-slate-900 rounded-l" />
              )}
            </button>

            <button
              onClick={() => setActiveSidebar('leaderboard')}
              className={`flex items-center justify-between px-6 py-3 transition text-left relative ${
                activeSidebar === 'leaderboard'
                  ? 'bg-slate-100/90 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!isSidebarCollapsed && <span>Leaderboard</span>}
              </div>
              {activeSidebar === 'leaderboard' && (
                <span className="absolute right-0 top-0 bottom-0 w-1 bg-slate-900 rounded-l" />
              )}
            </button>
          </nav>
        </div>

        <div className="px-4 flex justify-end">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition shadow-xs text-xs font-bold"
            title="Toggle sidebar"
          >
            {isSidebarCollapsed ? '>' : '<'}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header className="h-16 px-6 sm:px-10 lg:px-12 flex items-center justify-between border-b border-transparent">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {moduleTitle}
            </h1>

            {/* Score & Progress (Tanpa Card / Tanpa Background) */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-[18px] h-[18px] text-[#6a87a4]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
                  <path d="M7 6H4a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h2" />
                  <path d="M17 6h3a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-2" />
                </svg>
                <span className="text-slate-600 font-normal">
                  <strong className="text-slate-900 font-bold mr-1">{currentModuleScore}</strong>
                  Score
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-[18px] h-[18px] text-[#6a87a4]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 7l-8.5 8.5-5-5L2 17" />
                  <path d="M16 7h6v6" />
                </svg>
                <span className="text-slate-600 font-normal">
                  <strong className="text-slate-900 font-bold mr-1">{currentModulePercent}%</strong>
                  Progress
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 px-6 sm:px-10 lg:px-12 pt-6 pb-16">

          {/* ── MODUL COMPLETION BANNER (Stack -> Queue OR Queue -> Post-Test) ── */}
          {!isQueue && isModuleFullyCompleted && (
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs max-w-4xl">
              {/* Top Row: Trophy Badge + Title & Description */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#eaf7ee] flex items-center justify-center shrink-0">
                  <svg
                    className="w-7 h-7 text-[#1b5e3f]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4.5 4.5L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Modul Stack Selesai!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                    Progres pembelajaran telah mencapai 100%.
                  </p>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="border-t border-slate-100 my-4 sm:my-5" />

              {/* Bottom Row: Checkmark Info + CTA Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1b5e3f]">
                  <svg className="w-4 h-4 text-[#1b5e3f] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Modul berikutnya telah terbuka</span>
                </div>

                <Link
                  href="/courses/queue"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1b5e3f] hover:bg-[#144830] text-white text-xs sm:text-sm font-semibold transition shadow-xs active:scale-95"
                >
                  <span>Lanjut ke Queue</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}

          {isQueue && isModuleFullyCompleted && (
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs max-w-4xl">
              {/* Top Row: Graduation Badge + Title & Description */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#eef2ff] flex items-center justify-center shrink-0">
                  <svg
                    className="w-7 h-7 text-indigo-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4.5 4.5L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Modul Queue Selesai!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                    Seluruh materi Stack & Queue telah mencapai 100%.
                  </p>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="border-t border-slate-100 my-4 sm:my-5" />

              {/* Bottom Row: Checkmark Info + CTA Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-indigo-800">
                  <svg className="w-4 h-4 text-indigo-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Post-Test evaluasi akhir telah terbuka</span>
                </div>

                <button
                  onClick={() => showToast('Fitur Post-Test siap dikerjakan untuk evaluasi akhir!')}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs active:scale-95"
                >
                  <span>Mulai Post-Test</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ── CARD 2: LESSONS LEVEL GRID (10 CARDS) ── */}
          <div className="relative pt-12 sm:pt-14 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 sm:gap-x-5 gap-y-14 sm:gap-y-16 w-full">
              {lessons.map((lesson, idx) => {
                const unlocked = isLessonUnlocked(lesson.id, idx);
                const isCompleted = currentCompletedList.includes(lesson.id);
                const isCurrentActive = unlocked && !isCompleted;

                return (
                  <div key={lesson.id} className="relative flex flex-col">
                    {/* Tooltip 'Mulai' animates up and down above current active card, full width of card */}
                    {isCurrentActive && (
                      <div className="absolute -top-13 sm:-top-15 left-0 right-0 w-full z-20 pointer-events-none animate-mulai-bounce">
                        <div className="relative w-full bg-[#1e293b] text-white text-sm sm:text-base font-bold py-2.5 sm:py-3 px-3 rounded-2xl shadow-xl flex items-center justify-center tracking-wide">
                          Mulai
                          <div
                            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                            style={{
                              borderLeft: '8px solid transparent',
                              borderRight: '8px solid transparent',
                              borderTop: '8px solid #1e293b',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Card Element */}
                    <div
                      onClick={() => handleLessonClick(lesson, unlocked)}
                      className={`w-full h-44 sm:h-48 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 select-none bg-white ${
                        !unlocked
                          ? 'border border-slate-200/80 shadow-xs hover:border-slate-300 cursor-pointer'
                          : isCurrentActive
                          ? 'border-2 border-slate-900 shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1'
                          : 'border border-slate-200/90 shadow-xs cursor-pointer hover:shadow-md'
                      }`}
                    >
                      {/* Top Header inside Card */}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-slate-700 tracking-tight">
                          {lesson.id}
                        </span>

                        {!unlocked ? (
                          <span className="text-slate-400">
                            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : isCompleted ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                            ✓
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </div>

                      {/* Center Stage Icon (No lock in the middle) */}
                      <div className="flex-1 flex items-center justify-center my-1">
                        {renderStageIcon(lesson.type, idx === 0)}
                      </div>

                      {/* Bottom Title inside Card */}
                      <div className="text-center pt-2.5 border-t border-slate-100">
                        <span className="text-[12px] font-semibold text-slate-700 leading-tight block line-clamp-2">
                          {lesson.title}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
