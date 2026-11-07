'use client';

import React, { useState, useEffect } from 'react';

const PHRASES = [
  'Mulai Perjalananmu Menjadi Programmer!',
  'Kuasai Struktur Data Stack & Queue!',
  'Asah Logika Computational Thinking!',
  'Siap Menjadi Developer SMK PPLG Handal!',
];

export default function HeroTypingTitle() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = PHRASES[phraseIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 70);
      } else {
        // Tahan teks penuh selama 2.8 detik sebelum mulai menghapus
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2800);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 32);
      } else {
        // Ganti ke frasa berikutnya setelah jeda singkat
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
        }, 350);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIdx]);

  return (
    <h1
      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-white tracking-normal whitespace-nowrap flex items-center min-h-[44px] sm:min-h-[52px]"
      style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        textShadow: '0 2px 14px rgba(0,0,0,0.5)',
      }}
    >
      <span>{displayText}</span>
      <span className="inline-block w-[3px] h-[1.15em] bg-white ml-2 align-middle animate-cursor-blink shadow-sm" />
    </h1>
  );
}

