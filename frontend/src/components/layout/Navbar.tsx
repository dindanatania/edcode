'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { User } from '@/types/auth';

interface NavbarProps {
  variant?: 'transparent' | 'default';
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = authService.getSavedUser();
    if (saved) {
      setUser(saved);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  const isTransparent = variant === 'transparent';

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${
        isTransparent
          ? 'absolute top-0 left-0 bg-gradient-to-b from-black/25 via-black/10 to-transparent text-white'
          : 'sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center transition hover:opacity-90"
            >
              <Image
                src="/EdcodeLogo.png"
                alt="Edcode Logo"
                width={160}
                height={42}
                className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div
              className={`hidden md:flex items-center gap-6 text-sm font-semibold ${
                isTransparent
                  ? 'text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]'
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {user && (
                <Link
                  href={user.role === 'instructor' ? '/instructor/courses' : '/student/my-courses'}
                  className="hover:text-white transition hover:underline underline-offset-4"
                >
                  {user.role === 'instructor' ? 'Dashboard Pengajar' : 'Kursus Saya'}
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4 text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${
                    isTransparent ? 'text-white drop-shadow' : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {user.full_name}{' '}
                  <span className="text-xs bg-blue-500/80 text-white px-2 py-0.5 rounded-full capitalize">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    isTransparent
                      ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                      : 'border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`px-3 py-1.5 font-medium transition ${
                    isTransparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
                  }`}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className={`px-3 py-1.5 font-medium transition hidden sm:inline-block ${
                    isTransparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
                  }`}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
