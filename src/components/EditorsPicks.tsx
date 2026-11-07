'use client';

import React from 'react';
import Image from 'next/image';
import { editorLeadStory, editorSideList } from '../data/bbcData';
import { Article } from '../types';

interface EditorsPicksProps {
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
}

export default function EditorsPicks({ onArticleClick }: EditorsPicksProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-5 pb-10">
      {/* Header matching media_1794022061668_43bfc243.jpg */}
      <div className="border-b border-neutral-200 pb-3 mb-6">
        <h2 className="font-sans font-bold text-[28px] text-neutral-900 tracking-tight leading-tight">
          Editor&apos;s Pick
        </h2>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (col-span-7): US Capitol Dome Story */}
        <article
          onClick={() => onArticleClick?.(editorLeadStory)}
          className="lg:col-span-7 group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
        >
          {editorLeadStory.imageUrl && (
            <div className="w-full sm:w-[220px] md:w-[240px] aspect-[4/5] relative overflow-hidden bg-neutral-100 shrink-0">
              <Image
                src={editorLeadStory.imageUrl}
                alt={editorLeadStory.imageAlt || editorLeadStory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex flex-col justify-start">
            <div className="font-sans font-bold text-[10.5px] text-neutral-500 uppercase tracking-wider mb-2">
              {editorLeadStory.category}
            </div>
            <h3 className="font-sans font-bold text-[21px] sm:text-[23px] leading-[1.2] text-neutral-900 group-hover:underline">
              {editorLeadStory.title}
            </h3>
            {editorLeadStory.summary && (
              <p className="font-sans text-[12.5px] sm:text-[13px] text-neutral-600 leading-relaxed font-normal mt-2.5">
                {editorLeadStory.summary}
              </p>
            )}
            <div className="font-sans font-semibold text-[10.5px] text-neutral-400 uppercase tracking-wide mt-3">
              {editorLeadStory.time}
            </div>
          </div>
        </article>

        {/* Right Column (col-span-5): 3 Stacked Items with Vertical Separator */}
        <div className="lg:col-span-5 lg:border-l lg:border-neutral-200 lg:pl-7 flex flex-col justify-start">
          {editorSideList.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className={`group cursor-pointer flex items-start space-x-3.5 sm:space-x-4 ${
                idx < editorSideList.length - 1 ? 'border-b border-neutral-200 pb-3.5 mb-3.5' : ''
              }`}
            >
              {item.imageUrl && (
                <div className="w-[120px] h-[78px] sm:w-[130px] sm:h-[84px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start">
                <div className="font-sans font-bold text-[10.5px] text-neutral-500 uppercase tracking-wider mb-0.5">
                  {item.category}
                </div>
                <h4 className="font-sans font-bold text-[13.5px] sm:text-[14px] leading-snug text-neutral-900 group-hover:underline">
                  {item.title}
                </h4>
                <div className="font-sans font-semibold text-[10.5px] text-neutral-400 uppercase tracking-wide mt-1.5">
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
