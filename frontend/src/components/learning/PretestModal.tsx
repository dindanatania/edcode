'use client';

import React, { useState, useEffect } from 'react';
import { PRETEST_QUESTIONS, learningProgressService } from '@/services/learningProgress';
import { authService } from '@/services/auth';

interface PretestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (score: number) => void;
}

export default function PretestModal({ isOpen, onClose, onSuccess }: PretestModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('Siswa');

  useEffect(() => {
    const user = authService.getSavedUser();
    if (user?.full_name) {
      setUserName(user.full_name);
    }
  }, []);

  if (!isOpen) return null;

  const currentQ = PRETEST_QUESTIONS[currentIndex];
  const totalQuestions = PRETEST_QUESTIONS.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const currentSelected = answers[currentQ.id];
  const firstName = userName.split(' ')[0] || 'Siswa';

  const handleSelectOption = (key: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: key }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const { score } = learningProgressService.submitPretest(answers);
    setResultScore(score);
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    onSuccess(resultScore ?? 0);
    onClose();
  };

  // ══════════════════════════════════════════════════════════════════
  // COMPLETED VIEW: Clean, Minimalist Card matching user screenshot
  // ══════════════════════════════════════════════════════════════════
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 flex flex-col items-center text-center overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Confetti & Checkmark Graphic (1:1 design match with reference) */}
          <div className="relative my-3 flex items-center justify-center">
            {/* Top-center small circle ○ */}
            <div className="absolute -top-3 left-7 w-3.5 h-3.5 rounded-full border-2 border-indigo-400/90 pointer-events-none" />

            {/* Left purple plus + */}
            <div className="absolute top-10 -left-6 text-indigo-400 font-bold text-lg pointer-events-none select-none">
              +
            </div>

            {/* Right blue plus + */}
            <div className="absolute top-4 -right-6 text-indigo-500 font-bold text-base pointer-events-none select-none">
              +
            </div>

            {/* Bottom-left small dot • */}
            <div className="absolute -bottom-1 left-4 w-1.5 h-1.5 rounded-full bg-indigo-500 pointer-events-none" />

            {/* Bottom-right small checkmark tick */}
            <div className="absolute -bottom-2 right-4 text-indigo-600 pointer-events-none select-none">
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Concentric Soft Ring Halo */}
            <div className="p-3 rounded-full bg-blue-50/80 border border-blue-100/60 shadow-xs">
              {/* Vibrant Gradient Circle Button with Crisp White Checkmark */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#2563eb] to-[#4338ca] shadow-lg shadow-indigo-500/25 flex items-center justify-center text-white">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4.5 4.5L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading: Good Job, [Name]! */}
          <h2 className="text-2xl sm:text-[28px] text-slate-800 font-normal tracking-tight mt-5 mb-2">
            Good Job, <span className="font-bold text-slate-900">{firstName}!</span>
          </h2>

          {/* Subtitle Message */}
          <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-xs mx-auto leading-relaxed mb-8">
            Kamu telah berhasil menyelesaikan tahap Pre-Test. Sekarang akses modul pembelajaran resmi terbuka untukmu.
          </p>

          {/* Primary Action Button (Pill outline) */}
          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-slate-300/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Mulai Belajar Sekarang</span>
          </button>

          {/* Bottom Close Window Link */}
          <button
            type="button"
            onClick={handleFinish}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
            <span>close window</span>
          </button>

        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // ACTIVE QUESTION VIEW
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 sm:px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                Pre-Test
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition text-sm"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <div>
            {/* Stepper & Progress indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>
                  Pertanyaan {currentIndex + 1} dari {totalQuestions}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs">
                  {currentQ.ctPillar}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Context / Scenario Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-5 relative">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Kasus / Fenomena Penyelidikan:
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {currentQ.context}
                  </p>
                </div>
              </div>
            </div>

            {/* Question text */}
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-5 leading-snug">
              {currentQ.question}
            </h4>

            {/* Multiple Choice Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt) => {
                const isChosen = currentSelected === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    type="button"
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3.5 group ${
                      isChosen
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition ${
                        isChosen
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span className={`text-sm leading-normal ${isChosen ? 'font-semibold text-indigo-950' : 'text-slate-700'}`}>
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 sm:px-8 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition"
          >
            ← Sebelumnya
          </button>

          <div className="flex items-center gap-2">
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentSelected}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition active:scale-95 shadow-xs"
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < totalQuestions}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition active:scale-95 shadow-md shadow-indigo-600/20"
              >
                Kirim & Selesai
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
