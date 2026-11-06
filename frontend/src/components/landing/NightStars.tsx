'use client';

import React, { useMemo } from 'react';

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function NightStars() {
  const stars = useMemo(() => {
    // 380 stars covering 100% of the screen from top to bottom
    return Array.from({ length: 380 }, (_, i) => ({
      id: i,
      x: seededRand(i * 3) * 100, // 0% - 100% width
      y: seededRand(i * 3 + 1) * 98, // 0% - 98% full height
      size: 0.6 + seededRand(i * 7) * 1.4, // delicate 0.6px - 2.0px
      twinkleDur: 2 + seededRand(i * 11) * 4, // 2s - 6s
      twinkleDelay: seededRand(i * 13) * 6,
      driftAmp: 2 + seededRand(i * 17) * 4, // 2px - 6px subtle drift
      driftDur: 8 + seededRand(i * 19) * 10,
      driftDelay: seededRand(i * 23) * 8,
      baseOpacity: 0.35 + seededRand(i * 5) * 0.65,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--so); }
          40%       { opacity: calc(var(--so) * 0.15); }
          70%       { opacity: calc(var(--so) * 0.85); }
        }
        @keyframes starDrift {
          0%, 100% { transform: translateX(0px); }
          50%       { transform: translateX(var(--da)); }
        }
      `}</style>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: 'white',
            ['--so' as string]: s.baseOpacity,
            opacity: s.baseOpacity,
            animation: `starTwinkle ${s.twinkleDur}s ${s.twinkleDelay}s ease-in-out infinite,
                         starDrift ${s.driftDur}s ${s.driftDelay}s ease-in-out infinite`,
            ['--da' as string]: `${s.driftAmp}px`,
          }}
        />
      ))}
    </div>
  );
}
