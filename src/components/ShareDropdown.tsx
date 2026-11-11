'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ShareDropdown({
  children,
  title = '',
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1000);
  };

  const shareOptions = [
    {
      name: 'WHATSAPP',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: '#05a85c',
      bgHover: 'hover:bg-[#e6f6ef]',
    },
    {
      name: 'FACEBOOK',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.339 10.914 4 13.356 4H15v4z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
      bgHover: 'hover:bg-gray-50',
    },
    {
      name: 'TWITTER / X',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#000000',
      bgHover: 'hover:bg-gray-50',
    },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex items-center justify-center">
        {children}
      </div>
      {isOpen && (
        <div className="absolute right-0 top-[115%] w-[200px] bg-white border border-gray-200 shadow-xl rounded-md py-1 z-50">
          {shareOptions.map((opt, i) => (
            <a
              key={i}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-gray-800 ${opt.bgHover} transition-colors`}
            >
              <span style={{ color: opt.color }}>{opt.icon}</span>
              <span className="tracking-widest">{opt.name}</span>
            </a>
          ))}
          <div className="border-t border-gray-100 my-1" />
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-neutral-600">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <span className="tracking-widest">{copied ? 'COPIED!' : 'COPY LINK'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
