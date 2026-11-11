import React from 'react';

export function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function SkeletonArticleCard() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full aspect-[16/9] animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
      <div className="space-y-2">
        <div className="h-3 w-1/4 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
        <div className="h-5 w-full animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
        <div className="h-5 w-3/4 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
      </div>
      <div className="h-3 w-1/2 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm mt-2" />
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="w-full flex-grow flex flex-col bg-white min-h-screen">
      <div className="w-full h-[60px] border-b border-gray-200 flex items-center px-6">
        <div className="w-8 h-8 rounded-full animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]" />
        <div className="w-[120px] h-6 mx-auto animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
        <div className="w-[60px] h-6 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
      </div>
      <div className="w-full max-w-[1200px] mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="w-full aspect-[2/1] animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
          <div className="h-8 w-3/4 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
          <div className="h-4 w-full animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
          <div className="h-4 w-5/6 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
        </div>
        <div className="w-full md:w-[350px] space-y-6">
          <div className="h-6 w-1/2 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm mb-4" />
          <SkeletonArticleCard />
          <SkeletonArticleCard />
        </div>
      </div>
    </div>
  );
}

export function SkeletonArticleDetail() {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 mt-12">
      <div className="h-4 w-24 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm mb-6" />
      <div className="h-10 w-full animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm mb-4" />
      <div className="h-10 w-3/4 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm mb-8" />
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
          <div className="h-3 w-24 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
        </div>
      </div>
      <div className="w-full aspect-[2/1] animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm mb-8" />
      <div className="space-y-4">
        <div className="h-4 w-full animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
        <div className="h-4 w-full animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
        <div className="h-4 w-5/6 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-sm" />
      </div>
    </div>
  );
}
