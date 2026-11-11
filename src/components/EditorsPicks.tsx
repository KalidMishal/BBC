'use client';

import React from 'react';
import Image from 'next/image';
import { editorLeadStory, editorSideList } from '../data/bbcData';
import { Article } from '../types';

interface EditorsPicksProps {
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
  leadStory?: Article;
  sideList?: Article[];
}

export default function EditorsPicks({
  onArticleClick,
  leadStory = editorLeadStory,
  sideList = editorSideList
}: EditorsPicksProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-12">
      {/* Header matching media_1794203159869_dc83a53e.jpg */}
      <div className="border-b border-neutral-200 pb-4 sm:pb-5 mb-7 sm:mb-8">
        <h2 className="font-sans font-bold text-[34px] md:text-[38px] xl:text-[42px] 2xl:text-[46px] text-neutral-950 tracking-tight leading-none">
          Editor&apos;s Pick
        </h2>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] xl:grid-cols-[1.2fr_1fr] 2xl:grid-cols-[840px_1fr] gap-7 lg:gap-8 xl:gap-9 2xl:gap-10 items-start">
        
        {/* Left Column: US Capitol Dome Story */}
        <article
          onClick={() => onArticleClick?.(leadStory)}
          className="group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 2xl:gap-7 items-start"
        >
          {leadStory.imageUrl && (
            <div className="w-full sm:w-[280px] md:w-[320px] lg:w-[330px] xl:w-[355px] 2xl:w-[400px] aspect-[3/4] relative overflow-hidden bg-neutral-100 shrink-0">
              <Image
                src={leadStory.imageUrl}
                alt={leadStory.imageAlt || leadStory.title}
                fill
                className="object-cover origin-bottom-left scale-[1.12] group-hover:scale-[1.17] transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex flex-col justify-start pt-2 sm:pt-3 2xl:pt-4">
            <div className="font-sans font-bold text-[13px] sm:text-[14px] 2xl:text-[15px] text-neutral-600 uppercase tracking-wider mb-3">
              {leadStory.category}
            </div>
            <h3 className="font-sans font-bold text-[26px] sm:text-[29px] lg:text-[31px] xl:text-[34px] 2xl:text-[38px] leading-[1.16] text-neutral-950 group-hover:underline max-w-[355px]">
              {leadStory.title}
            </h3>
            {leadStory.summary && (
              <p className="font-sans text-[15px] sm:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[20px] text-neutral-600 leading-[1.55] font-normal mt-4 2xl:mt-5 max-w-[385px]">
                {leadStory.summary}
              </p>
            )}
            <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] 2xl:text-[14.5px] text-neutral-500 uppercase tracking-wide mt-5 2xl:mt-6">
              {leadStory.time}
            </div>
          </div>
        </article>

        {/* Right Column: 3 Stacked Items with Vertical Separator */}
        <div className="lg:border-l lg:border-neutral-200 lg:pl-7 xl:pl-8 2xl:pl-9 flex flex-col justify-start">
          {sideList.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className={`group cursor-pointer flex items-start gap-4 sm:gap-5 2xl:gap-6 ${
                idx < sideList.length - 1 ? 'border-b border-neutral-200 pb-4 mb-4' : ''
              }`}
            >
              {item.imageUrl && (
                <div className="w-[140px] h-[94px] sm:w-[170px] sm:h-[114px] lg:w-[190px] lg:h-[126px] xl:w-[210px] xl:h-[140px] 2xl:w-[240px] 2xl:h-[158px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start pt-0.5">
                <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] 2xl:text-[14.5px] text-neutral-600 uppercase tracking-wider mb-1.5">
                  {item.category}
                </div>
                <h4 className="font-sans font-bold text-[17px] sm:text-[19px] lg:text-[20px] xl:text-[21.5px] 2xl:text-[23.5px] leading-[1.26] text-neutral-950 group-hover:underline max-w-[385px]">
                  {item.title}
                </h4>
                <div className="font-sans font-bold text-[12px] sm:text-[13px] 2xl:text-[14px] text-neutral-500 uppercase tracking-wide mt-2.5">
                  {item.time}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
