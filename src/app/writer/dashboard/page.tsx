'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileDrawer from '../../../components/ProfileDrawer';
import ReaderProfileSettingsModal from '../../../components/ReaderProfileSettingsModal';
import { SkeletonPage, Spinner } from '../../../components/Skeletons';
import { API_BASE_URL, resolveMediaUrl } from '../../../lib/api';
import {
  authHeaders,
  clearAuthSession,
  getAuthToken,
  getDisplayName,
  getRoleDashboardPath,
  getStoredUser,
  updateStoredUser,
} from '../../../lib/auth';
import { AuthUser, EditorialPost } from '../../../types';

type WriterTab = 'Published' | 'Drafts' | 'Pending review' | 'Rejected' | 'Trash';

const WRITER_TABS: WriterTab[] = [
  'Published',
  'Drafts',
  'Pending review',
  'Rejected',
  'Trash',
];

function tabToQuery(tab: WriterTab): string {
  if (tab === 'Pending review') return 'pending';
  return tab.toLowerCase();
}

function queryToTab(q: string | null): WriterTab {
  const clean = (q || '').trim().toLowerCase();
  if (clean === 'published') return 'Published';
  if (clean === 'pending' || clean === 'pending review') return 'Pending review';
  if (clean === 'rejected') return 'Rejected';
  if (clean === 'trash') return 'Trash';
  return 'Drafts';
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

function WriterDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<WriterTab>('Published');

  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [busyPostId, setBusyPostId] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState('');

  const [rejectionModalPost, setRejectionModalPost] = useState<EditorialPost | null>(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<EditorialPost | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    linkedin: '',
    photo: '',
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(queryToTab(tabParam));
    }
  }, [searchParams]);

  const fetchWriterPosts = useCallback(async () => {
    if (!getAuthToken()) return;
    setLoadingPosts(true);
    setFeedbackError('');
    try {
      const res = await fetch(`${API_BASE_URL}/writer/posts`, {
        headers: authHeaders(),
        cache: 'no-store',
      });
      if (res.status === 401) {
        clearAuthSession();
        router.replace('/login?redirect=' + encodeURIComponent('/writer/dashboard'));
        return;
      }
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.posts)) {
        const sorted = [...(data.posts as EditorialPost[])].sort((a, b) => {
          const ta = new Date(a.published_at || a.updated_at || a.created_at || 0).getTime();
          const tb = new Date(b.published_at || b.updated_at || b.created_at || 0).getTime();
          return tb - ta;
        });
        setPosts(sorted);
      } else {
        setFeedbackError(data.message || 'Unable to load your articles.');
      }
    } catch {
      setFeedbackError('Network error while loading your articles.');
    } finally {
      setLoadingPosts(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getAuthToken();
    const stored = getStoredUser();

    if (!token || !stored) {
      router.replace('/login?redirect=' + encodeURIComponent('/writer/dashboard'));
      return;
    }

    if (stored.role !== 'writer') {
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

    // Sync profile from backend
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
            writer_role: data.user.writer_role ?? stored.writer_role,
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

    fetchWriterPosts();
  }, [router, fetchWriterPosts]);

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

  const handleSelectTab = (tab: WriterTab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    router.replace(`/writer/dashboard?tab=${tabToQuery(tab)}`, { scroll: false });
  };

  const handleStatusChange = async (postId: string, nextStatus: 'draft' | 'trash') => {
    if (busyPostId) return;
    setBusyPostId(postId);
    setFeedbackError('');
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${encodeURIComponent(postId)}/status`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedbackError(data.message || 'Failed to update article status.');
        return;
      }
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: nextStatus } : p))
      );
    } catch {
      setFeedbackError('Network error while updating article status.');
    } finally {
      setBusyPostId(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteConfirmPost || busyPostId) return;
    const targetId = deleteConfirmPost.id;
    setBusyPostId(targetId);
    setFeedbackError('');
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${encodeURIComponent(targetId)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedbackError(data.message || 'Failed to delete article.');
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== targetId));
      setDeleteConfirmPost(null);
    } catch {
      setFeedbackError('Network error while deleting article.');
    } finally {
      setBusyPostId(null);
    }
  };

  const handleSignOut = () => {
    clearAuthSession();
    router.push('/');
  };

  const tabCounts = useMemo(() => {
    return {
      Published: posts.filter((p) => p.status === 'published').length,
      Drafts: posts.filter((p) => p.status === 'draft').length,
      'Pending review': posts.filter((p) => p.status === 'pending').length,
      Rejected: posts.filter((p) => p.status === 'rejected').length,
      Trash: posts.filter((p) => p.status === 'trash').length,
    };
  }, [posts]);

  const visiblePosts = useMemo(() => {
    const statusMap: Record<WriterTab, EditorialPost['status']> = {
      Published: 'published',
      Drafts: 'draft',
      'Pending review': 'pending',
      Rejected: 'rejected',
      Trash: 'trash',
    };
    const targetStatus = statusMap[activeTab];
    const q = searchQuery.trim().toLowerCase();

    return posts.filter((p) => {
      if (p.status !== targetStatus) return false;
      if (!q) return true;
      const cat = (p.mainCategory || p.category || '').toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.subtitle || '').toLowerCase().includes(q) ||
        cat.includes(q)
      );
    });
  }, [posts, activeTab, searchQuery]);

  if (!authChecked || !user) {
    return <SkeletonPage />;
  }

  const displayName = profileData.fullName || getDisplayName(user);
  const avatarSrc = resolveMediaUrl(profileData.photo || user.profile_picture);

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex font-sans text-[#141414]">
      {/* Mobile Sidebar Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Left Dark Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-[#131a26] text-white flex flex-col justify-between flex-shrink-0 transition-transform duration-200 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {/* Inverted BBC Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-2">
            <span className="flex items-center gap-[3px]">
              <span className="w-[24px] h-[24px] bg-white text-[#131a26] font-bold text-[14px] flex items-center justify-center leading-none">
                B
              </span>
              <span className="w-[24px] h-[24px] bg-white text-[#131a26] font-bold text-[14px] flex items-center justify-center leading-none">
                B
              </span>
              <span className="w-[24px] h-[24px] bg-white text-[#131a26] font-bold text-[14px] flex items-center justify-center leading-none">
                C
              </span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
              Newsroom
            </span>
          </Link>
          <p className="text-[11px] font-semibold text-slate-400 mb-5">
            Writer Editorial Studio
          </p>

          <Link
            href="/"
            className="w-full mb-3 px-3 py-2 rounded border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/writer/new-post?mode=new"
            className="w-full mb-6 px-4 py-2.5 rounded bg-[#bb1919] hover:bg-[#9d1414] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Post</span>
          </Link>

          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">
            My Stories
          </div>
          <nav className="space-y-1">
            {WRITER_TABS.map((tab) => {
              const isActive = activeTab === tab;
              const count = tabCounts[tab];
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleSelectTab(tab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#212c3f] text-white font-bold border-l-[3px] border-[#bb1919]'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#bb1919] text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Author Quick Link */}
        <div className="p-4 border-t border-slate-800 bg-[#0f1520]">
          <Link
            href={`/author/${encodeURIComponent(
              displayName.toLowerCase().replace(/\s+/g, '-') || String(user.id)
            )}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
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
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:underline">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user.writer_role || 'Staff Writer'}
              </p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded hover:bg-gray-100 text-neutral-700 cursor-pointer"
              aria-label="Open menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#141414]">
                {activeTab}
              </h1>
              <p className="hidden sm:block text-xs text-neutral-500">
                Submit stories for editorial review. Only Admins can publish to BBC News.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/writer/new-post?mode=new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-xs font-bold rounded hover:bg-neutral-800 transition-colors"
            >
              <span>+ Write Article</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 py-1.5 px-2.5 rounded-full border border-gray-200 hover:border-gray-400 bg-white transition-colors cursor-pointer"
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
              <span className="hidden md:inline text-xs font-bold text-neutral-800 max-w-[130px] truncate">
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
        </header>

        {/* Workspace */}
        <main className="p-4 sm:p-8 flex-1">
          {/* Search & Refresh Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded text-sm text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="button"
              onClick={fetchWriterPosts}
              disabled={loadingPosts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              {loadingPosts ? <Spinner className="w-3.5 h-3.5" /> : null}
              <span>Refresh</span>
            </button>
          </div>

          {feedbackError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
              {feedbackError}
            </div>
          )}

          {loadingPosts ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center gap-3 text-sm text-neutral-500">
              <Spinner className="w-6 h-6 text-black" />
              <span>Loading your articles...</span>
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 mb-1.5">
                No articles in {activeTab}
              </h2>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mb-5">
                {activeTab === 'Drafts'
                  ? 'Start writing a new story and save drafts before submitting to the editorial desk.'
                  : activeTab === 'Pending review'
                  ? 'Articles you submit for review appear here while an Admin inspects and approves them.'
                  : activeTab === 'Published'
                  ? 'Once an Admin approves and publishes your submission, it appears live here.'
                  : activeTab === 'Rejected'
                  ? 'Stories returned by an Admin with revision notes will appear here.'
                  : 'Deleted drafts appear here until permanently removed.'}
              </p>
              <Link
                href="/writer/new-post?mode=new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
              >
                Create New Article
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {visiblePosts.map((post) => {
                const thumbSrc = resolveMediaUrl(
                  post.imageUrl || post.image_url,
                  '/hero-lead.jpg'
                );
                const mainCat = post.mainCategory || post.main_category || post.category || 'Uncategorized';
                const subCats = Array.isArray(post.sub_categories)
                  ? post.sub_categories
                  : [];
                const isBusy = busyPostId === post.id;
                const editMode = post.status === 'pending' ? 'edit_pending' : 'edit';

                return (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-24 h-16 sm:w-28 sm:h-[72px] rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <img
                          src={thumbSrc}
                          alt={post.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/hero-lead.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                            {mainCat}
                          </span>
                          {subCats.slice(0, 2).map((sub) => (
                            <span
                              key={sub}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                            >
                              {sub}
                            </span>
                          ))}
                          {post.status === 'published' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Live
                            </span>
                          )}
                          {post.status === 'pending' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              Awaiting Admin Review
                            </span>
                          )}
                          {post.status === 'rejected' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-[#bb1919] border border-red-200">
                              Needs Revision
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141414] leading-snug line-clamp-1">
                          {post.title || 'Untitled Draft'}
                        </h3>

                        {post.subtitle && (
                          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                            {post.subtitle}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500 mt-1.5">
                          <span>
                            {post.status === 'published' ? 'Published' : 'Updated'}{' '}
                            {formatDate(post.published_at || post.updated_at || post.created_at)}
                          </span>
                          {post.status === 'published' && (
                            <span>· {(post.views || 0).toLocaleString()} views</span>
                          )}
                          {post.readDuration || post.read_duration ? (
                            <span>· {post.readDuration || post.read_duration} min read</span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      {post.status === 'published' && (
                        <Link
                          href={`/news/articles/${encodeURIComponent(post.slug || post.id)}`}
                          className="px-3.5 py-2 bg-black text-white text-xs font-bold rounded hover:bg-neutral-800 transition-colors"
                        >
                          View Live
                        </Link>
                      )}

                      {post.status === 'rejected' && (
                        <button
                          type="button"
                          onClick={() => setRejectionModalPost(post)}
                          className="px-3.5 py-2 bg-red-50 text-[#bb1919] border border-red-200 text-xs font-bold rounded hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Reason
                        </button>
                      )}

                      {(post.status === 'draft' ||
                        post.status === 'pending' ||
                        post.status === 'rejected') && (
                        <Link
                          href={`/writer/new-post?mode=${editMode}&id=${encodeURIComponent(
                            post.id
                          )}`}
                          className="px-3.5 py-2 bg-[#00508f] text-white text-xs font-bold rounded hover:bg-blue-900 transition-colors"
                        >
                          {post.status === 'rejected' ? 'Edit & Resubmit' : 'Edit Post'}
                        </Link>
                      )}

                      {(post.status === 'draft' ||
                        post.status === 'pending' ||
                        post.status === 'rejected') && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(post.id, 'trash')}
                          className="px-3 py-2 border border-gray-300 text-xs font-bold text-neutral-700 rounded hover:border-[#bb1919] hover:text-[#bb1919] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isBusy ? 'Moving...' : 'Trash'}
                        </button>
                      )}

                      {post.status === 'trash' && (
                        <>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleStatusChange(post.id, 'draft')}
                            className="px-3.5 py-2 bg-white border border-gray-300 text-xs font-bold text-neutral-800 rounded hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Restore Draft
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setDeleteConfirmPost(post)}
                            className="px-3.5 py-2 bg-[#bb1919] text-white text-xs font-bold rounded hover:bg-[#9d1414] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Delete Permanently
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-[480px] w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-serif font-bold text-[#141414] mb-1">
              Editorial Rejection Note
            </h3>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-1">
              {rejectionModalPost.title}
            </p>
            <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed mb-5">
              {rejectionModalPost.rejection_reason ||
                rejectionModalPost.rejectionReason ||
                'No detailed feedback was recorded by the editorial desk.'}
            </div>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRejectionModalPost(null)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <Link
                href={`/writer/new-post?mode=edit&id=${encodeURIComponent(
                  rejectionModalPost.id
                )}`}
                className="px-4 py-2 bg-[#00508f] text-white rounded text-xs font-bold hover:bg-blue-900"
              >
                Edit &amp; Resubmit
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {deleteConfirmPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-[440px] w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-serif font-bold text-[#141414] mb-2">
              Delete Permanently?
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-5">
              This will permanently remove{' '}
              <strong className="text-black">
                {deleteConfirmPost.title || 'this draft'}
              </strong>{' '}
              from the database. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={Boolean(busyPostId)}
                onClick={() => setDeleteConfirmPost(null)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(busyPostId)}
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-[#bb1919] text-white rounded text-xs font-bold hover:bg-[#9d1414] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {busyPostId ? <Spinner className="w-3.5 h-3.5" /> : null}
                <span>Delete Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        profileData={profileData}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSignOut={handleSignOut}
        onWriterTabSelect={(tab) => {
          if (WRITER_TABS.includes(tab as WriterTab)) {
            handleSelectTab(tab as WriterTab);
          }
        }}
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

export default function WriterDashboardPage() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <WriterDashboardContent />
    </Suspense>
  );
}
