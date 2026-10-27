'use client';

import React from 'react';
import Image from 'next/image';
import { topStoryLead, topStoriesSecondary, topStoriesSideList } from '../data/bbcData';
import { Article } from '../types';

interface HeroSectionProps {
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
}

export default function HeroSection({ onArticleClick, onVideoClick }: HeroSectionProps) {
  const meghanStory = topStoriesSecondary[0];
  const eaglesNestStory = topStoriesSecondary[1];

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-7">
      {/* 
        Grid column ratio:
        Left: ~340px (Meghan heading wraps to exactly 3 lines matching reference)
        Center: 1fr (lead image & live headline)
        Right: ~235px (descriptions wrap to exactly 4 lines matching reference)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_235px] gap-6 lg:gap-8 items-stretch justify-between">
        
        {/* Left Column: Width increased from right side, wraps heading to 3 lines */}
        <div className="flex flex-col justify-between h-full">
          {/* Article 1: Meghan Markle (Headline naturally wraps across 3 lines) */}
          <article
            onClick={() => onArticleClick?.(meghanStory)}
            className="group cursor-pointer flex flex-col border-b border-neutral-200 pb-3 mb-3"
          >
            {meghanStory.imageUrl && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2.5">
                <Image
                  src={meghanStory.imageUrl}
                  alt={meghanStory.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div>
              <h3 className="font-serif font-bold text-[17px] sm:text-[17.5px] text-neutral-900 group-hover:underline leading-[1.25]">
                {meghanStory.title}
              </h3>
              {meghanStory.summary && (
                <p className="font-serif text-[13px] text-neutral-600 mt-1.5 leading-relaxed">
                  {meghanStory.summary}
                </p>
              )}
              <div className="flex items-center space-x-2 font-sans text-[11px] text-neutral-500 font-medium mt-2">
                <span>{meghanStory.time}</span>
                <span>|</span>
                <span className="text-neutral-700 font-semibold hover:underline">{meghanStory.category}</span>
              </div>
            </div>
          </article>

          {/* Article 2: Hitler's Eagle's Nest Retreat */}
          <article
            onClick={() => eaglesNestStory.badge === 'VIDEO' && onVideoClick ? onVideoClick(eaglesNestStory) : onArticleClick?.(eaglesNestStory)}
            className="group cursor-pointer flex flex-col border-b border-neutral-200 pb-3"
          >
            {eaglesNestStory.imageUrl && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2.5">
                <Image
                  src={eaglesNestStory.imageUrl}
                  alt={eaglesNestStory.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div>
              <h3 className="font-serif font-bold text-[16px] sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
                {eaglesNestStory.title}
              </h3>
              {eaglesNestStory.summary && (
                <p className="font-serif text-[13px] text-neutral-600 mt-1.5 leading-relaxed">
                  {eaglesNestStory.summary}
                </p>
              )}
              <div className="flex items-center space-x-2 font-sans text-[11px] text-neutral-500 font-medium mt-2">
                <span>{eaglesNestStory.time}</span>
                <span>|</span>
                <span className="text-neutral-700 font-semibold hover:underline">{eaglesNestStory.category}</span>
              </div>
            </div>
          </article>
        </div>

        {/* Center Column: Main Lead Story (No vertical dividing lines on left or right) */}
        <div className="flex flex-col justify-between h-full">
          <article
            onClick={() => onArticleClick?.(topStoryLead)}
            className="group cursor-pointer flex flex-col h-full"
          >
            {topStoryLead.imageUrl && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 shadow-xs">
                <Image
                  src={topStoryLead.imageUrl}
                  alt={topStoryLead.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className="space-y-2 mt-1">
              <h2 className="text-2xl sm:text-[28px] font-serif font-bold text-neutral-900 group-hover:underline leading-[1.2]">
                <span className="text-red-600 font-bold inline-flex items-center gap-1.5 mr-2 align-middle">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-red-600 bg-red-600 inline-block animate-pulse" />
                  <span>LIVE</span>
                </span>
                {topStoryLead.title}
              </h2>

              <p className="font-serif text-[14px] text-neutral-600 leading-relaxed font-normal">
                {topStoryLead.summary}
              </p>
            </div>
          </article>
        </div>

        {/* Right Column: Width ~235px, 4 articles with bottom ash lines under each article */}
        <div className="flex flex-col justify-between h-full">
          {topStoriesSideList.map((story) => (
            <article
              key={story.id}
              onClick={() => onArticleClick?.(story)}
              className="group cursor-pointer flex flex-col justify-between py-2 border-b border-neutral-200 pb-3 mb-2 last:mb-0"
            >
              <div>
                <h3 className="font-serif font-bold text-[14px] sm:text-[14.5px] text-neutral-900 group-hover:underline leading-snug">
                  {story.title}
                </h3>
                {story.summary && (
                  <p className="font-serif text-[12.5px] text-neutral-600 mt-1 leading-[1.38]">
                    {story.summary}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 font-sans text-[11px] text-neutral-500 font-medium mt-1.5">
                <span>{story.time}</span>
                <span>|</span>
                <span className="text-neutral-700 font-semibold hover:underline">{story.category}</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
