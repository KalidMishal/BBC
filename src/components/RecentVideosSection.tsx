'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { recentVideosList, VideoCardItem } from '../data/bbcData';
import { Article } from '../types';

interface RecentVideosSectionProps {
  onVideoClick?: (video: Article) => void;
  onArticleClick?: (article: Article) => void;
  videos?: VideoCardItem[];
}

export default function RecentVideosSection({
  onVideoClick,
  onArticleClick,
  videos = recentVideosList
}: RecentVideosSectionProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-8">
      {/* 
        Header Row matching media_1794023283220_5d1dfc4e.jpg:
        "Recent Videos" title & subtitle on left, "All Videos →" on right
      */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-3">
        <div>
          <h2 className="font-sans font-bold text-[34px] sm:text-[36px] md:text-[38px] lg:text-[40px] xl:text-[42px] 2xl:text-[44px] text-neutral-950 tracking-tight leading-none">
            Recent Videos
          </h2>
          <p className="font-sans text-[15px] sm:text-[16px] lg:text-[17px] 2xl:text-[18px] text-neutral-700 mt-2">
            Watch the latest reports, analyses and exclusive coverage from our newsroom.
          </p>
        </div>

        <Link
          href="/news"
          className="font-sans font-bold text-[14.5px] sm:text-[15.5px] 2xl:text-[17px] text-neutral-900 hover:text-black hover:underline flex items-center gap-1.5 transition shrink-0 pb-0.5"
        >
          All Videos
          <span className="text-lg font-normal">→</span>
        </Link>
      </div>

      {/* 5 Video Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4">
        {videos.map((video) => (
          <article
            key={video.id}
            onClick={() => {
              if (onVideoClick) onVideoClick(video);
              else onArticleClick?.(video);
            }}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {video.imageUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mb-2">
                  <Image
                    src={video.imageUrl}
                    alt={video.imageAlt || video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play Button anchored at bottom-left */}
                  <div className="absolute bottom-1.5 left-1.5 w-6 h-6 bg-black/85 flex items-center justify-center text-white">
                    <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                  </div>
                  {/* Duration Badge anchored at bottom-right */}
                  {video.duration && (
                    <div className="absolute bottom-1.5 right-1.5 bg-black/85 text-white font-mono text-[10.5px] font-bold px-1.5 py-0.5 leading-none">
                      {video.duration}
                    </div>
                  )}
                </div>
              )}

              <h3 className="font-sans font-extrabold text-[19px] sm:text-[19.5px] lg:text-[17.5px] xl:text-[20.5px] 2xl:text-[22px] leading-[1.2] text-neutral-950 tracking-[-0.015em] group-hover:underline">
                {video.title}
              </h3>

              {video.summary && (
                <p className="font-sans font-medium text-[15px] sm:text-[15.5px] lg:text-[14px] xl:text-[15.5px] 2xl:text-[16.5px] text-neutral-700 leading-[1.38] mt-2.5">
                  {video.summary}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 font-sans text-[13px] sm:text-[13.5px] lg:text-[12px] xl:text-[13.5px] 2xl:text-[14.5px] tracking-wide mt-3.5">
              <span className="font-bold text-neutral-800">{video.category}</span>
              <span className="text-neutral-400">|</span>
              <span className="font-medium text-neutral-600">{video.time}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
