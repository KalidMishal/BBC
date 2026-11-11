'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Lock, Mail, Check, User, Eye, EyeOff } from 'lucide-react';
import { loginApi, registerApi } from '../lib/api';
import { getRoleDashboardPath, saveAuthSession } from '../lib/auth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function SignInModal({
  isOpen,
  onClose,
  initialMode = 'login',
}: SignInModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const res = await registerApi(email, password, fullName || undefined);
        saveAuthSession(res.token, res.user);
        setSuccessMessage(
          `Account created for ${res.user?.email || email}! Welcome to BBC.`
        );
        setTimeout(() => {
          setSuccessMessage(null);
          setPassword('');
          onClose();
        }, 1200);
      } else {
        const res = await loginApi(email, password);
        saveAuthSession(res.token, res.user);
        const role = res.user?.role;
        setSuccessMessage(
          `Signed in as ${res.user?.email || email}! Redirecting...`
        );
        setTimeout(() => {
          setSuccessMessage(null);
          setPassword('');
          onClose();
          if (role === 'admin' || role === 'writer') {
            router.push(getRoleDashboardPath(role));
          }
        }, 900);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Authentication request failed'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header with BBC Logo */}
        <div className="bg-neutral-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="w-7 h-7 bg-white text-black font-bold flex items-center justify-center text-sm">
              B
            </div>
            <div className="w-7 h-7 bg-white text-black font-bold flex items-center justify-center text-sm">
              B
            </div>
            <div className="w-7 h-7 bg-white text-black font-bold flex items-center justify-center text-sm">
              C
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <h2 className="text-2xl font-black text-neutral-900">
            {mode === 'login'
              ? 'Sign in with your BBC Account'
              : 'Create your BBC Account'}
          </h2>
          <p className="text-xs text-neutral-600">
            Save articles for later, manage your reading feed, or sign in to the editorial desk.
          </p>

          {successMessage ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-emerald-800 text-sm flex items-center space-x-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={mode === 'register' ? 6 : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-500 text-white font-bold py-2.5 rounded text-sm transition cursor-pointer"
              >
                {isSubmitting
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-neutral-200 text-center space-y-2">
            <p className="text-xs text-neutral-600">
              {mode === 'login'
                ? "Don't have a BBC account?"
                : 'Already have a BBC account?'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setMode(mode === 'login' ? 'register' : 'login');
                }}
                className="text-xs font-bold text-neutral-900 underline hover:text-red-600 cursor-pointer"
              >
                {mode === 'login' ? 'Register for free today' : 'Sign in instead'}
              </button>
              <span className="text-neutral-300">|</span>
              <Link
                href="/login"
                onClick={onClose}
                className="text-xs font-bold text-neutral-600 hover:text-black underline"
              >
                Full sign-in page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
