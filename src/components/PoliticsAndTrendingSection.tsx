'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  politicsGridArticles,
  euLeadersStory,
  trendingNowArticles,
  TrendingItem
} from '../data/bbcData';
import { Article } from '../types';

interface PoliticsAndTrendingSectionProps {
  onArticleClick?: (article: Article) => void;
  gridArticles?: Article[];
  euStory?: Article;
  trendingItems?: TrendingItem[];
}

export default function PoliticsAndTrendingSection({
  onArticleClick,
  gridArticles = politicsGridArticles,
  euStory = euLeadersStory,
  trendingItems = trendingNowArticles
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
      <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5">
        <h2 className="font-sans font-bold text-[27px] sm:text-[34px] md:text-[35px] text-neutral-900 tracking-tight leading-tight whitespace-nowrap sm:whitespace-normal">
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
        {gridArticles.map((article) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] xl:grid-cols-[2fr_1fr] gap-6 lg:gap-8 xl:gap-10 items-stretch">
        {/* Left Side: EU Leaders Horizontal Feature */}
        <article
          onClick={() => onArticleClick?.(euStory)}
          className="group cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-6 xl:gap-7 items-stretch lg:self-end w-full"
        >
          {euStory.imageUrl && (
            <div className="relative aspect-[16/10] sm:aspect-auto lg:aspect-[16/10] w-full sm:w-[300px] md:w-[330px] lg:w-[47%] xl:w-[49%] shrink-0 overflow-hidden bg-neutral-100 sm:min-h-[240px] lg:min-h-0">
              <Image
                src={euStory.imageUrl}
                alt={euStory.imageAlt || euStory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex flex-col justify-between py-0.5 sm:py-1 flex-1 min-w-0">
            <div>
              <div className="font-sans font-bold text-[13.5px] sm:text-[14px] text-neutral-600 uppercase tracking-wider mb-1.5">
                {euStory.category}
              </div>
              <h3 className="font-sans font-extrabold text-[27px] sm:text-[29px] md:text-[31px] lg:text-[29px] xl:text-[34px] 2xl:text-[36px] leading-[1.15] tracking-[-0.015em] text-neutral-950 group-hover:underline max-w-[405px]">
                {euStory.title}
              </h3>
              {euStory.summary && (
                <p className="font-sans font-semibold text-[16.5px] sm:text-[17px] lg:text-[16.5px] xl:text-[18px] 2xl:text-[18.5px] text-neutral-700 leading-[1.48] mt-3 max-w-[375px] 2xl:max-w-[395px]">
                  {euStory.summary}
                </p>
              )}
            </div>
            <div className="font-sans font-bold text-[13px] sm:text-[13.5px] text-neutral-500 uppercase tracking-wide mt-4">
              {euStory.time}
            </div>
          </div>
        </article>

        {/* Right Side: Trending Now with Vertical Divider and 01, 02, 03 numbers */}
        <div className="border-t border-neutral-200 pt-6 lg:border-t-0 lg:pt-0 lg:border-l lg:border-neutral-200 lg:pl-8 xl:pl-10 flex flex-col justify-between lg:h-full">
          <div>
            <h2 className="font-sans font-extrabold text-[29px] sm:text-[31px] xl:text-[33px] 2xl:text-[34px] text-neutral-950 mb-3.5 sm:mb-4 tracking-tight leading-tight">
              Trending Now
            </h2>

            <div className="flex flex-col space-y-4 sm:space-y-4 xl:space-y-[18px]">
              {trendingItems.map((item) => (
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
                  className="group cursor-pointer flex items-start space-x-3.5 sm:space-x-4 xl:space-x-5"
                >
                  <span className="font-sans font-bold text-[30px] sm:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[38px] text-neutral-400 leading-none shrink-0 min-w-[40px] sm:min-w-[44px] xl:min-w-[48px] pt-1">
                    {item.number}
                  </span>
                  <div className="flex flex-col">
                    <h4 className="font-sans font-bold text-[18.5px] sm:text-[19.5px] xl:text-[20.5px] leading-snug text-neutral-900 group-hover:underline">
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
      </div>
    </section>
  );
}
