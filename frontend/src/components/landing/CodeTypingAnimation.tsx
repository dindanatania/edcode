'use client';

import React, { useEffect, useRef, useState } from 'react';

// Single simple line that types and resets
const CODE = 'console.log("Hello, World!");';

export default function CodeTypingAnimation() {
  const [displayed, setDisplayed] = useState('');
  const stateRef = useRef({ text: '', isDeleting: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      const s = stateRef.current;
      if (!s.isDeleting) {
        if (s.text.length < CODE.length) {
          s.text = CODE.slice(0, s.text.length + 1);
          setDisplayed(s.text);
          timerRef.current = setTimeout(tick, 75);
        } else {
          s.isDeleting = true;
          timerRef.current = setTimeout(tick, 1800);
        }
      } else {
        if (s.text.length > 0) {
          s.text = CODE.slice(0, s.text.length - 1);
          setDisplayed(s.text);
          timerRef.current = setTimeout(tick, 35);
        } else {
          s.isDeleting = false;
          timerRef.current = setTimeout(tick, 500);
        }
      }
    };

    timerRef.current = setTimeout(tick, 100);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Simple syntax highlight
  const highlighted = displayed
    .replace(/(console)/g, "<span style='color:#79b8ff'>$1</span>")
    .replace(/(\.log)/g, "<span style='color:#b392f0'>$1</span>")
    .replace(/("[^"]*"?)/g, "<span style='color:#9ecbff'>$1</span>");

  return (
    <div
      className="relative pointer-events-none shrink-0"
      style={{ width: '320px', minWidth: '320px', maxWidth: '320px' }}
    >
      {/* Soft glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: '0 0 60px 20px rgba(80,140,255,0.2)',
          borderRadius: '16px',
        }}
      />

      {/* Editor window */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10"
        style={{ background: 'rgba(10, 20, 50, 0.9)', backdropFilter: 'blur(10px)', width: '320px' }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-1.5 px-3 py-2"
          style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[10px] text-white/30 font-mono">index.js</span>
        </div>

        {/* Code area - FIXED HEIGHT and FIXED WIDTH so layout NEVER shifts */}
        <div className="px-4 py-4 font-mono text-sm leading-7 h-[68px] flex items-center overflow-hidden whitespace-nowrap">
          <span className="text-white/20 mr-3 select-none text-xs shrink-0">1</span>
          <span
            style={{ color: '#e6edf3' }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
          {/* blinking cursor */}
          <span
            className="inline-block w-[2px] h-[1.1em] align-middle ml-px shrink-0"
            style={{
              background: '#58a6ff',
              animation: 'cursorBlink 1s step-end infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
