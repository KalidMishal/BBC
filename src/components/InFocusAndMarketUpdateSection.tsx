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
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-8">
      {/* 
        =======================================================
        IN FOCUS THIS WEEK (Matching media_1794035586863_48a12b3e)
        =======================================================
      */}
      <div className="mb-4 sm:mb-5">
        <h2 className="font-sans font-bold text-[30px] text-neutral-900 tracking-tight leading-tight">
          In Focus This Week
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (col-span-8): Futuristic Skyline City Lead (~65% width) */}
        <article
          onClick={() => onArticleClick?.(inFocusLeadStory)}
          className="lg:col-span-8 group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
        >
          {inFocusLeadStory.imageUrl && (
            <div className="w-full sm:w-[250px] md:w-[265px] aspect-square relative overflow-hidden bg-neutral-100 shrink-0">
              <Image
                src={inFocusLeadStory.imageUrl}
                alt={inFocusLeadStory.imageAlt || inFocusLeadStory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex flex-col justify-start">
            <div className="font-sans font-bold text-[10.5px] text-neutral-500 uppercase tracking-wider mb-2">
              {inFocusLeadStory.category}
            </div>
            <h3 className="font-sans font-bold text-[21px] sm:text-[23px] leading-[1.2] text-neutral-900 group-hover:underline">
              {inFocusLeadStory.title}
            </h3>
            {inFocusLeadStory.summary && (
              <p className="font-sans text-[12.5px] sm:text-[13px] text-neutral-600 leading-relaxed font-normal mt-2.5">
                {inFocusLeadStory.summary}
              </p>
            )}
            <div className="font-sans font-semibold text-[10.5px] text-neutral-400 uppercase tracking-wide mt-3">
              {inFocusLeadStory.time}
            </div>
          </div>
        </article>

        {/* Right Column (col-span-4): 3 Stacked Items with Vertical Separator (~35% width) */}
        <div className="lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-7 flex flex-col justify-between space-y-3.5">
          {inFocusSideList.map((item) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className="group cursor-pointer flex items-start space-x-3.5 sm:space-x-4"
            >
              {item.imageUrl && (
                <div className="w-[110px] h-[72px] sm:w-[120px] sm:h-[78px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start">
                <div className="font-sans font-bold text-[10.5px] text-neutral-500 uppercase tracking-wider mb-0.5">
                  {item.category}
                </div>
                <h4 className="font-sans font-bold text-[13.5px] sm:text-[14px] leading-snug text-neutral-900 group-hover:underline">
                  {item.title}
                </h4>
                <div className="font-sans font-semibold text-[10.5px] text-neutral-400 uppercase tracking-wide mt-1">
                  {item.time}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 
        =======================================================
        MARKET UPDATE (Matching media_1794035586863_48a12b3e)
        =======================================================
      */}
      <div className="bg-[#f9f9f9] border border-neutral-100 p-4 sm:p-5 mt-8 sm:mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="shrink-0">
          <h3 className="font-sans font-bold text-[30px] text-neutral-900 leading-tight tracking-tight">
            Market Update
          </h3>
          <p className="font-sans text-[12px] sm:text-[12.5px] text-neutral-500 mt-0.5">
            A quick look at today&apos;s global markets.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 w-full lg:w-auto">
          {marketUpdateMetrics.map((m, idx) => (
            <div
              key={m.name}
              className={`flex flex-col ${
                idx > 0 ? 'sm:border-l sm:border-neutral-200 sm:pl-5' : ''
              }`}
            >
              <span className="text-[12px] font-semibold text-neutral-600">
                {m.name}
              </span>
              <span className="text-[15px] sm:text-[16px] font-bold text-neutral-900 font-mono mt-0.5">
                {m.value}
              </span>
              <span
                className={`text-[12px] font-bold mt-0.5 ${
                  m.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {m.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
