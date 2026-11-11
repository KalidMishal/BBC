'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchHomeData, HomeDataPayload } from '../lib/api';

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
import InFocusAndMarketUpdateSection from '../components/InFocusAndMarketUpdateSection';
import SportsCardsSection from '../components/SportsCardsSection';
import ListenNowSection from '../components/ListenNowSection';
import FourCategoriesDigestSection from '../components/FourCategoriesDigestSection';
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
  const [homeData, setHomeData] = useState<HomeDataPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchHomeData(controller.signal).then((data) => {
      if (data) {
        setHomeData(data);
      }
    });
    return () => controller.abort();
  }, []);

  const handleArticleClick = (article: Article) => {
    const slugOrId = article.slug || article.id;
    if (slugOrId) {
      router.push(`/news/articles/${encodeURIComponent(slugOrId)}`);
      return;
    }
    router.push(encodeURI("/news/articles/How-a-movement-of-students-brought-down-Serbia's-Vučić"));
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
        leadStory={homeData?.topStoryLead ?? undefined}
        secondaryStories={homeData?.topStoriesSecondary?.length ? homeData.topStoriesSecondary : undefined}
        sideStories={homeData?.topStoriesSideList?.length ? homeData.topStoriesSideList : undefined}
      />

      {/* 2.5 Politics & Government (4 cards) + EU Leaders Feature & Trending Now */}
      <PoliticsAndTrendingSection
        onArticleClick={handleArticleClick}
        gridArticles={homeData?.politicsGridArticles?.length ? homeData.politicsGridArticles : undefined}
        euStory={homeData?.euLeadersStory ?? undefined}
        trendingItems={homeData?.trendingNowArticles?.length ? homeData.trendingNowArticles : undefined}
      />

      {/* 3. Advertisement Banner */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 4. More News (under Advertisement, matching Image 1) */}
      <MoreNewsSection
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
        featuredStory={homeData?.moreNewsVanessa ?? undefined}
        bottomStory={homeData?.moreNewsBurnham ?? undefined}
        sideArticles={homeData?.moreNewsSideList?.length ? homeData.moreNewsSideList : undefined}
      />

      {/* 5. Human Rights & Civil Liberties (matching Image 2) */}
      <HumanRightsSection
        onArticleClick={handleArticleClick}
        articles={homeData?.humanRightsArticles?.length ? homeData.humanRightsArticles : undefined}
      />

      {/* 6. Advertisement Banner moved under Human Rights & Civil Liberties */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 7. Watch Feature (Macro Snake Video Banner matching Image 1) */}
      <WatchHero
        onVideoClick={(video) => setActiveVideo(video)}
        feature={homeData?.watchHeroCinema ?? undefined}
      />

      {/* 7.5 Recent Videos Section (5 video cards matching Image 1) */}
      <RecentVideosSection
        onVideoClick={(video) => setActiveVideo(video)}
        onArticleClick={handleArticleClick}
        videos={homeData?.recentVideosList?.length ? homeData.recentVideosList : undefined}
      />

      {/* 8. Editor's Pick (US Capitol dome + 3 items matching Image 2) */}
      <EditorsPicks
        onArticleClick={handleArticleClick}
        onVideoClick={(video) => setActiveVideo(video)}
        leadStory={homeData?.editorLeadStory ?? undefined}
        sideList={homeData?.editorSideList?.length ? homeData.editorSideList : undefined}
      />

      {/* 8.5 In-Depth The People Driving Change in 2026 + 4 Cards Grid matching Image 2 */}
      <InDepthDrivingChangeSection
        onArticleClick={handleArticleClick}
        leadStory={homeData?.inDepthChangeLead ?? undefined}
        cards={homeData?.inDepthChangeCards?.length ? homeData.inDepthChangeCards : undefined}
      />

      {/* 9. In Focus This Week & Market Update matching media_1794035586863_48a12b3e */}
      <InFocusAndMarketUpdateSection
        onArticleClick={handleArticleClick}
        leadStory={homeData?.inFocusLeadStory ?? undefined}
        sideList={homeData?.inFocusSideList?.length ? homeData.inFocusSideList : undefined}
        metrics={homeData?.marketUpdateMetrics?.length ? homeData.marketUpdateMetrics : undefined}
      />

      {/* 10. Advertisement Banner under Market Update */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 11. Sports (4 Cards Grid) matching media_1794035724019_9e85fb91 */}
      <SportsCardsSection
        onArticleClick={handleArticleClick}
        articles={homeData?.sportsSectionArticles?.length ? homeData.sportsSectionArticles : undefined}
      />

      {/* 12. Listen Now matching media_1794035802116_4ce202c6 */}
      <ListenNowSection
        onPlayPodcast={(podcast) => setActivePodcast(podcast)}
        featuredPodcast={homeData?.listenNowFeaturedPodcast ?? undefined}
        episodes={homeData?.listenNowEpisodes?.length ? homeData.listenNowEpisodes : undefined}
      />

      {/* 13. Education, Travel & Lifestyle, Energy & Infrastructure, Opinions matching media_1794035851083_5bb58673 */}
      <FourCategoriesDigestSection
        onArticleClick={handleArticleClick}
        columns={homeData?.fourCategoriesDigestData?.length ? homeData.fourCategoriesDigestData : undefined}
      />

      {/* 14. Global BBC Footer */}
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
