'use client';

import React, { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Bookmark,
  CircleUserRound,
  Headphones,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react';
import AudioPlayerBar from '../../../components/AudioPlayerBar';
import ProfileDrawer from '../../../components/ProfileDrawer';
import ReaderProfileSettingsModal from '../../../components/ReaderProfileSettingsModal';
import { SkeletonPage, SkeletonArticleCard, Spinner } from '../../../components/Skeletons';
import { API_BASE_URL, resolveMediaUrl } from '../../../lib/api';
import {
  authHeaders,
  clearAuthSession,
  getAuthToken,
  getDisplayName,
  getRoleDashboardPath,
  getStoredUser,
  saveAuthSession,
  updateStoredUser,
} from '../../../lib/auth';
import { fetchSavedPodcasts, toggleSavedPodcast } from '../../../lib/savedPodcasts';
import { getCategorySlugByName } from '../../../data/editorialConfig';
import {
  listenNowEpisodes,
  listenNowFeaturedPodcast,
} from '../../../data/bbcData';
import { AuthUser, BookmarkItem, PodcastItem } from '../../../types';

type ReaderTab = 'SAVED' | 'PODCASTS' | 'PERSONAL_SETTINGS';
type EditingField =
  | 'email'
  | 'password'
  | 'displayName'
  | 'country'
  | 'contactNumber'
  | 'deleteAccount'
  | null;

const COUNTRY_OPTIONS = [
  'Sri Lanka',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'India',
  'Singapore',
  'United Arab Emirates',
  'Germany',
  'France',
  'Japan',
  'New Zealand',
  'South Africa',
];

const OTHER_COUNTRY_OPTION = 'Other';

function ReaderDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<ReaderTab>('SAVED');

  // Modals / Drawers / Audio Player
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);

  // Saved Articles state
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  // Saved Podcasts state
  const [savedPodcasts, setSavedPodcasts] = useState<PodcastItem[]>([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);
  const [busyPodcastId, setBusyPodcastId] = useState<string | null>(null);

  // Personal Settings inline edit states
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Inline edit form values
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [displayNameDraft, setDisplayNameDraft] = useState('');
  const [countryDraft, setCountryDraft] = useState('Sri Lanka');
  const [customCountryDraft, setCustomCountryDraft] = useState('');
  const [contactNumberDraft, setContactNumberDraft] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoLoadError, setPhotoLoadError] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Sync URL query param ?tab=
  useEffect(() => {
    const tabParam = (searchParams.get('tab') || '').toLowerCase();
    Promise.resolve().then(() => {
      if (tabParam === 'podcasts' || tabParam === 'saved-podcasts' || tabParam === 'feed') {
        setActiveTab('PODCASTS');
      } else if (
        tabParam === 'personal-settings' ||
        tabParam === 'profile-settings' ||
        tabParam === 'account' ||
        tabParam === 'settings'
      ) {
        setActiveTab('PERSONAL_SETTINGS');
      } else if (tabParam === 'saved' || tabParam === 'saved-articles') {
        setActiveTab('SAVED');
      }
    });
  }, [searchParams]);

  const fetchBookmarks = useCallback(async () => {
    if (!getAuthToken()) return;
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

  const loadPodcasts = useCallback(async () => {
    try {
      const items = await fetchSavedPodcasts();
      setSavedPodcasts(items);
    } finally {
      setLoadingPodcasts(false);
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

    Promise.resolve().then(() => {
      const initialCountry = (stored.country || '').trim();
      setUser(stored);
      setDisplayNameDraft(stored.fullName || stored.name || '');
      if (initialCountry && !COUNTRY_OPTIONS.includes(initialCountry)) {
        setCountryDraft(OTHER_COUNTRY_OPTION);
        setCustomCountryDraft(initialCountry);
      } else {
        setCountryDraft(initialCountry || 'Sri Lanka');
        setCustomCountryDraft('');
      }
      setContactNumberDraft(stored.contact_number || '');
      setAuthChecked(true);
    });

    fetch(`${API_BASE_URL}/users/${stored.id}`, {
      headers: authHeaders(),
      cache: 'no-store',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.user) {
          const updated = updateStoredUser({
            email: data.user.email || stored.email,
            name: data.user.name || data.user.fullName || '',
            fullName: data.user.fullName ?? data.user.name ?? null,
            bio: data.user.bio ?? '',
            profile_picture: data.user.profile_picture ?? '',
            linkedin_url: data.user.linkedin_url ?? '',
            country: data.user.country ?? null,
            contact_number: data.user.contact_number ?? null,
          });
          if (updated) {
            const loadedCountry = (updated.country || '').trim();
            setUser(updated);
            setDisplayNameDraft(updated.fullName || updated.name || '');
            if (loadedCountry && !COUNTRY_OPTIONS.includes(loadedCountry)) {
              setCountryDraft(OTHER_COUNTRY_OPTION);
              setCustomCountryDraft(loadedCountry);
            } else {
              setCountryDraft(loadedCountry || 'Sri Lanka');
              setCustomCountryDraft('');
            }
            setContactNumberDraft(updated.contact_number || '');
          }
        }
      })
      .catch(() => {});

    Promise.resolve().then(() => {
      void fetchBookmarks();
      void loadPodcasts();
    });
  }, [router, fetchBookmarks, loadPodcasts]);

  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredUser();
      if (updated) {
        setUser(updated);
      }
    };
    const handlePodcastSync = () => {
      loadPodcasts();
    };
    window.addEventListener('userProfileUpdated', handleSync);
    window.addEventListener('savedPodcastsUpdated', handlePodcastSync);
    return () => {
      window.removeEventListener('userProfileUpdated', handleSync);
      window.removeEventListener('savedPodcastsUpdated', handlePodcastSync);
    };
  }, [loadPodcasts]);

  const switchTab = (tab: ReaderTab) => {
    setActiveTab(tab);
    setEditingField(null);
    setSettingsFeedback(null);
    const param =
      tab === 'PODCASTS'
        ? 'podcasts'
        : tab === 'PERSONAL_SETTINGS'
        ? 'personal-settings'
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

  const handleTogglePodcast = async (podcast: PodcastItem) => {
    if (!podcast?.id || busyPodcastId) return;
    setBusyPodcastId(podcast.id);
    try {
      const { podcasts } = await toggleSavedPodcast(podcast);
      setSavedPodcasts(podcasts);
    } finally {
      setBusyPodcastId(null);
    }
  };

  const openEditor = (field: EditingField) => {
    setSettingsFeedback(null);
    setEditingField(field);
    if (field === 'email') {
      setNewEmail(user?.email || '');
      setEmailPassword('');
    } else if (field === 'password') {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else if (field === 'displayName') {
      setDisplayNameDraft(user?.fullName || user?.name || '');
    } else if (field === 'country') {
      const savedCountry = (user?.country || '').trim();
      if (savedCountry && !COUNTRY_OPTIONS.includes(savedCountry)) {
        setCountryDraft(OTHER_COUNTRY_OPTION);
        setCustomCountryDraft(savedCountry);
      } else {
        setCountryDraft(savedCountry || 'Sri Lanka');
        setCustomCountryDraft('');
      }
    } else if (field === 'contactNumber') {
      setContactNumberDraft(user?.contact_number || '');
    } else if (field === 'deleteAccount') {
      setDeletePassword('');
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || settingsSaving) return;
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setSettingsFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (!emailPassword) {
      setSettingsFeedback({ type: 'error', text: 'Enter your current password to confirm.' });
      return;
    }

    setSettingsSaving(true);
    setSettingsFeedback(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/email`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          email: newEmail.trim().toLowerCase(),
          currentPassword: emailPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSettingsFeedback({
          type: 'error',
          text: data.message || 'Unable to update email address.',
        });
        return;
      }
      saveAuthSession(data.token, data.user);
      setUser(data.user);
      setEditingField(null);
      setEmailPassword('');
      setSettingsFeedback({ type: 'success', text: 'Email address updated.' });
    } catch {
      setSettingsFeedback({ type: 'error', text: 'Network error while updating email.' });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || settingsSaving) return;
    if (!currentPassword || !newPassword) {
      setSettingsFeedback({ type: 'error', text: 'Fill in both current and new passwords.' });
      return;
    }
    if (newPassword.length < 6) {
      setSettingsFeedback({
        type: 'error',
        text: 'New password must be at least 6 characters.',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSettingsFeedback({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setSettingsSaving(true);
    setSettingsFeedback(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/password`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSettingsFeedback({
          type: 'error',
          text: data.message || 'Unable to update password.',
        });
        return;
      }
      setEditingField(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setSettingsFeedback({ type: 'success', text: 'Password updated successfully.' });
    } catch {
      setSettingsFeedback({ type: 'error', text: 'Network error while updating password.' });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || settingsSaving) return;
    setSettingsSaving(true);
    setSettingsFeedback(null);

    try {
      const trimmedName = displayNameDraft.trim();
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ name: trimmedName }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSettingsFeedback({
          type: 'error',
          text: data.message || 'Unable to save display name.',
        });
        return;
      }
      const nextUser = updateStoredUser({
        name: trimmedName,
        fullName: trimmedName || null,
      });
      if (nextUser) setUser(nextUser);
      setEditingField(null);
      setSettingsFeedback({
        type: 'success',
        text: trimmedName ? 'Display name updated.' : 'Display name cleared.',
      });
    } catch {
      setSettingsFeedback({
        type: 'error',
        text: 'Network error while updating display name.',
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || settingsSaving) return;

    const trimmedCountry = (
      countryDraft === OTHER_COUNTRY_OPTION ? customCountryDraft : countryDraft
    ).trim();

    if (!trimmedCountry) {
      setSettingsFeedback({
        type: 'error',
        text: 'Please type your country of residence.',
      });
      return;
    }

    setSettingsSaving(true);
    setSettingsFeedback(null);

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ country: trimmedCountry }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSettingsFeedback({
          type: 'error',
          text: data.message || 'Unable to save country of residence.',
        });
        return;
      }
      const nextUser = updateStoredUser({
        country: trimmedCountry || null,
      });
      if (nextUser) setUser(nextUser);
      setEditingField(null);
      setSettingsFeedback({ type: 'success', text: 'Country of residence updated.' });
    } catch {
      setSettingsFeedback({
        type: 'error',
        text: 'Network error while updating country of residence.',
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSaveContactNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || settingsSaving) return;

    const trimmedContact = contactNumberDraft.trim();
    if (trimmedContact) {
      const digitCount = (trimmedContact.match(/\d/g) || []).length;
      if (!/^[+\d\s().-]{6,30}$/.test(trimmedContact) || digitCount < 6) {
        setSettingsFeedback({
          type: 'error',
          text: 'Please enter a valid contact number (at least 6 digits), or leave blank to clear.',
        });
        return;
      }
    }

    setSettingsSaving(true);
    setSettingsFeedback(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ contact_number: trimmedContact }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSettingsFeedback({
          type: 'error',
          text: data.message || 'Unable to save contact number.',
        });
        return;
      }
      const nextUser = updateStoredUser({
        contact_number: trimmedContact || null,
      });
      if (nextUser) setUser(nextUser);
      setEditingField(null);
      setSettingsFeedback({
        type: 'success',
        text: trimmedContact ? 'Contact number updated.' : 'Contact number removed.',
      });
    } catch {
      setSettingsFeedback({
        type: 'error',
        text: 'Network error while updating contact number.',
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;

    setUploadingPhoto(true);
    setSettingsFeedback(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onerror = () => {
        setUploadingPhoto(false);
        setSettingsFeedback({
          type: 'error',
          text: 'Selected file could not be read as an image.',
        });
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 320;
        const MAX_HEIGHT = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const persistPhotoUrl = async (photoUrl: string) => {
          const saveRes = await fetch(`${API_BASE_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ profile_picture: photoUrl }),
          });
          const saveData = await saveRes.json();
          if (!saveRes.ok || !saveData.success) {
            setSettingsFeedback({
              type: 'error',
              text: saveData.message || 'Photo uploaded but failed to save to profile.',
            });
            return;
          }

          setPhotoLoadError(false);
          const nextUser = updateStoredUser({
            profile_picture: photoUrl,
          });
          if (nextUser) setUser(nextUser);

          try {
            const cachedKey = `userProfile_${user.email}`;
            const rawCached = sessionStorage.getItem(cachedKey);
            const parsedCached = rawCached ? JSON.parse(rawCached) : {};
            sessionStorage.setItem(
              cachedKey,
              JSON.stringify({ ...parsedCached, photo: photoUrl })
            );
          } catch {
            // Ignore session storage errors
          }

          setSettingsFeedback({ type: 'success', text: 'Profile photo updated.' });
        };

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              setUploadingPhoto(false);
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
                await persistPhotoUrl(data.url);
              } else {
                const fallbackDataUrl = canvas.toDataURL('image/webp', 0.85);
                await persistPhotoUrl(fallbackDataUrl);
              }
            } catch {
              try {
                const fallbackDataUrl = canvas.toDataURL('image/webp', 0.85);
                await persistPhotoUrl(fallbackDataUrl);
              } catch {
                setSettingsFeedback({
                  type: 'error',
                  text: 'Network error during photo upload.',
                });
              }
            } finally {
              setUploadingPhoto(false);
            }
          },
          'image/webp',
          0.88
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || settingsSaving) return;
    if (!deletePassword) {
      setSettingsFeedback({
        type: 'error',
        text: 'Enter your password to permanently delete your account.',
      });
      return;
    }

    setSettingsSaving(true);
    setSettingsFeedback(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSettingsFeedback({
          type: 'error',
          text: data.message || 'Failed to delete account.',
        });
        return;
      }
      clearAuthSession();
      router.replace('/');
    } catch {
      setSettingsFeedback({
        type: 'error',
        text: 'Network error while deleting account.',
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSignOut = () => {
    clearAuthSession();
    router.push('/');
  };

  if (!authChecked || !user) {
    return <SkeletonPage />;
  }

  const displayName = getDisplayName(user);
  const avatarPhoto = resolveMediaUrl(user.profile_picture);
  const storedDisplayName = (user.fullName || user.name || '').trim();
  const storedCountry = (user.country || '').trim();
  const storedContactNumber = (user.contact_number || '').trim();
  const savedPodcastIds = new Set(savedPodcasts.map((p) => p.id));
  const recommendedPodcasts = [listenNowFeaturedPodcast, ...listenNowEpisodes];

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans text-[#141414]">
      {/* Single Top Header Bar: centered Reader Dashboard heading + Profile pill on right */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e0e0e0]">
        <div className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-[76px] flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0" aria-hidden="true" />
          <h1 className="text-[20px] sm:text-[32px] font-bold tracking-tight text-[#141414] text-center whitespace-nowrap shrink-0">
            Reader Dashboard
          </h1>

          <div className="flex-1 min-w-0 flex justify-end">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 sm:gap-2.5 p-1 sm:pl-1.5 sm:pr-3 sm:py-1 rounded-full border border-neutral-200 hover:border-neutral-400 bg-white transition cursor-pointer"
              aria-label="Open account menu"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-neutral-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {avatarPhoto && !photoLoadError ? (
                  <img
                    src={avatarPhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setPhotoLoadError(true)}
                  />
                ) : (
                  <span>{displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-neutral-900 max-w-[90px] md:max-w-[130px] truncate">
                {displayName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 hidden lg:inline">
                {user.role}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Settings-Format Container */}
      <main className="flex-1 w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-9">
        <div className="flex flex-col md:flex-row items-start">
          {/* Left Vertical Sidebar */}
          <nav
            aria-label="Reader dashboard sections"
            className="w-full md:w-[270px] lg:w-[300px] shrink-0 flex flex-col mb-4 md:mb-0"
          >
            <button
              type="button"
              onClick={() => switchTab('SAVED')}
              className={`w-full text-left px-5 py-4 flex items-center gap-3.5 text-[15px] border-b border-[#d4d4d4] transition-colors cursor-pointer ${
                activeTab === 'SAVED'
                  ? 'relative z-10 bg-white text-[#141414] font-bold border-l-[4px] border-l-[#005fcc]'
                  : 'bg-[#f4f4f4] hover:bg-white/70 text-[#005fcc] font-semibold border-l-[4px] border-l-transparent'
              }`}
            >
              <Bookmark
                className={`w-[18px] h-[18px] shrink-0 ${
                  activeTab === 'SAVED' ? 'text-[#4a4a4a]' : 'text-[#005fcc]'
                }`}
              />
              <span>Saved Articles</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab('PODCASTS')}
              className={`w-full text-left px-5 py-4 flex items-center gap-3.5 text-[15px] border-b border-[#d4d4d4] transition-colors cursor-pointer ${
                activeTab === 'PODCASTS'
                  ? 'relative z-10 bg-white text-[#141414] font-bold border-l-[4px] border-l-[#005fcc]'
                  : 'bg-[#f4f4f4] hover:bg-white/70 text-[#005fcc] font-semibold border-l-[4px] border-l-transparent'
              }`}
            >
              <Headphones
                className={`w-[18px] h-[18px] shrink-0 ${
                  activeTab === 'PODCASTS' ? 'text-[#4a4a4a]' : 'text-[#005fcc]'
                }`}
              />
              <span>Saved Podcasts</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab('PERSONAL_SETTINGS')}
              className={`w-full text-left px-5 py-4 flex items-center gap-3.5 text-[15px] border-b border-[#d4d4d4] transition-colors cursor-pointer ${
                activeTab === 'PERSONAL_SETTINGS'
                  ? 'relative z-10 bg-white text-[#141414] font-bold border-l-[4px] border-l-[#005fcc]'
                  : 'bg-[#f4f4f4] hover:bg-white/70 text-[#005fcc] font-semibold border-l-[4px] border-l-transparent'
              }`}
            >
              <CircleUserRound
                className={`w-[19px] h-[19px] shrink-0 ${
                  activeTab === 'PERSONAL_SETTINGS' ? 'text-[#4a4a4a]' : 'text-[#005fcc]'
                }`}
              />
              <span>Personal Settings</span>
            </button>
          </nav>

          {/* Right White Content Panel */}
          <section className="flex-1 w-full bg-white p-6 sm:p-10 md:p-11 shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-h-[500px]">
            {/* TAB 1: SAVED ARTICLES */}
            {activeTab === 'SAVED' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
                  <div>
                    <h2 className="text-[26px] sm:text-[30px] font-bold text-[#141414] leading-tight">
                      Saved Articles
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      Stories you bookmarked from across BBC News ({bookmarks.length}).
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
                  >
                    Browse Latest News
                  </Link>
                </div>

                {loadingBookmarks ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <SkeletonArticleCard />
                    <SkeletonArticleCard />
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="border border-neutral-200 bg-[#fafafa] p-10 text-center">
                    <div className="w-11 h-11 mx-auto mb-3.5 rounded-full bg-neutral-200/70 flex items-center justify-center text-neutral-600">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#141414] mb-1.5">
                      No saved articles yet
                    </h3>
                    <p className="text-sm text-neutral-600 max-w-md mx-auto mb-5">
                      Open any story and click Save next to the byline to keep it here for reading later.
                    </p>
                    <Link
                      href="/"
                      className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      Discover Top Stories
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookmarks.map((item) => {
                      const articleHref = `/news/articles/${encodeURIComponent(item.slug)}`;
                      const catName = item.category || 'World News';
                      const catHref = `/${getCategorySlugByName(catName)}`;
                      const thumbSrc = resolveMediaUrl(item.image, '/hero-lead.jpg');

                      return (
                        <article
                          key={item.slug}
                          className="border border-neutral-200 bg-white overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                          <div>
                            <Link
                              href={articleHref}
                              className="block aspect-[16/9] bg-neutral-100 overflow-hidden"
                            >
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

                          <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
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
                              className="text-xs font-bold text-[#005fcc] hover:text-[#bb1919] hover:underline transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
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

            {/* TAB 2: SAVED PODCASTS */}
            {activeTab === 'PODCASTS' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
                  <div>
                    <h2 className="text-[26px] sm:text-[30px] font-bold text-[#141414] leading-tight">
                      Saved Podcasts
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      Episodes and briefings saved from BBC Listen Now ({savedPodcasts.length}).
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
                  >
                    Browse Audio
                  </Link>
                </div>

                {loadingPodcasts ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <SkeletonArticleCard />
                    <SkeletonArticleCard />
                  </div>
                ) : savedPodcasts.length === 0 ? (
                  <div className="border border-neutral-200 bg-[#fafafa] p-8 text-center mb-8">
                    <div className="w-11 h-11 mx-auto mb-3.5 rounded-full bg-neutral-200/70 flex items-center justify-center text-neutral-600">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#141414] mb-1.5">
                      No saved podcasts yet
                    </h3>
                    <p className="text-sm text-neutral-600 max-w-md mx-auto">
                      Click Save on any podcast in Listen Now on the home page—or save one of the episodes below—to build your listening queue.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-10">
                    {savedPodcasts.map((pod) => (
                      <div
                        key={pod.id}
                        className="border border-neutral-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="relative w-full sm:w-32 aspect-[16/10] bg-neutral-900 overflow-hidden shrink-0">
                          <img
                            src={resolveMediaUrl(pod.imageUrl, '/listen-global-briefing.jpg')}
                            alt={pod.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/listen-global-briefing.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            {pod.category || pod.badge || 'BBC PODCAST'}
                            {pod.episodeDuration ? ` · ${pod.episodeDuration}` : ''}
                          </div>
                          <h3 className="font-serif font-bold text-lg text-[#141414] leading-snug mt-0.5">
                            {pod.title}
                          </h3>
                          {(pod.subtitle || pod.summary) && (
                            <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                              {pod.subtitle || pod.summary}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setActivePodcast(pod)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Listen Now</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePodcast(pod)}
                            disabled={busyPodcastId === pod.id}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#005fcc] hover:text-[#bb1919] hover:underline cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{busyPodcastId === pod.id ? 'Removing...' : 'Remove'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Discover / Quick-Save BBC Podcasts */}
                <div className="pt-5 border-t border-neutral-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 mb-4">
                    Recommended BBC Podcasts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedPodcasts.map((pod) => {
                      const isSaved = savedPodcastIds.has(pod.id);
                      return (
                        <div
                          key={pod.id}
                          className="border border-neutral-200 p-3.5 flex items-center gap-3.5 bg-[#fafafa]"
                        >
                          <img
                            src={pod.imageUrl}
                            alt={pod.title}
                            className="w-16 h-12 object-cover bg-neutral-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 truncate">
                              {pod.category || 'PODCAST'}
                            </div>
                            <h4 className="font-bold text-sm text-[#141414] truncate">
                              {pod.title}
                            </h4>
                            <div className="text-[11px] text-neutral-500">
                              {pod.episodeDuration || '25 mins'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setActivePodcast(pod)}
                              aria-label={`Play ${pod.title}`}
                              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePodcast(pod)}
                              disabled={busyPodcastId === pod.id}
                              className={`text-xs font-bold px-2.5 py-1.5 border transition-colors cursor-pointer ${
                                isSaved
                                  ? 'border-[#bb1919] bg-red-50 text-[#bb1919]'
                                  : 'border-neutral-300 bg-white text-[#005fcc] hover:border-[#005fcc]'
                              }`}
                            >
                              {isSaved ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PERSONAL SETTINGS (matches reference screenshot layout) */}
            {activeTab === 'PERSONAL_SETTINGS' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-[28px] sm:text-[34px] font-serif font-bold text-[#0f172a] tracking-tight leading-tight mb-1.5">
                    Personal Settings
                  </h2>
                  <p className="text-[11.5px] sm:text-[12px] font-bold text-[#7c8594] uppercase tracking-[0.12em] mb-6">
                    Manage Your Account
                  </p>

                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      aria-label="Change profile photo"
                      className="w-[78px] h-[78px] sm:w-[86px] sm:h-[86px] rounded-full overflow-hidden bg-neutral-900 text-white shadow-sm border border-gray-200 flex items-center justify-center font-bold text-2xl shrink-0 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {avatarPhoto && !photoLoadError ? (
                        <img
                          src={avatarPhoto}
                          alt={displayName}
                          onError={() => setPhotoLoadError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{displayName.charAt(0).toUpperCase()}</span>
                      )}
                    </button>

                    <div className="flex flex-col items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="text-[16px] sm:text-[17px] font-bold text-[#1a65d6] hover:text-[#00499e] hover:underline leading-tight cursor-pointer disabled:opacity-60"
                      >
                        {uploadingPhoto ? 'Uploading photo...' : 'Change photo'}
                      </button>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <span className="inline-block bg-[#eef5ff] text-[#1a65d6] text-[11px] sm:text-[12px] font-bold px-2.5 py-1 rounded uppercase tracking-[0.08em] leading-none">
                        Reader
                      </span>
                    </div>
                  </div>
                </div>

                {settingsFeedback && (
                  <div
                    className={`mb-6 w-full p-3 text-xs font-semibold border ${
                      settingsFeedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {settingsFeedback.text}
                  </div>
                )}

                <div className="w-full space-y-6">
                  {/* Email */}
                  <div>
                    <div className="text-xs text-[#555555] mb-1">Email</div>
                    {editingField === 'email' ? (
                      <form
                        onSubmit={handleSaveEmail}
                        className="p-4 border border-neutral-300 bg-[#fafafa] space-y-3"
                      >
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            New email address
                          </label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            Current password
                          </label>
                          <input
                            type="password"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-4 py-2 bg-[#005fcc] hover:bg-[#00499e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {settingsSaving ? <Spinner className="w-3 h-3" /> : null}
                            <span>Save email</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 text-xs font-bold text-neutral-700 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-baseline justify-between gap-4 border-b border-[#767676] pb-1.5">
                        <span className="text-[18px] sm:text-[19px] text-[#141414] truncate">
                          {user.email}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditor('email')}
                          className="text-sm font-bold text-[#005fcc] hover:underline inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>Edit</span>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="text-xs text-[#555555] mb-1">Password</div>
                    {editingField === 'password' ? (
                      <form
                        onSubmit={handleSavePassword}
                        className="p-4 border border-neutral-300 bg-[#fafafa] space-y-3"
                      >
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            Current password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            New password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            Confirm new password
                          </label>
                          <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-4 py-2 bg-[#005fcc] hover:bg-[#00499e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {settingsSaving ? <Spinner className="w-3 h-3" /> : null}
                            <span>Save password</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 text-xs font-bold text-neutral-700 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-baseline justify-between gap-4 border-b border-[#767676] pb-1.5">
                        <span className="text-[18px] sm:text-[19px] tracking-[0.16em] text-[#141414]">
                          ••••••••
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditor('password')}
                          className="text-sm font-bold text-[#005fcc] hover:underline inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>Edit</span>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Display name */}
                  <div>
                    <div className="text-xs text-[#555555] mb-1">Display name</div>
                    {editingField === 'displayName' ? (
                      <form
                        onSubmit={handleSaveDisplayName}
                        className="p-4 border border-neutral-300 bg-[#fafafa] space-y-3"
                      >
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            Display name
                          </label>
                          <input
                            type="text"
                            value={displayNameDraft}
                            onChange={(e) => setDisplayNameDraft(e.target.value)}
                            placeholder="Enter display name"
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-4 py-2 bg-[#005fcc] hover:bg-[#00499e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {settingsSaving ? <Spinner className="w-3 h-3" /> : null}
                            <span>Save name</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 text-xs font-bold text-neutral-700 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-baseline justify-between gap-4 border-b border-[#767676] pb-1.5">
                        <span className="text-[18px] sm:text-[19px] text-[#141414] truncate">
                          {storedDisplayName || 'None set'}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditor('displayName')}
                          className="text-sm font-bold text-[#005fcc] hover:underline inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>{storedDisplayName ? 'Edit' : 'Add'}</span>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Country of residence */}
                  <div>
                    <div className="text-xs text-[#555555] mb-1">Country of residence</div>
                    {editingField === 'country' ? (
                      <form
                        onSubmit={handleSaveCountry}
                        className="p-4 border border-neutral-300 bg-[#fafafa] space-y-3"
                      >
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            Select country
                          </label>
                          <select
                            value={countryDraft}
                            onChange={(e) => {
                              const nextVal = e.target.value;
                              setCountryDraft(nextVal);
                              if (nextVal !== OTHER_COUNTRY_OPTION) {
                                setCustomCountryDraft('');
                              }
                            }}
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          >
                            {COUNTRY_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                            <option value={OTHER_COUNTRY_OPTION}>Other</option>
                          </select>
                        </div>
                        {countryDraft === OTHER_COUNTRY_OPTION && (
                          <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                              Enter your country
                            </label>
                            <input
                              type="text"
                              value={customCountryDraft}
                              onChange={(e) => setCustomCountryDraft(e.target.value)}
                              placeholder="Type your country name"
                              required
                              className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-4 py-2 bg-[#005fcc] hover:bg-[#00499e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {settingsSaving ? <Spinner className="w-3 h-3" /> : null}
                            <span>Save country</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 text-xs font-bold text-neutral-700 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-baseline justify-between gap-4 border-b border-[#767676] pb-1.5">
                        <span className="text-[18px] sm:text-[19px] text-[#141414] truncate">
                          {storedCountry || 'Sri Lanka'}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditor('country')}
                          className="text-sm font-bold text-[#005fcc] hover:underline inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>Edit</span>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <div className="text-xs text-[#555555] mb-1">Contact Number</div>
                    {editingField === 'contactNumber' ? (
                      <form
                        onSubmit={handleSaveContactNumber}
                        className="p-4 border border-neutral-300 bg-[#fafafa] space-y-3"
                      >
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            Contact Number
                          </label>
                          <input
                            type="tel"
                            value={contactNumberDraft}
                            onChange={(e) => setContactNumberDraft(e.target.value)}
                            placeholder="e.g. +94 77 123 4567"
                            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#005fcc]"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-4 py-2 bg-[#005fcc] hover:bg-[#00499e] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {settingsSaving ? <Spinner className="w-3 h-3" /> : null}
                            <span>Save contact number</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 text-xs font-bold text-neutral-700 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-baseline justify-between gap-4 border-b border-[#767676] pb-1.5">
                        <span className="text-[18px] sm:text-[19px] text-[#141414] truncate">
                          {storedContactNumber || 'None set'}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditor('contactNumber')}
                          className="text-sm font-bold text-[#005fcc] hover:underline inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>{storedContactNumber ? 'Edit' : 'Add'}</span>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete your account */}
                  <div className="pt-4">
                    <div className="text-sm font-bold text-[#141414] mb-1.5">
                      Delete your account
                    </div>
                    {editingField === 'deleteAccount' ? (
                      <form
                        onSubmit={handleDeleteAccount}
                        className="p-4 border border-red-200 bg-red-50/50 space-y-3"
                      >
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          This permanently removes your account, saved articles, and saved podcasts. Enter your password to confirm.
                        </p>
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          required
                          placeholder="Enter your password"
                          className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#bb1919]"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-4 py-2 bg-[#bb1919] hover:bg-[#991515] text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                          >
                            {settingsSaving ? 'Deleting...' : 'Delete account permanently'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 text-xs font-bold text-neutral-700 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openEditor('deleteAccount')}
                        className="text-sm font-bold text-[#005fcc] hover:underline cursor-pointer"
                      >
                        I want to delete my account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <ProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        profileData={{ fullName: displayName, photo: avatarPhoto }}
        onOpenSettings={() => switchTab('PERSONAL_SETTINGS')}
        onSignOut={handleSignOut}
        onTabSelect={(tab) => switchTab(tab)}
      />

      <ReaderProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onProfileUpdate={() => {
          const refreshed = getStoredUser();
          if (refreshed) setUser(refreshed);
        }}
      />

      <AudioPlayerBar podcast={activePodcast} onClose={() => setActivePodcast(null)} />
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
