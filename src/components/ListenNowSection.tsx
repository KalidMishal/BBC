'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import {
  listenNowFeaturedPodcast,
  listenNowEpisodes
} from '../data/bbcData';
import { PodcastItem } from '../types';

interface ListenNowSectionProps {
  onPlayPodcast?: (podcast: PodcastItem) => void;
  featuredPodcast?: PodcastItem;
  episodes?: PodcastItem[];
}

export default function ListenNowSection({
  onPlayPodcast,
  featuredPodcast = listenNowFeaturedPodcast,
  episodes = listenNowEpisodes
}: ListenNowSectionProps) {
  return (
    <section className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-12 sm:pb-14 2xl:pb-16">
      {/* 
        Header Row matching media_1794331118729_0d3af247.jpg:
        "Listen Now" (+3 sizes & extra-bold) on left, "Explore Audio →" (+1 size) on right
      */}
      <div className="mb-7 sm:mb-9 2xl:mb-11">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-sans font-extrabold text-[40px] sm:text-[44px] lg:text-[46px] xl:text-[48px] 2xl:text-[53px] text-neutral-950 tracking-[-0.02em] leading-none">
            Listen Now
          </h2>

          <Link
            href="/news"
            className="font-sans font-bold text-[17px] sm:text-[18.5px] xl:text-[20.5px] 2xl:text-[22.5px] text-neutral-950 hover:text-black hover:underline flex items-center gap-2 transition shrink-0"
          >
            <span>Explore Audio</span>
            <span className="text-[21px] sm:text-[23px] xl:text-[24px] 2xl:text-[27px] font-normal leading-none">→</span>
          </Link>
        </div>

        <p className="font-sans font-medium text-[16.5px] sm:text-[18.5px] xl:text-[21.5px] 2xl:text-[24px] text-[#525252] mt-3 2xl:mt-4 leading-snug">
          Top audio stories, interviews and podcasts from our editorial team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[49.5%_1fr] gap-7 lg:gap-7 xl:gap-8 items-stretch">
        {/* Left Column: Featured Podcast Card matching media_1794331118729_0d3af247.jpg */}
        <div
          onClick={() => onPlayPodcast?.(featuredPodcast)}
          className="bg-gradient-to-br from-[#1f2023] via-[#1b1b1e] to-[#161618] text-white p-7 sm:p-10 xl:p-11 2xl:p-13 flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[360px] sm:min-h-[410px] lg:min-h-[395px] xl:min-h-[455px] 2xl:min-h-[510px]"
        >
          <div className="relative z-10 max-w-[295px] sm:max-w-[355px] xl:max-w-[375px] 2xl:max-w-[405px]">
            <div className="font-sans font-bold text-[13px] sm:text-[14px] xl:text-[15.5px] 2xl:text-[17px] text-[#d4d4d4] uppercase tracking-[0.14em] mb-3.5 sm:mb-4 2xl:mb-5">
              {featuredPodcast.category}
            </div>
            <h3 className="font-sans font-extrabold text-[38px] sm:text-[44px] lg:text-[42px] xl:text-[51px] 2xl:text-[59px] leading-[1.08] tracking-[-0.02em] text-white group-hover:underline">
              {featuredPodcast.title}
            </h3>
            {featuredPodcast.summary && (
              <p className="font-sans font-normal text-[16.5px] sm:text-[18.5px] xl:text-[20.5px] 2xl:text-[22.5px] text-[#e2e2e2] leading-[1.42] mt-4 sm:mt-5 2xl:mt-6 max-w-[285px] sm:max-w-[345px] xl:max-w-[360px] 2xl:max-w-[395px]">
                {featuredPodcast.summary}
              </p>
            )}
          </div>

          <div className="relative z-10 flex items-center gap-4 2xl:gap-5 mt-8">
            <div className="w-11 h-11 xl:w-12 xl:h-12 2xl:w-[54px] 2xl:h-[54px] rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4 2xl:w-5 2xl:h-5 fill-black text-black ml-0.5" />
            </div>
            <div className="font-sans text-[16.5px] sm:text-[18px] xl:text-[19.5px] 2xl:text-[21.5px] text-white flex items-center gap-3">
              <span className="font-extrabold">Listen Now</span>
              <span className="text-neutral-400 font-light">|</span>
              <span className="font-normal text-neutral-200">{featuredPodcast.episodeDuration || '27 mins'}</span>
            </div>
          </div>

          {/* Right side background microphone graphic smoothly blended */}
          <div
            className="absolute top-0 right-[-24px] sm:right-0 bottom-0 w-[52%] pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 18%, black 38%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 18%, black 38%)',
            }}
          >
            <Image
              src="/listen-mic-only.jpg"
              alt={featuredPodcast.title}
              fill
              className="object-cover object-right opacity-95 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Right Column: 3 Stacked Episodes aligned top-to-bottom with Featured Card */}
        <div className="flex flex-col justify-between gap-6 lg:gap-4">
          {episodes.map((ep) => (
            <article
              key={ep.id}
              onClick={() => onPlayPodcast?.(ep)}
              className="group cursor-pointer flex items-center gap-3.5 sm:gap-4"
            >
              {ep.imageUrl && (
                <div className="w-[130px] h-[84px] sm:w-[155px] sm:h-[98px] lg:w-[150px] lg:h-[96px] xl:w-[176px] xl:h-[112px] 2xl:w-[186px] 2xl:h-[118px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={ep.imageUrl}
                    alt={ep.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="w-9 h-9 xl:w-10 xl:h-10 2xl:w-[40px] 2xl:h-[40px] rounded-full border border-neutral-800 flex items-center justify-center shrink-0 group-hover:bg-neutral-100 transition-colors">
                <Play className="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-neutral-900 text-neutral-900 ml-0.5" />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <div className="font-sans font-bold text-[12.5px] sm:text-[13.5px] xl:text-[14px] 2xl:text-[15.5px] text-[#666666] uppercase tracking-wider mb-1 2xl:mb-1.5">
                  {ep.category}
                </div>
                <h4 className="font-sans font-extrabold text-[17.5px] sm:text-[19.5px] lg:text-[18.5px] xl:text-[21.5px] 2xl:text-[24.5px] leading-[1.24] tracking-[-0.015em] text-neutral-950 group-hover:underline">
                  {ep.title}
                </h4>
                <div className="font-sans font-medium text-[14.5px] sm:text-[16px] xl:text-[17px] 2xl:text-[18.5px] text-[#666666] mt-1 2xl:mt-1.5">
                  {ep.episodeDuration}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
