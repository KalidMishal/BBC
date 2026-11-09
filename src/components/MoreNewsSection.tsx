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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 mb-8 sm:mb-9 gap-4">
        <h2 className="font-sans font-bold text-[34px] md:text-[38px] xl:text-[42px] 2xl:text-[46px] text-neutral-950 tracking-tight leading-none">
          More News
        </h2>

        <div className="flex items-center space-x-6 sm:space-x-8 xl:space-x-10 text-[15px] sm:text-[17px] xl:text-[19px] 2xl:text-[21px] font-sans">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition cursor-pointer relative pb-1 ${
                  isActive
                    ? 'font-bold text-neutral-950 after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[3px] after:bg-neutral-950'
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
        Two-Column Grid matching media_1794187641879_515e7985.jpg:
        Left Column (~61% on wide screens): Vanessa Trump White House card + Burnham Indepth card
        Right Column (~35% on wide screens): 4 stacked horizontal news items
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.58fr_1fr] 2xl:grid-cols-[958px_540px] justify-between gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 items-start">
        
        {/* Left Column */}
        <div className="flex flex-col space-y-6 sm:space-y-6 2xl:space-y-7">
          
          {/* Top Card: Vanessa Trump White House Side-by-Side */}
          <article
            onClick={() => onArticleClick?.(moreNewsVanessa)}
            className="group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 2xl:gap-7 items-start"
          >
            {moreNewsVanessa.imageUrl && (
              <div className="w-full sm:w-[320px] md:w-[350px] lg:w-[370px] xl:w-[400px] 2xl:w-[495px] aspect-[8/7] relative overflow-hidden bg-neutral-100 shrink-0">
                <Image
                  src={moreNewsVanessa.imageUrl}
                  alt={moreNewsVanessa.imageAlt || moreNewsVanessa.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col justify-start pt-0.5">
              <div className="font-sans font-bold text-[13px] sm:text-[14px] 2xl:text-[15px] text-neutral-600 uppercase tracking-wider mb-2.5">
                {moreNewsVanessa.category}
              </div>
              <h3 className="font-sans font-bold text-[26px] sm:text-[30px] lg:text-[32px] xl:text-[34px] 2xl:text-[41px] leading-[1.15] text-neutral-950 group-hover:underline max-w-[415px]">
                {moreNewsVanessa.title}
              </h3>
              {moreNewsVanessa.summary && (
                <p className="font-sans text-[15.5px] sm:text-[16.5px] xl:text-[17.5px] 2xl:text-[19px] text-neutral-600 leading-[1.55] font-normal mt-4 max-w-[365px] xl:max-w-[355px] 2xl:max-w-[375px]">
                  {moreNewsVanessa.summary}
                </p>
              )}
              <div className="flex items-center space-x-2.5 font-sans font-bold text-[12.5px] sm:text-[13.5px] 2xl:text-[14.5px] text-neutral-500 uppercase tracking-wide mt-5">
                <span>{moreNewsVanessa.time}</span>
                <span>|</span>
                <span className="hover:underline">{moreNewsVanessa.category}</span>
              </div>
            </div>
          </article>

          {/* Bottom Card: Andy Burnham InDepth Card in light grey container */}
          <article
            onClick={() => onArticleClick?.(moreNewsBurnham)}
            className="group cursor-pointer flex flex-col sm:flex-row gap-5 sm:gap-6 2xl:gap-7 items-stretch bg-[#f7f7f7] transition hover:bg-[#efefef]"
          >
            {moreNewsBurnham.imageUrl && (
              <div className="w-full sm:w-[320px] md:w-[350px] lg:w-[370px] xl:w-[400px] 2xl:w-[495px] aspect-[2/1] relative overflow-hidden bg-[#f7f7f7] shrink-0">
                <Image
                  src={moreNewsBurnham.imageUrl}
                  alt={moreNewsBurnham.imageAlt || moreNewsBurnham.title}
                  fill
                  className="object-cover object-bottom group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col justify-center w-full p-5 sm:p-0 sm:py-5 sm:pr-6">
              <div className="font-sans font-bold text-[13px] sm:text-[14px] 2xl:text-[15px] text-neutral-600 uppercase tracking-wider mb-2">
                {moreNewsBurnham.category}
              </div>
              <h3 className="font-sans font-bold text-[22px] sm:text-[24px] lg:text-[25px] xl:text-[27px] 2xl:text-[31px] leading-[1.2] text-neutral-950 group-hover:underline max-w-[345px] 2xl:max-w-[365px]">
                {moreNewsBurnham.title}
              </h3>
              <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] 2xl:text-[14.5px] text-neutral-500 uppercase tracking-wide mt-4">
                {moreNewsBurnham.time}
              </div>
            </div>
          </article>

        </div>

        {/* Right Column: 4 Stacked News Items */}
        <div className="flex flex-col space-y-7 xl:space-y-8 2xl:space-y-9">
          {moreNewsSideList.map((item) => (
            <article
              key={item.id}
              onClick={() => onArticleClick?.(item)}
              className="group cursor-pointer flex items-start gap-4 sm:gap-5 2xl:gap-7"
            >
              {item.imageUrl && (
                <div className="w-[140px] h-[96px] sm:w-[160px] sm:h-[110px] lg:w-[170px] lg:h-[118px] xl:w-[180px] xl:h-[124px] 2xl:w-[202px] 2xl:h-[140px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start">
                <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] 2xl:text-[14px] text-neutral-600 uppercase tracking-wider mb-1.5">
                  {item.category}
                </div>
                <h4 className="font-sans font-bold text-[18px] sm:text-[19px] lg:text-[20px] xl:text-[21px] 2xl:text-[22px] leading-[1.26] text-neutral-950 group-hover:underline">
                  {item.title}
                </h4>
                <div className="font-sans font-bold text-[12px] sm:text-[13px] 2xl:text-[13.5px] text-neutral-500 uppercase tracking-wide mt-2">
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
