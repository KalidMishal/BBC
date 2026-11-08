'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  politicsGridArticles,
  euLeadersStory,
  trendingNowArticles
} from '../data/bbcData';
import { Article } from '../types';

interface PoliticsAndTrendingSectionProps {
  onArticleClick?: (article: Article) => void;
}

export default function PoliticsAndTrendingSection({
  onArticleClick
}: PoliticsAndTrendingSectionProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-8">
      {/* Grey color line directly above Politics & Government */}
      <div className="border-t border-neutral-200 w-full mb-6 sm:mb-7" />

      {/* 
        =======================================================
        SECTION 1: Politics & Government (4-Card Grid)
        Matching media_1793990467065_bdb49109.jpg (top part)
        =======================================================
      */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="font-sans font-bold text-[34px] sm:text-[34px] md:text-[35px] text-neutral-900 tracking-tight leading-tight">
          Politics &amp; Government
        </h2>
        <Link
          href="/Politics & Government"
          className="font-sans font-bold text-[14px] sm:text-[14.5px] text-neutral-900 hover:text-black hover:underline flex items-center gap-1 transition"
        >
          More Global News
          <span className="text-base font-normal">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 lg:gap-9 xl:gap-10">
        {politicsGridArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => onArticleClick?.(article)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {article.imageUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mb-2.5">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="font-sans font-bold text-[13.5px] sm:text-[14px] text-neutral-600 uppercase tracking-wider mb-1.5">
                {article.category}
              </div>
              <h3 className="font-sans font-bold text-[19px] sm:text-[20px] md:text-[20.5px] leading-[1.25] text-neutral-900 group-hover:underline">
                {article.title}
              </h3>
            </div>
            <div className="font-sans font-bold text-[13px] sm:text-[13.5px] text-neutral-500 uppercase tracking-wide mt-2.5">
              {article.time}
            </div>
          </article>
        ))}
      </div>

      {/* Thin horizontal divider separating Section 1 and Section 2 */}
      <div className="border-b border-neutral-200 my-8 sm:my-10" />

      {/* 
        =======================================================
        SECTION 2: EU Leaders Feature + Trending Now (01, 02, 03)
        Matching media_1793990467065_bdb49109.jpg (bottom part)
        =======================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-10 items-start">
        {/* Left Side: EU Leaders Horizontal Feature */}
        <article
          onClick={() => onArticleClick?.(euLeadersStory)}
          className="group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
        >
          {euLeadersStory.imageUrl && (
            <div className="relative aspect-[16/10] w-full sm:w-[280px] md:w-[320px] lg:w-[350px] shrink-0 overflow-hidden bg-neutral-100">
              <Image
                src={euLeadersStory.imageUrl}
                alt={euLeadersStory.imageAlt || euLeadersStory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex flex-col justify-start">
            <div className="font-sans font-bold text-[13.5px] sm:text-[14px] text-neutral-600 uppercase tracking-wider mb-1.5">
              {euLeadersStory.category}
            </div>
            <h3 className="font-sans font-bold text-[25px] sm:text-[27px] md:text-[29px] leading-[1.18] text-neutral-900 group-hover:underline">
              {euLeadersStory.title}
            </h3>
            {euLeadersStory.summary && (
              <p className="font-sans text-[15.5px] sm:text-[16.5px] text-neutral-600 leading-relaxed mt-3">
                {euLeadersStory.summary}
              </p>
            )}
            <div className="font-sans font-bold text-[13px] sm:text-[13.5px] text-neutral-500 uppercase tracking-wide mt-3">
              {euLeadersStory.time}
            </div>
          </div>
        </article>

        {/* Right Side: Trending Now with Vertical Divider and 01, 02, 03 numbers */}
        <div className="lg:border-l lg:border-neutral-200 lg:pl-8 flex flex-col justify-start">
          <h2 className="font-sans font-bold text-[30px] text-neutral-900 mb-4 sm:mb-5 tracking-tight leading-tight">
            Trending Now
          </h2>

          <div className="flex flex-col space-y-4 sm:space-y-5">
            {trendingNowArticles.map((item) => (
              <div
                key={item.number}
                onClick={() =>
                  onArticleClick?.({
                    id: `trend-${item.number}`,
                    title: item.title,
                    time: item.time,
                    category: 'Trending',
                    link: '#'
                  })
                }
                className="group cursor-pointer flex items-start space-x-3.5"
              >
                <span className="font-sans font-bold text-[24px] sm:text-[26px] text-neutral-400 leading-none shrink-0 min-w-[34px]">
                  {item.number}
                </span>
                <div className="flex flex-col">
                  <h4 className="font-sans font-bold text-[18.5px] sm:text-[19.5px] leading-snug text-neutral-900 group-hover:underline">
                    {item.title}
                  </h4>
                  <span className="font-sans font-bold text-[13px] sm:text-[13.5px] text-neutral-500 uppercase tracking-wide mt-1.5">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
