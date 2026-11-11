'use client';

import React from 'react';
import Image from 'next/image';
import { inDepthChangeLead, inDepthChangeCards } from '../data/bbcData';
import { Article } from '../types';

interface InDepthDrivingChangeSectionProps {
  onArticleClick?: (article: Article) => void;
  leadStory?: Article;
  cards?: Article[];
}

export default function InDepthDrivingChangeSection({
  onArticleClick,
  leadStory = inDepthChangeLead,
  cards = inDepthChangeCards
}: InDepthDrivingChangeSectionProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-12">
      {/* Grey divider line above section matching media_1794023369503_59369454.jpg */}
      <div className="border-t border-neutral-200 mb-6 sm:mb-8" />

      {/* 
        Top Hero In-Depth Banner:
        Left: IN-DEPTH, The People Driving Change in 2026, description, time (50% split)
        Right: NYC Skyline Panorama (50% split)
      */}
      <article
        onClick={() => onArticleClick?.(leadStory)}
        className="group cursor-pointer overflow-hidden bg-[#f1f1f1] grid grid-cols-1 md:grid-cols-[42%_58%] items-stretch min-h-[280px] md:min-h-[clamp(290px,25.5vw,420px)]"
      >
        <div className="px-6 pt-7 pb-6 sm:px-9 sm:py-8 lg:px-10 lg:py-9 xl:pl-12 xl:pr-4 2xl:pl-14 2xl:pr-4 flex flex-col justify-center">
          <div className="font-sans font-extrabold text-[13.5px] sm:text-[14.5px] xl:text-[15.5px] 2xl:text-[16.5px] text-[#595959] uppercase tracking-wider mb-2.5 xl:mb-3">
            {leadStory.category}
          </div>
          <h2 className="font-sans font-extrabold text-[28px] sm:text-[34px] md:text-[32px] lg:text-[clamp(33px,2.95vw,46px)] leading-[1.1] tracking-[-0.025em] text-neutral-950 group-hover:underline max-w-[465px]">
            {leadStory.title}
          </h2>
          {leadStory.summary && (
            <p className="font-sans font-medium text-[16px] sm:text-[17px] md:text-[16px] lg:text-[17.5px] xl:text-[18.5px] 2xl:text-[20.5px] text-[#595959] leading-[1.36] mt-3.5 xl:mt-4 max-w-[435px] md:max-w-[355px] lg:max-w-[385px] xl:max-w-[405px] 2xl:max-w-[445px]">
              {leadStory.summary}
            </p>
          )}
          <div className="font-sans font-bold text-[13px] sm:text-[14px] xl:text-[14.5px] 2xl:text-[15.5px] text-[#737373] uppercase tracking-wide mt-4 xl:mt-5">
            {leadStory.time}
          </div>
        </div>

        <div className="relative min-h-[220px] md:min-h-full overflow-hidden bg-[#f1f1f1]">
          {leadStory.imageUrl && (
            <Image
              src={leadStory.imageUrl}
              alt={leadStory.imageAlt || leadStory.title}
              fill
              className="object-cover object-right group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {/* Subtle blend gradient on the left edge of photo */}
          <div className="absolute inset-y-0 left-0 w-24 lg:w-36 xl:w-44 bg-gradient-to-r from-[#f1f1f1] via-[#f1f1f1]/75 to-transparent pointer-events-none hidden md:block" />
        </div>
      </article>

      {/* 
        Bottom 4-Card Grid matching media_1794047157609_ec90f6ac.jpg:
        World (conflict), Business (markets), Technology (AI robot), Travel & Lifestyle (mountain)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 xl:gap-7 2xl:gap-9 mt-8 sm:mt-10">
        {cards.map((card) => (
          <article
            key={card.id}
            onClick={() => onArticleClick?.(card)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {card.imageUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3">
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt || card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="font-sans font-bold text-[13px] sm:text-[13.5px] xl:text-[14px] 2xl:text-[14.5px] text-[#737373] uppercase tracking-wider mb-1.5">
                {card.category}
              </div>
              <h3 className="font-sans font-extrabold text-[18.5px] sm:text-[19px] lg:text-[clamp(16px,1.34vw,21.5px)] leading-[1.2] tracking-[-0.015em] text-neutral-950 group-hover:underline">
                {card.title}
              </h3>
            </div>
            <div className="font-sans font-bold text-[12px] sm:text-[12.5px] xl:text-[13px] text-[#787878] uppercase tracking-wide mt-2.5 xl:mt-3">
              {card.time}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
