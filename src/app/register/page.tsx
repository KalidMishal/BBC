'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Spinner } from '@/components/Skeletons';
import { registerApi } from '@/lib/api';
import { saveAuthSession } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordCriteria = [
    { label: 'At least 7 characters', valid: password.length >= 7 },
    {
      label: 'Lowercase (a-z) and uppercase (A-Z) letters',
      valid: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    { label: 'At least one number (0-9)', valid: /[0-9]/.test(password) },
    {
      label: 'At least one special symbol (e.g. @, $, !, %)',
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const isPasswordStrong = passwordCriteria.every((c) => c.valid);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isPasswordStrong) {
      setError(
        'Password must be at least 7 characters with uppercase, lowercase, number, and special symbol.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(email, password, name);
      if (res.success && res.user) {
        saveAuthSession(res.token, res.user);
        setSuccess('Registration successful! Redirecting to your reader dashboard...');
        setTimeout(() => {
          router.push('/reader/dashboard');
        }, 1000);
      } else {
        setError(res.error || res.message || 'Registration failed');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Network error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col justify-center py-10 px-4">
      <div className="max-w-[490px] w-full mx-auto flex flex-col items-center">
        {/* BBC 3-Box Logo */}
        <Link href="/" className="flex items-center space-x-1.5 mb-4" aria-label="BBC Home">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-base tracking-wider">
            B
          </div>
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-base tracking-wider">
            B
          </div>
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-base tracking-wider">
            C
          </div>
        </Link>
        <div className="w-10 h-[3px] bg-[#bb1919] mb-4" />

        <h1 className="text-[28px] sm:text-[32px] font-bold font-serif text-[#141414] mb-1.5 text-center leading-tight">
          Register for a BBC Account
        </h1>
        <p className="text-sm text-neutral-600 mb-6 text-center">
          Already registered?{' '}
          <Link
            href="/login"
            className="text-[#bb1919] font-bold underline underline-offset-2 hover:text-[#991515]"
          >
            Sign in
          </Link>
        </p>

        <div className="w-full bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8 flex flex-col">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded border border-red-200 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs sm:text-sm rounded border border-emerald-200 font-medium">
              {success}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  placeholder="Create a strong password"
                  className="w-full border border-neutral-300 rounded-md px-4 py-3 pr-11 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {(isPasswordFocused || password.length > 0) && (
                <div className="mt-1 p-3 bg-neutral-50 border border-neutral-200 rounded-md">
                  <p className="font-bold text-xs text-neutral-800 mb-1.5">
                    Password requirements:
                  </p>
                  <ul className="space-y-1">
                    {passwordCriteria.map((c, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-2 text-xs ${
                          c.valid ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {c.valid ? (
                          <Check className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm password"
                  className="w-full border border-neutral-300 rounded-md px-4 py-3 pr-11 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold text-sm uppercase tracking-wider py-3 rounded-md hover:bg-neutral-800 transition-colors mt-2 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Spinner /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <Link
              href="/"
              className="text-xs font-bold text-neutral-600 hover:text-black transition-colors"
            >
              ← Return to BBC Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
