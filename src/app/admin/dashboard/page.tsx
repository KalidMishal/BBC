'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileDrawer from '../../../components/ProfileDrawer';
import ReaderProfileSettingsModal from '../../../components/ReaderProfileSettingsModal';
import { SkeletonPage, Spinner } from '../../../components/Skeletons';
import UsersTab from './UsersTab';
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
import {
  ALL_BBC_SUBCATEGORIES,
  BBC_MAIN_CATEGORIES,
  BBC_PLACEMENTS,
  getPlacementShortLabel,
  getSubcategoriesForMain,
} from '../../../data/editorialConfig';
import { AuthUser, EditorialPost } from '../../../types';

type AdminTabKey =
  | 'overview'
  | 'newsletter'
  | 'publishedPosts'
  | 'users'
  | 'manageAds'
  | 'contactSubmissions'
  | 'advertiseLeads'
  | 'subscriptionRequests'
  | 'databaseBackups'
  | 'shortsReels'
  | 'manageJobs'
  | 'contributorForm';

interface AdminSidebarItem {
  key: AdminTabKey;
  label: string;
  description: string;
}

const ADMIN_NAV_ITEMS: AdminSidebarItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    description: 'Editorial review queue and newsroom operations overview.',
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
    description: 'Scheduled reader briefings and BBC editorial newsletter editions.',
  },
  {
    key: 'publishedPosts',
    label: 'Published Posts',
    description: 'Manage live BBC articles, homepage placements, and category assignments.',
  },
  {
    key: 'users',
    label: 'Users',
    description: 'Administer Reader, Writer, and Admin accounts and editorial roles.',
  },
  {
    key: 'manageAds',
    label: 'Manage Ads',
    description: 'Configure sponsorship slots and commercial campaign placements.',
  },
  {
    key: 'contactSubmissions',
    label: 'Contact Us Submissions',
    description: 'Review incoming reader inquiries and newsroom tips.',
  },
  {
    key: 'advertiseLeads',
    label: 'Advertise Leads',
    description: 'Track commercial advertising inquiries and partner proposals.',
  },
  {
    key: 'subscriptionRequests',
    label: 'Subscription Requests',
    description: 'Review institutional and reader subscription requests.',
  },
  {
    key: 'databaseBackups',
    label: 'Database Backups',
    description: 'Inspect automated snapshots and recovery archives for the bbc database.',
  },
  {
    key: 'shortsReels',
    label: 'Shorts & Reels',
    description: 'Curate vertical video dispatches and Watch highlight reels.',
  },
  {
    key: 'manageJobs',
    label: 'Manage Jobs',
    description: 'Publish editorial, journalism, and engineering openings.',
  },
  {
    key: 'contributorForm',
    label: 'Contributor Form',
    description: 'Review freelance correspondent pitches and guest column applications.',
  },
];

const VALID_TAB_KEYS = new Set<AdminTabKey>(ADMIN_NAV_ITEMS.map((i) => i.key));

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

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');

  // Pending queue state
  const [pendingPosts, setPendingPosts] = useState<EditorialPost[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [pendingError, setPendingError] = useState('');

  // Published posts management state
  const [publishedPosts, setPublishedPosts] = useState<EditorialPost[]>([]);
  const [loadingPublished, setLoadingPublished] = useState(false);
  const [publishedError, setPublishedError] = useState('');
  const [pubSearch, setPubSearch] = useState('');
  const [pubCategory, setPubCategory] = useState('');
  const [pubSubCategory, setPubSubCategory] = useState('');
  const [pubPlacement, setPubPlacement] = useState('');
  const [pubSortByViews, setPubSortByViews] = useState(false);
  const [pubPage, setPubPage] = useState(1);
  const [pubTotal, setPubTotal] = useState(0);
  const [pubTotalLive, setPubTotalLive] = useState(0);
  const [pubTotalPages, setPubTotalPages] = useState(1);

  // Global metrics
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  // Delete published post modal
  const [deletingPost, setDeletingPost] = useState<EditorialPost | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  // Drawer / Settings / Mobile nav
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
    const tabParam = searchParams.get('tab') as AdminTabKey | null;
    if (tabParam && VALID_TAB_KEYS.has(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchPendingPosts = useCallback(async () => {
    if (!getAuthToken()) return;
    setLoadingPending(true);
    setPendingError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/pending-posts`, {
        headers: authHeaders(),
        cache: 'no-store',
      });
      if (res.status === 401) {
        clearAuthSession();
        router.replace('/login?redirect=' + encodeURIComponent('/admin/dashboard'));
        return;
      }
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.posts)) {
        setPendingPosts(data.posts);
      } else {
        setPendingError(data.message || 'Failed to load pending review queue');
      }
    } catch {
      setPendingError('Network error while loading pending review queue');
    } finally {
      setLoadingPending(false);
    }
  }, [router]);

  const fetchPublishedPosts = useCallback(async () => {
    if (!getAuthToken()) return;
    setLoadingPublished(true);
    setPublishedError('');
    try {
      const params = new URLSearchParams({
        page: String(pubPage),
        limit: '15',
      });
      if (pubSearch.trim()) params.set('search', pubSearch.trim());
      if (pubCategory) params.set('category', pubCategory);
      if (pubSubCategory) params.set('subcategory', pubSubCategory);
      if (pubPlacement) params.set('placement', pubPlacement);
      if (pubSortByViews) params.set('sortByViews', 'true');

      const res = await fetch(
        `${API_BASE_URL}/admin/published-posts?${params.toString()}`,
        {
          headers: authHeaders(),
          cache: 'no-store',
        }
      );
      if (res.status === 401) {
        clearAuthSession();
        router.replace('/login?redirect=' + encodeURIComponent('/admin/dashboard'));
        return;
      }
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.posts)) {
        setPublishedPosts(data.posts);
        setPubTotal(Number(data.total ?? data.posts.length));
        setPubTotalLive(Number(data.totalLive ?? data.total ?? 0));
        setPubTotalPages(Number(data.totalPages ?? 1));
      } else {
        setPublishedError(data.message || 'Failed to load published articles');
      }
    } catch {
      setPublishedError('Network error while loading published articles');
    } finally {
      setLoadingPublished(false);
    }
  }, [pubPage, pubSearch, pubCategory, pubSubCategory, pubPlacement, pubSortByViews, router]);

  useEffect(() => {
    const token = getAuthToken();
    const stored = getStoredUser();

    if (!token || !stored) {
      router.replace('/login?redirect=' + encodeURIComponent('/admin/dashboard'));
      return;
    }

    if (stored.role !== 'admin') {
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

    // Sync own profile + dashboard metrics
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

    fetch(`${API_BASE_URL}/admin/users`, {
      headers: authHeaders(),
      cache: 'no-store',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.users)) {
          setTotalUsersCount(data.users.length);
        }
      })
      .catch(() => {});

    fetchPendingPosts();
  }, [router, fetchPendingPosts]);

  // Fetch published posts initially (for live count metric) and whenever filters/page change
  useEffect(() => {
    if (!authChecked) return;
    fetchPublishedPosts();
  }, [authChecked, fetchPublishedPosts]);

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

  const handleSelectTab = (tab: AdminTabKey) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    router.replace(`/admin/dashboard?tab=${tab}`, { scroll: false });
  };

  const handleDeletePublishedPost = async () => {
    if (!deletingPost || isDeletingPost) return;
    setIsDeletingPost(true);
    setPublishedError('');
    try {
      const res = await fetch(
        `${API_BASE_URL}/posts/${encodeURIComponent(deletingPost.id)}`,
        {
          method: 'DELETE',
          headers: authHeaders(),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPublishedError(data.message || 'Failed to delete article');
        setDeletingPost(null);
        return;
      }
      setDeletingPost(null);
      await fetchPublishedPosts();
    } catch {
      setPublishedError('Network error while deleting article');
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleSignOut = () => {
    clearAuthSession();
    router.push('/');
  };

  const availableSubCategories = useMemo(() => {
    if (pubCategory) {
      const scoped = getSubcategoriesForMain(pubCategory);
      return scoped.length > 0 ? scoped : ALL_BBC_SUBCATEGORIES;
    }
    return ALL_BBC_SUBCATEGORIES;
  }, [pubCategory]);

  if (!authChecked || !user) {
    return <SkeletonPage />;
  }

  const activeNavMeta =
    ADMIN_NAV_ITEMS.find((i) => i.key === activeTab) || ADMIN_NAV_ITEMS[0];
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

      {/* Left Dark Editorial Control Sidebar (12 NY Capital Items) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[268px] bg-[#131a26] text-white flex flex-col justify-between flex-shrink-0 transition-transform duration-200 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Inverted BBC 3-box logo */}
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
              Admin Desk
            </span>
          </Link>
          <p className="text-[11px] font-semibold text-slate-400 mb-5">
            BBC Editorial Control Center
          </p>

          <Link
            href="/"
            className="w-full mb-5 px-3 py-2 rounded border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
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

          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">
            Admin Modules
          </div>

          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              const badgeValue =
                item.key === 'overview'
                  ? pendingPosts.length
                  : item.key === 'publishedPosts'
                  ? pubTotalLive
                  : item.key === 'users' && totalUsersCount > 0
                  ? totalUsersCount
                  : null;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSelectTab(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-[13px] font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#212c3f] text-white font-bold border-l-[3px] border-[#bb1919]'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2">{item.label}</span>
                  {badgeValue !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isActive
                          ? 'bg-[#bb1919] text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {badgeValue}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Admin Badge */}
        <div className="p-4 border-t border-slate-800 bg-[#0f1520]">
          <div className="flex items-center gap-3">
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
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {user.is_default_admin ? '★ Default Admin' : 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column */}
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
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[#141414] truncate">
                {activeNavMeta.label}
              </h1>
              <p className="hidden sm:block text-xs text-neutral-500 truncate">
                {activeNavMeta.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/writer/new-post?mode=new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 bg-white text-neutral-800 text-xs font-bold rounded hover:bg-gray-50 transition-colors"
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
        <main className="p-4 sm:p-8 flex-1 space-y-6">
          {/* Metric Summary Cards */}
          {(activeTab === 'overview' || activeTab === 'publishedPosts' || activeTab === 'users') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => handleSelectTab('overview')}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Pending Reviews
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-[#141414]">
                    {pendingPosts.length}
                  </span>
                  <span className="text-[11px] font-bold text-[#bb1919]">
                    Review Queue →
                  </span>
                </div>
              </div>

              <div
                onClick={() => handleSelectTab('publishedPosts')}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Live Published Articles
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-[#141414]">
                    {pubTotalLive}
                  </span>
                  <span className="text-[11px] font-bold text-[#00508f]">
                    Manage Posts →
                  </span>
                </div>
              </div>

              <div
                onClick={() => handleSelectTab('users')}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Registered Users
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-[#141414]">
                    {totalUsersCount}
                  </span>
                  <span className="text-[11px] font-bold text-neutral-700">
                    User Directory →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* OVERVIEW TAB: Pending Review Queue */}
          {activeTab === 'overview' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#141414]">
                    Pending Editorial Review Queue
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Open any submission to inspect formatting, assign BBC categories &amp; homepage placement, and click Approve &amp; Publish.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchPendingPosts}
                  disabled={loadingPending}
                  className="px-3.5 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loadingPending ? <Spinner className="w-3.5 h-3.5" /> : null}
                  <span>Refresh Queue</span>
                </button>
              </div>

              {pendingError && (
                <div className="m-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
                  {pendingError}
                </div>
              )}

              {loadingPending ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-neutral-500">
                  <Spinner className="w-5 h-5 text-black" />
                  <span>Loading pending submissions...</span>
                </div>
              ) : pendingPosts.length === 0 ? (
                <div className="py-14 px-6 text-center">
                  <h3 className="text-base font-bold text-neutral-800 mb-1">
                    No submissions awaiting review
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    All writer submissions have been processed. New articles submitted from Writer Studio will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingPosts.map((post) => {
                    const thumbSrc = resolveMediaUrl(
                      post.imageUrl || post.image_url,
                      '/hero-lead.jpg'
                    );
                    const mainCat =
                      post.mainCategory || post.main_category || post.category || 'Uncategorized';
                    const subCats = Array.isArray(post.sub_categories)
                      ? post.sub_categories
                      : [];
                    const authorLabel =
                      post.authorName || post.author_name || 'Staff Writer';

                    return (
                      <div
                        key={post.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                      >
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-24 h-16 sm:w-28 sm:h-[72px] rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
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
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                Pending Review
                              </span>
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
                            </div>

                            <h3 className="font-serif font-bold text-base sm:text-lg text-[#141414] leading-snug line-clamp-1">
                              {post.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-2 text-xs text-neutral-500 mt-1">
                              <span>
                                By{' '}
                                <Link
                                  href={`/author/${encodeURIComponent(
                                    String(post.author_id || authorLabel)
                                  )}`}
                                  className="font-semibold text-neutral-800 hover:underline"
                                >
                                  {authorLabel}
                                </Link>
                              </span>
                              <span>· Submitted {formatDate(post.updated_at || post.created_at)}</span>
                              {post.readDuration || post.read_duration ? (
                                <span>· {post.readDuration || post.read_duration} min read</span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            href={`/admin/review-post/${encodeURIComponent(post.id)}`}
                            className="px-5 py-2.5 bg-[#bb1919] hover:bg-[#9d1414] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-colors"
                          >
                            OPEN
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PUBLISHED POSTS TAB */}
          {activeTab === 'publishedPosts' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 space-y-5">
              {/* Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={pubSearch}
                  onChange={(e) => {
                    setPubSearch(e.target.value);
                    setPubPage(1);
                  }}
                  placeholder="Search headline or author..."
                  className="border border-gray-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />

                <select
                  value={pubCategory}
                  onChange={(e) => {
                    setPubCategory(e.target.value);
                    setPubSubCategory('');
                    setPubPage(1);
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-xs text-neutral-900 bg-white focus:outline-none focus:border-black"
                >
                  <option value="">All Main Categories</option>
                  {BBC_MAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={pubSubCategory}
                  onChange={(e) => {
                    setPubSubCategory(e.target.value);
                    setPubPage(1);
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-xs text-neutral-900 bg-white focus:outline-none focus:border-black"
                >
                  <option value="">All Sub-Categories</option>
                  {availableSubCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>

                <select
                  value={pubPlacement}
                  onChange={(e) => {
                    setPubPlacement(e.target.value);
                    setPubPage(1);
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-xs text-neutral-900 bg-white focus:outline-none focus:border-black"
                >
                  <option value="">All Homepage Placements</option>
                  {BBC_PLACEMENTS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPubSortByViews((v) => !v);
                      setPubPage(1);
                    }}
                    className={`flex-1 px-3 py-2 rounded text-xs font-bold border transition-colors cursor-pointer ${
                      pubSortByViews
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pubSortByViews ? '↓ By Views' : 'Sort: Views'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPubSearch('');
                      setPubCategory('');
                      setPubSubCategory('');
                      setPubPlacement('');
                      setPubSortByViews(false);
                      setPubPage(1);
                    }}
                    className="px-3 py-2 rounded text-xs font-bold border border-gray-300 text-neutral-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {publishedError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
                  {publishedError}
                </div>
              )}

              {loadingPublished ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-neutral-500">
                  <Spinner className="w-5 h-5 text-black" />
                  <span>Loading published BBC articles...</span>
                </div>
              ) : publishedPosts.length === 0 ? (
                <div className="py-10 text-center text-xs text-neutral-500">
                  No published articles match your filter criteria.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {publishedPosts.map((post) => {
                    const thumbSrc = resolveMediaUrl(
                      post.imageUrl || post.image_url,
                      '/hero-lead.jpg'
                    );
                    const mainCat =
                      post.mainCategory || post.main_category || post.category || 'World News';
                    const placementKey = post.placement || post.section_key || 'archive';
                    const articleHref = `/news/articles/${encodeURIComponent(
                      post.slug || post.id
                    )}`;

                    return (
                      <div
                        key={post.id}
                        className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className="w-20 h-14 rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
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
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                                {mainCat}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#00508f] border border-blue-200">
                                {getPlacementShortLabel(placementKey)}
                              </span>
                            </div>

                            <Link href={articleHref}>
                              <h3 className="font-serif font-bold text-base text-[#141414] hover:underline line-clamp-1">
                                {post.title}
                              </h3>
                            </Link>

                            <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-neutral-500 mt-1">
                              <span>
                                By{' '}
                                <strong className="text-neutral-700">
                                  {post.authorName || post.author_name || 'BBC News Staff'}
                                </strong>
                              </span>
                              <span>· {(post.views || 0).toLocaleString()} views</span>
                              <span>· Published {formatDate(post.published_at || post.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            href={articleHref}
                            className="px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold text-neutral-700 hover:bg-gray-50"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/review-post/${encodeURIComponent(post.id)}`}
                            className="px-3 py-1.5 bg-[#00508f] text-white rounded text-[11px] font-bold hover:bg-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeletingPost(post)}
                            className="px-3 py-1.5 bg-red-50 text-[#bb1919] border border-red-200 rounded text-[11px] font-bold hover:bg-red-100 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {pubTotalPages > 1 && (
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">
                    Showing page {pubPage} of {pubTotalPages} ({pubTotal} results)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={pubPage <= 1}
                      onClick={() => setPubPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 border border-gray-300 rounded font-bold disabled:opacity-40 cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={pubPage >= pubTotalPages}
                      onClick={() => setPubPage((p) => Math.min(pubTotalPages, p + 1))}
                      className="px-3 py-1.5 border border-gray-300 rounded font-bold disabled:opacity-40 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <UsersTab
              currentUser={user}
              onUsersCountChange={(cnt) => setTotalUsersCount(cnt)}
            />
          )}

          {/* 9 MODULES COMING SOON PLACEHOLDERS */}
          {activeTab !== 'overview' &&
            activeTab !== 'publishedPosts' &&
            activeTab !== 'users' && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-4">
                  BBC Module Placeholder
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#141414] mb-2">
                  {activeNavMeta.label} — Coming Soon
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {activeNavMeta.description} This workspace slot is reserved for upcoming BBC Clone enhancements.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectTab('overview')}
                  className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Return to Overview
                </button>
              </div>
            )}
        </main>
      </div>

      {/* Delete Published Article Confirmation */}
      {deletingPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-[440px] w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-serif font-bold text-[#141414] mb-2">
              Delete Published Article?
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-5">
              This will permanently remove{' '}
              <strong className="text-black">{deletingPost.title}</strong> from the live website and database.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingPost}
                onClick={() => setDeletingPost(null)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingPost}
                onClick={handleDeletePublishedPost}
                className="px-4 py-2 bg-[#bb1919] text-white rounded text-xs font-bold hover:bg-[#9d1414] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isDeletingPost ? <Spinner className="w-3.5 h-3.5" /> : null}
                <span>Delete Article</span>
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
        onAdminTabSelect={(tabKey) => {
          if (VALID_TAB_KEYS.has(tabKey as AdminTabKey)) {
            handleSelectTab(tabKey as AdminTabKey);
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

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
