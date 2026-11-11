'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { watchHeroCinema } from '../data/bbcData';
import { Article } from '../types';

interface WatchHeroProps {
  onVideoClick?: (video: Article) => void;
  feature?: Article;
}

export default function WatchHero({
  onVideoClick,
  feature = watchHeroCinema
}: WatchHeroProps) {
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
        onClick={() => onVideoClick?.(feature)}
        className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 bg-black overflow-hidden shadow-xs"
      >
        {/* Left: Macro Snake Image (2/3 width) */}
        <div className="md:col-span-8 relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
          <Image
            src={feature.imageUrl || '/watch-snake-macro.jpg'}
            alt={feature.imageAlt || feature.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-500"
          />
          {/* Black square with white Play button anchored at bottom-left corner */}
          <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-11 sm:h-11 bg-black flex items-center justify-center text-white">
            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Right: Black content box (1/3 width) */}
        <div className="md:col-span-4 bg-black text-white p-6 sm:p-7 md:p-5 lg:p-6 xl:px-7 xl:py-8 2xl:px-7 flex flex-col justify-center items-start">
          <h3 className="font-serif font-bold text-[24px] sm:text-[28px] md:text-[21px] lg:text-[25px] xl:text-[30px] 2xl:text-[34px] text-white leading-[1.16] tracking-[-0.01em] group-hover:underline">
            {feature.title}
          </h3>
          {feature.summary && (
            <p className="font-sans font-medium text-[15px] sm:text-[16px] md:text-[13px] lg:text-[14.5px] xl:text-[16px] 2xl:text-[17.5px] text-neutral-200 leading-[1.48] mt-3 sm:mt-4 md:mt-2.5 lg:mt-3.5 xl:mt-4">
              {feature.summary}
            </p>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVideoClick?.(feature);
            }}
            className="border-[1.5px] border-white text-white font-sans text-[14px] sm:text-[15px] md:text-[12.5px] lg:text-[14px] xl:text-[15.5px] 2xl:text-[16.5px] font-bold px-5 py-2 md:px-4 md:py-1.5 lg:px-5 lg:py-2 xl:px-5 xl:py-2 mt-5 sm:mt-6 md:mt-3.5 lg:mt-4 xl:mt-5 hover:bg-white hover:text-black transition cursor-pointer"
          >
            See more
          </button>
        </div>
      </article>
    </section>
  );
}
