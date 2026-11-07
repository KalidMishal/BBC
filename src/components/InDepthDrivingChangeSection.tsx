'use client';

import React from 'react';
import Image from 'next/image';
import { inDepthChangeLead, inDepthChangeCards } from '../data/bbcData';
import { Article } from '../types';

interface InDepthDrivingChangeSectionProps {
  onArticleClick?: (article: Article) => void;
}

export default function InDepthDrivingChangeSection({
  onArticleClick
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
        onClick={() => onArticleClick?.(inDepthChangeLead)}
        className="group cursor-pointer border border-neutral-200/80 rounded-xs overflow-hidden bg-white shadow-xs grid grid-cols-1 md:grid-cols-12 items-stretch"
      >
        <div className="md:col-span-6 p-5 sm:p-7 md:p-8 flex flex-col justify-center">
          <div className="font-sans font-bold text-[10.5px] text-neutral-500 uppercase tracking-wider mb-2">
            {inDepthChangeLead.category}
          </div>
          <h2 className="font-sans font-bold text-[22px] sm:text-[26px] md:text-[28px] leading-[1.15] text-neutral-900 group-hover:underline">
            {inDepthChangeLead.title}
          </h2>
          {inDepthChangeLead.summary && (
            <p className="font-sans text-[12.5px] sm:text-[13px] text-neutral-600 leading-relaxed mt-2.5 max-w-lg">
              {inDepthChangeLead.summary}
            </p>
          )}
          <div className="font-sans font-semibold text-[10.5px] text-neutral-400 uppercase tracking-wide mt-3">
            {inDepthChangeLead.time}
          </div>
        </div>

        <div className="md:col-span-6 relative min-h-[200px] md:min-h-full overflow-hidden bg-neutral-100">
          {inDepthChangeLead.imageUrl && (
            <Image
              src={inDepthChangeLead.imageUrl}
              alt={inDepthChangeLead.imageAlt || inDepthChangeLead.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {/* Subtle blend gradient on the left edge of photo */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none hidden md:block" />
        </div>
      </article>

      {/* 
        Bottom 4-Card Grid matching media_1794047157609_ec90f6ac.jpg:
        World (conflict), Business (markets), Technology (AI robot), Travel & Lifestyle (mountain)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-7 sm:mt-8">
        {inDepthChangeCards.map((card) => (
          <article
            key={card.id}
            onClick={() => onArticleClick?.(card)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {card.imageUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2">
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt || card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="font-sans font-bold text-[10.5px] text-neutral-500 uppercase tracking-wider mb-1">
                {card.category}
              </div>
              <h3 className="font-sans font-bold text-[14px] sm:text-[14.5px] leading-snug text-neutral-900 group-hover:underline">
                {card.title}
              </h3>
            </div>
            <div className="font-sans font-semibold text-[10.5px] text-neutral-400 uppercase tracking-wide mt-2">
              {card.time}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
