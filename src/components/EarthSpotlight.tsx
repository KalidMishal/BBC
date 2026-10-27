'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { earthFeature } from '../data/bbcData';
import { Article } from '../types';

interface EarthSpotlightProps {
  onArticleClick?: (article: Article) => void;
}

export default function EarthSpotlight({ onArticleClick }: EarthSpotlightProps) {
  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-6 pb-8">
      {/* Section Header matching Image 4 */}
      <div className="border-t-2 border-neutral-900 pt-3 mb-6">
        <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight uppercase flex items-center space-x-1 cursor-pointer hover:text-red-600 transition">
          <span>EARTH</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </h2>
      </div>

      <article
        onClick={() => onArticleClick?.(earthFeature)}
        className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
      >
        {/* Left: Title and Summary (~5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <h3 className="text-2xl sm:text-[28px] lg:text-[32px] font-serif font-bold text-neutral-900 group-hover:underline leading-[1.2]">
            {earthFeature.title}
          </h3>
          <p className="font-serif text-[13.5px] sm:text-[14px] text-neutral-600 leading-relaxed font-normal">
            {earthFeature.summary}
          </p>
        </div>

        {/* Right: Birdwatching illustration (~7 cols) */}
        <div className="md:col-span-7">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs shadow-xs">
            <Image
              src={earthFeature.imageUrl || '/earth-birdwatching.jpg'}
              alt={earthFeature.imageAlt || earthFeature.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </article>
    </section>
  );
}
