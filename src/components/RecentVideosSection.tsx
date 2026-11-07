'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { recentVideosList } from '../data/bbcData';
import { Article } from '../types';

interface RecentVideosSectionProps {
  onVideoClick?: (video: Article) => void;
  onArticleClick?: (article: Article) => void;
}

export default function RecentVideosSection({
  onVideoClick,
  onArticleClick
}: RecentVideosSectionProps) {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-3 pb-8">
      {/* 
        Header Row matching media_1794023283220_5d1dfc4e.jpg:
        "Recent Videos" title & subtitle on left, "All Videos →" on right
      */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-2">
        <div>
          <h2 className="font-sans font-bold text-[28px] text-neutral-900 tracking-tight leading-tight">
            Recent Videos
          </h2>
          <p className="font-sans text-[13px] sm:text-[14px] text-neutral-600 mt-0.5">
            Watch the latest reports, analyses and exclusive coverage from our newsroom.
          </p>
        </div>

        <Link
          href="/news"
          className="font-sans font-bold text-[13px] text-neutral-900 hover:text-black hover:underline flex items-center gap-1 transition shrink-0"
        >
          All Videos
          <span className="text-sm font-normal">→</span>
        </Link>
      </div>

      {/* 5 Video Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {recentVideosList.map((video) => (
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
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-2">
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
                    <div className="absolute bottom-1.5 right-1.5 bg-black/85 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 leading-none">
                      {video.duration}
                    </div>
                  )}
                </div>
              )}

              <h3 className="font-sans font-bold text-[13.5px] sm:text-[14px] leading-snug text-neutral-900 group-hover:underline">
                {video.title}
              </h3>

              {video.summary && (
                <p className="font-sans text-[12px] sm:text-[12.5px] text-neutral-600 leading-relaxed font-normal mt-1.5 line-clamp-3">
                  {video.summary}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-1.5 font-sans font-semibold text-[11px] text-neutral-400 tracking-wide mt-2.5">
              <span>{video.category}</span>
              <span>|</span>
              <span>{video.time}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
