'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import { navCategories } from '../data/bbcData';
import { findCategoryBySlug } from '../data/categoriesData';
import { AuthUser } from '../types';
import {
  clearAuthSession,
  getDisplayName,
  getStoredUser,
} from '../lib/auth';
import { resolveMediaUrl } from '../lib/api';
import ProfileDrawer from './ProfileDrawer';
import ReaderProfileSettingsModal from './ReaderProfileSettingsModal';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenMenu?: () => void;
  onOpenSignIn?: () => void;
  onProfileClick?: () => void;
  hideCategoryBar?: boolean;
}

export default function Header({
  onOpenSearch,
  onOpenMenu,
  onOpenSignIn,
  onProfileClick,
  hideCategoryBar = false,
}: HeaderProps) {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const decodedPath = decodeURIComponent(pathname);
  const currentSlug = decodedPath.replace(/^\//, '');

  const resolvedCategory = findCategoryBySlug(currentSlug);
  const activeMainCategory = resolvedCategory?.main || null;
  const activeSubcategory =
    resolvedCategory && !resolvedCategory.isMain ? resolvedCategory.sub : null;

  const [selectedMainSlug, setSelectedMainSlug] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      setUser(getStoredUser());
    };
    syncAuth();
    window.addEventListener('authUpdated', syncAuth);
    window.addEventListener('userProfileUpdated', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('authUpdated', syncAuth);
      window.removeEventListener('userProfileUpdated', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  useEffect(() => {
    if (activeMainCategory) {
      setSelectedMainSlug(activeMainCategory.slug);
    } else if (pathname === '/') {
      setSelectedMainSlug(null);
    }
  }, [pathname, activeMainCategory]);

  const displayedCategory = selectedMainSlug
    ? findCategoryBySlug(selectedMainSlug)?.main || activeMainCategory
    : activeMainCategory;

  const subcategoriesToDisplay = displayedCategory?.subcategories || [];

  const handleSignOut = () => {
    clearAuthSession();
    setUser(null);
    setIsDrawerOpen(false);
    router.push('/');
  };

  const displayName = getDisplayName(user);
  const userPhoto = resolveMediaUrl(user?.profile_picture);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="w-full px-4 sm:px-6 md:px-8 h-[60px] sm:h-[64px] flex items-center justify-between relative">
          {/* Left Side: Menu Hamburger & Search Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenMenu ? (
              <button
                type="button"
                onClick={onOpenMenu}
                className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-900 transition cursor-pointer flex items-center justify-center"
                aria-label="Open navigation menu"
                title="Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </button>
            ) : (
              <Link
                href="/"
                className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-900 transition cursor-pointer flex items-center justify-center"
                aria-label="BBC Home"
                title="Home"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </Link>
            )}

            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-900 transition cursor-pointer flex items-center justify-center"
                aria-label="Search BBC"
                title="Search"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </button>
            )}
          </div>

          {/* Center: Iconic BBC 3-Box Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className="flex items-center space-x-1 cursor-pointer"
              aria-label="BBC Home"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-black flex items-center justify-center text-white font-black text-sm sm:text-base tracking-wider">
                B
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-black flex items-center justify-center text-white font-black text-sm sm:text-base tracking-wider">
                B
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-black flex items-center justify-center text-white font-black text-sm sm:text-base tracking-wider">
                C
              </div>
            </Link>
          </div>

          {/* Right Side: Signed-In Profile Pill OR Register & Sign In */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  if (onProfileClick) {
                    onProfileClick();
                  } else {
                    setIsDrawerOpen(true);
                  }
                }}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-neutral-200 hover:border-neutral-400 bg-white transition cursor-pointer"
                aria-label="Open account menu"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-neutral-900 max-w-[130px] truncate">
                  {displayName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 hidden md:inline">
                  {user.role}
                </span>
              </button>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-black hover:bg-neutral-800 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-1.5 transition cursor-pointer inline-flex items-center"
                >
                  Register
                </Link>

                {onOpenSignIn ? (
                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="text-neutral-900 hover:underline font-bold text-[11px] sm:text-xs transition cursor-pointer"
                  >
                    Sign In
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-neutral-900 hover:underline font-bold text-[11px] sm:text-xs transition cursor-pointer"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[60px] sm:h-[64px]" />

      {/* Categories Bar */}
      {!hideCategoryBar && (
        <div className="w-full bg-white border-b border-neutral-200 relative z-40">
          <div className="max-w-[1640px] mx-auto px-3 sm:px-6 md:px-8 flex items-center justify-start md:justify-center">
            <ul className="w-full md:w-auto flex items-center space-x-3 sm:space-x-6 text-[14px] font-bold py-1.5 sm:py-2 whitespace-nowrap overflow-x-auto no-scrollbar">
              {navCategories.map((cat) => {
                const isHome = cat.href === '/';
                let isActive = false;

                if (isHome) {
                  isActive = pathname === '/' && !selectedMainSlug;
                } else if (displayedCategory) {
                  const catClean = cat.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '');
                  const dispClean = displayedCategory.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '');
                  isActive = catClean === dispClean;
                } else {
                  isActive =
                    decodedPath.toLowerCase() === cat.href.toLowerCase();
                }

                return (
                  <li key={cat.name} className="relative py-1">
                    <Link
                      href={cat.href}
                      onClick={() => {
                        if (isHome) {
                          setSelectedMainSlug(null);
                        } else {
                          setSelectedMainSlug(cat.slug);
                        }
                      }}
                      className={`transition cursor-pointer inline-block ${
                        isActive
                          ? 'text-black'
                          : 'text-neutral-800 hover:text-black hover:underline'
                      }`}
                    >
                      {cat.name}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-black" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Subcategories Bar */}
      {!hideCategoryBar && subcategoriesToDisplay.length > 0 && (
        <div className="w-full bg-white border-b border-neutral-200 relative z-30 animate-in fade-in duration-150">
          <div className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-center">
            <ul className="flex items-center space-x-5 sm:space-x-7 text-[12px] sm:text-[12.5px] font-normal py-2.5 whitespace-nowrap overflow-x-auto no-scrollbar text-neutral-800">
              {subcategoriesToDisplay.map((sub) => {
                const subClean = sub.slug
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, '');
                const pathClean = currentSlug
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, '');
                const isSubActive =
                  subClean === pathClean ||
                  (activeSubcategory && activeSubcategory.slug === sub.slug);

                return (
                  <li key={sub.slug} className="relative py-0.5">
                    <Link
                      href={encodeURI(`/${sub.slug}`)}
                      className={`transition cursor-pointer inline-block ${
                        isSubActive
                          ? 'text-black font-bold'
                          : 'text-neutral-700 hover:text-black hover:underline'
                      }`}
                    >
                      {sub.name}
                      {isSubActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {!onProfileClick && (
        <>
          <ProfileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            user={user}
            profileData={{ fullName: displayName, photo: userPhoto }}
            onOpenSettings={() => {
              setIsDrawerOpen(false);
              setIsSettingsOpen(true);
            }}
            onSignOut={handleSignOut}
          />
          <ReaderProfileSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onProfileUpdate={() => {
              setUser(getStoredUser());
            }}
          />
        </>
      )}
    </>
  );
}
