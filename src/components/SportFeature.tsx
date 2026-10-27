'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { sportPremierLeague } from '../data/bbcData';
import { Article } from '../types';

interface SportFeatureProps {
  onArticleClick?: (article: Article) => void;
}

export default function SportFeature({ onArticleClick }: SportFeatureProps) {
  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-6 pb-8">
      {/* Section Header matching Image 2 */}
      <div className="border-t-2 border-neutral-900 pt-3 mb-5">
        <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight uppercase flex items-center space-x-1 cursor-pointer hover:text-red-600 transition">
          <span>PREMIER LEAGUE</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Large Left Image (~7 cols) */}
        <div className="lg:col-span-7">
          <div
            onClick={() => onArticleClick?.(sportPremierLeague)}
            className="group cursor-pointer relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs shadow-xs"
          >
            {sportPremierLeague.imageUrl && (
              <Image
                src={sportPremierLeague.imageUrl}
                alt={sportPremierLeague.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>
        </div>

        {/* Right Details & Live Updates (~5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3
              onClick={() => onArticleClick?.(sportPremierLeague)}
              className="font-serif font-bold text-xl sm:text-2xl lg:text-[26px] text-neutral-900 hover:underline cursor-pointer leading-[1.2]"
            >
              <span className="text-red-600 font-bold inline-flex items-center gap-1.5 mr-2 align-middle">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-red-600 bg-red-600 inline-block animate-pulse" />
                <span>LIVE</span>
              </span>
              {sportPremierLeague.title}
            </h3>

            <p className="font-serif text-[13px] sm:text-[14px] text-neutral-600 mt-2.5 leading-relaxed">
              {sportPremierLeague.summary}
            </p>

            {/* Bullet Points with exact bullet dots matching Image 2 */}
            {sportPremierLeague.bulletPoints && (
              <ul className="mt-4 space-y-2 font-serif text-[13px] text-neutral-800">
                {sportPremierLeague.bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-neutral-900 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
