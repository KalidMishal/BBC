'use client';

import React, { useState, useRef, use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Bookmark, ChevronRight, ChevronLeft } from 'lucide-react';
import { fetchCategoryArticlesApi, resolveMediaUrl } from '../../lib/api';

// Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdBanner from '../../components/AdBanner';
import SearchModal from '../../components/SearchModal';
import MobileMenu from '../../components/MobileMenu';
import SignInModal from '../../components/SignInModal';
import VideoModal from '../../components/VideoModal';
import AudioPlayerBar from '../../components/AudioPlayerBar';

// Data
import { findCategoryBySlug } from '../../data/categoriesData';
import {
  categoryHeroFallback,
  categoryInCaseYouMissedItFallback,
  categoryKeepingTabsFallback,
  categoryMoreArticlesFallback,
} from '../../data/articleEnrichments';
import { Article, PodcastItem } from '../../types';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawSlug = resolvedParams.category;
  const decodedSlug = decodeURIComponent(rawSlug || '');

  // Find category information
  const categoryInfo = findCategoryBySlug(decodedSlug);
  const categoryTitle: string = (
    categoryInfo
      ? (categoryInfo.isMain ? categoryInfo.main.name : (categoryInfo.sub?.name || categoryInfo.main.name))
      : decodedSlug.replace(/[-_]+/g, ' ')
  ) || 'Technology';

  const parentCategory = categoryInfo && !categoryInfo.isMain ? categoryInfo.main : null;
  const subcategories = categoryInfo?.isMain ? categoryInfo.main.subcategories : [];

  // Modal & player states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Article | null>(null);
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);
  const [dbArticles, setDbArticles] = useState<Article[]>([]);

  // Pagination for MORE [CATEGORY] section
  const [pageState, setPageState] = useState<{ slug: string; page: number }>({
    slug: decodedSlug,
    page: 1,
  });
  const morePage = pageState.slug === decodedSlug ? pageState.page : 1;
  const itemsPerPage = 10;
  const moreTechRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategoryArticlesApi(decodedSlug, 1, 24, controller.signal).then((payload) => {
      if (controller.signal.aborted) return;
      if (payload && Array.isArray(payload.articles)) {
        setDbArticles(payload.articles);
      } else {
        setDbArticles([]);
      }
      setPageState({ slug: decodedSlug, page: 1 });
    });
    return () => controller.abort();
  }, [decodedSlug]);

  const navigateToArticle = (target?: { slug?: string; id?: string }) => {
    const key = target?.slug || target?.id;
    if (key) {
      router.push(`/news/articles/${encodeURIComponent(key)}`);
      return;
    }
    router.push(encodeURI("/news/articles/How-a-movement-of-students-brought-down-Serbia's-Vučić"));
  };

  // Section 1: Hero 5-Story Fallback Data
  const staticHeroLeftTop = categoryHeroFallback.leftTop;
  const staticHeroLeftBottom = categoryHeroFallback.leftBottom;
  const staticHeroLead = categoryHeroFallback.lead;
  const staticHeroRightTop = categoryHeroFallback.rightTop;
  const staticHeroRightBottom = categoryHeroFallback.rightBottom;

  const heroLead = dbArticles[0] || staticHeroLead;
  const heroLeftTop = dbArticles[1] || staticHeroLeftTop;
  const heroLeftBottom = dbArticles[2] || staticHeroLeftBottom;
  const heroRightTop = dbArticles[3] || staticHeroRightTop;
  const heroRightBottom = dbArticles[4] || staticHeroRightBottom;

  const keepingTabsCards = useMemo(() => {
    const picked = dbArticles.slice(5, 7);
    if (picked.length >= 2) return picked;
    return [...picked, ...categoryKeepingTabsFallback].slice(0, 2);
  }, [dbArticles]);

  const inCaseYouMissedItCards = useMemo(() => {
    const picked = dbArticles.slice(7, 11);
    if (picked.length >= 4) return picked;
    return [...picked, ...categoryInCaseYouMissedItFallback].slice(0, 4);
  }, [dbArticles]);

  // Sponsored Dianomi Cards (Image 4 bottom)
  const sponsoredDianomi1 = [
    { id: 'sp-1', title: 'Discover the latest finance insights from global experts.', source: 'MarketViews', imageUrl: '/sidebar-ad-1.jpg' },
    { id: 'sp-2', title: 'Uncover the latest AI insights and breakthroughs.', source: 'MarketViews', imageUrl: '/sidebar-ad-2.jpg' },
    { id: 'sp-3', title: 'What is the latest on ETFs?', source: 'MarketViews', imageUrl: '/sidebar-ad-3.jpg' },
    { id: 'sp-4', title: 'Uncover the latest trends in retirement planning strategies.', source: 'MarketViews', imageUrl: '/sidebar-ad-4.jpg' },
    { id: 'sp-5', title: 'Robotics and Artificial Intelligence. Discover the trends.', source: 'MarketViews', imageUrl: '/taboola-1.jpg' }
  ];

  const allMoreArticles = useMemo(() => {
    const liveMapped = dbArticles.map((art) => ({
      id: art.id,
      slug: art.slug,
      date: art.time || 'Recent',
      title: art.title,
      summary: art.summary || art.cardSummary || '',
      imageUrl: resolveMediaUrl(art.imageUrl, '/hero-lead.jpg'),
    }));
    const combined = [
      ...liveMapped,
      ...categoryMoreArticlesFallback.map((s) => ({ ...s, slug: undefined })),
    ];
    return combined;
  }, [dbArticles]);

  const totalPages = Math.ceil(allMoreArticles.length / itemsPerPage);
  const currentArticles = allMoreArticles.slice(
    (morePage - 1) * itemsPerPage,
    morePage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setPageState({ slug: decodedSlug, page: newPage });
    if (moreTechRef.current) {
      moreTechRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* 1. Global Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* 2. Category Title Banner */}
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-6 w-full text-center">
        {/* Category Heading matching Image 5 slice 1 */}
        <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-tight">
          {categoryTitle}
        </h1>
      </div>

      {/* 4. Section 1: Hero 5-Story Grid matching Image 1 */}
      <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 pb-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: 2 Stacked Stories (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            {/* Story 1 */}
            <article onClick={() => navigateToArticle(heroLeftTop)} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={resolveMediaUrl(heroLeftTop.imageUrl, '/hero-lead.jpg')}
                  alt={heroLeftTop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="font-serif font-bold text-base sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
                {heroLeftTop.title}
              </h2>
              <p className="font-serif text-[12.5px] text-neutral-600 mt-2 leading-relaxed">
                {heroLeftTop.summary}
              </p>
            </article>

            <div className="border-t border-neutral-200 pt-6">
              {/* Story 2 */}
              <article onClick={() => navigateToArticle(heroLeftBottom)} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                  <Image
                    src={resolveMediaUrl(heroLeftBottom.imageUrl, '/hero-lead.jpg')}
                    alt={heroLeftBottom.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="font-serif font-bold text-base sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
                  {heroLeftBottom.title}
                </h2>
                <p className="font-serif text-[12.5px] text-neutral-600 mt-2 leading-relaxed">
                  {heroLeftBottom.summary}
                </p>
              </article>
            </div>
          </div>

          {/* Center Column: 1 Large Lead Story (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col border-y lg:border-y-0 lg:border-x border-neutral-200 py-6 lg:py-0 lg:px-8">
            <article onClick={() => navigateToArticle(heroLead)} className="group cursor-pointer flex flex-col text-center">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-4 rounded-xs shadow-xs">
                <Image
                  src={resolveMediaUrl(heroLead.imageUrl, '/hero-lead.jpg')}
                  alt={heroLead.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-[34px] text-neutral-900 group-hover:underline leading-[1.2] mt-1">
                {heroLead.title}
              </h2>
              <p className="font-serif text-[14px] sm:text-[15px] text-neutral-600 mt-3 leading-relaxed max-w-xl mx-auto">
                {heroLead.summary}
              </p>
            </article>
          </div>

          {/* Right Column: 2 Stacked Stories (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            {/* Story 1 */}
            <article onClick={() => navigateToArticle(heroRightTop)} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={resolveMediaUrl(heroRightTop.imageUrl, '/hero-lead.jpg')}
                  alt={heroRightTop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="font-serif font-bold text-base sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
                {heroRightTop.title}
              </h2>
              <p className="font-serif text-[12.5px] text-neutral-600 mt-2 leading-relaxed">
                {heroRightTop.summary}
              </p>
            </article>

            <div className="border-t border-neutral-200 pt-6">
              {/* Story 2 */}
              <article onClick={() => navigateToArticle(heroRightBottom)} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                  <Image
                    src={resolveMediaUrl(heroRightBottom.imageUrl, '/hero-lead.jpg')}
                    alt={heroRightBottom.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="font-serif font-bold text-base sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
                  {heroRightBottom.title}
                </h2>
                <p className="font-serif text-[12.5px] text-neutral-600 mt-2 leading-relaxed">
                  {heroRightBottom.summary}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Second Advertisement Banner */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 6. Section 2: KEEPING TABS > matching Image 2 */}
      <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 py-8 w-full">
        {/* Section Header */}
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-6 flex items-center justify-between">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase flex items-center">
            KEEPING TABS <ChevronRight className="w-3.5 h-3.5 ml-0.5 stroke-[3]" />
          </h2>
        </div>

        {/* 2-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {keepingTabsCards.map((card) => (
            <article key={card.id} onClick={() => navigateToArticle(card)} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={resolveMediaUrl(card.imageUrl, '/hero-lead.jpg')}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-[22px] text-neutral-900 group-hover:underline leading-snug">
                {card.title}
              </h3>
              <p className="font-serif text-[13.5px] text-neutral-600 mt-2 leading-relaxed">
                {card.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Section 3: LISTEN Audio Shelf matching Image 3 */}
      <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 py-6 w-full">
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-5">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            LISTEN
          </h2>
        </div>

        <div className="bg-neutral-950 text-white rounded-xs p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          {/* Left Text & Controls */}
          <div className="flex-1 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-1">
              The Interface
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-tight">
              The battle to delete your embarrassing online history
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2 leading-relaxed">
              How a kidfluencer law could reshape privacy for everyone, plus the bot purge delusion.
            </p>

            <div className="flex items-center space-x-4 mt-5">
              <button
                onClick={() =>
                  setActivePodcast({
                    id: 'interface-ep1',
                    title: 'The battle to delete your embarrassing online history',
                    subtitle: 'The Interface',
                    episodeDuration: '25 mins',
                    imageUrl: '/tech-listen-key.jpg'
                  })
                }
                className="flex items-center space-x-2 bg-white text-black font-bold text-xs uppercase px-4 py-2 rounded-full hover:bg-neutral-200 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>25 mins</span>
              </button>

              <button className="flex items-center space-x-1.5 text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer">
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Right Image & Equalizer Waveform Graphic */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 overflow-hidden rounded-xs bg-neutral-800">
              <Image
                src="/tech-listen-key.jpg"
                alt="The Interface Podcast"
                fill
                className="object-cover"
              />
            </div>
            {/* Animated Equalizer Waveform */}
            <div className="flex items-end space-x-1 h-16 w-24">
              <span className="w-1.5 bg-neutral-500 rounded-full h-8 animate-pulse"></span>
              <span className="w-1.5 bg-neutral-400 rounded-full h-14 animate-pulse delay-75"></span>
              <span className="w-1.5 bg-neutral-300 rounded-full h-10 animate-pulse delay-150"></span>
              <span className="w-1.5 bg-white rounded-full h-16 animate-pulse delay-200"></span>
              <span className="w-1.5 bg-neutral-400 rounded-full h-12 animate-pulse delay-100"></span>
              <span className="w-1.5 bg-neutral-500 rounded-full h-6 animate-pulse delay-300"></span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Third Advertisement Banner */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 9. Section 4: WATCH Video Hero matching Image 5 slice 2-3 */}
      <section className="bg-neutral-950 text-white py-10 my-4">
        <div className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="border-t border-neutral-800 pt-3 mb-6">
            <h2 className="text-xs sm:text-[13px] font-black text-neutral-300 tracking-wider uppercase">
              WATCH
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Featured Video */}
            <div className="lg:col-span-8">
              <div
                onClick={() =>
                  setActiveVideo({
                    id: 'vid-driverless',
                    title: 'Autonomous vehicles: Are they ready for real city streets?',
                    summary: 'BBC tech reporters test self-driving vehicles in heavy traffic scenarios.',
                    time: '14 mins',
                    category: 'Technology',
                    imageUrl: '/watch-tvs.jpg',
                    isVideo: true,
                    videoDuration: '14 mins'
                  })
                }
                className="relative aspect-video w-full bg-neutral-900 rounded-xs overflow-hidden cursor-pointer group shadow-2xl"
              >
                <Image
                  src="/watch-tvs.jpg"
                  alt="Driverless Cars Tech Feature"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider inline-block mb-1.5">
                    14 MINS
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white group-hover:underline leading-snug">
                    Autonomous vehicles: Are they ready for real city streets?
                  </h3>
                </div>
              </div>
            </div>

            {/* Video Playlist Sidebar */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-800">
                Latest Tech Episodes
              </h4>
              {[
                { id: 'ic-2', title: "Inside the sovereign data centres powering AI models", duration: "8 mins", image: "/tech-missed-2.jpg" },
                { id: 'ic-3', title: "The smart glasses with no cameras attached", duration: "11 mins", image: "/tech-missed-3.jpg" },
                { id: 'kt-1', title: "Could AI truly become self-conscious?", duration: "16 mins", image: "/tech-tabs-1.jpg" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigateToArticle(item)}
                  className="flex items-center space-x-3 cursor-pointer group hover:bg-neutral-900 p-2 rounded transition"
                >
                  <div className="relative w-24 h-16 flex-shrink-0 bg-neutral-800 rounded-xs overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold block">{item.duration}</span>
                    <h5 className="font-serif font-bold text-xs sm:text-sm text-neutral-100 group-hover:underline line-clamp-2">
                      {item.title}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Sponsored MarketViews Grid matching Image 4 bottom */}
      <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 py-6 w-full">
        <div className="flex items-center justify-between border-t border-neutral-300 pt-3 mb-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">
            SPONSORED LINKS
          </span>
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.15em] text-[#7e7e7e]">
            ADVERTISEMENT BY DIANOMI
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {sponsoredDianomi1.map((item) => (
            <div key={item.id} className="cursor-pointer group flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs mb-2">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition" />
              </div>
              <h5 className="font-serif font-bold text-xs text-neutral-900 group-hover:underline line-clamp-2 leading-snug">
                {item.title}
              </h5>
              <span className="text-[10px] text-neutral-500 mt-1">{item.source}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Section 5: IN CASE YOU MISSED IT matching Image 4 */}
      <section className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 py-8 w-full">
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-6">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            IN CASE YOU MISSED IT
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inCaseYouMissedItCards.map((card) => (
            <article key={card.id} onClick={() => navigateToArticle(card)} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={resolveMediaUrl(card.imageUrl, '/hero-lead.jpg')}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
                {card.title}
              </h3>
              <p className="font-serif text-[12.5px] text-neutral-600 mt-2 leading-relaxed">
                {card.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 12. Fourth Advertisement Banner */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 13. Section 6: MORE [CATEGORY] (10 articles per page, centered pagination with next arrow) */}
      <section ref={moreTechRef} className="max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 py-8 w-full scroll-mt-20">
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-6">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            MORE {categoryTitle.toUpperCase()}
          </h2>
        </div>

        {/* 10 Articles matching Image format: Left Date, Middle Headline/Summary, Right Thumbnail */}
        <div className="flex flex-col">
          {currentArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => navigateToArticle(article)}
              className="flex flex-col sm:flex-row items-start justify-between py-5 border-b border-neutral-200 group cursor-pointer first:pt-0"
            >
              {/* Left Column: Date */}
              <div className="w-full sm:w-28 md:w-32 flex-shrink-0 text-xs text-neutral-500 font-sans sm:text-right pr-4 mb-1.5 sm:mb-0">
                {article.date}
              </div>

              {/* Middle Column: Title & Description */}
              <div className="flex-1 pr-4 sm:pr-8">
                <h3 className="font-serif font-bold text-lg sm:text-[19px] md:text-[20px] text-neutral-900 leading-snug group-hover:underline">
                  {article.title}
                </h3>
                <p className="font-serif text-[13px] sm:text-[13.5px] text-neutral-600 mt-1.5 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              {/* Right Column: Landscape Image */}
              <div className="relative w-full sm:w-44 md:w-48 lg:w-52 aspect-[16/10] flex-shrink-0 overflow-hidden bg-neutral-100 rounded-xs mt-3 sm:mt-0 shadow-2xs">
                <Image
                  src={resolveMediaUrl(article.imageUrl, '/hero-lead.jpg')}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </article>
          ))}
        </div>

        {/* Centered Pagination with Arrow matching Image 5 bottom */}
        <div className="flex items-center justify-center pt-8 mt-2 space-x-2">
          {/* Previous Arrow Button */}
          {morePage > 1 && (
            <button
              onClick={() => handlePageChange(morePage - 1)}
              className="w-8 h-8 flex items-center justify-center border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-xs transition cursor-pointer text-xs font-bold"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === morePage;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100 bg-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Arrow Button */}
          {morePage < totalPages && (
            <button
              onClick={() => handlePageChange(morePage + 1)}
              className="w-8 h-8 flex items-center justify-center border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-xs transition cursor-pointer text-xs font-bold"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </section>

      {/* 14. Global BBC Footer */}
      <Footer />

      {/* Interactive Floating Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={(article) => {
          setIsSearchOpen(false);
          navigateToArticle(article);
        }}
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