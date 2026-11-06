'use client';

import React, { useState } from 'react';
import { learningProgressService } from '@/services/learningProgress';

interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: 'stack' | 'queue';
  lesson: {
    id: string;
    title: string;
    desc?: string;
    type: string;
  } | null;
  onLessonCompleted: (lessonId: string, scoreGained: number) => void;
}

export default function LessonDetailModal({
  isOpen,
  onClose,
  moduleName,
  lesson,
  onLessonCompleted,
}: LessonDetailModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  if (!isOpen || !lesson) return null;

  const isStack = moduleName === 'stack';

  // Inquiry mission content based on lesson
  const missionData = {
    title: `${lesson.id}. ${lesson.title}`,
    detectiveMission: isStack
      ? `Penyelidikan ${lesson.title}: Analisis bagaimana data bertumpuk dan elemen teratas (Top of Stack) berinteraksi dengan operasi LIFO.`
      : `Penyelidikan ${lesson.title}: Analisis bagaimana aliran data masuk dari belakang (Rear) dan keluar dari depan (Front) secara tertib (FIFO).`,
    quiz: {
      question: isStack
        ? `Jika kamu melakukan operasi pada ${lesson.title}, elemen mana yang paling pertama terkena dampak?`
        : `Pada mekanisme ${lesson.title}, di posisi manakah penanganan elemen dilakukan?`,
      options: isStack
        ? [
            { key: 'A', text: 'Elemen paling dasar (Bottom)' },
            { key: 'B', text: 'Elemen paling atas (Top)', isCorrect: true },
            { key: 'C', text: 'Elemen acak di tengah' },
          ]
        : [
            { key: 'A', text: 'Elemen terdepan (Front) atau terbelakang (Rear) sesuai aturan', isCorrect: true },
            { key: 'B', text: 'Selalu elemen yang nilainya paling besar' },
            { key: 'C', text: 'Elemen acak mana saja' },
          ],
      explanation: isStack
        ? 'Tepat sekali! Seluruh operasi Stack (Push, Pop, Peek) selalu berfokus pada elemen teratas (Top).'
        : 'Tepat sekali! Pada Queue standar, Enqueue dilakukan di Rear dan Dequeue diambil dari Front.',
    },
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    const chosen = missionData.quiz.options.find((o) => o.key === selectedAnswer);
    if (chosen?.isCorrect) {
      setFeedback({
        isCorrect: true,
        text: `Jawaban Benar (+100 Poin)! ${missionData.quiz.explanation}`,
      });
      learningProgressService.completeLesson(moduleName, lesson.id, 100);
      onLessonCompleted(lesson.id, 100);
    } else {
      setFeedback({
        isCorrect: false,
        text: 'Kurang tepat. Coba telaah kembali prinsip aliran data pada konsep ini!',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-base border border-indigo-500/30">
              {lesson.id}
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                Modul {isStack ? 'Stack' : 'Queue'} • Inquiry Lesson
              </span>
              <h3 className="text-base font-bold text-white">{lesson.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
          {/* Inquiry Mission Box */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg">🕵️</span>
              <div>
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                  Misi Penyelidikan Siswa
                </h4>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  {missionData.detectiveMission}
                </p>
              </div>
            </div>
          </div>

          {/* Explanation / Concept */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Penjelasan Konsep</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {lesson.desc || 'Pelajari struktur dan algoritma data ini untuk menyelesaikan tantangan kuis pemahaman.'}
            </p>
          </div>

          {/* Quick Inquiry Quiz */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-800">
                Kuis Evaluasi Pemahaman (+100 Poin)
              </h4>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                ⭐ Skor Aktif
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium mb-3">
              {missionData.quiz.question}
            </p>

            <div className="space-y-2">
              {missionData.quiz.options.map((opt) => {
                const isSelected = selectedAnswer === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setSelectedAnswer(opt.key);
                      setFeedback(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-950'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-medium border ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Tutup
          </button>

          {!feedback?.isCorrect ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition active:scale-95 shadow-sm"
            >
              Cek Jawaban & Kumpulkan Nilai 🎯
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 shadow-sm"
            >
              Lanjutkan ke Tahap Berikutnya ➔
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

