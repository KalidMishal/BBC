'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Share2, Bookmark, Play, Check } from 'lucide-react';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import AdBanner from '../../../../components/AdBanner';
import SearchModal from '../../../../components/SearchModal';
import MobileMenu from '../../../../components/MobileMenu';
import SignInModal from '../../../../components/SignInModal';
import AudioPlayerBar from '../../../../components/AudioPlayerBar';
import { Article, PodcastItem } from '../../../../types';

export default function ArticleDetailPage() {
  const router = useRouter();
  const moreSectionRef = useRef<HTMLDivElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);

  // Pagination state for MORE FROM [CATEGORY] section
  const [moreCategoryPage, setMoreCategoryPage] = useState(1);
  const itemsPerPage = 10;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const relatedArticles = [
    {
      id: 'rel-1',
      title: "Celebrations in Serbia after veteran ruler Vučić loses election to student-led protest movement",
      isVideo: false
    },
    {
      id: 'rel-2',
      title: "Joy and disbelief on Serbian streets as Vučić concedes election defeat",
      isVideo: true
    },
    {
      id: 'rel-3',
      title: "Early reports suggest record high turnout in Serbia elections",
      isVideo: false
    }
  ];

  const sidebarAds = [
    {
      id: 'sb-1',
      title: "Robotics and Artificial Intelligence. Discover the trends.",
      source: "MarketViews",
      imageUrl: "/sidebar-ad-1.jpg"
    },
    {
      id: 'sb-2',
      title: "Uncover the latest trends in retirement planning strategies.",
      source: "MarketViews",
      imageUrl: "/sidebar-ad-2.jpg"
    },
    {
      id: 'sb-3',
      title: "What are the latest AI trends currently being talked about?",
      source: "MarketViews",
      imageUrl: "/sidebar-ad-3.jpg"
    },
    {
      id: 'sb-4',
      title: "Discover the latest finance insights from global experts.",
      source: "MarketViews",
      imageUrl: "/sidebar-ad-4.jpg"
    }
  ];

  const taboolaCards = [
    {
      id: 'tab-1',
      title: "I Asked ChatGPT What the Rich Do That We Don't. The Answer Was Uncomfortable...",
      source: "Blinkist Magazine | Paid Content",
      imageUrl: "/taboola-1.jpg"
    },
    {
      id: 'tab-2',
      title: "I Asked ChatGPT What Rich People Do Differently. It Gave Me One Word.",
      source: "Blinkist Magazine | Paid Content",
      imageUrl: "/taboola-2.jpg"
    },
    {
      id: 'tab-3',
      title: "Men jailed after student raped, filmed and dumped in Clent road",
      source: "She was picked up in Birmingham by three men who hired a car for th...",
      imageUrl: "/taboola-3.jpg"
    },
    {
      id: 'tab-4',
      title: "Selena Gomez says vaping has affected her voice",
      source: "The 34-year-old says vaping nicotine 'a lot' permanently affected her...",
      imageUrl: "/taboola-4.jpg"
    },
    {
      id: 'tab-5',
      title: "Daughter of murdered woman 'refuses to be another victim'",
      source: "Keeley McKee's mother Leanne was killed by her partner in 2003, week...",
      imageUrl: "/taboola-5.jpg"
    },
    {
      id: 'tab-6',
      title: "Child poverty in Wales - Daughter slept on bed propped up by books",
      source: "Sarah Ruscoe, a single mum out of work due to health issues, worried...",
      imageUrl: "/taboola-6.jpg"
    }
  ];

  // 20 Articles for MORE FROM SERBIA (10 per page)
  const moreCategoryArticles = [
    {
      id: 'mf-1',
      date: '3 days ago',
      title: 'Why a student protest movement is challenging 12 years of Vučić rule in Serbia',
      summary: 'After two years of student protests, Serbians vote on Sunday in elections that could bring down the ruling party.',
      imageUrl: '/more-from-1.jpg'
    },
    {
      id: 'mf-2',
      date: '18 Jun 2026',
      title: "Parents of Serbia's teenage school shooter given jail terms in retrial",
      summary: 'The boy was 13 when he killed eight girls, a boy and a school guard at Vladislav Ribnikar school in Belgrade in 2023.',
      imageUrl: '/more-from-2.jpg'
    },
    {
      id: 'mf-3',
      date: '4 Feb 2026',
      title: 'How plans for Trump International hotel in Belgrade unravelled',
      summary: 'The project would have built on the ruins of the defence ministry bombed by Nato back in 1999.',
      imageUrl: '/more-from-3.jpg'
    },
    {
      id: 'mf-4',
      date: '8 Nov 2025',
      title: 'Serbia clears the way for controversial Trump-linked real estate plan',
      summary: 'Lawmakers passed a declaration paving the way for the demolition of the former defence ministry ruins.',
      imageUrl: '/hero-lead.jpg'
    },
    {
      id: 'mf-5',
      date: '25 Dec 2025',
      title: 'Belgrade students blockade ministry demanding election fraud probe',
      summary: 'Thousands of students took to the streets to demand a recount following disputed local election results.',
      imageUrl: '/article-hero-students.jpg'
    },
    {
      id: 'mf-6',
      date: '5 Nov 2025',
      title: 'Serbia rail disaster: Transport minister resigns after 14 killed at station',
      summary: 'Goran Vesić announced his departure following public outrage over the deadly collapse of a concrete station canopy.',
      imageUrl: '/morenews-nairobi.jpg'
    },
    {
      id: 'mf-7',
      date: '18 Dec 2025',
      title: "EU monitors report 'unjust conditions' in Serbian parliamentary vote",
      summary: 'International observers highlighted media bias, pressure on public sector employees and misuse of public resources.',
      imageUrl: '/morenews-ai.jpg'
    },
    {
      id: 'mf-8',
      date: '10 Aug 2025',
      title: 'Thousands march in Serbia against major lithium mining project',
      summary: "Environmental activists and opposition supporters filled Belgrade's central squares to protest Rio Tinto's Jadar project.",
      imageUrl: '/morenews-bovino.jpg'
    },
    {
      id: 'mf-9',
      date: '2 Nov 2025',
      title: 'How a roof collapse in Novi Sad triggered a nationwide youth uprising',
      summary: 'Grief transformed into a political earthquake that united students, trade unions and opposition parties across Serbia.',
      imageUrl: '/morenews-burnham.jpg'
    },
    {
      id: 'mf-10',
      date: '2 Jun 2025',
      title: 'Opposition boycotts Belgrade vote rerun citing ongoing irregularities',
      summary: 'Main coalition leaders refused to participate in municipal re-runs without independent international scrutiny.',
      imageUrl: '/morenews-vanessa.jpg'
    },
    // Page 2 (Articles 11 - 20)
    {
      id: 'mf-11',
      date: '15 May 2025',
      title: 'Serbia and Kosovo leaders hold high-stakes diplomatic talks in Brussels',
      summary: 'European Union mediators push both sides toward normalized relations amid heightened regional security tensions.',
      imageUrl: '/hero-lead.jpg'
    },
    {
      id: 'mf-12',
      date: '1 Nov 2025',
      title: 'Vučić promises swift investigation into station canopy collapse tragedy',
      summary: 'The Serbian president pledged full criminal accountability for those responsible for the engineering failure.',
      imageUrl: '/more-from-3.jpg'
    },
    {
      id: 'mf-13',
      date: '22 Oct 2025',
      title: 'Why young Serbians are choosing grassroots activism over emigration',
      summary: 'Generational shift sees educated youth remaining in the country to challenge democratic backsliding.',
      imageUrl: '/article-hero-students.jpg'
    },
    {
      id: 'mf-14',
      date: '14 Sep 2025',
      title: "Belgrade's historic railway station at center of redevelopment debate",
      summary: 'Heritage preservationists argue the 19th-century terminal should be protected from luxury waterfront commercialization.',
      imageUrl: '/more-from-2.jpg'
    },
    {
      id: 'mf-15',
      date: '29 Dec 2025',
      title: 'Students set up 24-hour blockades in Serbian university campuses',
      summary: 'Academic halls transformed into headquarters for civil disobedience across Belgrade and Novi Sad.',
      imageUrl: '/more-from-1.jpg'
    },
    {
      id: 'mf-16',
      date: '19 Jul 2025',
      title: 'International press freedom groups express concern over Serbian media climate',
      summary: 'Watchdogs call for impartial coverage and protection for investigative journalists reporting on corruption.',
      imageUrl: '/morenews-ai.jpg'
    },
    {
      id: 'mf-17',
      date: '3 Aug 2025',
      title: "Serbia's economic balancing act between European ties and global investment",
      summary: 'How infrastructure projects and foreign direct investment continue to influence foreign policy decisions.',
      imageUrl: '/morenews-bovino.jpg'
    },
    {
      id: 'mf-18',
      date: '8 Jul 2025',
      title: 'Activists camp out in central park ahead of massive Belgrade rally',
      summary: 'Organizers set up medical aid tents and information hubs as crowds arrive from across the country.',
      imageUrl: '/morenews-burnham.jpg'
    },
    {
      id: 'mf-19',
      date: '4 Nov 2025',
      title: 'Novi Sad mourning turns to determination as citizens demand accountability',
      summary: 'Thousands lay flowers and candles at the railway station before joining silent vigils across the city.',
      imageUrl: '/more-from-2.jpg'
    },
    {
      id: 'mf-20',
      date: '12 Jan 2026',
      title: 'Serbian diaspora rallies across Europe in solidarity with student protests',
      summary: 'Expatriate communities gather outside embassies in London, Berlin and Vienna supporting democratic change.',
      imageUrl: '/article-hero-students.jpg'
    }
  ];

  const totalMorePages = Math.ceil(moreCategoryArticles.length / itemsPerPage);
  const currentMoreArticles = moreCategoryArticles.slice(
    (moreCategoryPage - 1) * itemsPerPage,
    moreCategoryPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setMoreCategoryPage(newPage);
    if (moreSectionRef.current) {
      moreSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* 1. Global BBC Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* 2. Top Advertisement Banner matching Image 1 */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 3. Main Article Body Container */}
      <article className="max-w-[1040px] mx-auto px-4 sm:px-6 pt-4 pb-8">
        
        {/* Article Headline */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[42px] text-neutral-900 leading-[1.18] mb-4">
          How a movement of students brought down Serbia&apos;s Vučić
        </h1>

        {/* Metadata and Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-4 mb-5 gap-3">
          {/* Author and Published Info */}
          <div>
            <span className="font-sans text-xs text-neutral-500 block mb-1">
              6 hours ago
            </span>
            <span className="font-sans font-bold text-sm text-neutral-900 block">
              Paul Kirby
            </span>
            <span className="font-sans text-xs text-neutral-500 block">
              Europe digital editor
            </span>
          </div>

          {/* Social / Action Buttons */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 text-neutral-700 hover:text-neutral-900 font-medium px-2 py-1 rounded hover:bg-neutral-100 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
              <span>{copiedShare ? 'Copied' : 'Share'}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center space-x-1.5 font-medium px-2 py-1 rounded transition cursor-pointer ${
                isSaved ? 'text-red-600 bg-red-50' : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 stroke-[2] ${isSaved ? 'fill-red-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* Add as preferred on Google */}
            <div className="inline-flex items-center space-x-1.5 border border-neutral-300 rounded-sm px-2.5 py-1 text-xs text-neutral-700 hover:bg-neutral-50 transition cursor-pointer">
              {/* Google G logo */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Add as preferred on Google</span>
            </div>
          </div>
        </div>

        {/* 4. Hero Image matching Image 1 & 2 */}
        <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-neutral-100 rounded-xs mb-2">
          <Image
            src="/article-hero-students.jpg"
            alt="Students movement celebrating in Serbia"
            fill
            priority
            className="object-cover"
          />
        </div>
        {/* Caption */}
        <div className="flex items-center justify-between font-sans text-xs text-neutral-500 mb-6">
          <span>Although it was a students&apos; movement that won Serbia&apos;s election, no student has been elected</span>
          <span className="text-[11px] text-neutral-400">AFP via Getty Images</span>
        </div>

        {/* 5. Article Content & Right Sidebar matching Image 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Main Story Text Column (~65%) */}
          <div className="lg:col-span-8">
            <p className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5">
              Theirs is a movement born from tragedy that began with students blockading streets and turned into almost daily protests and a national movement against corruption and government negligence.
            </p>

            <p className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5">
              In just under two years the students have succeeded in tearing up 14 years of political dominance under Aleksandar Vučić, who has seen support for his Serbian Progressive party (SNS) ebb away and ultimately fail in what became a referendum on the future of Serbia.
            </p>

            <p className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5">
              From Belgrade to Novi Sad and Niš, the mood was euphoric as supporters gathered in town centres or in front of Student List headquarters. In a post on social media, the students declared &quot;Serbia is free&quot;.
            </p>

            <p className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5">
              Most symbolic of all was the demise of so-called Ćaciland, a pro-Vučić tent camp set up 18 months ago at Pioneers Park in central Belgrade in front of the Serbian parliament. Metal fences were torn down amid shouts of &quot;Vučić is leaving&quot;.
            </p>

            {/* Subheading */}
            <h2 className="font-serif font-bold text-2xl sm:text-[26px] text-neutral-900 mt-8 mb-4">
              How the students changed Serbia
            </h2>

            <p className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5">
              They have no obvious leaders and have no grounding in politics, and yet the &quot;Student List-Students Win&quot; movement attracted anti-government voters across Serbian society.
            </p>

            <p className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5">
              They fielded candidates for all 250 parliamentary seats, and yet no students were among them.
            </p>

            <p className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5">
              As he joined the students marching towards Belgrade last week, lead candidate and cardiologist Ilija Srdanović said history was being rewritten: &quot;The energy is unstoppable.&quot;
            </p>

            {/* Tag Badge */}
            <div className="mt-8 pt-4">
              <span className="inline-block bg-neutral-100 text-neutral-800 text-xs font-sans font-medium px-3.5 py-1.5 rounded-xs hover:bg-neutral-200 transition cursor-pointer">
                Serbia
              </span>
            </div>
          </div>

          {/* Right Sidebar Ad Area matching Image 2 */}
          <aside className="lg:col-span-4 flex flex-col space-y-6">
            <div className="border-t border-neutral-200 pt-2">
              <div className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#7e7e7e] text-right mb-3">
                ADVERTISEMENT
              </div>

              {/* Sponsored 4-card list matching Image 2 */}
              <div className="flex flex-col divide-y divide-neutral-200">
                {sidebarAds.map((ad) => (
                  <div key={ad.id} className="py-3 first:pt-0 last:pb-0 flex items-start space-x-3 cursor-pointer group">
                    <div className="relative w-16 h-12 flex-shrink-0 bg-neutral-100 overflow-hidden rounded-xs">
                      <Image
                        src={ad.imageUrl}
                        alt={ad.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-sans font-bold text-xs text-neutral-900 group-hover:underline leading-tight line-clamp-2">
                        {ad.title}
                      </h4>
                      <span className="font-sans text-[10.5px] text-neutral-500 mt-1 block">
                        {ad.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard 300x250 placeholder */}
            <div className="w-full bg-[#f9f9f9] border border-[#ebebeb] h-[250px] flex items-center justify-center select-none">
              <span className="text-sm font-sans font-medium text-[#767676] tracking-wide">
                300 x 250
              </span>
            </div>
          </aside>
        </div>

      </article>

      {/* 6. Mid-page Advertisement Banner matching instruction */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 7. RELATED Section matching Image 3 */}
      <section className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6">
        <div className="border-t-2 border-neutral-900 pt-2.5 mb-5">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            RELATED
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((item) => (
            <article
              key={item.id}
              onClick={() => router.push(encodeURI("/news/articles/How-a-movement-of-students-brought-down-Serbia's-Vučić"))}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <h3 className="font-serif font-bold text-base sm:text-[16.5px] text-neutral-900 group-hover:underline leading-snug">
                {item.isVideo && (
                  <span className="inline-flex items-center text-neutral-900 mr-1.5 align-baseline">
                    ▶
                  </span>
                )}
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </section>

      {/* 8. MORE FROM [CATEGORY] Section matching uploaded image format */}
      <section ref={moreSectionRef} className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 scroll-mt-24">
        {/* Section Header matching image */}
        <div className="border-t-2 border-neutral-900 pt-2 mb-6">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            MORE FROM SERBIA
          </h2>
        </div>

        {/* 10 Articles List (Matching Image Layout: Date left, Title/Summary center, Image right) */}
        <div className="flex flex-col">
          {currentMoreArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col sm:flex-row items-start justify-between py-5 border-b border-neutral-200 group cursor-pointer first:pt-0"
            >
              {/* Left Column: Date (~110px on desktop) */}
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

              {/* Right Column: Landscape Thumbnail Image */}
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

        {/* Pagination: Previous and Next Buttons */}
        <div className="flex items-center justify-between pt-6 mt-2">
          <button
            onClick={() => handlePageChange(Math.max(moreCategoryPage - 1, 1))}
            disabled={moreCategoryPage === 1}
            className={`px-5 py-2 font-bold text-xs uppercase tracking-wider border transition cursor-pointer ${
              moreCategoryPage === 1
                ? 'border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50'
                : 'border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            ← Previous
          </button>

          <span className="text-xs font-bold text-neutral-600 font-sans">
            Page {moreCategoryPage} of {totalMorePages}
          </span>

          <button
            onClick={() => handlePageChange(Math.min(moreCategoryPage + 1, totalMorePages))}
            disabled={moreCategoryPage === totalMorePages}
            className={`px-5 py-2 font-bold text-xs uppercase tracking-wider border transition cursor-pointer ${
              moreCategoryPage === totalMorePages
                ? 'border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50'
                : 'border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            Next →
          </button>
        </div>
      </section>

      {/* 9. Bottom Advertisement Banner & Taboola Feed matching Image 4 & instruction */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* Sponsored Taboola Grid matching Image 4 */}
      <section className="max-w-[1040px] mx-auto px-4 sm:px-6 pt-4 pb-12">
        <div className="flex items-center justify-between border-t border-neutral-300 pt-3 mb-5">
          <span className="font-sans font-bold text-xs text-neutral-800">
            Taboola Feed
          </span>
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.15em] text-[#7e7e7e]">
            ADVERTISEMENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taboolaCards.map((card) => (
            <div
              key={card.id}
              className="flex items-start justify-between space-x-3 cursor-pointer group pb-3 border-b border-neutral-100"
            >
              <div className="flex-1">
                <h4 className="font-serif font-bold text-sm text-neutral-900 group-hover:underline leading-snug line-clamp-3">
                  {card.title}
                </h4>
                <p className="font-sans text-[11px] text-neutral-500 mt-1 line-clamp-2">
                  {card.source}
                </p>
              </div>
              <div className="relative w-20 h-16 flex-shrink-0 bg-neutral-100 overflow-hidden rounded-xs">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Global BBC Footer */}
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

      <AudioPlayerBar
        podcast={activePodcast}
        onClose={() => setActivePodcast(null)}
      />
    </main>
  );
}
