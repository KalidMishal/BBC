'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Play } from 'lucide-react';
import { editorsPicks } from '../data/bbcData';
import { Article } from '../types';

interface EditorsPicksProps {
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
}

export default function EditorsPicks({ onArticleClick, onVideoClick }: EditorsPicksProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#181818] text-white py-8">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Header matching Image 1: White border line + EDITOR'S PICKS > on left, arrows on right */}
        <div className="border-t-2 border-white pt-3 mb-6 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase flex items-center space-x-1 cursor-pointer hover:text-red-500 transition">
            <span>EDITOR&apos;S PICKS</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </h2>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 hover:bg-neutral-800 rounded-sm text-neutral-300 hover:text-white transition cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 hover:bg-neutral-800 rounded-sm text-neutral-300 hover:text-white transition cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* 5 Video Cards Row */}
        <div
          ref={scrollRef}
          className="grid grid-flow-col auto-cols-[82%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:grid-cols-5 gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {editorsPicks.map((story) => (
            <article
              key={story.id}
              onClick={() => onVideoClick ? onVideoClick(story) : onArticleClick?.(story)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail with Play Icon overlay */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 rounded-xs mb-3 shadow-xs">
                  <Image
                    src={story.imageUrl || '/editor-starlink.jpg'}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-black/85 text-white p-1 rounded-xs flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-[14.5px] sm:text-[15px] text-white group-hover:underline leading-snug">
                  {story.title}
                </h3>

                {/* Summary */}
                {story.summary && (
                  <p className="font-serif text-[12px] sm:text-[12.5px] text-neutral-400 mt-1.5 leading-[1.38]">
                    {story.summary}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="mt-2.5 font-sans text-[11px] text-neutral-400 font-medium">
                <span className="hover:underline">{story.category}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
