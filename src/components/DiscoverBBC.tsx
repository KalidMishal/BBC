'use client';

import React from 'react';
import Image from 'next/image';
import { discoverHeroCard, discoverCards } from '../data/bbcData';

export default function DiscoverBBC() {
  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 py-6 border-b border-neutral-200 bg-white">
      {/* Section Header matching screenshot */}
      <div className="border-t border-neutral-900 pt-2.5 mb-6">
        <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
          DISCOVER MORE FROM THE BBC
        </h2>
      </div>

      {/* Slot 1: Top Hero Section directly on white background matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-10">
        {/* Left Column: Heading, Subtitle & Rectangular "See more" Button */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <h3 className="font-serif text-2xl sm:text-3xl md:text-[32px] font-extrabold text-neutral-900 leading-[1.18] mb-3">
            The best of the BBC,
            <br />
            delivered to you
          </h3>
          <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed max-w-sm mb-6">
            Get news and insights with BBC newsletters, sent direct to your inbox. Sign up for free.
          </p>
          <div>
            <button
              onClick={() => alert('BBC Newsletters: Choose your favorite newsletters and subscribe.')}
              className="border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm px-5 py-2 transition cursor-pointer"
            >
              See more
            </button>
          </div>
        </div>

        {/* Right Column: Full-fidelity Mosaic Illustration */}
        <div className="md:col-span-7">
          <div className="relative aspect-[16/9] w-full overflow-hidden shadow-2xs">
            <Image
              src="/discover-mosaic.jpg"
              alt="The best of the BBC, delivered to you"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Slots 2 - 9: Two rows of 4 cards matching Image 3 format (8 cards total) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {discoverCards.map((card) => (
          <div
            key={card.id}
            onClick={() => alert(`Navigating to ${card.title}`)}
            className="group cursor-pointer flex flex-col justify-between bg-white"
          >
            <div>
              {/* Card Thumbnail Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 shadow-2xs">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <h4 className="font-serif text-[15px] sm:text-base font-bold text-neutral-900 group-hover:underline leading-snug mb-1.5">
                {card.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
