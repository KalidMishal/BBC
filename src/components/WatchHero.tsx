'use client';

import React from 'react';
import Image from 'next/image';
import { Play, ChevronRight } from 'lucide-react';
import { watchHeroCinema } from '../data/bbcData';
import { Article } from '../types';

interface WatchHeroProps {
  onVideoClick?: (video: Article) => void;
}

export default function WatchHero({ onVideoClick }: WatchHeroProps) {
  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 py-6">
      {/* Section Header matching Image 1 */}
      <div className="border-t-2 border-neutral-900 pt-2 mb-4">
        <h2 className="text-sm sm:text-[15px] font-black text-neutral-900 uppercase flex items-center space-x-1 cursor-pointer hover:text-red-600 transition tracking-wide">
          <span>WATCH</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </h2>
      </div>

      <article
        onClick={() => onVideoClick?.(watchHeroCinema)}
        className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#383134] text-white rounded-xs overflow-hidden p-5 sm:p-7 shadow-xs"
      >
        {/* Left: Vintage / Modern TVs Widescreen Triptych */}
        <div className="md:col-span-7">
          <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-neutral-900 rounded-xs">
            <Image
              src="/watch-tvs.jpg"
              alt={watchHeroCinema.title}
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            {/* Centered Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-13 h-13 rounded-full bg-black/60 border border-white/40 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-110 group-hover:bg-red-600 group-hover:border-transparent transition-all shadow-lg">
                <Play className="w-6 h-6 fill-white text-white ml-0.5" />
              </div>
            </div>
            {/* Video Duration Badge */}
            <div className="absolute bottom-2.5 left-2.5 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs backdrop-blur-xs">
              {watchHeroCinema.videoDuration || '08:24'}
            </div>
          </div>
        </div>

        {/* Right: Title, Summary & See more Button */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-white group-hover:underline decoration-white decoration-2 leading-tight">
              {watchHeroCinema.title}
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mt-2.5 line-clamp-3">
              {watchHeroCinema.summary}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVideoClick?.(watchHeroCinema);
              }}
              className="inline-flex items-center justify-center bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs sm:text-sm px-5 py-2 rounded-xs transition cursor-pointer shadow-xs"
            >
              See more
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
