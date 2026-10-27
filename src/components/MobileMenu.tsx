'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Search, User, ChevronDown, ChevronUp } from 'lucide-react';
import { mainCategories } from '../data/categoriesData';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenSignIn: () => void;
}

export default function MobileMenu({ isOpen, onClose, onOpenSearch, onOpenSignIn }: MobileMenuProps) {
  const router = useRouter();
  // Track open state of category dropdowns by category id
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNavigate = (slug: string) => {
    onClose();
    if (typeof window !== 'undefined') {
      window.location.href = encodeURI(`/${slug}`);
    } else {
      router.push(encodeURI(`/${slug}`));
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-start animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#121212] text-white w-full max-w-[420px] sm:max-w-[460px] h-full overflow-y-auto flex flex-col justify-between p-5 sm:p-6 shadow-2xl animate-in slide-in-from-left duration-200 cursor-default"
      >
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center space-x-1 cursor-pointer"
              aria-label="BBC Home"
            >
              <div className="w-7 h-7 bg-white text-black font-black flex items-center justify-center text-sm">
                B
              </div>
              <div className="w-7 h-7 bg-white text-black font-black flex items-center justify-center text-sm">
                B
              </div>
              <div className="w-7 h-7 bg-white text-black font-black flex items-center justify-center text-sm">
                C
              </div>
            </Link>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 rounded hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          {/* Quick Sign In / Register */}
          <div className="py-4 border-b border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onOpenSignIn();
              }}
              className="flex items-center space-x-3 text-neutral-200 hover:text-white font-bold text-sm cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
                <User className="w-4 h-4" />
              </div>
              <span>Sign In / Register</span>
            </button>
          </div>

          {/* Search Trigger */}
          <div className="py-4 border-b border-neutral-800">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center space-x-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-4 py-2.5 rounded text-sm transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-neutral-400" />
              <span>Search BBC</span>
            </button>
          </div>

          {/* 15 Main Categories & 84 Subcategories Navigation */}
          <div className="py-4">
            <ul className="divide-y divide-neutral-800/80">
              {mainCategories.map((category) => {
                const isOpen = !!openCategories[category.id];
                const hasSubcategories = category.subcategories.length > 0;

                return (
                  <li key={category.id} className="py-1">
                    {/* Main Category Header Row */}
                    <div className="flex items-center justify-between group rounded hover:bg-neutral-900 transition">
                      {/* Category Name Link */}
                      <button
                        onClick={() => handleNavigate(category.slug)}
                        className="flex-1 text-left py-2.5 px-2 text-neutral-100 hover:text-white font-bold text-[15px] sm:text-base transition cursor-pointer flex items-center space-x-2"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {category.name}
                        </span>
                      </button>

                      {/* Dropdown Toggle Button */}
                      {hasSubcategories && (
                        <button
                          onClick={(e) => toggleCategory(category.id, e)}
                          className="p-2 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition cursor-pointer"
                          aria-label={`Toggle ${category.name} subcategories`}
                          title={`Toggle ${category.name} subcategories`}
                        >
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-neutral-200 stroke-[2.5]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white stroke-[2.2]" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subcategories Dropdown Accordion (No red vertical line, no arrows) */}
                    {hasSubcategories && isOpen && (
                      <div className="mt-1 mb-2 ml-4 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        <ul className="space-y-1">
                          {category.subcategories.map((sub) => (
                            <li key={sub.slug}>
                              <button
                                onClick={() => handleNavigate(sub.slug)}
                                className="w-full text-left py-1.5 px-2 text-[13.5px] text-neutral-300 hover:text-white hover:bg-neutral-900/90 rounded transition cursor-pointer"
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
