'use client';

import React from 'react';
import Image from 'next/image';
import { sportsSectionArticles } from '../data/bbcData';
import { Article } from '../types';

interface SportsCardsSectionProps {
  onArticleClick?: (article: Article) => void;
  articles?: Article[];
}

export default function SportsCardsSection({
  onArticleClick,
  articles = sportsSectionArticles
}: SportsCardsSectionProps) {
  return (
    <section className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-8">
      {/* Header matching media_1794330932958_066b33ac.jpg */}
      <div className="mb-7 sm:mb-8 xl:mb-9 2xl:mb-10">
        <h2 className="font-sans font-extrabold text-[32px] sm:text-[36px] lg:text-[clamp(36px,2.85vw,46px)] text-neutral-950 tracking-[-0.02em] leading-none">
          Sports
        </h2>
      </div>

      {/* 4 Cards Grid matching media_1794330932958_066b33ac.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 xl:gap-6 2xl:gap-7 pb-10 sm:pb-12 2xl:pb-14 border-b border-neutral-200">
        {articles.map((card) => (
          <article
            key={card.id}
            onClick={() => onArticleClick?.(card)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {card.imageUrl && (
                <div className="relative aspect-[375/250] w-full overflow-hidden bg-neutral-100 mb-3.5 xl:mb-4">
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt || card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] lg:text-[clamp(12.5px,0.95vw,15px)] text-[#666666] uppercase tracking-wider mb-1.5 xl:mb-2">
                {card.category}
              </div>
              <h3 className="font-sans font-extrabold text-[21px] sm:text-[22px] lg:text-[clamp(19px,1.56vw,25.5px)] leading-[1.16] tracking-[-0.02em] text-neutral-950 group-hover:underline max-w-[330px] lg:max-w-[clamp(242px,19vw,305px)]">
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
                <p className="font-sans font-medium text-[14.5px] sm:text-[15.5px] lg:text-[clamp(13.5px,1.06vw,17px)] text-[#686868] leading-[1.42] mt-2.5 2xl:mt-3">
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
