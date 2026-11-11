'use client';

import React from 'react';
import Image from 'next/image';
import { humanRightsArticles } from '../data/bbcData';
import { Article } from '../types';

interface HumanRightsSectionProps {
  onArticleClick?: (article: Article) => void;
  articles?: Article[];
}

export default function HumanRightsSection({
  onArticleClick,
  articles = humanRightsArticles
}: HumanRightsSectionProps) {
  const story1 = articles[0] || humanRightsArticles[0];
  const story2 = articles[1] || humanRightsArticles[1];

  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-5 pb-8">
      {/* Header matching media_1794016188879_d0c66188.jpg & media_1794154767970_70c1d6c7.jpg */}
      <div className="mb-4 sm:mb-5">
        <h2 className="font-sans font-bold text-[34px] sm:text-[34px] md:text-[35px] text-neutral-900 tracking-tight leading-tight">
          Human Rights &amp; Civil Liberties
        </h2>
      </div>

      {/* 2 High-Impact Landscape Cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Card 1: Language Act in Canada */}
        <article
          onClick={() => onArticleClick?.(story1)}
          className="group cursor-pointer flex flex-col justify-between"
        >
          <div>
            {story1.imageUrl && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2.5">
                <Image
                  src={story1.imageUrl}
                  alt={story1.imageAlt || story1.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <h3 className="font-sans font-bold text-[22px] sm:text-[24px] md:text-[25px] leading-[1.2] text-neutral-900 group-hover:underline">
              {story1.title}
            </h3>

            {story1.summary && (
              <p className="font-sans text-[15.5px] sm:text-[16.5px] text-neutral-600 leading-relaxed font-normal mt-3">
                {story1.summary}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 font-sans font-bold text-[13.5px] sm:text-[14px] text-neutral-600 uppercase tracking-wide mt-4">
            <span>{story1.time}</span>
            <span>|</span>
            <span className="hover:underline">{story1.category}</span>
          </div>
        </article>

        {/* Card 2: Renate Reinsve */}
        <article
          onClick={() => onArticleClick?.(story2)}
          className="group cursor-pointer flex flex-col justify-between"
        >
          <div>
            {story2.imageUrl && (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2.5">
                <Image
                  src={story2.imageUrl}
                  alt={story2.imageAlt || story2.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <h3 className="font-sans font-bold text-[22px] sm:text-[24px] md:text-[25px] leading-[1.2] text-neutral-900 group-hover:underline">
              {story2.title}
            </h3>

            {story2.summary && (
              <p className="font-sans text-[15.5px] sm:text-[16.5px] text-neutral-600 leading-relaxed font-normal mt-3">
                {story2.summary}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 font-sans font-bold text-[13.5px] sm:text-[14px] text-neutral-600 uppercase tracking-wide mt-4">
            <span>{story2.time}</span>
            <span>|</span>
            <span className="hover:underline">{story2.category}</span>
          </div>
        </article>
      </div>
    </section>
  );
}
