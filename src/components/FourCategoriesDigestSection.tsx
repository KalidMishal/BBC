'use client';

import React from 'react';
import Image from 'next/image';
import { fourCategoriesDigestData } from '../data/bbcData';
import { Article } from '../types';

interface FourCategoriesDigestSectionProps {
  onArticleClick?: (article: Article) => void;
}

export default function FourCategoriesDigestSection({
  onArticleClick
}: FourCategoriesDigestSectionProps) {
  return (
    <section className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-16">
      {/* Grey divider line above section */}
      <div className="border-t border-neutral-200 mb-7 sm:mb-9 2xl:mb-10" />

      {/* 
        4-Column Digest matching media_1794229831734_bddd70d6.jpg:
        1. Education
        2. Travel & Lifestyle
        3. Energy & Infrastructure
        4. Opinions
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-x-6 lg:gap-7 xl:gap-8 2xl:gap-9 items-start">
        {fourCategoriesDigestData.map((col, colIdx) => (
          <div
            key={col.title}
            className="relative flex flex-col"
          >
            {/* Vertical hairline divider starting cleanly at photo row on desktop */}
            {colIdx > 0 && (
              <div
                aria-hidden="true"
                className="hidden lg:block absolute -left-3.5 xl:-left-4 2xl:-left-[18px] top-[34px] xl:top-[45px] 2xl:top-[54px] bottom-0 w-px bg-neutral-200/80"
              />
            )}

            {/* Column Header */}
            <h3 className="font-sans font-bold text-[24px] sm:text-[26px] lg:text-[18.5px] xl:text-[25.5px] 2xl:text-[30px] text-neutral-950 mb-4 xl:mb-5 2xl:mb-6 tracking-tight leading-none whitespace-nowrap">
              {col.title}
            </h3>

            {/* Lead Article */}
            <article
              onClick={() => onArticleClick?.(col.leadArticle)}
              className="group cursor-pointer flex flex-col mb-5 xl:mb-6 2xl:mb-7"
            >
              {col.leadArticle.imageUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 2xl:mb-4">
                  <Image
                    src={col.leadArticle.imageUrl}
                    alt={col.leadArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h4 className="font-sans font-bold text-[19px] sm:text-[20px] lg:text-[16px] xl:text-[19.5px] 2xl:text-[22.5px] leading-[1.22] text-neutral-950 group-hover:underline lg:min-h-[60px] xl:min-h-[72px] 2xl:min-h-[84px]">
                {col.leadArticle.title}
              </h4>
            </article>

            {/* 3 Smaller Stacked Items */}
            <div className="flex flex-col space-y-4 sm:space-y-5 2xl:space-y-6">
              {col.articles.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onArticleClick?.(item)}
                  className="group cursor-pointer flex items-start gap-3 xl:gap-3.5 2xl:gap-4"
                >
                  {item.imageUrl && (
                    <div className="w-[100px] h-[64px] sm:w-[106px] sm:h-[68px] lg:w-[82px] lg:h-[52px] xl:w-[100px] xl:h-[64px] 2xl:w-[116px] 2xl:h-[74px] relative overflow-hidden shrink-0 bg-neutral-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h5 className="font-sans font-semibold text-[14.5px] lg:text-[12.5px] xl:text-[14px] 2xl:text-[15.5px] leading-[1.32] text-neutral-950 group-hover:underline">
                    {item.title}
                  </h5>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
