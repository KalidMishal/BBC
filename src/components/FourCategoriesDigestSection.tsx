'use client';

import React from 'react';
import Image from 'next/image';
import { fourCategoriesDigestData, DigestColumnData } from '../data/bbcData';
import { Article } from '../types';

interface FourCategoriesDigestSectionProps {
  onArticleClick?: (article: Article) => void;
  columns?: DigestColumnData[];
}

export default function FourCategoriesDigestSection({
  onArticleClick,
  columns = fourCategoriesDigestData
}: FourCategoriesDigestSectionProps) {
  return (
    <section className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-16">
      {/* Grey divider line above section */}
      <div className="border-t border-neutral-200 mb-7 sm:mb-9 2xl:mb-10" />

      {/* 
        4-Column Digest matching media_1794331269883_82032902.jpg:
        1. Education
        2. Travel & Lifestyle
        3. Energy & Infrastructure
        4. Opinions
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-x-6 lg:gap-7 xl:gap-8 2xl:gap-9 items-stretch">
        {columns.map((col, colIdx) => (
          <div
            key={col.title}
            className="relative flex flex-col"
          >
            {/* Vertical hairline divider starting cleanly at photo row on desktop */}
            {colIdx > 0 && (
              <div
                aria-hidden="true"
                className="hidden lg:block absolute -left-3.5 xl:-left-4 2xl:-left-[18px] top-[34px] xl:top-[42px] 2xl:top-[48px] bottom-0 w-px bg-neutral-200/80"
              />
            )}

            {/* Column Header */}
            <h3 className="font-sans font-extrabold text-[24px] sm:text-[26px] lg:text-[clamp(22px,1.72vw,28.5px)] text-neutral-950 mb-4 xl:mb-5 2xl:mb-6 tracking-[-0.02em] leading-none whitespace-nowrap">
              {col.title}
            </h3>

            {/* Lead Article (no ash line below heading, matching reference) */}
            <article
              onClick={() => onArticleClick?.(col.leadArticle)}
              className="group cursor-pointer flex flex-col mb-5 xl:mb-6"
            >
              {col.leadArticle.imageUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 2xl:mb-3.5">
                  <Image
                    src={col.leadArticle.imageUrl}
                    alt={col.leadArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h4 className="font-sans font-extrabold text-[19px] sm:text-[20px] lg:text-[clamp(17.5px,1.38vw,22px)] leading-[1.22] tracking-[-0.02em] text-neutral-950 group-hover:underline lg:min-h-[clamp(66px,5.2vw,84px)]">
                {col.leadArticle.title}
              </h4>
            </article>

            {/* 3 Smaller Stacked Items: ash divider under heading column only (not under thumbnail) */}
            <div className="flex flex-col flex-1 gap-3 sm:gap-3.5 xl:gap-4">
              {col.articles.map((item, idx) => {
                const hasBottomLine = idx < col.articles.length - 1;
                return (
                  <article
                    key={item.id}
                    onClick={() => onArticleClick?.(item)}
                    className={`group cursor-pointer flex items-stretch gap-3 lg:gap-2.5 xl:gap-3.5 ${
                      hasBottomLine ? 'min-h-[76px] lg:min-h-[clamp(62px,4.8vw,78px)]' : ''
                    }`}
                  >
                    {item.imageUrl && (
                      <div className="w-[100px] h-[64px] sm:w-[106px] sm:h-[68px] lg:w-[clamp(80px,6.3vw,108px)] lg:h-auto lg:aspect-[100/64] relative overflow-hidden shrink-0 self-start bg-neutral-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div
                      className={`flex-1 min-w-0 ${
                        hasBottomLine ? 'border-b border-neutral-200 pb-3 sm:pb-3.5' : ''
                      }`}
                    >
                      <h5 className="font-sans font-bold text-[15px] lg:text-[clamp(12px,0.92vw,14.8px)] leading-[1.3] tracking-[-0.01em] text-neutral-950 group-hover:underline">
                        {item.title}
                      </h5>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
