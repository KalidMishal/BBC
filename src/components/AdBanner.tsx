'use client';

import React from 'react';

interface AdBannerProps {
  type?: 'placeholder' | 'billboard' | 'bbc-app' | 'midterm' | 'britbox' | 'leaderboard' | 'compact';
  width?: number;
  height?: number;
  sizeText?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export default function AdBanner({
  type = 'placeholder',
  width = 1000,
  height = 350,
  sizeText = "1000 x 350",
  title = "Discover the best of British culture, history, and storytelling",
  subtitle = "Stream thousands of hours of acclaimed BBC dramas, comedies, and factual series.",
  ctaText = "Explore Now"
}: AdBannerProps) {
  // Advertisement Banner Box matching Image (Placeholder box with vertical label outside the box and center size text)
  if (type === 'placeholder' || type === 'billboard' || type === 'bbc-app') {
    const displayText = sizeText || `${width} x ${height}`;
    return (
      <div className="w-full bg-white py-6 sm:py-8 overflow-x-hidden">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 flex items-center justify-center">
          {/* Centered Banner Wrapper with outer Advertisement label */}
          <div className="relative inline-flex items-center justify-center max-w-full">
            {/* Left Vertical Advertisement Label OUTSIDE the box matching reference image */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 sm:mr-5 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[9px] sm:text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#7e7e7e] -rotate-90 whitespace-nowrap">
                ADVERTISEMENT
              </span>
            </div>

            {/* Banner Box with exact #f9f9f9 background, #e8e8e8 border, and center size text */}
            <div
              style={{ width: `${width}px`, maxWidth: 'calc(100vw - 84px)' }}
              className="h-[200px] sm:h-[260px] md:h-[320px] lg:h-[350px] bg-[#f9f9f9] border border-[#e8e8e8] flex items-center justify-center select-none"
            >
              <span className="text-xl sm:text-2xl font-sans font-medium text-[#767676] tracking-wide">
                {displayText}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'midterm') {
    return (
      <div className="w-full my-6 max-w-[1280px] mx-auto px-4">
        <div className="text-[10px] tracking-wider uppercase text-neutral-400 font-semibold text-center mb-1">
          Advertisement
        </div>
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-sm text-white p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-purple-700/60 rounded flex items-center justify-center font-bold text-xl border border-purple-400/30">
              26
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                  SPECIAL REPORT
                </span>
                <span className="text-xs uppercase tracking-wider text-purple-200 font-medium">
                  US MIDTERM ELECTIONS 2026
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                Live results, key senate battles & race-by-race balance of power
              </h3>
            </div>
          </div>
          <button className="bg-white hover:bg-neutral-100 text-purple-950 font-bold px-5 py-2 text-sm rounded shadow transition cursor-pointer whitespace-nowrap">
            Follow Live Updates
          </button>
        </div>
      </div>
    );
  }

  if (type === 'britbox') {
    return (
      <div className="w-full my-6 max-w-[1280px] mx-auto px-4">
        <div className="text-[10px] tracking-wider uppercase text-neutral-400 font-semibold text-center mb-1">
          Advertisement
        </div>
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-neutral-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between border-t-2 border-sky-400">
          <div className="flex items-center space-x-4 mb-3 sm:mb-0">
            <div className="px-3 py-1 bg-white text-blue-950 font-black text-lg tracking-tight rounded-sm">
              britbox
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">Stream the biggest British mysteries & prestige dramas</h4>
              <p className="text-xs text-neutral-300">Start your 7-day free trial. Cancel anytime.</p>
            </div>
          </div>
          <button className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-4 py-1.5 text-xs sm:text-sm rounded transition cursor-pointer">
            Start Free Trial
          </button>
        </div>
      </div>
    );
  }

  // Default Top Leaderboard / Shop banner
  return (
    <div className="w-full bg-[#fbf9f4] border-b border-neutral-200 py-3">
      <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-3 mb-2 md:mb-0 text-center md:text-left">
          <div className="w-10 h-7 bg-black text-white flex items-center justify-center font-bold text-xs tracking-widest rounded-sm">
            BBC
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-900">{title}</p>
            <p className="text-[11px] text-neutral-500 hidden sm:block">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">AD</span>
          <button className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-3.5 py-1.5 rounded transition cursor-pointer">
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}
