'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import NightStars from '@/components/landing/NightStars';
import CodeTypingAnimation from '@/components/landing/CodeTypingAnimation';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: '#0d1b3e' }}>

      {/* ═══════════════════════════════════════════
          HERO — FULL SCREEN NIGHT SKY
      ═══════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden flex flex-col"
        style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a1628 0%, #0d2347 50%, #0f2d5e 100%)' }}
      >
        {/* ── Twinkling stars ── */}
        <NightStars />

        {/* ── Navbar ── */}
        <div className="relative z-50">
          <Navbar variant="transparent" />
        </div>

        {/* ── HERO SECTION ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-20 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 w-full max-w-6xl mx-auto">

            {/* LEFT: Code editor animation (strictly fixed width so it never shifts neighbors) */}
            <div className="w-[320px] shrink-0 flex items-center justify-center">
              <CodeTypingAnimation />
            </div>

            {/* RIGHT: HERO CONTENT — COMPLETELY STATIC (DIAM & TIDAK BERGERAK) */}
            <div className="flex flex-col items-start text-left shrink-0">
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-white tracking-normal whitespace-nowrap flex items-center"
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  textShadow: '0 2px 14px rgba(0,0,0,0.5)',
                }}
              >
                <span>Mulai Perjalananmu Menjadi Programmer!</span>
                <span
                  className="inline-block w-[2px] h-[1.1em] bg-white ml-2 align-middle"
                  style={{ animation: 'cursorBlink 1s step-end infinite' }}
                />
              </h1>

              {/* CTA Button — completely static, no motion/shifting */}
              <div className="mt-6 sm:mt-7">
                <Link
                  href="/courses"
                  className="inline-block rounded-lg bg-white px-8 py-3 text-base font-medium text-[#204987] shadow-md transition-colors duration-200 hover:bg-zinc-100"
                >
                  Mulai Belajar
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTION
      ═══════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-[#0a1628] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-400 bg-blue-950/50 px-3 py-1 rounded-full">
              Fitur Unggulan
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kenapa Belajar di Edcode PPLG?
            </h2>
            <p className="mt-4 text-blue-200/70 text-lg">
              Dirancang khusus untuk siswa SMK jurusan PPLG — materi relevan, interaktif, dan terstruktur.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'Kurikulum PPLG', color: 'bg-blue-900/40 border-blue-700/40', desc: 'Materi sesuai standar SMK PPLG: pemrograman dasar, web, mobile, database, dan jaringan.' },
              { icon: '📈', title: 'Lacak Progres', color: 'bg-indigo-900/40 border-indigo-700/40', desc: 'Dashboard progres belajar real-time — lihat seberapa jauh perjalananmu sebagai developer.' },
              { icon: '🎓', title: 'Kuis & Evaluasi', color: 'bg-purple-900/40 border-purple-700/40', desc: 'Uji pemahamanmu dengan kuis interaktif dan dapatkan nilai instan setiap menyelesaikan modul.' },
            ].map((f) => (
              <div
                key={f.title}
                className={`${f.color} border p-8 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/30`}
              >
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-3xl mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-3 text-blue-200/70 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="py-8 text-center text-sm" style={{ background: '#080f20' }}>
        <span className="text-blue-200/40">© 2026 Edcode. All rights reserved.</span>
      </footer>
    </div>
  );
}
