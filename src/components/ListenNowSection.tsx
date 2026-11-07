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
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-3 pb-8">
      {/* 
        Header Row matching media_1794035802116_4ce202c6.jpg:
        "Listen Now" + subtitle on left, "Explore Audio →" on right
      */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-2">
        <div>
          <h2 className="font-sans font-bold text-[24px] sm:text-[28px] text-neutral-900 tracking-tight">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mt-4">
        {/* Left Column (col-span-7): Featured Podcast Card */}
        <div
          onClick={() => onPlayPodcast?.(listenNowFeaturedPodcast)}
          className="lg:col-span-7 bg-[#1c1a1a] text-white p-6 sm:p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-xs min-h-[250px]"
        >
          <div className="relative z-10 max-w-[65%]">
            <div className="font-sans font-bold text-[10.5px] text-neutral-400 uppercase tracking-widest mb-2">
              {listenNowFeaturedPodcast.category}
            </div>
            <h3 className="font-sans font-bold text-[26px] sm:text-[32px] leading-tight text-white group-hover:underline">
              {listenNowFeaturedPodcast.title}
            </h3>
            {listenNowFeaturedPodcast.summary && (
              <p className="font-sans text-[13px] sm:text-[13.5px] text-neutral-300 leading-relaxed mt-2.5">
                {listenNowFeaturedPodcast.summary}
              </p>
            )}
          </div>

          <div className="relative z-10 flex items-center space-x-3 mt-6 sm:mt-8">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
            </div>
            <span className="font-sans font-bold text-xs sm:text-[13px] text-white">
              Listen Now | {listenNowFeaturedPodcast.episodeDuration || '27 mins'}
            </span>
          </div>

          {/* Right side background microphone graphic */}
          <div className="absolute top-0 right-0 bottom-0 w-[45%] pointer-events-none">
            <Image
              src={listenNowFeaturedPodcast.imageUrl || '/listen-global-briefing.jpg'}
              alt={listenNowFeaturedPodcast.title}
              fill
              className="object-cover object-right opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Right Column (col-span-5): 3 Stacked Episodes */}
        <div className="lg:col-span-5 flex flex-col space-y-4 sm:space-y-5 justify-between">
          {listenNowEpisodes.map((ep) => (
            <article
              key={ep.id}
              onClick={() => onPlayPodcast?.(ep)}
              className="group cursor-pointer flex items-center space-x-4"
            >
              {ep.imageUrl && (
                <div className="w-[120px] h-[75px] sm:w-[130px] sm:h-[80px] relative overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={ep.imageUrl}
                    alt={ep.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-start">
                <div className="font-sans font-bold text-[10.5px] text-neutral-500 uppercase tracking-wider mb-1">
                  {ep.category}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center shrink-0">
                    <Play className="w-2.5 h-2.5 fill-neutral-800 text-neutral-800 ml-0.5" />
                  </div>
                  <h4 className="font-sans font-bold text-[13.5px] sm:text-[14px] leading-snug text-neutral-900 group-hover:underline">
                    {ep.title}
                  </h4>
                </div>
                <div className="font-sans text-[11px] text-neutral-400 mt-1 pl-7">
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
