'use client';

import React from 'react';
import Image from 'next/image';
import { topStoryLead, topStoriesSecondary, topStoriesSideList } from '../data/bbcData';
import { Article } from '../types';

interface HeroSectionProps {
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
  leadStory?: Article;
  secondaryStories?: Article[];
  sideStories?: Article[];
}

export default function HeroSection({
  onArticleClick,
  onVideoClick,
  leadStory = topStoryLead,
  secondaryStories = topStoriesSecondary,
  sideStories = topStoriesSideList
}: HeroSectionProps) {
  const meghanStory = secondaryStories[0] || topStoriesSecondary[0];
  const eaglesNestStory = secondaryStories[1] || topStoriesSecondary[1];
  const displayedSideStories = sideStories.slice(0, 5);

  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-3 sm:pt-3.5 pb-5">
      {/* 
        3-Column Grid matching media_1794046839520_42a0686b.jpg (Image 1):
        Left (~26%): Meghan Markle & Eagle's Nest cards (no divider between them)
        Center (~48%): Paris protests lead story with LIVE UPDATES
        Right (~26%): LATEST UPDATES with amber square and 5 clean headlines aligned to Left column bottom
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.85fr_1fr] gap-5 lg:gap-7 lg:items-stretch">
        
        {/* Left Column: 2 Cards with image, bold sans-serif headline, uppercase metadata */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:h-full lg:justify-between">
          {/* Article 1: Meghan Markle */}
          <article
            onClick={() => onArticleClick?.(meghanStory)}
            className="group cursor-pointer flex flex-col"
          >
            {meghanStory.imageUrl && (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mb-2">
                <Image
                  src={meghanStory.imageUrl}
                  alt={meghanStory.title}
                  fill
                  className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div>
              <h3 className="font-sans font-bold text-[17px] sm:text-[18px] lg:text-[16.5px] xl:text-[18px] 2xl:text-[18.5px] text-neutral-900 group-hover:underline leading-[1.2]">
                {meghanStory.title}
              </h3>
              <div className="flex items-center space-x-1.5 font-sans text-[12px] sm:text-[12.5px] text-neutral-600 font-bold uppercase tracking-wider mt-1.5 sm:mt-2">
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
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mb-2">
                <Image
                  src={eaglesNestStory.imageUrl}
                  alt={eaglesNestStory.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div>
              <h3 className="font-sans font-bold text-[17px] sm:text-[18px] lg:text-[16.5px] xl:text-[18px] 2xl:text-[18.5px] text-neutral-900 group-hover:underline leading-[1.2]">
                {eaglesNestStory.title}
              </h3>
              <div className="flex items-center space-x-1.5 font-sans text-[12px] sm:text-[12.5px] text-neutral-600 font-bold uppercase tracking-wider mt-1.5 sm:mt-2">
                <span>{eaglesNestStory.category}</span>
                <span>•</span>
                <span>{eaglesNestStory.time}</span>
              </div>
            </div>
          </article>
        </div>

        {/* Center Column: Main Lead Story with Paris protests image, large bold sans-serif headline, LIVE UPDATES */}
        <div className="flex flex-col h-full">
          <article
            onClick={() => onArticleClick?.(leadStory)}
            className="group cursor-pointer flex flex-col flex-1"
          >
            {leadStory.imageUrl && (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mb-2.5 shadow-xs">
                <Image
                  src={leadStory.imageUrl}
                  alt={leadStory.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[26px] sm:text-[31px] lg:text-[29px] xl:text-[33px] 2xl:text-[35px] font-sans font-bold text-neutral-900 group-hover:underline leading-[1.12]">
                  {leadStory.title}
                </h2>

                {leadStory.summary && (
                  <p className="font-sans text-[14.5px] sm:text-[15.5px] lg:text-[14px] xl:text-[15px] 2xl:text-[15.5px] text-neutral-600 leading-[1.52] font-normal mt-2.5">
                    {leadStory.summary}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-1.5 font-sans text-[12.5px] sm:text-[13px] font-bold tracking-wider mt-3 uppercase">
                <span className="text-neutral-600">{leadStory.category || 'WORLD'}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-[#b4982d]">LIVE UPDATES</span>
              </div>
            </div>
          </article>
        </div>

        {/* Right Column: ■ LATEST UPDATES with 5 headline-only articles */}
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-3 sm:mb-3.5 lg:mb-3 xl:mb-4">
            <span className="w-3.5 h-3.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 2xl:h-4 bg-[#c9a62e] inline-block mr-2.5 xl:mr-3 shrink-0" />
            <h2 className="font-sans font-bold text-[26px] sm:text-[30px] lg:text-[21px] xl:text-[28px] 2xl:text-[32px] uppercase tracking-tight leading-none text-neutral-900">
              LATEST UPDATES
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-3.5 lg:gap-1.5">
            {displayedSideStories.map((story, idx) => (
              <React.Fragment key={story.id}>
                <article
                  onClick={() => onArticleClick?.(story)}
                  className="group cursor-pointer flex flex-col"
                >
                  <h3 className="font-sans font-bold text-[18.5px] sm:text-[19.5px] lg:text-[15.5px] xl:text-[19px] 2xl:text-[21px] text-neutral-900 group-hover:underline leading-[1.2]">
                    {story.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 font-sans text-[12.5px] sm:text-[13px] lg:text-[11px] xl:text-[12.5px] 2xl:text-[13.5px] text-neutral-600 font-bold uppercase tracking-wider mt-1.5 xl:mt-2">
                    <span>{story.category}</span>
                    <span>•</span>
                    <span>{story.time}</span>
                  </div>
                </article>
                {idx < displayedSideStories.length - 1 && (
                  <div className="border-b border-neutral-200 w-full" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
