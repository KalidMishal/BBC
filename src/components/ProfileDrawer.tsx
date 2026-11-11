'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthUser } from '../types';
import { getDisplayName } from '../lib/auth';
import { resolveMediaUrl } from '../lib/api';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  profileData: { fullName?: string; photo?: string };
  onOpenSettings: () => void;
  onSignOut: () => void;
  onTabSelect?: (tab: 'SAVED' | 'FEED' | 'MANAGE_ACCOUNT') => void;
  onWriterTabSelect?: (tab: string) => void;
  onAdminTabSelect?: (tab: string) => void;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  user,
  profileData,
  onOpenSettings,
  onSignOut,
  onTabSelect,
  onWriterTabSelect,
  onAdminTabSelect,
}: ProfileDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAlreadyInReaderDashboard = Boolean(
    pathname?.startsWith('/reader/dashboard')
  );
  const isAlreadyInWriterDashboard = Boolean(
    pathname?.startsWith('/writer/dashboard') || onWriterTabSelect
  );
  const isAlreadyInAdminDashboard = Boolean(
    pathname?.startsWith('/admin/dashboard') || onAdminTabSelect
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isAdmin = user?.role === 'admin' || Boolean(onAdminTabSelect);
  const isWriter = (user?.role === 'writer' || Boolean(onWriterTabSelect)) && !isAdmin;
  const displayName =
    profileData?.fullName ||
    getDisplayName(user) ||
    (isAdmin ? 'Admin' : isWriter ? 'Writer' : 'Reader');
  const displayPhoto = resolveMediaUrl(profileData?.photo || user?.profile_picture);

  const handleReaderDashboardClick = () => {
    onClose();
    if (onTabSelect) {
      onTabSelect('SAVED');
    }
    router.push('/reader/dashboard');
  };

  const handleSavedArticlesClick = () => {
    onClose();
    if (onTabSelect) {
      onTabSelect('SAVED');
    } else {
      router.push('/reader/dashboard?tab=saved');
    }
  };

  const handleFeedClick = () => {
    onClose();
    if (onTabSelect) {
      onTabSelect('FEED');
    } else {
      router.push('/reader/dashboard?tab=feed');
    }
  };

  const handleWriterTabClick = (tab: string) => {
    onClose();
    if (onWriterTabSelect) {
      onWriterTabSelect(tab);
    } else {
      const tabParam = tab.toLowerCase().includes('pending')
        ? 'pending'
        : tab.toLowerCase();
      router.push(`/writer/dashboard?tab=${tabParam}`);
    }
  };

  const handleAdminTabClick = (tabKey: string) => {
    onClose();
    if (onAdminTabSelect) {
      onAdminTabSelect(tabKey);
    } else {
      router.push(`/admin/dashboard?tab=${tabKey}`);
    }
  };

  const adminNavItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'newsletter', label: 'Newsletter' },
    { key: 'publishedPosts', label: 'Published Posts' },
    { key: 'users', label: 'Users' },
    { key: 'manageAds', label: 'Manage Ads' },
    { key: 'contactSubmissions', label: 'Contact Us Submissions' },
    { key: 'advertiseLeads', label: 'Advertise Leads' },
    { key: 'subscriptionRequests', label: 'Subscription Requests' },
    { key: 'databaseBackups', label: 'Database Backups' },
    { key: 'shortsReels', label: 'Shorts & Reels' },
    { key: 'manageJobs', label: 'Manage Jobs' },
    { key: 'contributorForm', label: 'Contributor Form' },
  ];

  return (
    <div className="fixed inset-0 z-[9998] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="relative w-[320px] sm:w-[360px] h-full bg-white z-[9999] shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-y-auto border-l border-gray-200 animate-in slide-in-from-right duration-300 font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 border border-gray-200 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-bold text-[17px] text-[#0f0f0f] truncate leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-0.5">
                  {isAdmin
                    ? user?.is_default_admin
                      ? 'Default Admin'
                      : 'Admin'
                    : isWriter
                    ? user?.writer_role || 'Writer'
                    : 'Reader'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors rounded-md focus:outline-none cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Section: MY PROFILE */}
          {((!isAdmin && !isWriter) ||
            (isAdmin && !isAlreadyInAdminDashboard) ||
            (isWriter && !isAlreadyInWriterDashboard)) && (
            <div className="py-5 border-b border-gray-200">
              <div className="text-[#bb1919] text-[11px] font-bold tracking-wider uppercase mb-3">
                MY PROFILE
              </div>

              {isAdmin ? (
                <div className="flex flex-col space-y-0.5 -mx-2.5">
                  {adminNavItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleAdminTabClick(item.key)}
                      className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : isWriter ? (
                <div className="flex flex-col space-y-0.5 -mx-2.5">
                  {['Published', 'Drafts', 'Pending review', 'Rejected', 'Trash'].map(
                    (tabName) => (
                      <button
                        key={tabName}
                        type="button"
                        onClick={() => handleWriterTabClick(tabName)}
                        className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
                      >
                        {tabName}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-col space-y-0.5 -mx-2.5">
                  {!isAlreadyInReaderDashboard && (
                    <button
                      type="button"
                      onClick={handleReaderDashboardClick}
                      className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
                    >
                      Reader Dashboard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSavedArticlesClick}
                    className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
                  >
                    Saved Articles
                  </button>
                  <button
                    type="button"
                    onClick={handleFeedClick}
                    className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
                  >
                    Feed
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Account actions */}
          <div className="py-3 flex flex-col space-y-0.5 -mx-2.5">
            {(isAlreadyInAdminDashboard ||
              isAlreadyInWriterDashboard ||
              isAlreadyInReaderDashboard) && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/');
                }}
                className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
              >
                Back to home
              </button>
            )}

            {isAdmin && !isAlreadyInAdminDashboard && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  handleAdminTabClick('overview');
                }}
                className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
              >
                Admin dashboard
              </button>
            )}

            {isWriter && !isAlreadyInWriterDashboard && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push('/writer/dashboard');
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
                >
                  Writer Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const authorSlug = displayName.trim().toLowerCase().replace(/\s+/g, '-');
                    if (user?.id) {
                      router.push(`/author/${encodeURIComponent(authorSlug || String(user.id))}`);
                    } else {
                      router.push('/');
                    }
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
                >
                  Author Page
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                if (!isAdmin && !isWriter) {
                  if (onTabSelect) {
                    onTabSelect('MANAGE_ACCOUNT');
                  } else {
                    router.push('/reader/dashboard?tab=profile-settings');
                  }
                } else {
                  onOpenSettings();
                }
              }}
              className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none"
            >
              Manage account
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full text-left px-2.5 py-2 rounded-md text-[15px] font-medium text-gray-800 hover:text-[#bb1919] hover:bg-red-50 cursor-pointer transition-colors focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
