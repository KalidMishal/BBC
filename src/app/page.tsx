'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import PoliticsAndTrendingSection from '../components/PoliticsAndTrendingSection';
import MoreNewsSection from '../components/MoreNewsSection';
import HumanRightsSection from '../components/HumanRightsSection';
import WatchHero from '../components/WatchHero';
import RecentVideosSection from '../components/RecentVideosSection';
import EditorsPicks from '../components/EditorsPicks';
import InDepthDrivingChangeSection from '../components/InDepthDrivingChangeSection';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';

// Modals
import SearchModal from '../components/SearchModal';
import MobileMenu from '../components/MobileMenu';
import ArticleModal from '../components/ArticleModal';
import SignInModal from '../components/SignInModal';
import VideoModal from '../components/VideoModal';
import AudioPlayerBar from '../components/AudioPlayerBar';

import { Article, PodcastItem } from '../types';

export default function BBCCloneHomePage() {
  const router = useRouter();

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeVideo, setActiveVideo] = useState<Article | null>(null);
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);

  const handleArticleClick = (article: Article) => {
    if (typeof window !== 'undefined') {
      window.location.href = encodeURI("/news/articles/How-a-movement-of-students-brought-down-Serbia's-Vučić");
    } else {
      router.push(encodeURI("/news/articles/How-a-movement-of-students-brought-down-Serbia's-Vučić"));
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* 1. Primary Masthead & Sticky Navigation */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* 2. Hero News Section (Top 3-column section) */}
      <HeroSection
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 2.5 Politics & Government (4 cards) + EU Leaders Feature & Trending Now */}
      <PoliticsAndTrendingSection
        onArticleClick={handleArticleClick}
      />

      {/* 3. Advertisement Banner */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 4. More News (under Advertisement, matching Image 1) */}
      <MoreNewsSection
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 5. Human Rights & Civil Liberties (matching Image 2) */}
      <HumanRightsSection
        onArticleClick={handleArticleClick}
      />

      {/* 6. Advertisement Banner moved under Human Rights & Civil Liberties */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 7. Watch Feature (Macro Snake Video Banner matching Image 1) */}
      <WatchHero
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 7.5 Recent Videos Section (5 video cards matching Image 1) */}
      <RecentVideosSection
        onVideoClick={(video) => setActiveVideo(video)}
        onArticleClick={handleArticleClick}
      />

      {/* 8. Editor's Pick (US Capitol dome + 3 items matching Image 2) */}
      <EditorsPicks
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 8.5 In-Depth The People Driving Change in 2026 + 4 Cards Grid matching Image 2 */}
      <InDepthDrivingChangeSection
        onArticleClick={handleArticleClick}
      />

      {/* 9. Global BBC Footer */}
      <Footer />

      {/* Interactive Modals & Floating Overlays */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleArticleClick}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />

      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
      />

      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

      <AudioPlayerBar
        podcast={activePodcast}
        onClose={() => setActivePodcast(null)}
      />
    </main>
  );
}
