'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, Check } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
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
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <h2 className="text-2xl font-black text-neutral-900">
            Sign in with your BBC Account
          </h2>
          <p className="text-xs text-neutral-600">
            Enjoy personalized notifications, save articles for later, and customize your news feed.
          </p>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-emerald-800 text-sm flex items-center space-x-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Signed in successfully! Welcome back.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@example.com"
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
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-2.5 rounded text-sm transition cursor-pointer"
              >
                Sign In
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-neutral-200 text-center space-y-2">
            <p className="text-xs text-neutral-600">
              Don&apos;t have a BBC account?
            </p>
            <button
              onClick={() => alert("Registration demo: Account creation initiated.")}
              className="text-xs font-bold text-neutral-900 underline hover:text-red-600 cursor-pointer"
            >
              Register for free today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
