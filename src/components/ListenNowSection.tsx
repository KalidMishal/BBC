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
}

export default function ListenNowSection({ onPlayPodcast }: ListenNowSectionProps) {
  return (
    <section className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-12 sm:pb-14 2xl:pb-16">
      {/* 
        Header Row matching media_1794217280194_8479f715.jpg:
        "Listen Now" on left, "Explore Audio →" on right, subtitle cleanly underneath
      */}
      <div className="mb-7 sm:mb-9 2xl:mb-11">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-sans font-bold text-[34px] md:text-[38px] xl:text-[42px] 2xl:text-[46px] text-neutral-950 tracking-tight leading-none">
            Listen Now
          </h2>

          <Link
            href="/news"
            className="font-sans font-bold text-[15px] sm:text-[17px] xl:text-[19px] 2xl:text-[21px] text-neutral-950 hover:text-black hover:underline flex items-center gap-2 transition shrink-0"
          >
            <span>Explore Audio</span>
            <span className="text-[19px] xl:text-[22px] 2xl:text-[25px] font-normal leading-none">→</span>
          </Link>
        </div>

        <p className="font-sans text-[15px] sm:text-[17px] xl:text-[20px] 2xl:text-[22.5px] text-neutral-600 mt-3 2xl:mt-4 leading-snug">
          Top audio stories, interviews and podcasts from our editorial team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_1fr] xl:grid-cols-[690px_1fr] 2xl:grid-cols-[792px_1fr] gap-7 lg:gap-8 xl:gap-9 2xl:gap-11 items-stretch">
        {/* Left Column: Featured Podcast Card matching media_1794217280194_8479f715.jpg */}
        <div
          onClick={() => onPlayPodcast?.(listenNowFeaturedPodcast)}
          className="bg-gradient-to-br from-[#1f2023] via-[#1b1b1e] to-[#161618] text-white p-7 sm:p-10 xl:p-12 2xl:p-14 flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[340px] sm:min-h-[400px] lg:min-h-[390px] xl:min-h-[450px] 2xl:min-h-[518px]"
        >
          <div className="relative z-10 max-w-[270px] sm:max-w-[320px] xl:max-w-[340px] 2xl:max-w-[365px]">
            <div className="font-sans font-bold text-[12px] sm:text-[13px] xl:text-[14px] 2xl:text-[15.5px] text-neutral-300 uppercase tracking-[0.14em] mb-3.5 sm:mb-4 2xl:mb-5">
              {listenNowFeaturedPodcast.category}
            </div>
            <h3 className="font-sans font-bold text-[36px] sm:text-[42px] lg:text-[40px] xl:text-[48px] 2xl:text-[56px] leading-[1.08] tracking-tight text-white group-hover:underline">
              {listenNowFeaturedPodcast.title}
            </h3>
            {listenNowFeaturedPodcast.summary && (
              <p className="font-sans text-[15px] sm:text-[17px] xl:text-[19px] 2xl:text-[21px] text-neutral-300 leading-[1.45] mt-4 sm:mt-5 2xl:mt-6 max-w-[280px] sm:max-w-[310px] xl:max-w-[320px] 2xl:max-w-[350px]">
                {listenNowFeaturedPodcast.summary}
              </p>
            )}
          </div>

          <div className="relative z-10 flex items-center gap-4 2xl:gap-5 mt-8">
            <div className="w-11 h-11 xl:w-12 xl:h-12 2xl:w-[52px] 2xl:h-[52px] rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4 2xl:w-5 2xl:h-5 fill-black text-black ml-0.5" />
            </div>
            <div className="font-sans text-[15px] sm:text-[16.5px] xl:text-[18px] 2xl:text-[20px] text-white flex items-center gap-3">
              <span className="font-bold">Listen Now</span>
              <span className="text-neutral-400 font-light">|</span>
              <span className="font-normal text-neutral-200">{listenNowFeaturedPodcast.episodeDuration || '27 mins'}</span>
            </div>
          </div>

          {/* Right side background microphone graphic smoothly blended */}
          <div
            className="absolute top-0 right-0 bottom-0 w-[52%] pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 18%, black 38%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 18%, black 38%)',
            }}
          >
            <Image
              src="/listen-mic-only.jpg"
              alt={listenNowFeaturedPodcast.title}
              fill
              className="object-cover object-right opacity-95 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Right Column: 3 Stacked Episodes aligned top-to-bottom with Featured Card */}
        <div className="flex flex-col justify-between gap-6 lg:gap-4">
          {listenNowEpisodes.map((ep) => (
            <article
              key={ep.id}
              onClick={() => onPlayPodcast?.(ep)}
              className="group cursor-pointer flex items-center gap-4 sm:gap-5 2xl:gap-6"
            >
              {ep.imageUrl && (
                <div className="w-[130px] h-[84px] sm:w-[155px] sm:h-[98px] lg:w-[160px] lg:h-[102px] xl:w-[196px] xl:h-[124px] 2xl:w-[228px] 2xl:h-[144px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={ep.imageUrl}
                    alt={ep.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="w-9 h-9 xl:w-10 xl:h-10 2xl:w-[44px] 2xl:h-[44px] rounded-full border border-neutral-800 flex items-center justify-center shrink-0 group-hover:bg-neutral-100 transition-colors">
                <Play className="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-neutral-900 text-neutral-900 ml-0.5" />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <div className="font-sans font-bold text-[11.5px] sm:text-[12.5px] 2xl:text-[14px] text-neutral-500 uppercase tracking-wider mb-1 2xl:mb-1.5">
                  {ep.category}
                </div>
                <h4 className="font-sans font-bold text-[16px] sm:text-[18px] lg:text-[17px] xl:text-[20px] 2xl:text-[23px] leading-snug text-neutral-950 group-hover:underline">
                  {ep.title}
                </h4>
                <div className="font-sans text-[13px] sm:text-[14.5px] xl:text-[15.5px] 2xl:text-[17px] text-neutral-500 mt-1 2xl:mt-1.5">
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
