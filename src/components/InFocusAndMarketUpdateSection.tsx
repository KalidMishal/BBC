'use client';

import React from 'react';
import Image from 'next/image';
import {
  inFocusLeadStory,
  inFocusSideList,
  marketUpdateMetrics
} from '../data/bbcData';
import { Article } from '../types';

interface InFocusAndMarketUpdateSectionProps {
  onArticleClick?: (article: Article) => void;
}

export default function InFocusAndMarketUpdateSection({
  onArticleClick
}: InFocusAndMarketUpdateSectionProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-12">
      {/* 
        =======================================================
        IN FOCUS THIS WEEK (Matching media_1794217115363_4bce850f)
        =======================================================
      */}
      <div className="mb-8 sm:mb-9 xl:mb-10 2xl:mb-12">
        <h2 className="font-sans font-bold text-[34px] md:text-[38px] xl:text-[42px] 2xl:text-[46px] text-neutral-950 tracking-tight leading-none">
          In Focus This Week
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.52fr_1fr] xl:grid-cols-[840px_1fr] 2xl:grid-cols-[950px_1fr] gap-7 lg:gap-6 xl:gap-7 2xl:gap-7 items-start">
        {/* Left Column: Futuristic Skyline City Lead (~62% width) */}
        <article
          onClick={() => onArticleClick?.(inFocusLeadStory)}
          className="group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-7 xl:gap-8 2xl:gap-9 items-start"
        >
          {inFocusLeadStory.imageUrl && (
            <div className="w-full sm:w-[290px] md:w-[320px] lg:w-[310px] xl:w-[420px] 2xl:w-[490px] aspect-[490/473] relative overflow-hidden bg-neutral-100 shrink-0">
              <Image
                src={inFocusLeadStory.imageUrl}
                alt={inFocusLeadStory.imageAlt || inFocusLeadStory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex flex-col justify-start pt-2 sm:pt-4 xl:pt-6 2xl:pt-7">
            <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] 2xl:text-[15px] text-neutral-600 uppercase tracking-wider mb-3">
              {inFocusLeadStory.category}
            </div>
            <h3 className="font-sans font-bold text-[26px] sm:text-[28px] lg:text-[27px] xl:text-[32px] 2xl:text-[37px] leading-[1.18] text-neutral-950 group-hover:underline max-w-[426px]">
              {inFocusLeadStory.title}
            </h3>
            {inFocusLeadStory.summary && (
              <p className="font-sans text-[15px] sm:text-[16px] lg:text-[15.5px] xl:text-[18px] 2xl:text-[20.5px] text-neutral-600 leading-[1.52] font-normal mt-4 2xl:mt-5 max-w-[340px] xl:max-w-[305px] 2xl:max-w-[345px]">
                {inFocusLeadStory.summary}
              </p>
            )}
            <div className="font-sans font-bold text-[12px] sm:text-[13px] 2xl:text-[14.5px] text-neutral-500 uppercase tracking-wide mt-5 2xl:mt-6">
              {inFocusLeadStory.time}
            </div>
          </div>
        </article>

        {/* Right Column: 3 Stacked Items with Vertical Separator (~38% width) */}
        <div className="lg:border-l lg:border-neutral-200 lg:pl-6 xl:pl-7 2xl:pl-[30px] flex flex-col justify-between space-y-6 lg:space-y-[26px] xl:space-y-7 2xl:space-y-[34px]">
          {inFocusSideList.map((item) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className="group cursor-pointer flex items-start gap-4 sm:gap-5 xl:gap-6 2xl:gap-8"
            >
              {item.imageUrl && (
                <div className="w-[140px] h-[88px] sm:w-[165px] sm:h-[104px] lg:w-[150px] lg:h-[90px] xl:w-[186px] xl:h-[116px] 2xl:w-[216px] 2xl:h-[135px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start pt-0.5">
                <div className="font-sans font-bold text-[12px] sm:text-[13px] 2xl:text-[14.5px] text-neutral-600 uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h4 className="font-sans font-bold text-[16.5px] sm:text-[18px] lg:text-[17px] xl:text-[20px] 2xl:text-[23.5px] leading-[1.24] text-neutral-950 group-hover:underline max-w-[325px]">
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
                <div className="font-sans font-bold text-[11.5px] sm:text-[12.5px] 2xl:text-[14px] text-neutral-500 uppercase tracking-wide mt-2 2xl:mt-2.5">
                  {item.time}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 
        =======================================================
        MARKET UPDATE (Matching media_1794217115363_4bce850f)
        =======================================================
      */}
      <div className="bg-[#f7f7f7] px-6 sm:px-8 lg:px-9 xl:px-10 2xl:px-11 py-8 sm:py-9 lg:py-10 2xl:py-12 mt-10 sm:mt-12 xl:mt-14 2xl:mt-16 flex flex-col lg:flex-row lg:items-center justify-between gap-7 lg:gap-12 xl:gap-16 2xl:gap-[124px]">
        <div className="shrink-0">
          <h3 className="font-sans font-bold text-[28px] sm:text-[32px] xl:text-[35px] 2xl:text-[38px] text-neutral-950 leading-tight tracking-tight">
            Market Update
          </h3>
          <p className="font-sans text-[14.5px] sm:text-[16px] xl:text-[17px] 2xl:text-[19px] text-neutral-500 mt-1.5 whitespace-nowrap">
            A quick look at today&apos;s global markets.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-5 lg:flex lg:items-stretch lg:justify-between lg:gap-4">
          {marketUpdateMetrics.map((m, idx) => (
            <React.Fragment key={m.name}>
              {idx > 0 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block w-px bg-neutral-200 my-1 shrink-0"
                />
              )}
              <div className="flex flex-col shrink-0">
                <span className="font-sans text-[14px] xl:text-[15.5px] 2xl:text-[17px] font-bold text-neutral-900">
                  {m.name}
                </span>
                <span className="font-sans text-[20px] sm:text-[22px] xl:text-[24px] 2xl:text-[26px] font-bold text-neutral-950 tabular-nums leading-tight mt-1.5">
                  {m.value}
                </span>
                <span
                  className={`font-sans text-[15px] xl:text-[17.5px] 2xl:text-[20px] font-medium mt-1 ${
                    m.isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'
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
