'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { ColumnSection, Article } from '../types';

interface MultiColumnDigestProps {
  columns: ColumnSection[];
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
}

export default function MultiColumnDigest({ columns, onArticleClick, onVideoClick }: MultiColumnDigestProps) {
  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 py-6">
      {/* 4 Columns with no vertical dividing line between them */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col">
            {/* Column Header: Top black rule with arrow right behind the heading text */}
            <div className="border-t-2 border-neutral-900 pt-2 mb-3 h-8 flex items-center">
              <h2 className="text-sm sm:text-[15px] font-black text-neutral-900 uppercase inline-flex items-center space-x-1 group cursor-pointer hover:text-red-600 transition tracking-wide">
                <span>{col.title.toUpperCase()}</span>
                <span className="text-neutral-900 group-hover:text-red-600 transition-colors text-sm font-bold">
                  ›
                </span>
              </h2>
            </div>

            {/* Lead Article in Column: Image aligned in the exact same line */}
            <article
              onClick={() => col.leadArticle.badge === 'VIDEO' && onVideoClick ? onVideoClick(col.leadArticle) : onArticleClick?.(col.leadArticle)}
              className="group cursor-pointer mb-3.5 pb-3.5 border-b border-neutral-200"
            >
              {col.leadArticle.imageUrl && (
                <div className="relative aspect-[16/9.2] w-full overflow-hidden bg-neutral-100 mb-2.5 shadow-2xs">
                  <Image
                    src={col.leadArticle.imageUrl}
                    alt={col.leadArticle.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {col.leadArticle.badge === 'VIDEO' && (
                    <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs flex items-center space-x-1">
                      <Play className="w-2.5 h-2.5 fill-white text-white" />
                      <span>{col.leadArticle.videoDuration || 'VIDEO'}</span>
                    </div>
                  )}
                </div>
              )}
              <h3 className="font-bold text-[14px] sm:text-[15px] text-neutral-900 group-hover:underline decoration-neutral-900 decoration-1 leading-snug">
                {col.leadArticle.badge === 'LIVE' && (
                  <span className="inline-flex items-center text-red-600 font-bold mr-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse mr-1 inline-block" />
                    LIVE
                  </span>
                )}
                {col.title.toUpperCase() === 'VIDEO' && (
                  <span className="text-neutral-900 mr-1.5 inline-block text-xs">▶</span>
                )}
                {col.leadArticle.title}
              </h3>
              {col.leadArticle.summary && (
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed line-clamp-3">
                  {col.leadArticle.summary}
                </p>
              )}
            </article>

            {/* Sub-articles: Ash color horizontal divider line under each article */}
            <div className="space-y-3">
              {col.articles.map((art) => (
                <article
                  key={art.id}
                  onClick={() => art.badge === 'VIDEO' && onVideoClick ? onVideoClick(art) : onArticleClick?.(art)}
                  className="group cursor-pointer pb-3 border-b border-neutral-200"
                >
                  <h4 className="font-semibold text-xs sm:text-[13px] text-neutral-900 group-hover:underline decoration-neutral-900 decoration-1 leading-snug flex items-start space-x-1.5">
                    {col.title.toUpperCase() === 'VIDEO' && (
                      <span className="text-neutral-900 flex-shrink-0 mt-0.5 text-[10px]">
                        ▶
                      </span>
                    )}
                    <span>{art.title}</span>
                  </h4>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
