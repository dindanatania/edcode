'use client';

import React from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastState {
  isOpen: boolean;
  variant?: ToastVariant;
  title?: string;
  message: string;
}

interface ToastNotificationProps {
  isOpen: boolean;
  variant?: ToastVariant;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function ToastNotification({
  isOpen,
  variant = 'info',
  title,
  message,
  onClose,
}: ToastNotificationProps) {
  if (!isOpen) return null;

  // Configurations strictly aligned with user reference image (media_1793939548331_76768cd9.png)
  const config = {
    info: {
      defaultTitle: 'Information',
      glowGradient: 'from-sky-100/80 via-sky-50/30 to-transparent',
      ambientColor: 'bg-sky-200/50',
      iconContainerBorder: 'border-sky-100',
      icon: (
        <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.85}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 8.5v.01M12 11.5v4.5" />
        </svg>
      ),
    },
    success: {
      defaultTitle: 'Success',
      glowGradient: 'from-emerald-100/80 via-emerald-50/30 to-transparent',
      ambientColor: 'bg-emerald-200/50',
      iconContainerBorder: 'border-emerald-100',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.85}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 5-5" />
        </svg>
      ),
    },
    warning: {
      defaultTitle: 'Warning',
      glowGradient: 'from-amber-100/80 via-amber-50/30 to-transparent',
      ambientColor: 'bg-amber-200/50',
      iconContainerBorder: 'border-amber-100',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.85}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.5m0 3.5h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      ),
    },
    error: {
      defaultTitle: 'Error',
      glowGradient: 'from-rose-100/80 via-rose-50/30 to-transparent',
      ambientColor: 'bg-rose-200/50',
      iconContainerBorder: 'border-rose-100',
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.85}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 8v4.5m0 3.5h.01" />
        </svg>
      ),
    },
  }[variant];

  const displayTitle = title || config.defaultTitle;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[420px] transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className="relative bg-white rounded-2xl shadow-[0_14px_40px_-8px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100/80 p-4 sm:p-4.5 flex items-start gap-3.5 overflow-hidden">
        
        {/* Soft Ambient Corner Glow Wash (from reference image) */}
        <div
          className={`absolute -left-6 -top-6 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-60 ${config.ambientColor}`}
        />
        <div
          className={`absolute top-0 left-0 w-36 h-full bg-gradient-to-r ${config.glowGradient} pointer-events-none opacity-80`}
        />

        {/* Squircle Left Icon Badge */}
        <div
          className={`relative z-10 w-11 h-11 rounded-2xl bg-white border ${config.iconContainerBorder} shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0`}
        >
          {config.icon}
        </div>

        {/* Title & Message Description */}
        <div className="relative z-10 flex-1 min-w-0 pt-0.5 pr-1">
          <h4 className="text-sm font-bold text-slate-900 leading-snug tracking-tight">
            {displayTitle}
          </h4>
          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
            {message}
          </p>
        </div>

        {/* Top-Right Dismiss Cross */}
        <button
          onClick={onClose}
          type="button"
          className="relative z-10 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100/70 transition shrink-0 -mt-1 -mr-1"
          aria-label="Tutup notifikasi"
          title="Tutup"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  );
}
