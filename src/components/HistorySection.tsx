'use client';

import React from 'react';
import Image from 'next/image';
import { crownsAndControversies } from '../data/bbcData';
import { Article } from '../types';

interface HistorySectionProps {
  onArticleClick?: (article: Article) => void;
}

export default function HistorySection({ onArticleClick }: HistorySectionProps) {
  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-6 pb-8">
      {/* Section Header matching Image 3: uppercase CROWNS AND CONTROVERSIES without chevron */}
      <div className="border-t-2 border-neutral-900 pt-3 mb-6">
        <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight uppercase">
          CROWNS AND CONTROVERSIES
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
        {crownsAndControversies.map((story) => (
          <article
            key={story.id}
            onClick={() => onArticleClick?.(story)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            {story.imageUrl && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs mb-3 shadow-xs">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div>
              <h3 className="font-serif font-bold text-[16px] sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
                {story.title}
              </h3>
              {story.summary && (
                <p className="font-serif text-[12.5px] sm:text-[13px] text-neutral-600 mt-2 leading-[1.4]">
                  {story.summary}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
