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
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-6">
      {/* 
        3-Column Grid matching media_1794046839520_42a0686b.jpg (Image 1):
        Left (~26%): Meghan Markle & Eagle's Nest cards (no divider between them)
        Center (~48%): Paris protests lead story with LIVE UPDATES
        Right (~26%): LATEST UPDATES with amber square and clean headlines
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.85fr_1fr] gap-6 lg:gap-8 items-start">
        
        {/* Left Column: 2 Cards with image, bold sans-serif headline, uppercase metadata */}
        <div className="flex flex-col space-y-5">
          {/* Article 1: Meghan Markle */}
          <article
            onClick={() => onArticleClick?.(meghanStory)}
            className="group cursor-pointer flex flex-col"
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
              <h3 className="font-sans font-bold text-[15.5px] sm:text-[16.5px] text-neutral-900 group-hover:underline leading-[1.22]">
                {meghanStory.title}
              </h3>
              <div className="flex items-center space-x-1.5 font-sans text-[11px] text-neutral-500 font-bold uppercase tracking-wider mt-2">
                <span>{meghanStory.category}</span>
                <span>•</span>
                <span>{meghanStory.time}</span>
              </div>
            </div>
          </article>

          {/* Article 2: Hitler's Eagle's Nest Retreat */}
          <article
            onClick={() => eaglesNestStory.badge === 'VIDEO' && onVideoClick ? onVideoClick(eaglesNestStory) : onArticleClick?.(eaglesNestStory)}
            className="group cursor-pointer flex flex-col"
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
              <h3 className="font-sans font-bold text-[15.5px] sm:text-[16.5px] text-neutral-900 group-hover:underline leading-[1.22]">
                {eaglesNestStory.title}
              </h3>
              <div className="flex items-center space-x-1.5 font-sans text-[11px] text-neutral-500 font-bold uppercase tracking-wider mt-2">
                <span>{eaglesNestStory.category}</span>
                <span>•</span>
                <span>{eaglesNestStory.time}</span>
              </div>
            </div>
          </article>
        </div>

        {/* Center Column: Main Lead Story with Paris protests image, large bold sans-serif headline, LIVE UPDATES */}
        <div className="flex flex-col">
          <article
            onClick={() => onArticleClick?.(topStoryLead)}
            className="group cursor-pointer flex flex-col"
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

            <div>
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] font-sans font-bold text-neutral-900 group-hover:underline leading-[1.15]">
                {topStoryLead.title}
              </h2>

              {topStoryLead.summary && (
                <p className="font-sans text-[13.5px] sm:text-[14px] text-neutral-600 leading-relaxed font-normal mt-2.5">
                  {topStoryLead.summary}
                </p>
              )}

              <div className="flex items-center space-x-1.5 font-sans text-[11px] font-bold tracking-wider mt-3 uppercase">
                <span className="text-neutral-500">WORLD</span>
                <span className="text-neutral-400">•</span>
                <span className="text-[#b4982d]">LIVE UPDATES</span>
              </div>
            </div>
          </article>
        </div>

        {/* Right Column: ■ LATEST UPDATES with 4 headline-only articles */}
        <div className="flex flex-col">
          <div className="flex items-center mb-3.5 sm:mb-4">
            <span className="w-3.5 h-3.5 bg-[#c9a62e] inline-block mr-2.5 shrink-0" />
            <h2 className="font-sans font-bold text-[30px] uppercase tracking-tight leading-tight text-neutral-900">
              LATEST UPDATES
            </h2>
          </div>

          <div className="flex flex-col">
            {topStoriesSideList.map((story, idx) => (
              <article
                key={story.id}
                onClick={() => onArticleClick?.(story)}
                className={`group cursor-pointer flex flex-col justify-between py-1.5 ${
                  idx < topStoriesSideList.length - 1 ? 'border-b border-neutral-200 pb-3.5 mb-3' : 'pb-1'
                }`}
              >
                <h3 className="font-sans font-bold text-[17px] sm:text-[17.5px] md:text-[18px] text-neutral-900 group-hover:underline leading-snug">
                  {story.title}
                </h3>
                <div className="flex items-center space-x-1.5 font-sans text-[13px] text-neutral-500 font-bold uppercase tracking-wider mt-2">
                  <span>{story.category}</span>
                  <span>•</span>
                  <span>{story.time}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
