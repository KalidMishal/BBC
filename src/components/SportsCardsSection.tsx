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
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-8">
      {/* Header matching media_1794217196154_22da8df7.jpg */}
      <div className="mb-7 sm:mb-8 xl:mb-9 2xl:mb-10">
        <h2 className="font-sans font-bold text-[34px] md:text-[38px] xl:text-[42px] 2xl:text-[46px] text-neutral-950 tracking-tight leading-none">
          Sports
        </h2>
      </div>

      {/* 4 Cards Grid matching media_1794217196154_22da8df7.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 xl:gap-6 2xl:gap-7 pb-10 sm:pb-12 2xl:pb-14 border-b border-neutral-200">
        {sportsSectionArticles.map((card) => (
          <article
            key={card.id}
            onClick={() => onArticleClick?.(card)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {card.imageUrl && (
                <div className="relative aspect-[375/260] w-full overflow-hidden bg-neutral-100 mb-4 2xl:mb-5">
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt || card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] 2xl:text-[14.5px] text-neutral-600 uppercase tracking-wider mb-2">
                {card.category}
              </div>
              <h3 className="font-sans font-bold text-[21px] sm:text-[22px] lg:text-[21px] xl:text-[24px] 2xl:text-[27.5px] leading-[1.18] text-neutral-950 group-hover:underline max-w-[330px] lg:max-w-[260px] xl:max-w-[290px] 2xl:max-w-[330px]">
                {card.title.split(' ').map((word, wIdx, arr) => (
                  <React.Fragment key={wIdx}>
                    {word.includes('-') ? (
                      <span className="whitespace-nowrap">{word}</span>
                    ) : (
                      word
                    )}
                    {wIdx < arr.length - 1 ? ' ' : ''}
                  </React.Fragment>
                ))}
              </h3>
              {card.summary && (
                <p className="font-sans text-[14.5px] sm:text-[15.5px] lg:text-[14.5px] xl:text-[16px] 2xl:text-[18.5px] text-neutral-600 leading-[1.46] font-normal mt-2.5 2xl:mt-3">
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
