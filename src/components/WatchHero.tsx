'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { watchHeroCinema } from '../data/bbcData';
import { Article } from '../types';

interface WatchHeroProps {
  onVideoClick?: (video: Article) => void;
}

export default function WatchHero({ onVideoClick }: WatchHeroProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-5 pb-8">
      {/* Header matching media_1794021619253_52337f93.jpg */}
      <div className="mb-4">
        <h2 className="font-sans font-bold text-[30px] text-neutral-900 tracking-tight leading-tight">
          Watch
        </h2>
      </div>

      {/* Single widescreen video banner */}
      <article
        onClick={() => onVideoClick?.(watchHeroCinema)}
        className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 bg-black overflow-hidden shadow-xs"
      >
        {/* Left: Macro Snake Image (2/3 width) */}
        <div className="md:col-span-8 relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
          <Image
            src={watchHeroCinema.imageUrl || '/watch-snake-macro.jpg'}
            alt={watchHeroCinema.imageAlt || watchHeroCinema.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-500"
          />
          {/* Black square with white Play button anchored at bottom-left corner */}
          <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-11 sm:h-11 bg-black flex items-center justify-center text-white">
            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Right: Black content box (1/3 width) */}
        <div className="md:col-span-4 bg-black text-white p-6 sm:p-7 md:p-8 flex flex-col justify-center items-start">
          <h3 className="font-serif font-bold text-[18px] sm:text-[21px] text-white leading-snug group-hover:underline">
            {watchHeroCinema.title}
          </h3>
          {watchHeroCinema.summary && (
            <p className="font-serif text-[12px] sm:text-[12.5px] text-neutral-300 leading-relaxed mt-3">
              {watchHeroCinema.summary}
            </p>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVideoClick?.(watchHeroCinema);
            }}
            className="border border-white text-white font-sans text-[11px] sm:text-xs font-semibold px-3.5 py-1.5 mt-4 hover:bg-white hover:text-black transition cursor-pointer"
          >
            See more
          </button>
        </div>
      </article>
    </section>
  );
}
