'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WeekendReads from '../components/WeekendReads';
import SportFeature from '../components/SportFeature';
import AudioShelf from '../components/AudioShelf';
import MoreNewsSection from '../components/MoreNewsSection';
import EditorsPicks from '../components/EditorsPicks';
import TravelSpotlight from '../components/TravelSpotlight';
import HistorySection from '../components/HistorySection';
import EarthSpotlight from '../components/EarthSpotlight';
import MultiColumnDigest from '../components/MultiColumnDigest';
import SportAudioShelf from '../components/SportAudioShelf';
import WatchHero from '../components/WatchHero';
import DiscoverBBC from '../components/DiscoverBBC';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';

// Modals
import SearchModal from '../components/SearchModal';
import MobileMenu from '../components/MobileMenu';
import ArticleModal from '../components/ArticleModal';
import SignInModal from '../components/SignInModal';
import VideoModal from '../components/VideoModal';
import AudioPlayerBar from '../components/AudioPlayerBar';

// Data
import {
  fourColumnDigest1,
  fourColumnDigest2,
  fourColumnDigest3
} from '../data/bbcData';
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
      {/* 1. Primary Masthead & Sticky Navigation (No Ad section above navbar) */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* 2. Hero News Section (First Section matching screenshot) */}
      <HeroSection
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 3. Advertisement Banner above Weekend Reads matching Image 2 */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 4. Weekend Reads (2 High-Impact Landscape Cards) */}
      <WeekendReads
        onArticleClick={handleArticleClick}
      />

      {/* 5. Sport Premier League Feature (Cole Palmer / Match Action) */}
      <SportFeature
        onArticleClick={handleArticleClick}
      />

      {/* 6. Best Audio of the Week (Horizontal Podcast Shelf) */}
      <AudioShelf
        onPlayPodcast={(podcast) => setActivePodcast(podcast)}
      />

      {/* 7. Advertisement Banner below Best Audio of the Week matching Image 2 */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 8. More News (Featured Story + Multi-tier Grid) */}
      <MoreNewsSection
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 9. Editor's Picks (Dark Carousel matching Image 1) */}
      <EditorsPicks
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 10. Advertisement Banner under Editor's Picks matching Image 2 */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 11. Travel Feature Spotlight ("The unspoken rules of Japanese body language") */}
      <TravelSpotlight
        onArticleClick={handleArticleClick}
      />

      {/* 12. History Spotlight ("Crowns and Controversies" 3-Card Row) */}
      <HistorySection
        onArticleClick={handleArticleClick}
      />

      {/* 13. Earth Feature Spotlight ("Birdwatching rewires the brain") */}
      <EarthSpotlight
        onArticleClick={handleArticleClick}
      />

      {/* 14. Advertisement Banner under Earth Section matching Image 2 */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 15. 4-Column News Digest 1 (US & Canada, More World News, Business, Technology) */}
      <MultiColumnDigest
        columns={fourColumnDigest1}
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 16. Advertisement Banner under 4-Column Digest 1 */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 17. Latest Sport Audio Shelf */}
      <SportAudioShelf
        onPlayPodcast={(podcast) => setActivePodcast(podcast)}
      />

      {/* 18. 4-Column News Digest 2 (Sport, Health, Culture, Travel) */}
      <MultiColumnDigest
        columns={fourColumnDigest2}
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 19. Advertisement Banner under 4-Column Digest 2 */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 20. Watch Feature ("Why the television refuses to die") */}
      <WatchHero
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 21. 4-Column News Digest 3 (Arts, Earth, Video, World's Table) */}
      <MultiColumnDigest
        columns={fourColumnDigest3}
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
      />

      {/* 22. Discover More from the BBC (9 slots) */}
      <DiscoverBBC />

      {/* 23. Advertisement Banner under Discover More from the BBC */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 24. Global BBC Footer */}
      <Footer />

      {/* 24. Interactive Modals & Floating Overlays */}
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
