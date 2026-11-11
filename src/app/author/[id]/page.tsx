'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SearchModal from '../../../components/SearchModal';
import MobileMenu from '../../../components/MobileMenu';
import SignInModal from '../../../components/SignInModal';
import { SkeletonArticleCard, Spinner } from '../../../components/Skeletons';
import { API_BASE_URL, resolveMediaUrl } from '../../../lib/api';
import { getCategorySlugByName } from '../../../data/editorialConfig';
import { Article, EditorialPost } from '../../../types';

interface AuthorProfileData {
  id: number;
  name: string;
  writer_role?: string | null;
  profile_picture?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'Recently';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AuthorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = typeof params?.id === 'string' ? decodeURIComponent(params.id) : '';

  const [author, setAuthor] = useState<AuthorProfileData | null>(null);
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const loadAuthorAndPosts = useCallback(async () => {
    if (!rawId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    try {
      const [userRes, postsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/${encodeURIComponent(rawId)}`, {
          cache: 'no-store',
        }),
        fetch(
          `${API_BASE_URL}/author/${encodeURIComponent(rawId)}/posts?page=${page}&limit=8`,
          { cache: 'no-store' }
        ),
      ]);

      if (postsRes.status === 404 && userRes.status === 404) {
        setNotFound(true);
        return;
      }

      const postsData = postsRes.ok ? await postsRes.json() : null;
      const userData = userRes.ok ? await userRes.json() : null;

      if (postsData?.success) {
        if (postsData.author) {
          setAuthor(postsData.author);
        } else if (userData?.success && userData.user) {
          setAuthor(userData.user);
        }
        setPosts(Array.isArray(postsData.posts) ? postsData.posts : []);
        setTotal(Number(postsData.pagination?.total ?? 0));
        setTotalPages(Number(postsData.pagination?.totalPages ?? 1));
      } else if (userData?.success && userData.user) {
        setAuthor(userData.user);
        setPosts([]);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [rawId, page]);

  useEffect(() => {
    loadAuthorAndPosts();
  }, [loadAuthorAndPosts]);

  const topReadStories = useMemo(() => {
    return [...posts]
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 5);
  }, [posts]);

  const handleSelectSearchArticle = (art: Article) => {
    setIsSearchOpen(false);
    router.push(`/news/articles/${encodeURIComponent(art.slug || art.id)}`);
  };

  const avatarSrc = resolveMediaUrl(author?.profile_picture);

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col font-sans">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      <main className="flex-1 pt-[112px] sm:pt-[124px] pb-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb */}
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2 mb-6">
            <Link href="/" className="hover:text-black hover:underline">
              BBC News
            </Link>
            <span>›</span>
            <span>Journalists</span>
            {author?.name && (
              <>
                <span>›</span>
                <span className="text-[#bb1919]">{author.name}</span>
              </>
            )}
          </div>

          {loading ? (
            <div className="space-y-8">
              <div className="bg-neutral-50 border border-gray-200 p-8 rounded flex items-center gap-4">
                <Spinner className="w-6 h-6 text-black" />
                <span className="text-sm text-neutral-600">Loading correspondent profile...</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonArticleCard />
                <SkeletonArticleCard />
                <SkeletonArticleCard />
              </div>
            </div>
          ) : notFound || !author ? (
            <div className="bg-neutral-50 border border-gray-200 rounded-md p-12 text-center max-w-xl mx-auto my-8">
              <h1 className="text-2xl font-serif font-bold text-[#141414] mb-2">
                Author Profile Not Found
              </h1>
              <p className="text-sm text-neutral-600 mb-6">
                The requested BBC journalist profile could not be located.
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Return to BBC Home
              </Link>
            </div>
          ) : (
            <>
              {/* Author Hero Card */}
              <section className="border-t-4 border-black bg-[#f8f9fa] border-x border-b border-gray-200 p-6 sm:p-8 mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-neutral-900 text-white font-bold text-3xl flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">
                    {avatarSrc && !avatarError ? (
                      <img
                        src={avatarSrc}
                        alt={author.name}
                        onError={() => setAvatarError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(author.name || 'B').charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#bb1919]">
                        {author.writer_role || 'BBC News Correspondent'}
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs font-semibold text-neutral-600">
                        {total} Published {total === 1 ? 'Story' : 'Stories'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414]">
                        {author.name || 'BBC News Staff'}
                      </h1>
                      {author.linkedin_url && (
                        <a
                          href={
                            author.linkedin_url.startsWith('http')
                              ? author.linkedin_url
                              : `https://${author.linkedin_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${author.name} on LinkedIn`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-300 text-xs font-bold text-[#0077b5] hover:border-[#0077b5] transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75-1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>

                    <p className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed max-w-3xl">
                      {author.bio ||
                        `Reporting global news, in-depth analysis, and special features for BBC News.`}
                    </p>
                  </div>
                </div>
              </section>

              {/* Main 8/4 Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left 8 Cols: Published Stories */}
                <div className="lg:col-span-8">
                  <div className="border-t-2 border-black pt-2.5 mb-6 flex items-center justify-between">
                    <h2 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-[#141414]">
                      LATEST REPORTING BY {author.name.toUpperCase()}
                    </h2>
                  </div>

                  {posts.length === 0 ? (
                    <div className="border border-gray-200 rounded p-10 text-center bg-neutral-50">
                      <p className="text-sm text-neutral-600">
                        No published articles from this author yet.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {posts.map((post) => {
                        const articleHref = `/news/articles/${encodeURIComponent(
                          post.slug || post.id
                        )}`;
                        const catName =
                          post.mainCategory || post.main_category || post.category || 'World News';
                        const catHref = `/${getCategorySlugByName(catName)}`;
                        const thumbSrc = resolveMediaUrl(
                          post.imageUrl || post.image_url,
                          '/hero-lead.jpg'
                        );

                        return (
                          <article
                            key={post.id}
                            className="py-6 first:pt-0 flex flex-col sm:flex-row gap-5 items-start group"
                          >
                            <Link
                              href={articleHref}
                              className="w-full sm:w-56 aspect-[16/10] bg-gray-100 rounded-xs overflow-hidden flex-shrink-0"
                            >
                              <img
                                src={thumbSrc}
                                alt={post.title}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/hero-lead.jpg';
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <Link
                                  href={catHref}
                                  className="text-[11px] font-bold uppercase tracking-wider text-[#bb1919] hover:underline"
                                >
                                  {catName}
                                </Link>
                                <span className="text-xs text-neutral-300">·</span>
                                <span className="text-xs text-neutral-500">
                                  {formatDate(post.published_at || post.created_at)}
                                </span>
                                {post.readDuration || post.read_duration ? (
                                  <>
                                    <span className="text-xs text-neutral-300">·</span>
                                    <span className="text-xs text-neutral-500">
                                      {post.readDuration || post.read_duration} min read
                                    </span>
                                  </>
                                ) : null}
                              </div>

                              <Link href={articleHref}>
                                <h3 className="font-serif font-bold text-xl leading-snug text-[#141414] group-hover:underline">
                                  {post.title}
                                </h3>
                              </Link>

                              {(post.cardSummary || post.summary || post.subtitle) && (
                                <p className="mt-2 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                                  {post.cardSummary || post.summary || post.subtitle}
                                </p>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 border border-gray-300 font-bold uppercase tracking-wider hover:border-black disabled:opacity-40 cursor-pointer"
                      >
                        ← Previous
                      </button>
                      <span className="font-semibold text-neutral-600">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 border border-gray-300 font-bold uppercase tracking-wider hover:border-black disabled:opacity-40 cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>

                {/* Right 4 Cols: Most Read by Author */}
                <aside className="lg:col-span-4 space-y-6">
                  <div className="border-t-2 border-black pt-2.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-[#141414] mb-4">
                      MOST READ STORIES
                    </h2>

                    {topReadStories.length === 0 ? (
                      <p className="text-xs text-neutral-500">No stories available yet.</p>
                    ) : (
                      <ol className="divide-y divide-gray-200">
                        {topReadStories.map((story, idx) => (
                          <li key={story.id} className="py-3.5 first:pt-0 last:pb-0">
                            <Link
                              href={`/news/articles/${encodeURIComponent(
                                story.slug || story.id
                              )}`}
                              className="flex items-start gap-3 group"
                            >
                              <span className="font-serif font-black text-2xl text-neutral-300 group-hover:text-[#bb1919] transition-colors leading-none mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <h4 className="font-serif font-bold text-sm leading-snug text-[#141414] group-hover:underline line-clamp-2">
                                  {story.title}
                                </h4>
                                <span className="text-[11px] text-neutral-500 mt-1 block">
                                  {story.mainCategory || story.category || 'BBC News'} ·{' '}
                                  {(story.views || 0).toLocaleString()} views
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectSearchArticle}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </div>
  );
}
