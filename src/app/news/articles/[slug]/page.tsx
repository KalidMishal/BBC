'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import AdBanner from '../../../../components/AdBanner';
import AuthorProfile from '../../../../components/AuthorProfile';
import SearchModal from '../../../../components/SearchModal';
import MobileMenu from '../../../../components/MobileMenu';
import SignInModal from '../../../../components/SignInModal';
import AudioPlayerBar from '../../../../components/AudioPlayerBar';
import { SkeletonArticleDetail } from '../../../../components/Skeletons';
import { fetchArticleDetailApi, resolveMediaUrl } from '../../../../lib/api';
import { getCategorySlugByName } from '../../../../data/editorialConfig';
import {
  buildFallbackBodyParagraphs,
  findStaticArticleFallback,
  getArticleEnrichment,
} from '../../../../data/articleEnrichments';
import { Article, PodcastItem } from '../../../../types';

function extractFirstImageSrc(html: string): string {
  if (!html) return '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ? match[1].trim() : '';
}

function stripHtmlText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatDisplayDate(dateStr?: string | null, fallback?: string): string {
  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }
  return fallback || 'Recent';
}

const STATIC_SERBIA_RELATED: Article[] = [
  {
    id: 'rel-1',
    slug: "How-a-movement-of-students-brought-down-Serbia's-Vučić",
    title:
      'Celebrations in Serbia after veteran ruler Vučić loses election to student-led protest movement',
    isVideo: false,
  },
  {
    id: 'rel-2',
    slug: "How-a-movement-of-students-brought-down-Serbia's-Vučić",
    title:
      'Joy and disbelief on Serbian streets as Vučić concedes election defeat',
    isVideo: true,
  },
  {
    id: 'rel-3',
    slug: "How-a-movement-of-students-brought-down-Serbia's-Vučić",
    title: 'Early reports suggest record high turnout in Serbia elections',
    isVideo: false,
  },
];

const STATIC_SERBIA_MORE = [
  {
    id: 'mf-1',
    date: '3 days ago',
    title:
      'Why a student protest movement is challenging 12 years of Vučić rule in Serbia',
    summary:
      'After two years of student protests, Serbians vote on Sunday in elections that could bring down the ruling party.',
    imageUrl: '/more-from-1.jpg',
  },
  {
    id: 'mf-2',
    date: '18 Jun 2026',
    title:
      "Parents of Serbia's teenage school shooter given jail terms in retrial",
    summary:
      'The boy was 13 when he killed eight girls, a boy and a school guard at Vladislav Ribnikar school in Belgrade in 2023.',
    imageUrl: '/more-from-2.jpg',
  },
  {
    id: 'mf-3',
    date: '4 Feb 2026',
    title: 'How plans for Trump International hotel in Belgrade unravelled',
    summary:
      'The project would have built on the ruins of the defence ministry bombed by Nato back in 1999.',
    imageUrl: '/more-from-3.jpg',
  },
  {
    id: 'mf-4',
    date: '8 Nov 2025',
    title:
      'Serbia clears the way for controversial Trump-linked real estate plan',
    summary:
      'Lawmakers passed a declaration paving the way for the demolition of the former defence ministry ruins.',
    imageUrl: '/hero-lead.jpg',
  },
  {
    id: 'mf-5',
    date: '25 Dec 2025',
    title: 'Belgrade students blockade ministry demanding election fraud probe',
    summary:
      'Thousands of students took to the streets to demand a recount following disputed local election results.',
    imageUrl: '/article-hero-students.jpg',
  },
  {
    id: 'mf-6',
    date: '5 Nov 2025',
    title:
      'Serbia rail disaster: Transport minister resigns after 14 killed at station',
    summary:
      'Goran Vesić announced his departure following public outrage over the deadly collapse of a concrete station canopy.',
    imageUrl: '/morenews-nairobi.jpg',
  },
];

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawSlug =
    typeof params?.slug === 'string' ? decodeURIComponent(params.slug) : '';
  const moreSectionRef = useRef<HTMLDivElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);

  const [loadedSlug, setLoadedSlug] = useState<string>('');
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedFromDb, setRelatedFromDb] = useState<Article[]>([]);
  const [moreFromDb, setMoreFromDb] = useState<Article[]>([]);
  const [isSerbiaFallback, setIsSerbiaFallback] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Pagination state for MORE FROM [CATEGORY] section
  const [morePageState, setMorePageState] = useState<{ slug: string; page: number }>({
    slug: rawSlug,
    page: 1,
  });
  const moreCategoryPage = morePageState.slug === rawSlug ? morePageState.page : 1;
  const itemsPerPage = 10;

  const loading = Boolean(rawSlug) && loadedSlug !== rawSlug;

  useEffect(() => {
    const controller = new AbortController();

    if (!rawSlug) {
      return () => controller.abort();
    }

    fetchArticleDetailApi(rawSlug, controller.signal).then((payload) => {
      if (controller.signal.aborted) return;
      if (payload && payload.article) {
        setArticle(payload.article);
        setRelatedFromDb(Array.isArray(payload.related) ? payload.related : []);
        setMoreFromDb(Array.isArray(payload.more) ? payload.more : []);
        setIsSerbiaFallback(false);
        setNotFound(false);
      } else {
        const lowerSlug = rawSlug.toLowerCase();
        if (
          lowerSlug.includes('serbia') ||
          lowerSlug.includes('vucic') ||
          lowerSlug.includes('vučić')
        ) {
          setArticle({
            id: 'serbia-demo',
            slug: rawSlug,
            title: "How a movement of students brought down Serbia's Vučić",
            category: 'World News',
            subCategories: ['Europe'],
            tags: ['Serbia'],
            author: 'Paul Kirby',
            authorWriterRole: 'Europe digital editor',
            time: '6 hours ago',
            readDuration: 5,
            imageUrl: '/article-hero-students.jpg',
          });
          setRelatedFromDb([]);
          setMoreFromDb([]);
          setIsSerbiaFallback(true);
          setNotFound(false);
        } else {
          const staticMatch = findStaticArticleFallback(rawSlug);
          if (staticMatch) {
            setArticle(staticMatch);
            setRelatedFromDb([]);
            setMoreFromDb([]);
            setIsSerbiaFallback(false);
            setNotFound(false);
          } else {
            setArticle(null);
            setIsSerbiaFallback(false);
            setNotFound(true);
          }
        }
      }
      setMorePageState({ slug: rawSlug, page: 1 });
      setLoadedSlug(rawSlug);
    });

    return () => controller.abort();
  }, [rawSlug]);

  const sidebarAds = [
    {
      id: 'sb-1',
      title: 'Robotics and Artificial Intelligence. Discover the trends.',
      source: 'MarketViews',
      imageUrl: '/sidebar-ad-1.jpg',
    },
    {
      id: 'sb-2',
      title: 'Uncover the latest trends in retirement planning strategies.',
      source: 'MarketViews',
      imageUrl: '/sidebar-ad-2.jpg',
    },
    {
      id: 'sb-3',
      title: 'What are the latest AI trends currently being talked about?',
      source: 'MarketViews',
      imageUrl: '/sidebar-ad-3.jpg',
    },
    {
      id: 'sb-4',
      title: 'Discover the latest finance insights from global experts.',
      source: 'MarketViews',
      imageUrl: '/sidebar-ad-4.jpg',
    },
  ];

  const taboolaCards = [
    {
      id: 'tab-1',
      title:
        "I Asked ChatGPT What the Rich Do That We Don't. The Answer Was Uncomfortable...",
      source: 'Blinkist Magazine | Paid Content',
      imageUrl: '/taboola-1.jpg',
    },
    {
      id: 'tab-2',
      title:
        'I Asked ChatGPT What Rich People Do Differently. It Gave Me One Word.',
      source: 'Blinkist Magazine | Paid Content',
      imageUrl: '/taboola-2.jpg',
    },
    {
      id: 'tab-3',
      title: 'Men jailed after student raped, filmed and dumped in Clent road',
      source: 'She was picked up in Birmingham by three men who hired a car for th...',
      imageUrl: '/taboola-3.jpg',
    },
    {
      id: 'tab-4',
      title: 'Selena Gomez says vaping has affected her voice',
      source:
        "The 34-year-old says vaping nicotine 'a lot' permanently affected her...",
      imageUrl: '/taboola-4.jpg',
    },
    {
      id: 'tab-5',
      title: "Daughter of murdered woman 'refuses to be another victim'",
      source:
        "Keeley McKee's mother Leanne was killed by her partner in 2003, week...",
      imageUrl: '/taboola-5.jpg',
    },
    {
      id: 'tab-6',
      title: 'Child poverty in Wales - Daughter slept on bed propped up by books',
      source:
        'Sarah Ruscoe, a single mum out of work due to health issues, worried...',
      imageUrl: '/taboola-6.jpg',
    },
  ];

  const relatedArticles = useMemo(() => {
    if (relatedFromDb.length > 0) return relatedFromDb.slice(0, 3);
    if (moreFromDb.length > 0) return moreFromDb.slice(0, 3);
    return STATIC_SERBIA_RELATED;
  }, [relatedFromDb, moreFromDb]);

  const moreCategoryArticles = useMemo(() => {
    if (moreFromDb.length > 0) {
      return moreFromDb.map((item) => ({
        id: item.id,
        slug: item.slug,
        date: item.time || formatDisplayDate(item.publishedAt),
        title: item.title,
        summary: item.summary || item.cardSummary || '',
        imageUrl: resolveMediaUrl(item.imageUrl, '/hero-lead.jpg'),
      }));
    }
    return STATIC_SERBIA_MORE.map((item) => ({
      ...item,
      slug: "How-a-movement-of-students-brought-down-Serbia's-Vučić",
    }));
  }, [moreFromDb]);

  const totalMorePages = Math.max(
    1,
    Math.ceil(moreCategoryArticles.length / itemsPerPage)
  );
  const currentMoreArticles = moreCategoryArticles.slice(
    (moreCategoryPage - 1) * itemsPerPage,
    moreCategoryPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setMorePageState({ slug: rawSlug, page: newPage });
    if (moreSectionRef.current) {
      moreSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateArticle = (slugOrId?: string) => {
    if (!slugOrId) return;
    router.push(`/news/articles/${encodeURIComponent(slugOrId)}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
        />
        <div className="pt-20">
          <SkeletonArticleDetail />
        </div>
        <Footer />
      </main>
    );
  }

  if (!rawSlug || notFound || !article) {
    return (
      <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased flex flex-col">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
          <div className="max-w-md w-full border border-neutral-200 bg-neutral-50 rounded-md p-8 text-center">
            <h1 className="font-serif font-bold text-2xl text-neutral-900 mb-2">
              Article Not Found
            </h1>
            <p className="text-sm text-neutral-600 mb-6">
              The story you are looking for may have been moved, unpublished, or removed.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
            >
              Back to BBC News Home
            </Link>
          </div>
        </div>
        <Footer />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectArticle={(art) => {
            setIsSearchOpen(false);
            handleNavigateArticle(art.slug || art.id);
          }}
        />
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
        />
        <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      </main>
    );
  }

  const mainCatName = article.category || 'World News';
  const subCats = article.subCategories || [];
  const tags = article.tags || [];
  const enrichment = getArticleEnrichment(article);
  const leadSummary = (
    article.subtitle ||
    article.summary ||
    article.cardSummary ||
    ''
  ).trim();
  const resolvedCover =
    resolveMediaUrl(article.imageUrl) ||
    enrichment?.imageUrl ||
    '/hero-lead.jpg';
  const rawContent = (article.content || '').trim();
  const strippedContent = rawContent ? stripHtmlText(rawContent) : '';
  const hasRichArticleBody = Boolean(
    rawContent &&
      strippedContent !== leadSummary &&
      (/<(p|h[1-6]|ul|ol|blockquote|img|div)\b/i.test(rawContent) ||
        strippedContent.length > leadSummary.length + 25)
  );
  const firstInlineImg = hasRichArticleBody
    ? resolveMediaUrl(extractFirstImageSrc(rawContent))
    : '';
  const showSeparateHeroImage = Boolean(
    resolvedCover && (!firstInlineImg || resolvedCover !== firstInlineImg)
  );
  const imageCaption = isSerbiaFallback
    ? "Although it was a students' movement that won Serbia's election, no student has been elected"
    : enrichment?.caption || article.imageAlt || '';
  const fallbackParagraphs =
    enrichment?.paragraphs || buildFallbackBodyParagraphs(article);
  const displayPublishDate = formatDisplayDate(article.publishedAt, article.time);
  const displayReadTime = article.readDuration
    ? `${article.readDuration} min read`
    : '4 min read';

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* 1. Global BBC Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* 2. Main Article Body Container */}
      <article className="max-w-[1040px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8">
        {/* Category Breadcrumb Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3">
          <Link
            href={`/${getCategorySlugByName(mainCatName)}`}
            className="text-[#bb1919] hover:underline"
          >
            {mainCatName}
          </Link>
          {subCats.map((sub) => (
            <span key={sub} className="inline-flex items-center gap-2 text-neutral-500">
              <span>›</span>
              <Link
                href={`/${getCategorySlugByName(sub)}`}
                className="hover:text-black hover:underline"
              >
                {sub}
              </Link>
            </span>
          ))}
        </div>

        {/* Article Headline */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[42px] text-neutral-900 leading-[1.18] mb-3">
          {article.title}
        </h1>

        {leadSummary && (
          <p className="font-serif text-lg sm:text-xl text-neutral-600 leading-relaxed mb-4">
            {leadSummary}
          </p>
        )}

        {/* Author Attribution, Bookmark Save & Share Bar */}
        <AuthorProfile
          authorId={article.authorId}
          authorName={article.author || 'BBC News Staff'}
          authorBio={article.authorBio}
          authorPhoto={resolveMediaUrl(article.authorProfilePicture)}
          authorLinkedin={article.authorLinkedinUrl}
          authorWriterRole={article.authorWriterRole}
          publishDate={displayPublishDate}
          readTime={displayReadTime}
          article={{
            slug: article.slug || rawSlug,
            title: article.title,
            image: resolvedCover,
            imageUrl: resolvedCover,
            category: mainCatName,
            date: displayPublishDate,
            author: article.author || 'BBC News Staff',
          }}
        />

        {/* 5. Article Content & Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Main Story Text Column */}
          <div className="lg:col-span-8">
            {/* Hero / Cover Image */}
            {showSeparateHeroImage && resolvedCover && (
              <div className="mb-6">
                <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-neutral-100 rounded-xs">
                  <img
                    src={resolvedCover}
                    alt={article.imageAlt || enrichment?.imageAlt || article.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/hero-lead.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                {(imageCaption || isSerbiaFallback) && (
                  <div className="flex items-center justify-between font-sans text-xs text-neutral-500 mt-2 gap-4">
                    <span>{imageCaption}</span>
                    {isSerbiaFallback && (
                      <span className="text-[11px] text-neutral-400 shrink-0">
                        AFP via Getty Images
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {isSerbiaFallback ? (
              <>
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
              </>
            ) : hasRichArticleBody ? (
              <div
                className="bbc-article-content font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.7]"
                dangerouslySetInnerHTML={{ __html: rawContent }}
              />
            ) : (
              <div>
                {fallbackParagraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="font-serif text-[17.5px] sm:text-[18.5px] text-neutral-800 leading-[1.68] mb-5"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Topic Tags (Hashtags Only) */}
            {tags.length > 0 && (
              <div className="mt-8 pt-5 border-t border-neutral-200 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-neutral-100 text-neutral-700 text-xs font-sans font-medium px-3.5 py-1.5 rounded-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar Ad Area */}
          <aside className="lg:col-span-4 flex flex-col space-y-6">
            <div className="border-t border-neutral-200 pt-2">
              <div className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#7e7e7e] text-right mb-3">
                ADVERTISEMENT
              </div>

              <div className="flex flex-col divide-y divide-neutral-200">
                {sidebarAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-start space-x-3 cursor-pointer group"
                  >
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

            <div className="w-full bg-[#f9f9f9] border border-[#ebebeb] h-[250px] flex items-center justify-center select-none">
              <span className="text-sm font-sans font-medium text-[#767676] tracking-wide">
                300 x 250
              </span>
            </div>
          </aside>
        </div>
      </article>

      {/* 6. Mid-page Advertisement Banner */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

      {/* 7. RELATED Section */}
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
              onClick={() => handleNavigateArticle(item.slug || item.id)}
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

      {/* 8. MORE FROM [CATEGORY] Section */}
      <section
        ref={moreSectionRef}
        className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 scroll-mt-24"
      >
        <div className="border-t-2 border-neutral-900 pt-2 mb-6">
          <h2 className="text-xs sm:text-[13px] font-black text-neutral-900 tracking-wider uppercase">
            {isSerbiaFallback
              ? 'MORE FROM SERBIA'
              : `MORE FROM ${mainCatName.toUpperCase()}`}
          </h2>
        </div>

        <div className="flex flex-col">
          {currentMoreArticles.map((moreItem) => (
            <article
              key={moreItem.id}
              onClick={() => handleNavigateArticle(moreItem.slug || moreItem.id)}
              className="flex flex-col sm:flex-row items-start justify-between py-5 border-b border-neutral-200 group cursor-pointer first:pt-0"
            >
              <div className="w-full sm:w-28 md:w-32 flex-shrink-0 text-xs text-neutral-500 font-sans sm:text-right pr-4 mb-1.5 sm:mb-0">
                {moreItem.date}
              </div>

              <div className="flex-1 pr-4 sm:pr-8">
                <h3 className="font-serif font-bold text-lg sm:text-[19px] md:text-[20px] text-neutral-900 leading-snug group-hover:underline">
                  {moreItem.title}
                </h3>
                <p className="font-serif text-[13px] sm:text-[13.5px] text-neutral-600 mt-1.5 leading-relaxed">
                  {moreItem.summary}
                </p>
              </div>

              <div className="relative w-full sm:w-44 md:w-48 lg:w-52 aspect-[16/10] flex-shrink-0 overflow-hidden bg-neutral-100 rounded-xs mt-3 sm:mt-0 shadow-2xs">
                <Image
                  src={resolveMediaUrl(moreItem.imageUrl, '/hero-lead.jpg')}
                  alt={moreItem.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </article>
          ))}
        </div>

        {totalMorePages > 1 && (
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
              onClick={() =>
                handlePageChange(Math.min(moreCategoryPage + 1, totalMorePages))
              }
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
        )}
      </section>

      {/* 9. Bottom Advertisement Banner & Taboola Feed */}
      <AdBanner type="placeholder" sizeText="1000 x 350" />

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
        onSelectArticle={(art) => {
          setIsSearchOpen(false);
          handleNavigateArticle(art.slug || art.id);
        }}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />

      <AudioPlayerBar podcast={activePodcast} onClose={() => setActivePodcast(null)} />
    </main>
  );
}
