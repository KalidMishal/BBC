'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShareDropdown from './ShareDropdown';
import { API_BASE_URL } from '../lib/api';
import { authHeaders, getAuthToken, getStoredUser } from '../lib/auth';

interface AuthorProfileProps {
  authorId?: number | string | null;
  authorName: string;
  authorEmail?: string;
  authorBio?: string | null;
  authorPhoto?: string | null;
  authorLinkedin?: string | null;
  authorWriterRole?: string | null;
  publishDate?: string;
  readTime?: string;
  disableLinks?: boolean;
  article?: {
    slug?: string;
    title?: string;
    image?: string;
    imageUrl?: string;
    category?: string;
    date?: string;
    time?: string;
    authorName?: string;
    author?: string;
  };
}

export default function AuthorProfile({
  authorId,
  authorName,
  authorBio,
  authorPhoto,
  authorLinkedin,
  authorWriterRole,
  publishDate,
  readTime,
  disableLinks = false,
  article,
}: AuthorProfileProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [imgError, setImgError] = useState(false);

  const safeAuthorName = authorName?.trim() || 'BBC News Staff';
  const authorHref =
    safeAuthorName && !disableLinks
      ? `/author/${encodeURIComponent(
          authorId ? String(authorId) : safeAuthorName.toLowerCase().replace(/\s+/g, '-')
        )}`
      : undefined;

  useEffect(() => {
    const syncRoleAndBookmark = async () => {
      const user = getStoredUser();
      const token = getAuthToken();
      if (user) {
        const role = (user.role || '').toLowerCase();
        setIsStaff(['admin', 'writer'].includes(role));
      } else {
        setIsStaff(false);
      }

      if (!article?.slug || !token) {
        setIsBookmarked(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/bookmarks`, {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.bookmarks)) {
          setIsBookmarked(data.bookmarks.some((b: { slug?: string }) => b.slug === article.slug));
        }
      } catch (err) {
        console.error('Failed to fetch bookmark status', err);
      }
    };

    syncRoleAndBookmark();
    window.addEventListener('authUpdated', syncRoleAndBookmark);
    return () => window.removeEventListener('authUpdated', syncRoleAndBookmark);
  }, [article?.slug]);

  const handleBookmark = async () => {
    const token = getAuthToken();
    const user = getStoredUser();

    if (!token || !user) {
      const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '/';
      sessionStorage.setItem('redirectAfterLogin', currentPath);
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!article?.slug) return;

    try {
      const res = await fetch(`${API_BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          article_slug: article.slug,
          title: article.title || '',
          image: article.image || article.imageUrl || '/hero-lead.jpg',
          category: article.category || 'News',
          date: article.date || article.time || publishDate || '',
          author: safeAuthorName,
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(Boolean(data.bookmarked));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mt-3 md:mt-5 mb-4 py-3 md:py-4 border-t border-b border-gray-200">
      <div className="flex items-center gap-3 min-w-0">
        {authorPhoto && !imgError ? (
          <img
            src={authorPhoto}
            alt={safeAuthorName}
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
            {safeAuthorName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex flex-col min-w-0">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
            <div className="font-sans font-bold text-[14px] text-[#141414] flex items-center whitespace-nowrap">
              <span className="mr-1 text-neutral-500 font-semibold text-xs uppercase tracking-wider">
                By
              </span>
              {authorHref ? (
                <Link
                  href={authorHref}
                  className="hover:text-[#bb1919] hover:underline transition-colors cursor-pointer"
                >
                  {safeAuthorName}
                </Link>
              ) : (
                <span>{safeAuthorName}</span>
              )}
              {authorLinkedin && (
                <a
                  href={
                    disableLinks
                      ? undefined
                      : authorLinkedin.startsWith('http')
                      ? authorLinkedin
                      : `https://${authorLinkedin}`
                  }
                  onClick={disableLinks ? (e) => e.preventDefault() : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`text-[#0077b5] hover:text-[#005582] transition-colors ml-2 inline-flex items-center justify-center shrink-0 ${
                    disableLinks ? 'cursor-default' : ''
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75-1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
            </div>
            {authorWriterRole && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#bb1919]">
                · {authorWriterRole}
              </span>
            )}
          </div>

          {(publishDate || readTime) && (
            <div className="text-[12px] text-neutral-500 font-sans flex flex-wrap items-center gap-x-1.5 mt-0.5">
              {publishDate && <span>Published {publishDate}</span>}
              {publishDate && readTime && <span>•</span>}
              {readTime && <span className="whitespace-nowrap">{readTime}</span>}
            </div>
          )}

          {authorBio && (
            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{authorBio}</p>
          )}
        </div>
      </div>

      {/* Save and Share Actions */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {!isStaff && (
          <button
            type="button"
            onClick={handleBookmark}
            disabled={disableLinks}
            className={`h-9 px-3 rounded-full border flex items-center gap-1.5 text-xs font-bold transition-colors bg-white cursor-pointer disabled:cursor-default ${
              isBookmarked
                ? 'border-[#bb1919] text-[#bb1919] bg-red-50/40'
                : 'border-gray-300 text-neutral-700 hover:text-[#bb1919] hover:border-[#bb1919]'
            }`}
            aria-label="Save Article"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        )}

        <ShareDropdown title={article?.title}>
          <div
            className="h-9 px-3 rounded-full border border-gray-300 flex items-center gap-1.5 text-xs font-bold text-neutral-700 bg-white hover:border-black hover:text-black transition-colors cursor-pointer"
            aria-label="Share Article"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </div>
        </ShareDropdown>
      </div>
    </div>
  );
}
