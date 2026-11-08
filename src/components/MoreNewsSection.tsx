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
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-5 pb-8">
      {/* 
        Header Row matching media_1794016040137_b362a74d.jpg & media_1794154578521_d819fe36.jpg:
        "More News" on left, Category Tabs (All, World, Business, Technology, Health) on right
      */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-3 mb-6 sm:mb-7 gap-3">
        <h2 className="font-sans font-bold text-[34px] sm:text-[34px] md:text-[35px] text-neutral-900 tracking-tight leading-tight">
          More News
        </h2>

        <div className="flex items-center space-x-5 sm:space-x-7 text-[15px] sm:text-[15.5px] font-sans">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition cursor-pointer relative pb-1 ${
                  isActive
                    ? 'font-bold text-neutral-950 after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[3px] after:bg-neutral-950'
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
        Two-Column Grid matching media_1794154578521_d819fe36.jpg:
        Left Column (col-span-7): Vanessa Trump White House card + Burnham Indepth card
        Right Column (col-span-5): 4 stacked horizontal news items
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 xl:gap-12 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col space-y-7 sm:space-y-8">
          
          {/* Top Card: Vanessa Trump White House Side-by-Side */}
          <article
            onClick={() => onArticleClick?.(moreNewsVanessa)}
            className="group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
          >
            {moreNewsVanessa.imageUrl && (
              <div className="w-full sm:w-[320px] md:w-[350px] lg:w-[365px] xl:w-[380px] aspect-[4/3.5] relative overflow-hidden bg-neutral-100 shrink-0">
                <Image
                  src={moreNewsVanessa.imageUrl}
                  alt={moreNewsVanessa.imageAlt || moreNewsVanessa.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col justify-start">
              <div className="font-sans font-bold text-[13px] sm:text-[13.5px] text-neutral-600 uppercase tracking-wider mb-2">
                {moreNewsVanessa.category}
              </div>
              <h3 className="font-sans font-bold text-[27px] sm:text-[29px] md:text-[32px] leading-[1.12] text-neutral-900 group-hover:underline">
                {moreNewsVanessa.title}
              </h3>
              {moreNewsVanessa.summary && (
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-neutral-600 leading-relaxed font-normal mt-3 max-w-lg">
                  {moreNewsVanessa.summary}
                </p>
              )}
              <div className="flex items-center space-x-2 font-sans font-bold text-[12.5px] sm:text-[13px] text-neutral-500 uppercase tracking-wide mt-4">
                <span>{moreNewsVanessa.time}</span>
                <span>|</span>
                <span className="hover:underline">{moreNewsVanessa.category}</span>
              </div>
            </div>
          </article>

          {/* Bottom Card: Andy Burnham InDepth Card in light grey container */}
          <article
            onClick={() => onArticleClick?.(moreNewsBurnham)}
            className="group cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-6 items-center bg-[#f8f8f8] p-4 sm:p-5 transition hover:bg-[#f2f2f2]"
          >
            {moreNewsBurnham.imageUrl && (
              <div className="w-full sm:w-[210px] md:w-[230px] lg:w-[245px] aspect-[16/10] relative overflow-hidden bg-white shrink-0">
                <Image
                  src={moreNewsBurnham.imageUrl}
                  alt={moreNewsBurnham.imageAlt || moreNewsBurnham.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col justify-center w-full">
              <div className="font-sans font-bold text-[12.5px] sm:text-[13px] text-neutral-600 uppercase tracking-wider mb-1.5">
                {moreNewsBurnham.category}
              </div>
              <h3 className="font-sans font-bold text-[22px] sm:text-[24px] md:text-[25px] leading-snug text-neutral-900 group-hover:underline">
                {moreNewsBurnham.title}
              </h3>
              <div className="font-sans font-bold text-[12px] sm:text-[12.5px] text-neutral-500 uppercase tracking-wide mt-2.5">
                {moreNewsBurnham.time}
              </div>
            </div>
          </article>

        </div>

        {/* Right Column: 4 Stacked News Items */}
        <div className="lg:col-span-5 flex flex-col space-y-6 lg:space-y-7">
          {moreNewsSideList.map((item) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className="group cursor-pointer flex items-start space-x-4 sm:space-x-4.5"
            >
              {item.imageUrl && (
                <div className="w-[130px] h-[86px] sm:w-[145px] sm:h-[96px] lg:w-[155px] lg:h-[102px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start">
                <div className="font-sans font-bold text-[12.5px] sm:text-[13px] text-neutral-600 uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h4 className="font-sans font-bold text-[17.5px] sm:text-[18.5px] md:text-[19px] leading-snug text-neutral-900 group-hover:underline">
                  {item.title}
                </h4>
                <div className="font-sans font-bold text-[12px] sm:text-[12.5px] text-neutral-500 uppercase tracking-wide mt-1.5">
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
