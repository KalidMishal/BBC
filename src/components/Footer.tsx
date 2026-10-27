'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Footer() {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const directoryLinks = [
    'Home', 'News', 'Sport', 'Business', 'Innovation', 'Culture', 'Arts', 'Travel', 'Earth', 'Audio', 'Video', 'Weather', 'BBC Shop', 'BritBox'
  ];

  const legalLinks = [
    'Terms of Use', 'About the BBC', 'Privacy Policy', 'Cookies', 'Accessibility Help', 'Contact the BBC', 'Advertise with us', 'Do not share or sell my info', 'Contact technical support'
  ];

  const otherLanguages = [
    'BBC Mundo (Spanish)', 'BBC News Brasil (Portuguese)', 'BBC News Arabic',
    'BBC News Russian', 'BBC News Hindi', 'BBC News Urdu',
    'BBC News Persian', 'BBC News Indonesian', 'BBC News Chinese',
    'BBC News Somali', 'BBC News Vietnamese', 'BBC News Hausa'
  ];

  return (
    <footer className="w-full bg-white text-neutral-900 pt-8 pb-12 mt-6 border-t-2 border-neutral-900">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Row 1: BBC Logo */}
        <div className="flex items-center space-x-1 mb-5">
          <span className="w-7 h-7 bg-black text-white font-black flex items-center justify-center text-sm tracking-tighter">
            B
          </span>
          <span className="w-7 h-7 bg-black text-white font-black flex items-center justify-center text-sm tracking-tighter">
            B
          </span>
          <span className="w-7 h-7 bg-black text-white font-black flex items-center justify-center text-sm tracking-tighter">
            C
          </span>
        </div>

        {/* Row 2: Directory Categories + Language Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-neutral-200">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-[13px] font-bold text-neutral-900">
            {directoryLinks.map((item) => (
              <li key={item}>
                <a href="#" className="hover:underline hover:text-red-600 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* BBC in other languages dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1.5 text-xs font-bold text-neutral-800 border border-neutral-300 hover:border-black rounded-xs px-3 py-1.5 transition cursor-pointer"
            >
              <span>BBC in other languages</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-white border border-neutral-200 rounded-xs shadow-lg p-3 z-50 grid grid-cols-1 gap-1 text-xs">
                {otherLanguages.map((lang) => (
                  <a
                    key={lang}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Selected language edition: ${lang}`);
                      setIsLangOpen(false);
                    }}
                    className="px-2 py-1.5 hover:bg-neutral-100 rounded text-neutral-800 transition"
                  >
                    {lang}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Follow BBC on (Social Icons) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-neutral-200">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-neutral-700">Follow BBC on:</span>
            <div className="flex items-center space-x-3 text-neutral-800">
              {/* X / Twitter */}
              <a href="#" className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition" title="X">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition" title="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition" title="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Row 4: Legal & Policy Links */}
        <div className="py-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-neutral-600 font-medium">
            {legalLinks.map((link) => (
              <li key={link}>
                <a href="#" className="hover:underline hover:text-black transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Row 5: Copyright & Disclaimer */}
        <div className="text-[11px] text-neutral-500 leading-relaxed space-y-1.5 pt-1">
          <p>
            Copyright 2026 BBC. All rights reserved. The BBC is not responsible for the content of external sites.
          </p>
          <p>
            <a href="#" className="text-neutral-700 hover:underline font-semibold">
              Read about our approach to external linking.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
