'use client';

import React from 'react';
import Link from 'next/link';

interface LockedModuleScreenProps {
  moduleName: string;
  reason: 'pretest_required' | 'stack_required';
  stackProgressPercent?: number;
  onOpenPretest?: () => void;
}

export default function LockedModuleScreen({
  moduleName,
  reason,
  stackProgressPercent = 0,
  onOpenPretest,
}: LockedModuleScreenProps) {
  const isPretestMissing = reason === 'pretest_required';

  return (
    <div className="min-h-screen bg-[#edf4fa] flex items-center justify-center p-6 selection:bg-blue-100">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center relative overflow-hidden">
        
        {/* Background Decorative Accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-900" />

        {/* Lock Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 mb-6 shadow-xs">
          <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={1.8} />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4" />
          </svg>
        </div>

        {/* Badge */}
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-3">
          Akses Modul {moduleName} Terkunci
        </span>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
          {isPretestMissing
            ? 'Kerjakan Pre-Test Terlebih Dahulu!'
            : 'Selesaikan Modul Stack Dulu!'}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {isPretestMissing ? (
            <>
              Untuk mengukur kemampuan awal dan kesiapan belajar dengan model <em>Inquiry Learning</em>, 
              kamu diwajibkan menyelesaikan <strong>Pre-Test</strong> terlebih dahulu sebelum membuka materi {moduleName}.
            </>
          ) : (
            <>
              Materi <strong>Queue (Antrean)</strong> membutuhkan pemahaman dasar dari <strong>Stack (Tumpukan)</strong>. 
              Selesaikan seluruh 10 tahapan pembelajaran pada Modul Stack untuk membuka akses modul ini.
            </>
          )}
        </p>

        {/* Stack Progress Bar (if reason is stack_required) */}
        {!isPretestMissing && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>Progres Modul Stack:</span>
              <span className="font-bold text-indigo-600">{stackProgressPercent}% Selesai</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${stackProgressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isPretestMissing ? (
            <button
              onClick={onOpenPretest}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md active:scale-95"
            >
              Mulai Pre-Test Sekarang ➔
            </button>
          ) : (
            <Link
              href="/courses/stack"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 active:scale-95"
            >
              Lanjutkan Belajar Stack ➔
            </Link>
          )}

          <Link
            href="/courses"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}

