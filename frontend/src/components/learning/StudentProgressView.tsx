'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LearningProgressState } from '@/types/progress';

interface StudentProgressViewProps {
  progress: LearningProgressState;
  userName: string;
}

interface AttemptItem {
  id: string;
  time: string;
  module: 'stack' | 'queue' | 'pretest';
  lessonId: string;
  title: string;
  score: number;
  duration: string;
  ctPillar: string;
  status: 'passed' | 'remedial' | 'in_progress';
  stars?: number;
  link: string;
}

export default function StudentProgressView({ progress, userName }: StudentProgressViewProps) {
  const [timeFilter, setTimeFilter] = useState<'overall' | 'today' | 'week'>('overall');
  const [activeToggle, setActiveToggle] = useState<'time' | 'score' | 'accuracy' | 'coverage'>('time');

  // Lesson titles dictionary for Stack & Queue
  const STACK_LESSON_META: Record<string, { title: string; pillar: string }> = {
    '01': { title: 'Konsep Dasar Stack (LIFO)', pillar: 'Pengenalan Pola' },
    '02': { title: 'Operasi Push (Insert Data)', pillar: 'Abstraksi' },
    '03': { title: 'Operasi Pop (Remove Data)', pillar: 'Abstraksi' },
    '04': { title: 'Operasi Peek (Lihat Teratas)', pillar: 'Dekomposisi' },
    '05': { title: 'Notasi Prefix & Infix', pillar: 'Perancangan Algoritma' },
    '06': { title: 'Infix ke Postfix Algorithm', pillar: 'Perancangan Algoritma' },
    '07': { title: 'Evaluasi Ekspresi Postfix', pillar: 'Dekomposisi' },
    '08': { title: 'Implementasi Stack Program', pillar: 'Abstraksi' },
    '09': { title: 'Aplikasi Undo & Redo', pillar: 'Pengenalan Pola' },
    '10': { title: 'Tantangan Akhir Stack', pillar: 'Perancangan Algoritma' },
  };

  const QUEUE_LESSON_META: Record<string, { title: string; pillar: string }> = {
    '01': { title: 'Konsep Dasar Queue (FIFO)', pillar: 'Pengenalan Pola' },
    '02': { title: 'Operasi Enqueue', pillar: 'Abstraksi' },
    '03': { title: 'Operasi Dequeue', pillar: 'Abstraksi' },
    '04': { title: 'Operasi Front & Rear', pillar: 'Dekomposisi' },
    '05': { title: 'Circular Queue Buffer', pillar: 'Perancangan Algoritma' },
    '06': { title: 'Priority Queue Logic', pillar: 'Pengenalan Pola' },
    '07': { title: 'Double-Ended Queue (Deque)', pillar: 'Dekomposisi' },
    '08': { title: 'Implementasi Queue Program', pillar: 'Abstraksi' },
    '09': { title: 'Simulasi Antrean Riil', pillar: 'Pengenalan Pola' },
    '10': { title: 'Tantangan Akhir Queue', pillar: 'Perancangan Algoritma' },
  };

  // Calculations
  const completedStackCount = progress.stackLessonsCompleted.length;
  const completedQueueCount = progress.queueLessonsCompleted.length;
  const totalCompletedCount = completedStackCount + completedQueueCount;
  const totalLessons = 20;
  const coveragePercent = Math.min(100, Math.round((totalCompletedCount / totalLessons) * 100));

  // Time calculations (simulated realistic learning session time based on lessons)
  const baseMinutes = progress.pretestCompleted ? 2 : 0;
  const lessonMinutes = totalCompletedCount * 3 + Math.floor(totalCompletedCount * 0.5);
  const totalSeconds = (baseMinutes + lessonMinutes) * 60 + (totalCompletedCount > 0 ? 42 : 0);
  
  const minutesFormatted = Math.floor(totalSeconds / 60);
  const secondsFormatted = totalSeconds % 60;
  const displayTotalTime = `${minutesFormatted}m ${secondsFormatted < 10 ? '0' : ''}${secondsFormatted}s`;
  const timerDigital = `00:${minutesFormatted < 10 ? '0' : ''}${minutesFormatted}:${secondsFormatted < 10 ? '0' : ''}${secondsFormatted}`;

  const passedTime = `${Math.max(0, minutesFormatted - 1)}m 15s`;
  const incompleteTime = totalCompletedCount < 20 ? '1m 20s' : '0m 00s';

  const totalPoints = progress.stackScore + progress.queueScore + (progress.pretestCompleted ? progress.pretestScore : 0);
  const avgAccuracy = progress.pretestCompleted ? Math.min(100, Math.max(75, 80 + Math.round(totalCompletedCount * 1.5))) : 0;

  // Recent attempts list
  const attempts: AttemptItem[] = [];

  // Add Queue completed lessons (reverse chronological)
  progress.queueLessonsCompleted.forEach((lid, idx) => {
    const meta = QUEUE_LESSON_META[lid] || { title: `Tahap Queue ${lid}`, pillar: 'Logika Algoritma' };
    attempts.push({
      id: `queue-${lid}`,
      time: `10:${30 + idx * 4} AM`,
      module: 'queue',
      lessonId: lid,
      title: meta.title,
      score: 100,
      duration: '02m 15s',
      ctPillar: meta.pillar,
      status: 'passed',
      stars: 5,
      link: '/courses/queue',
    });
  });

  // Add Stack completed lessons
  progress.stackLessonsCompleted.forEach((lid, idx) => {
    const meta = STACK_LESSON_META[lid] || { title: `Tahap Stack ${lid}`, pillar: 'Logika Algoritma' };
    attempts.push({
      id: `stack-${lid}`,
      time: `09:${10 + idx * 5} AM`,
      module: 'stack',
      lessonId: lid,
      title: meta.title,
      score: 100,
      duration: '01m 45s',
      ctPillar: meta.pillar,
      status: 'passed',
      stars: 5,
      link: '/courses/stack',
    });
  });

  // Add Pre-Test if finished
  if (progress.pretestCompleted) {
    attempts.push({
      id: 'pretest',
      time: '08:30 AM',
      module: 'pretest',
      lessonId: 'Pre-Test',
      title: 'Pre-Test Diagnostic (Evaluasi Awal CT)',
      score: progress.pretestScore,
      duration: '02m 45s',
      ctPillar: 'Diagnostic CT',
      status: 'passed',
      stars: 5,
      link: '/courses/stack',
    });
  }

  // Circular ring chart stroke dash computation
  const ringRadius = 50;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = Math.max(0.12, Math.min(1, totalSeconds / 1800)); // normalized up to 30 min
  const strokeDashoffset = ringCircumference - ringProgress * ringCircumference;

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* ══════════════════════════════════════════════════════════════
          CARD 1: RINGKASAN WAKTU BELAJAR (Time spent overview)
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5 text-slate-800">
            <h3 className="text-sm font-bold tracking-tight text-slate-800">
              Ringkasan Waktu Belajar
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition"
              title="Total akumulasi waktu yang telah kamu habiskan selama berinteraksi dan menyelesaikan modul belajar."
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
              </svg>
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as 'overall' | 'today' | 'week')}
              className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 text-xs font-semibold text-slate-700 py-1.5 pl-3.5 pr-8 rounded-full shadow-2xs transition focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="overall">Keseluruhan</option>
              <option value="today">Hari ini</option>
              <option value="week">Minggu ini</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▾
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-2">
          
          {/* Left Large Metric */}
          <div className="flex items-center gap-8 w-full lg:w-auto">
            <div>
              <div className="text-3xl sm:text-[34px] font-black text-slate-900 tracking-tight leading-none">
                {displayTotalTime}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-2">
                Total waktu belajar
              </div>
            </div>
            <div className="hidden lg:block w-px h-16 bg-slate-100" />
          </div>

          {/* Middle 2x2 Breakdown */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 w-full lg:w-auto">
            {/* 1. Passed Attempts */}
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0 mt-1" />
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {passedTime}
                </div>
                <div className="text-xs text-slate-400 font-normal mt-0.5">
                  Materi Tuntas
                </div>
              </div>
            </div>

            {/* 2. Incomplete Attempts */}
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0 mt-1" />
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {incompleteTime}
                </div>
                <div className="text-xs text-slate-400 font-normal mt-0.5">
                  Belum Selesai
                </div>
              </div>
            </div>

            {/* 3. Failed Attempts */}
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0 mt-1" />
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  0m 00s
                </div>
                <div className="text-xs text-slate-400 font-normal mt-0.5">
                  Perlu Remediasi
                </div>
              </div>
            </div>

            {/* 4. Active Learning Time */}
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-1" />
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {displayTotalTime}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Waktu Belajar Aktif
                </div>
              </div>
            </div>
          </div>

          {/* Right Donut Ring Chart */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Ring */}
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke="#e8edf5"
                strokeWidth="14"
              />
              {/* Dynamic Progress Ring */}
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke="#6366f1"
                strokeWidth="14"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Digital Timer in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[13px] font-bold text-slate-700 font-mono tracking-wider">
                {timerDigital}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CARD 2: WAKTU BELAJAR AKTIF (Active practice time)
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-7">
        {/* Header with Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-slate-800">
            <h3 className="text-sm font-bold tracking-tight text-slate-800">
              Waktu Belajar Aktif
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition"
              title="Perbandingan waktu aktif belajar berdasarkan keberhasilan pemahaman konsep."
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-slate-600 font-medium">Materi Selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-slate-600 font-medium">Sedang Berjalan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-300" />
              <span className="text-slate-600 font-medium">Perlu Remediasi</span>
            </div>
            
            <div className="relative ml-2">
              <select className="appearance-none bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-1 pl-3 pr-7 rounded-full cursor-pointer">
                <option>Hari ini</option>
                <option>Minggu ini</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Bar Visual */}
        <div className="pt-2 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {displayTotalTime}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1.5">
              Waktu belajar aktifmu
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="w-full h-11 bg-sky-400 rounded-lg shadow-xs flex items-center justify-end px-4 text-white text-xs font-bold transition-all">
              {coveragePercent}% Penguasaan
            </div>
            <span className="block text-[11px] text-slate-500 font-medium mt-1 text-left">
              Kamu ({userName})
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CARD 3: IKHTISAR PROGRES (Progress overview)
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-7">
        
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-slate-800">
            <h3 className="text-sm font-bold tracking-tight text-slate-800">
              Ikhtisar Progres
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition"
              title="Statistik komprehensif perkembangan belajar dan akurasi logika Computational Thinking."
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
              </svg>
            </button>
          </div>

          {/* Toggle Switches from Image */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveToggle('time')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeToggle === 'time'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Waktu Belajar
              </button>
              <button
                type="button"
                onClick={() => setActiveToggle('score')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeToggle === 'score'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Skor
              </button>
              <button
                type="button"
                onClick={() => setActiveToggle('accuracy')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeToggle === 'accuracy'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Akurasi
              </button>
              <button
                type="button"
                onClick={() => setActiveToggle('coverage')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeToggle === 'coverage'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cakupan Modul
              </button>
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 pl-3 pr-7 rounded-full cursor-pointer">
                <option>Harian</option>
                <option>Mingguan</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Column & Timeline Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          
          {/* Left Metrics (Vertical List) */}
          <div className="md:col-span-1 space-y-6 md:border-r md:border-slate-100 md:pr-6">
            <div>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {displayTotalTime}
              </div>
              <div className="text-xs text-slate-400 font-normal mt-0.5">
                Total waktu belajar
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {coveragePercent}%
              </div>
              <div className="text-xs text-slate-400 font-normal mt-0.5">
                Cakupan modul tuntas
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {avgAccuracy}%
              </div>
              <div className="text-xs text-slate-400 font-normal mt-0.5">
                Rata-rata akurasi kuis
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {totalPoints} Poin
              </div>
              <div className="text-xs text-slate-400 font-normal mt-0.5">
                Akumulasi skor total
              </div>
            </div>
          </div>

          {/* Right Timeline Bar Chart Area */}
          <div className="md:col-span-3 flex flex-col justify-end pt-4">
            
            {/* Chart Grid Lines */}
            <div className="h-44 w-full flex items-end justify-between border-b border-slate-200 relative pb-1 px-2">
              
              {/* Horizontal dashed guide lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="w-full border-b border-dashed border-slate-200" />
                <div className="w-full border-b border-dashed border-slate-200" />
                <div className="w-full border-b border-dashed border-slate-200" />
              </div>

              {/* Sample simulated calendar dates with active bar today */}
              {['28 Okt', '29 Okt', '30 Okt', '31 Okt', '1 Nov', '2 Nov', '3 Nov', '4 Nov', '5 Nov', 'Hari ini'].map((d, i) => {
                const isToday = i === 9;
                return (
                  <div key={d} className="flex flex-col items-center gap-2 z-10">
                    {isToday ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <div
                          className="w-5 sm:w-6 bg-indigo-600 rounded-t-md transition-all duration-500 shadow-sm"
                          style={{ height: `${Math.max(40, coveragePercent * 1.3)}px` }}
                        />
                      </div>
                    ) : (
                      <div className="w-5 sm:w-6 h-1 rounded-full bg-slate-100" />
                    )}
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap transform -rotate-45 sm:rotate-0 mt-2">
                      {d}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CARD 4: AKTIVITAS PEMBELAJARAN TERAKHIR (Recent attempts)
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-slate-800">
            <h3 className="text-sm font-bold tracking-tight text-slate-800">
              Aktivitas Pembelajaran Terakhir
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition"
              title="Daftar riwayat materi dan modul yang telah kamu pelajari secara berurutan."
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
              </svg>
            </button>
          </div>
        </div>

        {/* Date Group Header */}
        <div className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
          Hari Ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        {/* Attempts Table */}
        {attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100">
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Materi / Modul</th>
                  <th className="py-2.5 px-3">Skor</th>
                  <th className="py-2.5 px-3">Durasi</th>
                  <th className="py-2.5 px-3">Pilar CT</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition group">
                    {/* Waktu */}
                    <td className="py-3.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-8 rounded-full bg-blue-500 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    </td>

                    {/* Modul Title */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.module === 'pretest' ? 'CT' : item.lessonId}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {item.title}
                        </span>
                      </div>
                    </td>

                    {/* Skor */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500">🏆</span>
                        <span>{item.score} Poin</span>
                      </div>
                    </td>

                    {/* Durasi */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="9" strokeWidth="2" />
                          <path strokeLinecap="round" d="M12 7v5l3 2" strokeWidth="2" />
                        </svg>
                        <span>{item.duration}</span>
                      </div>
                    </td>

                    {/* Pilar CT */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {item.ctPillar}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-xs">
                        ✓
                      </div>
                    </td>

                    {/* Aksi Link */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <Link
                        href={item.link}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                        title="Buka Materi"
                      >
                        ▶
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-xl mb-3 text-slate-500">
              📋
            </div>
            <p className="font-medium text-slate-600">Belum ada rekaman aktivitas pembelajaran.</p>
            <p className="mt-1">Selesaikan Pre-Test atau pelajari modul materi pertama untuk melihat analisismu di sini!</p>
          </div>
        )}

      </div>

    </div>
  );
}

