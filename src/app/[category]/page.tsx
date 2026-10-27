'use client';

import React, { useState, useRef, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Bookmark, ChevronRight, ChevronLeft } from 'lucide-react';

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

  // Pagination for MORE [CATEGORY] section
  const [morePage, setMorePage] = useState<number>(1);
  const itemsPerPage = 10;
  const moreTechRef = useRef<HTMLDivElement>(null);

  const navigateToArticle = () => {
    const articleUrl = encodeURI("/news/articles/How-a-movement-of-students-brought-down-Serbia's-Vučić");
    if (typeof window !== 'undefined') {
      window.location.href = articleUrl;
    } else {
      router.push(articleUrl);
    }
  };

  // Section 1: Hero 5-Story Data (Image 1)
  const heroLeftTop = {
    title: "How one man became the unsung hero of the internet during a cyber-security scramble",
    summary: "For more than 20 years, Ondřej Surý has been quietly helping to keep websites around the world running securely, largely in his spare time.",
    imageUrl: "/tech-hero-1.jpg",
    time: "4 hrs ago"
  };

  const heroLeftBottom = {
    title: "Gabon says access to social media restored after eight month ban",
    summary: "The authorities had justified the ban by saying online content was fuelling conflict, while the opposition had condemned it as an abuse of power.",
    imageUrl: "/tech-hero-2.jpg",
    time: "7 hrs ago"
  };

  const heroLead = {
    title: "Police using AI risks making discrimination worse, researchers warn",
    summary: "AI tools learn from biased records and may deepen discrimination against minorities without oversight, researchers say.",
    imageUrl: "/tech-hero-lead.jpg",
    time: "2 hrs ago"
  };

  const heroRightTop = {
    title: "The Indian workers filming their work to train AI",
    summary: "Indian workers are being paid to film themselves at work and the footage is used to train AI.",
    imageUrl: "/tech-hero-3.jpg",
    time: "5 hrs ago"
  };

  const heroRightBottom = {
    title: "'I'm 96 and have 15 million followers': The grannies taking over TikTok",
    summary: "Grandma Droniak, Nonna Gracie, Viv Truran and Barbara Costello have all found fame on social media in their later years.",
    imageUrl: "/tech-hero-4.jpg",
    time: "8 hrs ago"
  };

  // Section 2: KEEPING TABS (Image 2)
  const keepingTabsCards = [
    {
      id: 'kt-1',
      title: "Anthropic thinks its AI might be conscious. It has profound consequences for your life",
      summary: "Some of the most powerful people in tech are taking steps to consider AI's rights alongside humans and animals. This belief could reshape our world. Some fear it would be catastrophic.",
      imageUrl: "/tech-tabs-1.jpg",
      time: "3 hrs ago"
    },
    {
      id: 'kt-2',
      title: "Meta's new AI is about to make the internet more annoying",
      summary: "Meta's new AI Muse can shop, haggle and book appointments for you. What happens when millions of agents start doing the same?",
      imageUrl: "/tech-tabs-2.jpg",
      time: "6 hrs ago"
    }
  ];

  // Section 4: IN CASE YOU MISSED IT (Image 4)
  const inCaseYouMissedItCards = [
    {
      id: 'ic-1',
      title: "Why did an OpenAI agent hack Australia's health system and can it be stopped in the future?",
      summary: "News that an automated AI agent hacked a government IT system raises big questions about regulating the tech.",
      imageUrl: "/tech-missed-1.jpg"
    },
    {
      id: 'ic-2',
      title: "Huge data centres rise at 'China speed' to power its AI ambitions",
      summary: "The BBC visits Inner Mongolia, an unlikely frontier in Beijing's AI race with Washington.",
      imageUrl: "/tech-missed-2.jpg"
    },
    {
      id: 'ic-3',
      title: "They were labelled 'pervert glasses'. Will a camera-free version transform their image?",
      summary: "Meta has unveiled audio-only smart glasses, with some questioning whether it is a response to the backlash over privacy.",
      imageUrl: "/tech-missed-3.jpg"
    },
    {
      id: 'ic-4',
      title: "Why are there concerns AI could threaten humanity, and how real are they?",
      summary: "Existential fears about AI have once again reared their head - here's what you need to know.",
      imageUrl: "/tech-missed-4.jpg"
    }
  ];

  // Sponsored Dianomi Cards (Image 4 bottom)
  const sponsoredDianomi1 = [
    { id: 'sp-1', title: 'Discover the latest finance insights from global experts.', source: 'MarketViews', imageUrl: '/sidebar-ad-1.jpg' },
    { id: 'sp-2', title: 'Uncover the latest AI insights and breakthroughs.', source: 'MarketViews', imageUrl: '/sidebar-ad-2.jpg' },
    { id: 'sp-3', title: 'What is the latest on ETFs?', source: 'MarketViews', imageUrl: '/sidebar-ad-3.jpg' },
    { id: 'sp-4', title: 'Uncover the latest trends in retirement planning strategies.', source: 'MarketViews', imageUrl: '/sidebar-ad-4.jpg' },
    { id: 'sp-5', title: 'Robotics and Artificial Intelligence. Discover the trends.', source: 'MarketViews', imageUrl: '/taboola-1.jpg' }
  ];

  // Section 5: MORE TECH Articles (20 items total, 10 per page matching Image 5 slices 3, 4, 5)
  const allMoreArticles = [
    // Page 1 (Articles 1 - 10)
    {
      id: 'mt-1',
      date: '2 hrs ago',
      title: "Global connectivity surge: High-speed satellite networks challenge undersea cable dominance",
      summary: "Engineers deploy new mesh satellite constellations as international carriers reassess deep-sea internet infrastructure vulnerabilities.",
      imageUrl: '/more-tech-1.jpg'
    },
    {
      id: 'mt-2',
      date: '4 hrs ago',
      title: "Robotic companions prove unexpected breakthrough in elder cognitive care therapy",
      summary: "Clinical trials across European nursing homes suggest tactile robotic pets reduce stress and enhance daily cognitive engagement.",
      imageUrl: '/more-tech-2.jpg'
    },
    {
      id: 'mt-3',
      date: '6 hrs ago',
      title: "Inside the open-source community fixing legacy internet security protocols for free",
      summary: "A distributed collective of voluntary developers continues to patch foundational web standards that commercial tech relies upon.",
      imageUrl: '/more-tech-3.jpg'
    },
    {
      id: 'mt-4',
      date: '8 hrs ago',
      title: "Neural synthesis models simulate authentic speech for patients with severe voice impairment",
      summary: "Breakthrough machine learning systems restore vocal identity using only minutes of archived audio recordings.",
      imageUrl: '/more-tech-4.jpg'
    },
    {
      id: 'mt-5',
      date: '10 hrs ago',
      title: "Algorithmic hiring filters face strict scrutiny under new corporate accountability rules",
      summary: "Regulators require tech companies to provide independent auditing logs for candidate resume screening tools.",
      imageUrl: '/more-tech-5.jpg'
    },
    {
      id: 'mt-6',
      date: '12 hrs ago',
      title: "The microchip fabrication race: How sovereign semiconductor factories are redefining geopolitical leverage",
      summary: "Billions in state subsidies accelerate domestic foundry manufacturing across Europe and the United States.",
      imageUrl: '/more-tech-6.jpg'
    },
    {
      id: 'mt-7',
      date: '14 hrs ago',
      title: "Next-generation liquid cooling architectures save energy in hyperscale AI computing clusters",
      summary: "Data centers replace traditional chillers with submerged immersion tanks to curb surging electricity demands.",
      imageUrl: '/more-tech-7.jpg'
    },
    {
      id: 'mt-8',
      date: '16 hrs ago',
      title: "Autonomous drone networks deliver critical emergency medical supplies to remote islands",
      summary: "Automated flight corridors bypass inclement coastal weather to deliver anti-venom and emergency blood packs within minutes.",
      imageUrl: '/more-tech-8.jpg'
    },
    {
      id: 'mt-9',
      date: '18 hrs ago',
      title: "Tech CEOs clash over safety thresholds for multi-modal frontier models in closed-door summit",
      summary: "Industry leaders debate voluntary model weight release moratoriums and government red-teaming mandates.",
      imageUrl: '/more-tech-9.jpg'
    },
    {
      id: 'mt-10',
      date: '20 hrs ago',
      title: "Smart grid controllers deploy machine learning to balance renewable power grid surges",
      summary: "Software predicts sudden wind and solar generation spikes, diverting excess electricity into regional storage banks.",
      imageUrl: '/more-tech-10.jpg'
    },
    // Page 2 (Articles 11 - 20)
    {
      id: 'mt-11',
      date: '1 day ago',
      title: "Wearable brain-computer interfaces demonstrate real-time keyboard typing without surgery",
      summary: "Non-invasive optical sensors detect pre-motor cortex signals with ninety-four percent character accuracy.",
      imageUrl: '/more-tech-11.jpg'
    },
    {
      id: 'mt-12',
      date: '1 day ago',
      title: "European privacy regulators order compliance audits on mobile advertising device tracking IDs",
      summary: "Cross-app tracking identifiers face renewed legal challenges under updated consumer privacy protection laws.",
      imageUrl: '/more-tech-12.jpg'
    },
    {
      id: 'mt-13',
      date: '2 days ago',
      title: "Quantum key distribution link secures inter-bank currency transaction network",
      summary: "Commercial financial institutions test quantum cryptographic protocols immune to quantum computing decryption.",
      imageUrl: '/more-tech-13.jpg'
    },
    {
      id: 'mt-14',
      date: '2 days ago',
      title: "Biometric sensor rings predict onset of viral infections before visible symptoms emerge",
      summary: "Continuous temperature and pulse wave micro-fluctuations alert wearers hours before fevers materialize.",
      imageUrl: '/more-tech-14.jpg'
    },
    {
      id: 'mt-15',
      date: '3 days ago',
      title: "Synthetic voice generation scams trigger urgent calls for digital watermarking legislation",
      summary: "Telecommunications providers test automated cryptographic audio signatures to verify caller legitimacy.",
      imageUrl: '/more-tech-15.jpg'
    },
    {
      id: 'mt-16',
      date: '3 days ago',
      title: "Space telescope constellation maps orbital space debris with millimeter precision",
      summary: "Low Earth orbit tracking network alerts satellite operators to collision risks with unprecedented advance warning.",
      imageUrl: '/more-tech-1.jpg'
    },
    {
      id: 'mt-17',
      date: '4 days ago',
      title: "Solid-state battery cells enter pilot automotive fleet trials with ten-minute recharge times",
      summary: "Automakers test prototype ceramic electrolyte packs promising five hundred miles of range on a single charge.",
      imageUrl: '/more-tech-2.jpg'
    },
    {
      id: 'mt-18',
      date: '4 days ago',
      title: "Digital rights organizations demand open protocols for cross-platform messaging services",
      summary: "Interoperability regulations compel tech giants to open end-to-end encrypted messaging bridge APIs.",
      imageUrl: '/more-tech-3.jpg'
    },
    {
      id: 'mt-19',
      date: '5 days ago',
      title: "Deep-sea underwater research drones uncover new hydrothermal vents using edge AI navigation",
      summary: "Autonomous oceanographic submarines navigate extreme trench depths without tethered human pilot commands.",
      imageUrl: '/more-tech-4.jpg'
    },
    {
      id: 'mt-20',
      date: '5 days ago',
      title: "The evolving ethical framework for synthetic biological data storage in DNA molecules",
      summary: "Scientists archive petabytes of cultural knowledge inside synthetic DNA strands capable of lasting millennia.",
      imageUrl: '/more-tech-5.jpg'
    }
  ];

  const totalPages = Math.ceil(allMoreArticles.length / itemsPerPage);
  const currentArticles = allMoreArticles.slice(
    (morePage - 1) * itemsPerPage,
    morePage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setMorePage(newPage);
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

      {/* 2. Top Advertisement Banner matching reference image */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 3. Category Title Banner */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-2 pb-6 w-full text-center">
        {/* Category Heading matching Image 5 slice 1 */}
        <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-tight">
          {categoryTitle}
        </h1>
      </div>

      {/* 4. Section 1: Hero 5-Story Grid matching Image 1 */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: 2 Stacked Stories (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            {/* Story 1 */}
            <article onClick={navigateToArticle} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={heroLeftTop.imageUrl}
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
              <article onClick={navigateToArticle} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                  <Image
                    src={heroLeftBottom.imageUrl}
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
            <article onClick={navigateToArticle} className="group cursor-pointer flex flex-col text-center">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-4 rounded-xs shadow-xs">
                <Image
                  src={heroLead.imageUrl}
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
            <article onClick={navigateToArticle} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={heroRightTop.imageUrl}
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
              <article onClick={navigateToArticle} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                  <Image
                    src={heroRightBottom.imageUrl}
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
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Section Header */}
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-6 flex items-center justify-between">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase flex items-center">
            KEEPING TABS <ChevronRight className="w-3.5 h-3.5 ml-0.5 stroke-[3]" />
          </h2>
        </div>

        {/* 2-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {keepingTabsCards.map((card) => (
            <article key={card.id} onClick={navigateToArticle} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={card.imageUrl}
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
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 w-full">
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
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
                { title: "Inside the sovereign data centres powering AI models", duration: "8 mins", image: "/tech-missed-2.jpg" },
                { title: "The smart glasses with no cameras attached", duration: "11 mins", image: "/tech-missed-3.jpg" },
                { title: "Could AI truly become self-conscious?", duration: "16 mins", image: "/tech-tabs-1.jpg" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={navigateToArticle}
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
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 w-full">
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
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-6">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            IN CASE YOU MISSED IT
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inCaseYouMissedItCards.map((card) => (
            <article key={card.id} onClick={navigateToArticle} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-3 rounded-xs shadow-2xs">
                <Image
                  src={card.imageUrl}
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

      {/* 13. Section 6: MORE TECH (10 articles per page, centered pagination with next arrow matching Image 5) */}
      <section ref={moreTechRef} className="max-w-[1040px] mx-auto px-4 sm:px-6 py-8 w-full scroll-mt-20">
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-6">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            MORE TECH
          </h2>
        </div>

        {/* 10 Articles matching Image format: Left Date, Middle Headline/Summary, Right Thumbnail */}
        <div className="flex flex-col">
          {currentArticles.map((article) => (
            <article
              key={article.id}
              onClick={navigateToArticle}
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
                  src={article.imageUrl}
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
        onSelectArticle={() => setIsSearchOpen(false)}
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