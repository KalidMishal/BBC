'use client';

import React from 'react';
import Image from 'next/image';
import { weekendReads } from '../data/bbcData';
import { Article } from '../types';

interface WeekendReadsProps {
  onArticleClick?: (article: Article) => void;
}

export default function WeekendReads({ onArticleClick }: WeekendReadsProps) {
  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-6 pb-8">
      {/* Section Header matching Image 1 */}
      <div className="border-t-2 border-neutral-900 pt-3 mb-5">
        <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight uppercase">
          WEEKEND READS
        </h2>
      </div>

      {/* Two Large Landscape Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {weekendReads.map((story) => (
          <article
            key={story.id}
            onClick={() => onArticleClick?.(story)}
            className="group cursor-pointer flex flex-col"
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

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg sm:text-[20px] text-neutral-900 group-hover:underline leading-snug">
                {story.title}
              </h3>
              {story.summary && (
                <p className="font-serif text-[13px] sm:text-[14px] text-neutral-600 leading-relaxed">
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
