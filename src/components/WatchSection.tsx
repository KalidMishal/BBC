'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { watchVideosDark } from '../data/bbcData';
import { Article } from '../types';

interface WatchSectionProps {
  onVideoClick?: (video: Article) => void;
}

export default function WatchSection({ onVideoClick }: WatchSectionProps) {
  return (
    <section className="w-full bg-[#121212] text-white py-10 my-8">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Watch
            </h2>
          </div>
          <button className="text-xs font-bold text-neutral-400 hover:text-white transition flex items-center space-x-1 cursor-pointer">
            <span>View all videos</span>
            <span>→</span>
          </button>
        </div>

        {/* 4 Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {watchVideosDark.map((video) => (
            <article
              key={video.id}
              onClick={() => onVideoClick?.(video)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail with duration badge and play hover */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-800 rounded-sm mb-3">
                {video.imageUrl && (
                  <Image
                    src={video.imageUrl}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-transform">
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  </div>
                </div>
                {/* Duration pill */}
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                  {video.videoDuration}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {video.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:underline decoration-white decoration-1 leading-snug mt-1">
                  {video.title}
                </h3>
                {video.summary && (
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {video.summary}
                  </p>
                )}
                <div className="flex items-center space-x-2 text-[11px] text-neutral-500 font-medium mt-2">
                  <span>{video.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
