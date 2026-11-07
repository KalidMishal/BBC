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
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-3 pb-12">
      {/* Grey divider line above section matching media_1794035851083_5bb58673.jpg */}
      <div className="border-t border-neutral-200 mb-6 sm:mb-8" />

      {/* 
        4-Column Digest:
        1. Education
        2. Travel & Lifestyle
        3. Energy & Infrastructure
        4. Opinions
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-start">
        {fourCategoriesDigestData.map((col) => (
          <div key={col.title} className="flex flex-col">
            {/* Column Header */}
            <h3 className="font-sans font-bold text-[18px] sm:text-[20px] text-neutral-900 mb-3 tracking-tight">
              {col.title}
            </h3>

            {/* Lead Article */}
            <article
              onClick={() => onArticleClick?.(col.leadArticle)}
              className="group cursor-pointer flex flex-col pb-3.5 border-b border-neutral-200 mb-3.5"
            >
              {col.leadArticle.imageUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2">
                  <Image
                    src={col.leadArticle.imageUrl}
                    alt={col.leadArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h4 className="font-sans font-bold text-[14px] sm:text-[14.5px] leading-snug text-neutral-900 group-hover:underline">
                {col.leadArticle.title}
              </h4>
            </article>

            {/* 3 Smaller Stacked Items */}
            <div className="flex flex-col space-y-3">
              {col.articles.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onArticleClick?.(item)}
                  className="group cursor-pointer flex items-start space-x-2.5"
                >
                  {item.imageUrl && (
                    <div className="w-[58px] h-[38px] relative overflow-hidden shrink-0 bg-neutral-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h5 className="font-sans font-bold text-[11.5px] sm:text-[12px] leading-snug text-neutral-900 group-hover:underline line-clamp-3">
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
