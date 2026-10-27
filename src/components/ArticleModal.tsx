'use client';

import React from 'react';
import Image from 'next/image';
import { X, Share2, Bookmark, Clock, MessageSquare, ThumbsUp } from 'lucide-react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-neutral-200">
        {/* Top Header */}
        <div className="px-6 py-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              {article.category || article.tag || 'BBC News'}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-xs text-neutral-500">{article.time}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-neutral-500 hover:text-black p-1 transition cursor-pointer" title="Save article">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="text-neutral-500 hover:text-black p-1 transition cursor-pointer" title="Share article">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-black p-1 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-base sm:text-lg font-medium text-neutral-600 leading-relaxed border-l-4 border-red-600 pl-4 py-1 italic">
              {article.summary}
            </p>
          )}

          {article.imageUrl && (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 rounded-sm shadow-sm my-4">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Text Content */}
          <div className="prose max-w-none text-neutral-800 space-y-4 text-sm sm:text-base leading-relaxed">
            <p>
              Correspondents on the ground report significant developments unfolding throughout the day. Officials confirmed that emergency measures and contingency protocols have been activated across multiple regional administrative offices.
            </p>
            <p>
              &ldquo;We are monitoring the situation with extreme diligence and coordinating closely with international partners,&rdquo; a senior spokesperson told BBC News during an afternoon press conference. &ldquo;Our primary commitment remains the safety, stability, and transparency of all ongoing operations.&rdquo;
            </p>
            <p>
              Analysts point out that this is part of a broader shift in geopolitical and socioeconomic trends observed over the past eighteen months. Public reaction has been swift, with community representatives and advocacy groups organizing local briefings and panel discussions to address questions from citizens.
            </p>
            <p>
              Further updates will be broadcast across BBC News television, BBC Sounds radio broadcasts, and updated live right here on the digital wire as official statements are verified.
            </p>
          </div>

          {/* Bullet points if available */}
          {article.bulletPoints && (
            <div className="bg-neutral-50 p-4 rounded-sm border border-neutral-200">
              <h4 className="font-bold text-sm text-neutral-900 mb-2">Key Match & Event Takeaways:</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-700">
                {article.bulletPoints.map((pt, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reactions bar */}
          <div className="pt-6 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-black transition cursor-pointer">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful (1.2k)</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-black transition cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>Comments (248)</span>
              </button>
            </div>
            <span>Published by BBC Global Newsroom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
