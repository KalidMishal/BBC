'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import {
  topStoryLead,
  topStoriesSecondary,
  topStoriesSideList,
  weekendReads,
  sportPremierLeague,
  moreNewsFeatured,
  moreNewsLeft,
  moreNewsRight,
  editorsPicks,
  watchVideosDark,
  travelFeature,
  crownsAndControversies,
  earthFeature,
  fourColumnDigest1,
  fourColumnDigest2,
  fourColumnDigest3
} from '../data/bbcData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectArticle }: SearchModalProps) {
  const [query, setQuery] = useState('');

  // Collect all articles for local search
  const allArticles = useMemo(() => {
    const list: Article[] = [
      topStoryLead,
      ...topStoriesSecondary,
      ...topStoriesSideList,
      ...weekendReads,
      sportPremierLeague,
      moreNewsFeatured,
      ...moreNewsLeft,
      ...moreNewsRight,
      ...editorsPicks,
      ...watchVideosDark,
      travelFeature,
      ...crownsAndControversies,
      earthFeature,
    ];

    [...fourColumnDigest1, ...fourColumnDigest2, ...fourColumnDigest3].forEach((col) => {
      list.push(col.leadArticle);
      list.push(...col.articles);
    });

    // Deduplicate
    const map = new Map<string, Article>();
    list.forEach((a) => {
      if (a && a.title && !map.has(a.title)) {
        map.set(a.title, a);
      }
    });
    return Array.from(map.values());
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.tag && a.tag.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, allArticles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden border border-neutral-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200 flex items-center space-x-3 bg-neutral-50">
          <Search className="w-5 h-5 text-neutral-500" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, topics, sport, videos..."
            className="w-full bg-transparent text-neutral-900 placeholder-neutral-400 font-medium text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black px-2 py-1 rounded cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-neutral-400 text-sm">
              <p className="font-semibold text-neutral-600">Type a keyword to search BBC News</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Premier League', 'France', 'Starlink', 'Science', 'Technology', 'Economy'].map((k) => (
                  <button
                    key={k}
                    onClick={() => setQuery(k)}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded transition cursor-pointer"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              No results found for &quot;<span className="font-semibold text-neutral-800">{query}</span>&quot;. Try different keywords.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-2">
                Top Matches ({searchResults.length})
              </p>
              {searchResults.map((article) => (
                <div
                  key={article.id}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="p-3 hover:bg-neutral-50 rounded-sm cursor-pointer border-b border-neutral-100 last:border-b-0 transition flex items-center justify-between group"
                >
                  <div className="pr-4">
                    {article.category && (
                      <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                        {article.category}
                      </span>
                    )}
                    <h4 className="font-bold text-neutral-900 group-hover:text-red-600 text-sm leading-snug">
                      {article.title}
                    </h4>
                    {article.summary && (
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                        {article.summary}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
