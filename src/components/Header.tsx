'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import { navCategories } from '../data/bbcData';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onOpenSignIn: () => void;
}

export default function Header({ onOpenSearch, onOpenMenu, onOpenSignIn }: HeaderProps) {
  const pathname = usePathname() || '/';

  return (
    <>
      {/* 1. Permanent Sticky / Fixed Top Navbar:
          Spans edge to edge across device, stays fixed at top of screen when scrolling */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="w-full px-4 sm:px-6 md:px-8 h-[64px] sm:h-[70px] flex items-center justify-between relative">
          
          {/* Left Side: Menu Hamburger & Search Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenMenu}
              className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-900 transition cursor-pointer flex items-center justify-center"
              aria-label="Open navigation menu"
              title="Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>

            <button
              onClick={onOpenSearch}
              className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-900 transition cursor-pointer flex items-center justify-center"
              aria-label="Search BBC"
              title="Search"
            >
              <Search className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* Center: Iconic BBC 3-Box Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center space-x-1 cursor-pointer" aria-label="BBC Home">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black flex items-center justify-center text-white font-black text-lg sm:text-xl tracking-wider">
                B
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black flex items-center justify-center text-white font-black text-lg sm:text-xl tracking-wider">
                B
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black flex items-center justify-center text-white font-black text-lg sm:text-xl tracking-wider">
                C
              </div>
            </Link>
          </div>

          {/* Right Side: Register & Sign In */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            <button
              onClick={onOpenSignIn}
              className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 transition cursor-pointer"
            >
              Register
            </button>

            <button
              onClick={onOpenSignIn}
              className="text-neutral-900 hover:underline font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for the fixed top navbar so content starts cleanly below it */}
      <div className="h-[64px] sm:h-[70px]" />

      {/* 2. Categories Bar directly below the fixed navbar:
          Contains: Home, World News, Sport, Law & Justice, Education, Health, Energy & Infrastructure, Travel & Lifestyle, Opinions */}
      <div className="w-full bg-white border-b border-neutral-200 relative z-40">
        <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-center">
          <ul className="flex items-center space-x-4 sm:space-x-6 text-[13px] font-bold py-2.5 sm:py-3 whitespace-nowrap overflow-x-auto no-scrollbar">
            {navCategories.map((cat) => {
              const decodedPath = decodeURIComponent(pathname);
              const isActive = cat.href === '/'
                ? decodedPath === '/'
                : decodedPath.toLowerCase() === cat.href.toLowerCase();

              return (
                <li key={cat.name} className="relative py-1">
                  <Link
                    href={cat.href}
                    className={`transition cursor-pointer inline-block ${
                      isActive ? 'text-black' : 'text-neutral-800 hover:text-black hover:underline'
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
    </>
  );
}
