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
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-8">
      {/* 
        Header Row matching media_1794035802116_4ce202c6.jpg:
        "Listen Now" + subtitle on left, "Explore Audio →" on right
      */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-2">
        <div>
          <h2 className="font-sans font-bold text-[30px] text-neutral-900 tracking-tight leading-tight">
            Listen Now
          </h2>
          <p className="font-sans text-[13px] sm:text-[14px] text-neutral-600 mt-0.5">
            Top audio stories, interviews and podcasts from our editorial team.
          </p>
        </div>

        <Link
          href="/news"
          className="font-sans font-bold text-[13px] text-neutral-900 hover:text-black hover:underline flex items-center gap-1 transition shrink-0"
        >
          Explore Audio
          <span className="text-sm font-normal">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch mt-4">
        {/* Left Column (col-span-7): Featured Podcast Card matching media_1794047249424_5dc9ace4.jpg */}
        <div
          onClick={() => onPlayPodcast?.(listenNowFeaturedPodcast)}
          className="lg:col-span-7 bg-[#141416] text-white p-5 sm:p-7 md:p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-xs min-h-[260px]"
        >
          <div className="relative z-10 max-w-[65%]">
            <div className="font-sans font-bold text-[10px] text-neutral-400 uppercase tracking-widest mb-2">
              {listenNowFeaturedPodcast.category}
            </div>
            <h3 className="font-sans font-bold text-[24px] sm:text-[28px] leading-tight text-white group-hover:underline">
              {listenNowFeaturedPodcast.title}
            </h3>
            {listenNowFeaturedPodcast.summary && (
              <p className="font-sans text-[12px] sm:text-[12.5px] text-neutral-300 leading-relaxed mt-2.5 max-w-[250px]">
                {listenNowFeaturedPodcast.summary}
              </p>
            )}
          </div>

          <div className="relative z-10 flex items-center space-x-2.5 mt-6 sm:mt-8">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-3 h-3 fill-black text-black ml-0.5" />
            </div>
            <span className="font-sans font-bold text-xs sm:text-[12.5px] text-white">
              Listen Now | {listenNowFeaturedPodcast.episodeDuration || '27 mins'}
            </span>
          </div>

          {/* Right side background microphone graphic */}
          <div className="absolute top-0 right-0 bottom-0 w-[45%] pointer-events-none">
            <Image
              src="/listen-mic-only.jpg"
              alt={listenNowFeaturedPodcast.title}
              fill
              className="object-cover object-right opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Right Column (col-span-5): 3 Stacked Episodes */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 sm:space-y-4">
          {listenNowEpisodes.map((ep) => (
            <article
              key={ep.id}
              onClick={() => onPlayPodcast?.(ep)}
              className="group cursor-pointer flex items-center space-x-3.5"
            >
              {ep.imageUrl && (
                <div className="w-[115px] h-[72px] sm:w-[122px] sm:h-[76px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={ep.imageUrl}
                    alt={ep.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start">
                <div className="font-sans font-bold text-[10px] sm:text-[10.5px] text-neutral-500 uppercase tracking-wider mb-0.5">
                  {ep.category}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center shrink-0">
                    <Play className="w-2.5 h-2.5 fill-neutral-800 text-neutral-800 ml-0.5" />
                  </div>
                  <h4 className="font-sans font-bold text-[13px] sm:text-[13.5px] leading-snug text-neutral-900 group-hover:underline">
                    {ep.title}
                  </h4>
                </div>
                <div className="font-sans text-[11px] text-neutral-400 mt-0.5 pl-7">
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
