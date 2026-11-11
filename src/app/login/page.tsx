'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/Skeletons';
import { loginApi } from '@/lib/api';
import { getRoleDashboardPath, saveAuthSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getRedirectDestination = (role?: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get('redirect');
      if (redirectParam && redirectParam.startsWith('/')) {
        return redirectParam;
      }
      const sessionRedirect = sessionStorage.getItem('redirectAfterLogin');
      if (sessionRedirect && sessionRedirect.startsWith('/')) {
        sessionStorage.removeItem('redirectAfterLogin');
        return sessionRedirect;
      }
    }
    return getRoleDashboardPath(role);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(email, password);
      if (data.success && data.user) {
        saveAuthSession(data.token, data.user);
        router.push(getRedirectDestination(data.user.role));
      } else {
        setError(data.error || data.message || 'Sign in failed');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Network error, please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col justify-center py-10 px-4">
      <div className="max-w-[460px] w-full mx-auto flex flex-col items-center">
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

        <h1 className="text-[28px] sm:text-[32px] font-serif font-bold text-[#141414] mb-1.5 text-center leading-tight">
          Sign in to your BBC Account
        </h1>
        <p className="text-sm text-neutral-600 mb-6 text-center">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-[#bb1919] font-bold underline underline-offset-2 hover:text-[#991515]"
          >
            Register now
          </Link>
        </p>

        {/* White Card Container */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8 flex flex-col">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-neutral-300 rounded-md px-4 py-3 pr-11 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white"
                  required
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 text-white font-bold text-sm uppercase tracking-wider bg-black hover:bg-neutral-800 transition-colors rounded-md shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? <Spinner /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
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
