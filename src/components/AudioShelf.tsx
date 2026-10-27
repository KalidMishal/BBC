'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Headphones, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { podcastsWeek } from '../data/bbcData';
import { PodcastItem } from '../types';

interface AudioShelfProps {
  onPlayPodcast?: (podcast: PodcastItem) => void;
}

export default function AudioShelf({ onPlayPodcast }: AudioShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-6 pb-8 border-b border-neutral-200">
      {/* Section Header matching Image 3 */}
      <div className="border-t-2 border-neutral-900 pt-3 mb-5 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight uppercase flex items-center space-x-1 cursor-pointer hover:text-red-600 transition">
          <span>BEST AUDIO OF THE WEEK</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </h2>

        {/* Navigation Arrows matching Image 3 */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 hover:bg-neutral-100 rounded-sm text-neutral-800 transition cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 hover:bg-neutral-100 rounded-sm text-neutral-800 transition cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Cards matching Image 3 */}
      <div
        ref={scrollRef}
        className="flex space-x-5 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
      >
        {podcastsWeek.map((pod) => (
          <div
            key={pod.id}
            onClick={() => onPlayPodcast?.(pod)}
            className="group flex-shrink-0 w-36 sm:w-44 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Square Album Cover */}
              <div className="relative aspect-square w-full rounded-xs overflow-hidden bg-neutral-900 mb-2 shadow-xs">
                <Image
                  src={pod.imageUrl}
                  alt={pod.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white p-1 rounded-xs backdrop-blur-xs">
                  <Headphones className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Show Title */}
              <h4 className="font-sans text-[11px] font-bold text-neutral-600 tracking-wide uppercase line-clamp-1">
                {pod.title}
              </h4>

              {/* Episode Title in Serif with line-clamp-3 */}
              <h3 className="font-serif text-[13px] font-bold text-neutral-900 group-hover:underline line-clamp-3 leading-snug mt-0.5">
                {pod.subtitle}
              </h3>
            </div>

            {/* Footer Row matching Image 3: Save button + duration */}
            <div className="flex items-center space-x-3 text-[11px] text-neutral-500 font-sans mt-3 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Saved "${pod.title}" to your BBC Sounds library.`);
                }}
                className="flex items-center space-x-1 hover:text-black transition cursor-pointer"
                title="Save episode"
              >
                <Bookmark className="w-3 h-3 stroke-[2.2]" />
                <span className="font-medium">Save</span>
              </button>
              <span>{pod.episodeDuration || '25 mins'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
