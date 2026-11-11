'use client';

import React, { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileDrawer from '../../../components/ProfileDrawer';
import ReaderProfileSettingsModal from '../../../components/ReaderProfileSettingsModal';
import { SkeletonPage, SkeletonArticleCard, Spinner } from '../../../components/Skeletons';
import { API_BASE_URL, fetchHomeData, resolveMediaUrl } from '../../../lib/api';
import {
  authHeaders,
  clearAuthSession,
  getAuthToken,
  getDisplayName,
  getRoleDashboardPath,
  getStoredUser,
  updateStoredUser,
} from '../../../lib/auth';
import { BBC_MAIN_CATEGORIES, getCategorySlugByName } from '../../../data/editorialConfig';
import { Article, AuthUser, BookmarkItem } from '../../../types';

type ReaderTab = 'SAVED' | 'FEED' | 'MANAGE_ACCOUNT';

function ReaderDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<ReaderTab>('SAVED');

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  const [feedArticles, setFeedArticles] = useState<Article[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    linkedin: '',
    photo: '',
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync URL query param ?tab=
  useEffect(() => {
    const tabParam = (searchParams.get('tab') || '').toLowerCase();
    if (tabParam === 'feed') {
      setActiveTab('FEED');
    } else if (tabParam === 'profile-settings' || tabParam === 'account' || tabParam === 'settings') {
      setActiveTab('MANAGE_ACCOUNT');
    } else if (tabParam === 'saved') {
      setActiveTab('SAVED');
    }
  }, [searchParams]);

  // Load user & bookmarks & feed on mount
  const fetchBookmarks = useCallback(async () => {
    if (!getAuthToken()) return;
    setLoadingBookmarks(true);
    try {
      const res = await fetch(`${API_BASE_URL}/bookmarks`, {
        headers: authHeaders(),
        cache: 'no-store',
      });
      if (res.status === 401) {
        clearAuthSession();
        router.replace('/login?redirect=' + encodeURIComponent('/reader/dashboard'));
        return;
      }
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.bookmarks)) {
        setBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    } finally {
      setLoadingBookmarks(false);
    }
  }, [router]);

  const fetchFeed = useCallback(async () => {
    setLoadingFeed(true);
    try {
      const [articlesRes, homePayload] = await Promise.all([
        fetch(`${API_BASE_URL}/articles?limit=24`, { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetchHomeData(),
      ]);

      const collected: Article[] = [];
      const seen = new Set<string>();
      const pushUnique = (item?: Article | null) => {
        if (!item || !item.title) return;
        const key = (item.slug || item.id || item.title).toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        collected.push(item);
      };

      if (articlesRes && Array.isArray(articlesRes.articles)) {
        for (const art of articlesRes.articles as Article[]) {
          pushUnique(art);
        }
      }

      if (homePayload) {
        pushUnique(homePayload.topStoryLead);
        homePayload.topStoriesSecondary?.forEach(pushUnique);
        homePayload.topStoriesSideList?.forEach(pushUnique);
        homePayload.politicsGridArticles?.forEach(pushUnique);
        pushUnique(homePayload.euLeadersStory);
        pushUnique(homePayload.moreNewsVanessa);
        pushUnique(homePayload.moreNewsBurnham);
        homePayload.moreNewsSideList?.forEach(pushUnique);
        homePayload.humanRightsArticles?.forEach(pushUnique);
        pushUnique(homePayload.editorLeadStory);
        homePayload.editorSideList?.forEach(pushUnique);
        pushUnique(homePayload.inDepthChangeLead);
        homePayload.inDepthChangeCards?.forEach(pushUnique);
        pushUnique(homePayload.inFocusLeadStory);
        homePayload.inFocusSideList?.forEach(pushUnique);
        homePayload.sportsSectionArticles?.forEach(pushUnique);
      }

      setFeedArticles(collected);
    } catch (err) {
      console.error('Failed to load reader feed', err);
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    const stored = getStoredUser();

    if (!token || !stored) {
      router.replace('/login?redirect=' + encodeURIComponent('/reader/dashboard'));
      return;
    }

    if (stored.role === 'writer' || stored.role === 'admin') {
      router.replace(getRoleDashboardPath(stored.role));
      return;
    }

    setUser(stored);
    setProfileData({
      fullName: getDisplayName(stored),
      bio: stored.bio || '',
      linkedin: stored.linkedin_url || '',
      photo: stored.profile_picture || '',
    });
    setAuthChecked(true);

    // Sync fresh profile from backend
    fetch(`${API_BASE_URL}/users/${stored.id}`, {
      headers: authHeaders(),
      cache: 'no-store',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.user) {
          const updated = updateStoredUser({
            name: data.user.name || data.user.fullName || stored.name,
            fullName: data.user.fullName || data.user.name || stored.fullName,
            bio: data.user.bio ?? '',
            profile_picture: data.user.profile_picture ?? '',
            linkedin_url: data.user.linkedin_url ?? '',
          });
          if (updated) setUser(updated);
          setProfileData({
            fullName: data.user.name || data.user.fullName || getDisplayName(stored),
            bio: data.user.bio || '',
            linkedin: data.user.linkedin_url || '',
            photo: data.user.profile_picture || '',
          });
        }
      })
      .catch(() => {});

    fetchBookmarks();
    fetchFeed();
  }, [router, fetchBookmarks, fetchFeed]);

  // Listen to modal profile updates
  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredUser();
      if (updated) {
        setUser(updated);
        setProfileData({
          fullName: getDisplayName(updated),
          bio: updated.bio || '',
          linkedin: updated.linkedin_url || '',
          photo: updated.profile_picture || '',
        });
      }
    };
    window.addEventListener('userProfileUpdated', handleSync);
    return () => window.removeEventListener('userProfileUpdated', handleSync);
  }, []);

  const switchTab = (tab: ReaderTab) => {
    setActiveTab(tab);
    setProfileMessage(null);
    const param =
      tab === 'FEED'
        ? 'feed'
        : tab === 'MANAGE_ACCOUNT'
        ? 'profile-settings'
        : 'saved';
    router.replace(`/reader/dashboard?tab=${param}`, { scroll: false });
  };

  const handleRemoveBookmark = async (slug: string) => {
    if (!slug || removingSlug) return;
    setRemovingSlug(slug);
    try {
      const res = await fetch(`${API_BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ article_slug: slug }),
      });
      const data = await res.json();
      if (res.ok && data.success && !data.bookmarked) {
        setBookmarks((prev) => prev.filter((item) => item.slug !== slug));
      }
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    } finally {
      setRemovingSlug(null);
    }
  };

  const handleToggleFeedBookmark = async (article: Article) => {
    const slug = article.slug || article.id;
    if (!slug || togglingSlug) return;
    setTogglingSlug(slug);
    try {
      const res = await fetch(`${API_BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          article_slug: slug,
          title: article.title,
          image: article.imageUrl || '/hero-lead.jpg',
          category: article.category || 'World News',
          date: article.time || article.publishedAt || '',
          author: article.author || 'BBC News Staff',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.bookmarked) {
          setBookmarks((prev) => [
            {
              slug,
              title: article.title,
              image: article.imageUrl || '/hero-lead.jpg',
              category: article.category || 'World News',
              date: article.time || '',
              author: article.author || 'BBC News Staff',
              created_at: new Date().toISOString(),
            },
            ...prev.filter((b) => b.slug !== slug),
          ]);
        } else {
          setBookmarks((prev) => prev.filter((b) => b.slug !== slug));
        }
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    } finally {
      setTogglingSlug(null);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setProfileMessage(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 240;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              setIsUploadingPhoto(false);
              return;
            }
            const formData = new FormData();
            formData.append('folder', 'avatars');
            formData.append(
              'file',
              blob,
              file.name.replace(/\.[^/.]+$/, '') + '.webp'
            );

            try {
              const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: authHeaders(),
                body: formData,
              });
              const data = await res.json();
              if (res.ok && data.success && data.url) {
                setProfileData((prev) => ({ ...prev, photo: data.url }));
                setProfileMessage({
                  type: 'success',
                  text: 'Photo uploaded. Click Save Changes to update your profile.',
                });
              } else {
                setProfileMessage({
                  type: 'error',
                  text: data.message || 'Failed to upload profile photo',
                });
              }
            } catch {
              setProfileMessage({
                type: 'error',
                text: 'Network error during photo upload',
              });
            } finally {
              setIsUploadingPhoto(false);
            }
          },
          'image/webp',
          0.85
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSavingProfile) return;

    if (!profileData.fullName.trim()) {
      setProfileMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          name: profileData.fullName.trim(),
          bio: profileData.bio,
          profile_picture: profileData.photo,
          linkedin_url: profileData.linkedin || '',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProfileMessage({
          type: 'error',
          text: data.message || 'Failed to update profile.',
        });
        return;
      }

      const nextUser = updateStoredUser({
        name: profileData.fullName.trim(),
        fullName: profileData.fullName.trim(),
        bio: profileData.bio,
        profile_picture: profileData.photo,
        linkedin_url: profileData.linkedin || '',
      });
      if (nextUser) setUser(nextUser);

      sessionStorage.setItem(
        `userProfile_${user.email}`,
        JSON.stringify(profileData)
      );

      setProfileMessage({
        type: 'success',
        text: 'Your reader profile settings have been saved.',
      });
    } catch {
      setProfileMessage({
        type: 'error',
        text: 'Network error while saving settings.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSignOut = () => {
    clearAuthSession();
    router.push('/');
  };

  if (!authChecked || !user) {
    return <SkeletonPage />;
  }

  const displayName = profileData.fullName || getDisplayName(user);
  const avatarSrc = resolveMediaUrl(profileData.photo || user.profile_picture);
  const bookmarkedSlugs = new Set(bookmarks.map((b) => b.slug));

  const filteredFeed =
    selectedCategory === 'All'
      ? feedArticles
      : feedArticles.filter(
          (art) =>
            (art.category || '').toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-[#141414]">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 hover:text-black transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to News</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex items-center gap-[3px]">
              <span className="w-[22px] h-[22px] bg-black text-white font-bold text-[13px] flex items-center justify-center leading-none">
                B
              </span>
              <span className="w-[22px] h-[22px] bg-black text-white font-bold text-[13px] flex items-center justify-center leading-none">
                B
              </span>
              <span className="w-[22px] h-[22px] bg-black text-white font-bold text-[13px] flex items-center justify-center leading-none">
                C
              </span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600 border-l border-gray-300 pl-2.5">
              Readers Dashboard
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-full border border-gray-200 hover:border-gray-400 bg-white transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-neutral-800 max-w-[140px] truncate">
              {displayName}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-neutral-500"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center gap-6 sm:gap-8 overflow-x-auto custom-scrollbar-hide border-t border-gray-100">
          <button
            type="button"
            onClick={() => switchTab('SAVED')}
            className={`py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'SAVED'
                ? 'border-[#bb1919] text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Saved Articles ({bookmarks.length})
          </button>
          <button
            type="button"
            onClick={() => switchTab('FEED')}
            className={`py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'FEED'
                ? 'border-[#bb1919] text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Personalized Feed
          </button>
          <button
            type="button"
            onClick={() => switchTab('MANAGE_ACCOUNT')}
            className={`py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'MANAGE_ACCOUNT'
                ? 'border-[#bb1919] text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Profile Settings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'SAVED' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black">
                  Saved Articles
                </h1>
                <p className="text-sm text-neutral-600 mt-1">
                  Stories you bookmarked from across BBC News to read at your convenience.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Browse Latest News
              </Link>
            </div>

            {loadingBookmarks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonArticleCard />
                <SkeletonArticleCard />
                <SkeletonArticleCard />
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-neutral-500">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-neutral-900 mb-2">
                  No saved articles yet
                </h2>
                <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6">
                  When reading an article, click the Save button next to the author byline to bookmark it to your personal reading list.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => switchTab('FEED')}
                    className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Explore Personalized Feed
                  </button>
                  <Link
                    href="/"
                    className="px-5 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-gray-50 transition-colors"
                  >
                    Discover Top Stories
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((item) => {
                  const articleHref = `/news/articles/${encodeURIComponent(item.slug)}`;
                  const catName = item.category || 'World News';
                  const catHref = `/${getCategorySlugByName(catName)}`;
                  const thumbSrc = resolveMediaUrl(item.image, '/hero-lead.jpg');

                  return (
                    <article
                      key={item.slug}
                      className="bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <Link href={articleHref} className="block aspect-[16/9] bg-gray-100 overflow-hidden">
                          <img
                            src={thumbSrc}
                            alt={item.title || 'Saved article'}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/hero-lead.jpg';
                            }}
                            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                          />
                        </Link>
                        <div className="p-4">
                          <Link
                            href={catHref}
                            className="text-[11px] font-bold uppercase tracking-wider text-[#bb1919] hover:underline"
                          >
                            {catName}
                          </Link>
                          <Link href={articleHref}>
                            <h3 className="mt-1.5 font-serif font-bold text-[17px] leading-snug text-[#141414] hover:underline line-clamp-3">
                              {item.title || item.slug}
                            </h3>
                          </Link>
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-neutral-500">
                        <div className="truncate pr-2">
                          <span className="font-semibold text-neutral-700">
                            {item.author || 'BBC News Staff'}
                          </span>
                          {item.date ? <span className="ml-1.5">· {item.date}</span> : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBookmark(item.slug)}
                          disabled={removingSlug === item.slug}
                          className="text-xs font-bold text-neutral-500 hover:text-[#bb1919] transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {removingSlug === item.slug ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'FEED' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black">
                Personalized Feed
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                Filter the latest reporting across BBC News topics and save stories for later.
              </p>
            </div>

            {/* Category filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 custom-scrollbar-hide">
              {['All', ...BBC_MAIN_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-neutral-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loadingFeed ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonArticleCard />
                <SkeletonArticleCard />
                <SkeletonArticleCard />
              </div>
            ) : filteredFeed.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
                <p className="text-sm text-neutral-600">
                  No articles available in <strong>{selectedCategory}</strong> yet.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  View All Topics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeed.map((art) => {
                  const targetSlug = art.slug || art.id;
                  const articleHref = `/news/articles/${encodeURIComponent(targetSlug)}`;
                  const catName = art.category || 'World News';
                  const catHref = `/${getCategorySlugByName(catName)}`;
                  const imgSrc = resolveMediaUrl(art.imageUrl, '/hero-lead.jpg');
                  const isSaved = bookmarkedSlugs.has(targetSlug);

                  return (
                    <article
                      key={art.id}
                      className="bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <Link href={articleHref} className="block aspect-[16/9] bg-gray-100 overflow-hidden">
                          <img
                            src={imgSrc}
                            alt={art.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/hero-lead.jpg';
                            }}
                            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                          />
                        </Link>
                        <div className="p-4">
                          <Link
                            href={catHref}
                            className="text-[11px] font-bold uppercase tracking-wider text-[#bb1919] hover:underline"
                          >
                            {catName}
                          </Link>
                          <Link href={articleHref}>
                            <h3 className="mt-1.5 font-serif font-bold text-[17px] leading-snug text-[#141414] hover:underline line-clamp-2">
                              {art.title}
                            </h3>
                          </Link>
                          {(art.summary || art.cardSummary) && (
                            <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                              {art.cardSummary || art.summary}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-neutral-500">
                        <span className="truncate pr-2">
                          {art.time || 'Recent'} {art.author ? `· ${art.author}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleFeedBookmark(art)}
                          disabled={togglingSlug === targetSlug}
                          className={`inline-flex items-center gap-1 font-bold text-xs cursor-pointer flex-shrink-0 ${
                            isSaved
                              ? 'text-[#bb1919]'
                              : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'MANAGE_ACCOUNT' && (
          <div className="max-w-[680px]">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-1">
              Profile Settings
            </h1>
            <p className="text-sm text-neutral-600 mb-6">
              Update your reader profile details and avatar.
            </p>

            <form
              onSubmit={handleSaveProfileInline}
              className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6"
            >
              {profileMessage && (
                <div
                  className={`p-3 rounded text-xs font-medium border ${
                    profileMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {profileMessage.text}
                </div>
              )}

              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-900 text-white font-bold text-xl flex items-center justify-center border border-gray-200 flex-shrink-0">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="text-sm font-bold text-[#00508f] hover:underline cursor-pointer disabled:opacity-60"
                  >
                    {isUploadingPhoto ? 'Uploading photo...' : 'Change profile photo'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded px-3.5 py-2.5 text-sm text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell us a little about your reading interests..."
                  className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2.5 border border-gray-300 rounded text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-gray-50 hover:text-[#bb1919] transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile || isUploadingPhoto}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSavingProfile ? <Spinner /> : null}
                  <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <ProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        profileData={profileData}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSignOut={handleSignOut}
        onTabSelect={(tab) => switchTab(tab)}
      />

      <ReaderProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onProfileUpdate={(next) => {
          setProfileData(next);
          const refreshed = getStoredUser();
          if (refreshed) setUser(refreshed);
        }}
      />
    </div>
  );
}

export default function ReaderDashboardPage() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <ReaderDashboardContent />
    </Suspense>
  );
}
