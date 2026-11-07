'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { User } from '@/types/auth';
import { learningProgressService, PROGRESS_EVENT_NAME, INITIAL_PROGRESS } from '@/services/learningProgress';
import { LearningProgressState } from '@/types/progress';
import PretestModal from '@/components/learning/PretestModal';
import ToastNotification, { ToastVariant } from '@/components/ui/ToastNotification';
import StudentProgressView from '@/components/learning/StudentProgressView';

export default function CoursesStudentPortalPage() {
  const router = useRouter();
  const [user] = useState<User | null>(() => {
    try { return authService.getSavedUser(); } catch { return null; }
  });
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'progress'>('home');
  const [isPretestModalOpen, setIsPretestModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 👈 State Tambahan untuk Menu Settings Popover & Theme
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  const [progress, setProgress] = useState<LearningProgressState>(() => {
    try { return learningProgressService.getProgress(); } catch { return INITIAL_PROGRESS; }
  });
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

  useEffect(() => {
    const updateState = () => {
      setProgress(learningProgressService.getProgress());
    };

    window.addEventListener(PROGRESS_EVENT_NAME, updateState);
    return () => window.removeEventListener(PROGRESS_EVENT_NAME, updateState);
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

  const handleLogout = () => {
    try { authService.logout(); } catch { }
    showToast('Berhasil keluar akun', 'info', 'Logout');
    router.push('/login');
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    showToast(`Mode tampilan diubah ke ${mode}`, 'info', 'Tema');
  };

  const userName = user?.full_name || 'Siswa SMK PPLG';
  const userInitials = userName.slice(0, 2).toUpperCase();

  const isPretestDone = progress.pretestCompleted;
  const isStackDone = progress.stackLessonsCompleted.length >= 10;
  const stackPercent = Math.min(100, Math.round((progress.stackLessonsCompleted.length / 10) * 100));
  const queuePercent = Math.min(100, Math.round((progress.queueLessonsCompleted.length / 10) * 100));

  const handleStackClick = () => {
    if (!isPretestDone) {
      showToast('Selesaikan Pre-Test terlebih dahulu untuk membuka akses modul ini.', 'info', 'Information');
      setIsPretestModalOpen(true);
      return;
    }
    router.push('/courses/stack');
  };

  const handleQueueClick = () => {
    if (!isPretestDone) {
      showToast('Selesaikan Pre-Test terlebih dahulu untuk membuka akses modul ini.', 'info', 'Information');
      setIsPretestModalOpen(true);
      return;
    }
    if (!isStackDone) {
      showToast('Selesaikan 10 tahapan modul Stack terlebih dahulu untuk membuka modul Queue.', 'warning', 'Warning');
      return;
    }
    router.push('/courses/queue');
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex font-sans text-zinc-800 antialiased selection:bg-blue-100">

      {/* Alert Notification */}
      <ToastNotification
        isOpen={toast.isOpen}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Pre-Test Modal */}
      <PretestModal
        isOpen={isPretestModalOpen}
        onClose={() => setIsPretestModalOpen(false)}
        onSuccess={() => {
          showToast('Pre-Test selesai! Modul Stack kini dapat diakses.', 'success', 'Success');
        }}
      />

      {/* ══════════════════════════════════════════════
          LEFT SIDEBAR (Collapsible & Fixed Height)
      ══════════════════════════════════════════════ */}
      <aside
        className={`shrink-0 bg-white border-r border-zinc-200/80 flex flex-col justify-between py-6 h-screen sticky top-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20 px-3 items-center' : 'w-56 px-4'
        }`}
      >
        {/* Bagian Atas: Logo & Navigasi */}
        <div className="w-full flex flex-col items-center">
          {/* Brand Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 mb-8 w-full ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-2'
            }`}
          >
            {isSidebarCollapsed ? (
              <Image
                src="/icon.png"
                alt="Edcode Icon"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
            ) : (
              <Image
                src="/EdcodeLogo.png"
                alt="Edcode Logo"
                width={140}
                height={38}
                className="h-8 w-auto object-contain"
                priority
              />
            )}
          </Link>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1 text-[15px] font-medium text-zinc-600 w-full">
            {/* 1. Beranda */}
            <button
              onClick={() => setActiveTab('home')}
              title={isSidebarCollapsed ? 'Beranda' : undefined}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition text-left ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${
                activeTab === 'home'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {!isSidebarCollapsed && <span>Beranda</span>}
            </button>

            {/* 2. Leaderboard */}
            <button
              onClick={() => setActiveTab('stats')}
              title={isSidebarCollapsed ? 'Leaderboard' : undefined}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition text-left ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${
                activeTab === 'stats'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {!isSidebarCollapsed && <span>Leaderboard</span>}
            </button>

            {/* 3. Progress */}
            <button
              onClick={() => setActiveTab('progress')}
              title={isSidebarCollapsed ? 'Progress' : undefined}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition text-left ${
                isSidebarCollapsed ? 'justify-center' : ''
              } ${
                activeTab === 'progress'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              {!isSidebarCollapsed && <span>Progress</span>}
            </button>
          </nav>
        </div>

        {/* ══════════════════════════════════════════════
            BAGIAN BAWAH SIDEBAR: PROFILE & HIDE BUTTON
        ══════════════════════════════════════════════ */}
        <div className="w-full pt-4 border-t border-zinc-100 flex flex-col gap-2 relative">
          
          {/* ── SETTINGS POPOVER MENU ── */}
          {isSettingsOpen && (
            <>
              {/* Overlay pembatal saat klik di luar */}
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsSettingsOpen(false)}
              />

              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
                {/* Header Menu */}
                <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Pengaturan</p>
                </div>

                {/* Direct ke Landing Page */}
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Halaman Utama (Landing)</span>
                </Link>

                {/* Tema / Mode Tampilan */}
                <div className="px-3 py-2">
                  <p className="text-[11px] font-medium text-zinc-500 mb-1.5">Mode Tampilan</p>
                  <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl text-[11px]">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`py-1 rounded-lg font-medium transition ${
                        themeMode === 'light' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`py-1 rounded-lg font-medium transition ${
                        themeMode === 'dark' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`py-1 rounded-lg font-medium transition ${
                        themeMode === 'system' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                      }`}
                    >
                      Default
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-1 border-t border-zinc-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 1. PROFIL SISWA & IKON SETTINGS (Menggantikan Ikon Logout) */}
          <div 
            className={`flex items-center gap-3 p-2 rounded-xl bg-zinc-50 border border-zinc-100/80 transition-all ${
              isSidebarCollapsed ? 'justify-center p-1.5 bg-transparent border-none' : ''
            }`}
          >
            {/* Avatar Inisial */}
            <div 
              title={isSidebarCollapsed ? userName : undefined}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
            >
              {userInitials}
            </div>

            {/* Nama & Role */}
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-800 truncate">{userName}</p>
                <p className="text-[10px] text-zinc-400 truncate">Siswa SMK PPLG</p>
              </div>
            )}

            {/* Tombol Settings (Roda Gigi) */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                title="Pengaturan & Akun"
                className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* 2. TOMBOL TOGGLE HIDE SIDEBAR (Ikon Lebih Kecil `w-4 h-4` & Di Kanan saat Expanded) */}
          <div className="w-full flex items-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Buka Menu Navigasi' : 'Sembunyikan Menu Navigasi'}
              className={`p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors flex items-center justify-center ${
                isSidebarCollapsed ? 'mx-auto' : 'ml-auto'
              }`}
            >
              {isSidebarCollapsed ? (
                // Ikon Panah Ganda (>>) saat Collapsed (Posisi Tengah)
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                // Ikon Panah Ganda (<<) Kecil saat Expanded (Posisi Kanan)
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </aside>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-10 px-8 flex items-center justify-end bg-transparent" />

        <main className="flex-1 px-8 lg:px-12 pt-4 sm:pt-6 pb-20 max-w-7xl w-full">
          {activeTab === 'home' && (
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                Hello, {userName}
              </h1>
            </div>
          )}

          {/* TAB 1: BERANDA */}
          {activeTab === 'home' && (
            <>
              {!isPretestDone && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-8 max-w-xl mb-10">
                  <div className="w-36 h-28 shrink-0 relative flex items-center justify-center">
                    <svg viewBox="0 0 160 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M35 50 C20 40 25 20 40 18 C38 30 45 42 35 50 Z" fill="#1e293b" />
                      <path d="M42 32 C35 22 40 12 50 15 C46 22 48 30 42 32 Z" fill="#1e293b" opacity="0.8" />
                      <path d="M125 45 C140 35 135 15 120 15 C122 25 118 38 125 45 Z" fill="#1e293b" />
                      <path d="M118 28 C126 18 120 10 110 12 C114 18 112 26 118 28 Z" fill="#1e293b" opacity="0.8" />
                      <g filter="drop-shadow(0px 8px 12px rgba(0,0,0,0.06))">
                        <polygon points="30,75 70,55 70,105 30,115" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                        <polygon points="70,55 105,65 105,115 70,105" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                        <polygon points="105,65 135,50 135,95 105,115" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                        <line x1="40" y1="72" x2="60" y2="62" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="40" y1="88" x2="60" y2="78" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="75" y1="68" x2="98" y2="75" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="75" y1="88" x2="98" y2="95" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="110" y1="72" x2="128" y2="63" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
                      </g>
                      <g filter="drop-shadow(0px 4px 6px rgba(245, 158, 11, 0.4))">
                        <path
                          d="M85 30 C74 30 65 39 65 50 C65 65 85 85 85 85 C85 85 105 65 105 50 C105 39 96 30 85 30 Z"
                          fill="#f59e0b"
                        />
                        <circle cx="85" cy="50" r="7" fill="#ffffff" />
                      </g>
                    </svg>
                  </div>

                  <div className="flex flex-col items-start gap-3.5">
                    <h2 className="text-slate-800 font-bold text-base sm:text-lg leading-snug">
                      Lakukan Pretest untuk<br />mengukur kemampuan awalmu!
                    </h2>
                    <button
                      onClick={() => setIsPretestModalOpen(true)}
                      className="px-7 py-2.5 rounded-full bg-[#2f3b52] hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                    >
                      Mulai Pretest
                    </button>
                  </div>
                </div>
              )}

              {/* Modul Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Modul Stack */}
                <div
                  onClick={handleStackClick}
                  className={`bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-300 flex flex-col group cursor-pointer h-full ${
                    !isPretestDone ? 'grayscale opacity-60 hover:opacity-75' : 'hover:shadow-md'
                  }`}
                >
                  <div className="relative w-full aspect-[1672/941] overflow-hidden bg-slate-100">
                    <Image
                      src="/StackLogo.png"
                      alt="Modul Stack"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-zinc-900 group-hover:text-indigo-600 transition">
                        Stack
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Pelajari konsep tumpukan data Last-In First-Out, operasi push, pop, dan implementasinya.
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium mb-2.5">
                        <span><strong className="text-zinc-800 font-bold">{progress.stackScore}</strong> points</span>
                        <span><strong className="text-zinc-800 font-bold">{progress.stackLessonsCompleted.length}/10</strong> Modul</span>
                      </div>
                      <div className="relative w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${stackPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modul Queue */}
                <div
                  onClick={handleQueueClick}
                  className={`bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-300 flex flex-col group cursor-pointer h-full ${
                    !isPretestDone || !isStackDone ? 'grayscale opacity-60 hover:opacity-75' : 'hover:shadow-md'
                  }`}
                >
                  <div className="relative w-full aspect-[1672/941] overflow-hidden bg-slate-100">
                    <Image
                      src="/QueueLogo.png"
                      alt="Modul Queue"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-zinc-900 group-hover:text-indigo-600 transition">
                        Queue
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Pelajari konsep antrean First-In First-Out, operasi enqueue, dequeue, dan penggunaannya.
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium mb-2.5">
                        <span><strong className="text-zinc-800 font-bold">{progress.queueScore}</strong> points</span>
                        <span><strong className="text-zinc-800 font-bold">{progress.queueLessonsCompleted.length}/10</strong> Modul</span>
                      </div>
                      <div className="relative w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${queuePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: PROGRESS */}
          {activeTab === 'progress' && (
            <StudentProgressView progress={progress} userName={userName} />
          )}

          {/* TAB 3: LEADERBOARD */}
          {activeTab === 'stats' && (
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 max-w-3xl text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Papan Peringkat Kelas SMK PPLG</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                Skor totalmu saat ini: <strong className="text-slate-800 font-bold">{progress.stackScore + progress.queueScore + (progress.pretestCompleted ? progress.pretestScore : 0)} Poin</strong>. Terus selesaikan tantangan untuk menempati posisi puncak!
              </p>
              <button
                onClick={() => setActiveTab('progress')}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-95"
              >
                Lihat Detail Progres Saya ➔
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 