'use client';

import React from 'react';
import Image from 'next/image';
import { sportsSectionArticles } from '../data/bbcData';
import { Article } from '../types';

interface SportsCardsSectionProps {
  onArticleClick?: (article: Article) => void;
}

export default function SportsCardsSection({ onArticleClick }: SportsCardsSectionProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-8">
      {/* Header matching media_1794035724019_9e85fb91.jpg */}
      <div className="mb-4 sm:mb-5">
        <h2 className="font-sans font-bold text-[30px] text-neutral-900 tracking-tight leading-tight">
          Sports
        </h2>
      </div>

      {/* 4 Cards Grid matching media_1794047236112_f256d59b.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {sportsSectionArticles.map((card) => (
          <article
            key={card.id}
            onClick={() => onArticleClick?.(card)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {card.imageUrl && (
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-100 mb-2">
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt || card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="font-sans font-bold text-[12.5px] sm:text-[13px] text-neutral-600 uppercase tracking-wider mb-1.5">
                {card.category}
              </div>
              <h3 className="font-sans font-bold text-[17.5px] sm:text-[18.5px] leading-snug text-neutral-900 group-hover:underline">
                {card.title}
              </h3>
              {card.summary && (
                <p className="font-sans text-[13.5px] sm:text-[14.5px] text-neutral-600 leading-relaxed font-normal mt-2">
                  {card.summary}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
