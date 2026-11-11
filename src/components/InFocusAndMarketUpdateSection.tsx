'use client';

import React from 'react';
import Image from 'next/image';
import {
  inFocusLeadStory,
  inFocusSideList,
  marketUpdateMetrics,
  MarketMetric
} from '../data/bbcData';
import { Article } from '../types';

interface InFocusAndMarketUpdateSectionProps {
  onArticleClick?: (article: Article) => void;
  leadStory?: Article;
  sideList?: Article[];
  metrics?: MarketMetric[];
}

export default function InFocusAndMarketUpdateSection({
  onArticleClick,
  leadStory = inFocusLeadStory,
  sideList = inFocusSideList,
  metrics = marketUpdateMetrics
}: InFocusAndMarketUpdateSectionProps) {
  return (
    <section className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-12">
      {/* Ash divider line above In Focus This Week */}
      <div className="border-t border-neutral-200 mb-7 sm:mb-8 xl:mb-10" />

      {/* 
        =======================================================
        IN FOCUS THIS WEEK (Matching media_1794330840195_be5af48c)
        =======================================================
      */}
      <div className="mb-7 sm:mb-8 xl:mb-10 2xl:mb-11">
        <h2 className="font-sans font-extrabold text-[32px] sm:text-[36px] lg:text-[clamp(36px,2.85vw,46px)] text-neutral-950 tracking-[-0.02em] leading-none">
          In Focus This Week
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[61%_1fr] gap-7 lg:gap-6 xl:gap-7 2xl:gap-8 items-start lg:items-stretch">
        {/* Left Column: Futuristic Skyline City Lead (~61% width) */}
        <article
          onClick={() => onArticleClick?.(leadStory)}
          className="group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 xl:gap-7 2xl:gap-8 items-start"
        >
          {leadStory.imageUrl && (
            <div className="w-full sm:w-[270px] md:w-[300px] lg:w-[49%] aspect-[490/473] relative overflow-hidden bg-neutral-100 shrink-0">
              <Image
                src={leadStory.imageUrl}
                alt={leadStory.imageAlt || leadStory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col justify-start pt-1 sm:pt-3 lg:pt-4 xl:pt-5 2xl:pt-6">
            <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] lg:text-[clamp(12.5px,0.98vw,15.5px)] text-[#595959] uppercase tracking-wider mb-2.5 xl:mb-3">
              {leadStory.category}
            </div>
            <h3 className="font-sans font-extrabold text-[25px] sm:text-[28px] lg:text-[clamp(26px,2.2vw,36px)] leading-[1.15] tracking-[-0.02em] text-neutral-950 group-hover:underline max-w-[430px]">
              {leadStory.title}
            </h3>
            {leadStory.summary && (
              <p className="font-sans font-medium text-[15.5px] sm:text-[16.5px] lg:text-[clamp(15.5px,1.25vw,19.5px)] text-[#5c5c5c] leading-[1.45] mt-3.5 xl:mt-4 max-w-[340px] lg:max-w-[clamp(285px,22vw,345px)]">
                {leadStory.summary}
              </p>
            )}
            <div className="font-sans font-bold text-[12px] sm:text-[13px] lg:text-[clamp(12px,0.92vw,14.5px)] text-[#737373] uppercase tracking-wide mt-4 xl:mt-5">
              {leadStory.time}
            </div>
          </div>
        </article>

        {/* Right Column: 3 Stacked Items with Vertical Separator */}
        <div className="lg:border-l lg:border-neutral-200 lg:pl-5 xl:pl-6 2xl:pl-7 flex flex-col justify-between space-y-6 lg:space-y-0 lg:gap-5 xl:gap-6">
          {sideList.map((item) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className="group cursor-pointer flex items-start gap-4 xl:gap-5 2xl:gap-6"
            >
              {item.imageUrl && (
                <div className="w-[140px] sm:w-[165px] lg:w-[35%] max-w-[214px] aspect-[16/10] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-start pt-0.5">
                <div className="font-sans font-bold text-[12px] sm:text-[13px] lg:text-[clamp(12px,0.92vw,14.5px)] text-[#595959] uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h4 className="font-sans font-extrabold text-[16.5px] sm:text-[18px] lg:text-[clamp(16px,1.25vw,21.5px)] leading-[1.22] tracking-[-0.015em] text-neutral-950 group-hover:underline">
                  {item.title.split(' ').map((word, wIdx, arr) => (
                    <React.Fragment key={wIdx}>
                      {word.includes('-') ? (
                        <span className="whitespace-nowrap">{word}</span>
                      ) : (
                        word
                      )}
                      {wIdx < arr.length - 1 ? ' ' : ''}
                    </React.Fragment>
                  ))}
                </h4>
                <div className="font-sans font-bold text-[11.5px] sm:text-[12.5px] lg:text-[clamp(11.5px,0.88vw,14px)] text-[#737373] uppercase tracking-wide mt-2">
                  {item.time}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 
        =======================================================
        MARKET UPDATE (Matching media_1794330840195_be5af48c)
        =======================================================
      */}
      <div className="bg-[#f7f7f7] px-6 sm:px-8 lg:px-9 xl:px-10 2xl:px-11 py-8 sm:py-9 lg:py-10 2xl:py-11 mt-10 sm:mt-12 xl:mt-14 flex flex-col lg:flex-row lg:items-center justify-between gap-7 lg:gap-10 xl:gap-14 2xl:gap-24">
        <div className="shrink-0">
          <h3 className="font-sans font-extrabold text-[28px] sm:text-[32px] lg:text-[clamp(30px,2.4vw,38px)] text-neutral-950 leading-tight tracking-[-0.02em]">
            Market Update
          </h3>
          <p className="font-sans font-medium text-[14.5px] sm:text-[16px] lg:text-[clamp(15px,1.18vw,18.5px)] text-[#737373] mt-1.5 whitespace-nowrap">
            A quick look at today&apos;s global markets.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-5 lg:flex lg:items-stretch lg:justify-between lg:gap-4">
          {metrics.map((m, idx) => (
            <React.Fragment key={m.name}>
              {idx > 0 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block w-px bg-neutral-200 my-1 shrink-0"
                />
              )}
              <div className="flex flex-col shrink-0">
                <span className="font-sans text-[14px] lg:text-[clamp(14px,1.08vw,17px)] font-semibold text-neutral-900">
                  {m.name}
                </span>
                <span className="font-sans text-[20px] sm:text-[22px] lg:text-[clamp(20px,1.65vw,26px)] font-extrabold text-neutral-950 tabular-nums leading-tight mt-1">
                  {m.value}
                </span>
                <span
                  className={`font-sans text-[15px] lg:text-[clamp(15px,1.25vw,19.5px)] font-semibold mt-1 ${
                    m.isPositive ? 'text-[#2e7d32]' : 'text-[#c93b3b]'
                  }`}
                >
                  {m.change}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
