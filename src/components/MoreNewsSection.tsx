'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  moreNewsVanessa,
  moreNewsBurnham,
  moreNewsSideList
} from '../data/bbcData';
import { Article } from '../types';

interface MoreNewsSectionProps {
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
}

const filterTabs = ['All', 'World', 'Business', 'Technology', 'Health'];

export default function MoreNewsSection({ onArticleClick }: MoreNewsSectionProps) {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-5 pb-8">
      {/* 
        Header Row matching media_1794016040137_b362a74d.jpg:
        "More News" on left, Category Tabs (All, World, Business, Technology, Health) on right
      */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-3 mb-6 gap-3">
        <h2 className="font-sans font-bold text-[24px] sm:text-[28px] text-neutral-900 tracking-tight">
          More News
        </h2>

        <div className="flex items-center space-x-4 sm:space-x-6 text-[13px] sm:text-[13.5px] font-sans">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition cursor-pointer relative pb-1 ${
                  isActive
                    ? 'font-bold text-neutral-950 after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2.5px] after:bg-neutral-950'
                    : 'font-normal text-neutral-600 hover:text-black hover:underline'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        Two-Column Grid matching media_1794016040137_b362a74d.jpg:
        Left Column (col-span-7): Vanessa Trump White House card + Burnham Indepth card
        Right Column (col-span-5): 4 stacked horizontal news items
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Top Card: Vanessa Trump White House Side-by-Side */}
          <article
            onClick={() => onArticleClick?.(moreNewsVanessa)}
            className="group cursor-pointer flex flex-col sm:flex-row gap-5 items-start"
          >
            {moreNewsVanessa.imageUrl && (
              <div className="w-full sm:w-[250px] md:w-[270px] aspect-[4/3] sm:aspect-square relative overflow-hidden bg-neutral-100 shrink-0">
                <Image
                  src={moreNewsVanessa.imageUrl}
                  alt={moreNewsVanessa.imageAlt || moreNewsVanessa.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col justify-start">
              <div className="font-sans font-bold text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">
                {moreNewsVanessa.category}
              </div>
              <h3 className="font-sans font-bold text-[21px] sm:text-[24px] leading-[1.18] text-neutral-900 group-hover:underline">
                {moreNewsVanessa.title}
              </h3>
              {moreNewsVanessa.summary && (
                <p className="font-sans text-[13px] sm:text-[13.5px] text-neutral-600 leading-relaxed font-normal mt-2.5">
                  {moreNewsVanessa.summary}
                </p>
              )}
              <div className="flex items-center space-x-2 font-sans font-semibold text-[11px] text-neutral-500 uppercase tracking-wide mt-3.5">
                <span>{moreNewsVanessa.time}</span>
                <span>|</span>
                <span className="hover:underline">{moreNewsVanessa.category}</span>
              </div>
            </div>
          </article>

          {/* Bottom Card: Andy Burnham InDepth Card in light grey container */}
          <article
            onClick={() => onArticleClick?.(moreNewsBurnham)}
            className="group cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-5 items-center bg-[#f8f8f8] p-3 sm:p-4 transition hover:bg-[#f2f2f2]"
          >
            {moreNewsBurnham.imageUrl && (
              <div className="w-full sm:w-[210px] md:w-[230px] aspect-[16/10] relative overflow-hidden bg-white shrink-0">
                <Image
                  src={moreNewsBurnham.imageUrl}
                  alt={moreNewsBurnham.imageAlt || moreNewsBurnham.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col justify-center w-full">
              <div className="font-sans font-bold text-[11px] text-neutral-500 uppercase tracking-wider mb-1">
                {moreNewsBurnham.category}
              </div>
              <h3 className="font-sans font-bold text-[17px] sm:text-[19px] leading-snug text-neutral-900 group-hover:underline">
                {moreNewsBurnham.title}
              </h3>
              <div className="font-sans font-semibold text-[11px] text-neutral-400 uppercase tracking-wide mt-2">
                {moreNewsBurnham.time}
              </div>
            </div>
          </article>

        </div>

        {/* Right Column: 4 Stacked News Items */}
        <div className="lg:col-span-5 flex flex-col space-y-4 sm:space-y-5">
          {moreNewsSideList.map((item) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className="group cursor-pointer flex items-start space-x-3.5 sm:space-x-4"
            >
              {item.imageUrl && (
                <div className="w-[108px] h-[72px] sm:w-[115px] sm:h-[76px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start">
                <div className="font-sans font-bold text-[10.5px] sm:text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">
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
