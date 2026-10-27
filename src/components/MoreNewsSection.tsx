'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight, Play } from 'lucide-react';
import {
  moreNewsVanessa,
  moreNewsBurnham,
  moreNewsBottomRow,
  moreNewsTextOnly
} from '../data/bbcData';
import { Article } from '../types';

interface MoreNewsSectionProps {
  onArticleClick?: (article: Article) => void;
  onVideoClick?: (article: Article) => void;
}

export default function MoreNewsSection({ onArticleClick, onVideoClick }: MoreNewsSectionProps) {
  const [storyAI, storyBovino, storyNairobi] = moreNewsBottomRow;
  const [storySchools, storyBiosecurity] = moreNewsTextOnly;

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-6 pb-8">
      {/* Section Header matching BBC reference */}
      <div className="border-t-2 border-neutral-900 pt-3 mb-6">
        <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight uppercase flex items-center space-x-1 cursor-pointer hover:text-red-600 transition">
          <span>MORE NEWS</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </h2>
      </div>

      {/* TOP ROW: 4 Columns (Col 1: Text, Col 2-3: Large Photo, Col 4: Burnham) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start pb-6">
        
        {/* Col 1: Vanessa Trump Text Only (4 lines title, 4 lines description) */}
        <article
          onClick={() => onArticleClick?.(moreNewsVanessa)}
          className="group cursor-pointer flex flex-col justify-between h-full"
        >
          <div>
            <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-neutral-900 group-hover:underline leading-[1.25]">
              Vanessa Trump says <br className="hidden sm:inline" />
              she is cancer-free six <br className="hidden sm:inline" />
              months after revealing <br className="hidden sm:inline" />
              diagnosis
            </h3>
            <p className="font-serif text-[14.5px] sm:text-[15px] text-neutral-600 mt-2.5 leading-[1.4]">
              The ex-wife of Donald Trump Jr, with <br className="hidden sm:inline" />
              whom she shares five children, announced <br className="hidden sm:inline" />
              in May that she had been diagnosed with <br className="hidden sm:inline" />
              breast cancer.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-sans text-xs sm:text-[12.5px] text-neutral-500 font-medium mt-3">
            <span>{moreNewsVanessa.time || '2 days ago'}</span>
            <span>|</span>
            <span className="text-neutral-700 font-semibold hover:underline">{moreNewsVanessa.category || 'US & Canada'}</span>
          </div>
        </article>

        {/* Col 2 & 3: Large Landscape Image of Vanessa Trump and Daughter */}
        <div
          onClick={() => onArticleClick?.(moreNewsVanessa)}
          className="lg:col-span-2 group cursor-pointer overflow-hidden bg-neutral-100 rounded-xs shadow-xs"
        >
          <Image
            src={moreNewsVanessa.imageUrl || '/morenews-vanessa.jpg'}
            alt={moreNewsVanessa.imageAlt || moreNewsVanessa.title}
            width={640}
            height={380}
            priority
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Col 4: Andy Burnham with BBC INDEPTH badge (2 lines title, 4 lines description) */}
        <article
          onClick={() => onArticleClick?.(moreNewsBurnham)}
          className="group cursor-pointer flex flex-col justify-between h-full pb-4 border-b border-neutral-200"
        >
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs mb-2.5 shadow-xs">
              <Image
                src={moreNewsBurnham.imageUrl || '/morenews-burnham.jpg'}
                alt={moreNewsBurnham.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* BBC InDepth Badge */}
              <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs flex items-center space-x-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>BBC INDEPTH</span>
              </div>
            </div>

            <h3 className="font-serif font-bold text-[16.5px] sm:text-[17.5px] text-neutral-900 group-hover:underline leading-snug">
              Between quick wins and big <br className="hidden sm:inline" />
              dreams lies Burnham&apos;s biggest test
            </h3>
            <p className="font-serif text-[13.5px] sm:text-[14.5px] text-neutral-600 mt-2 leading-[1.4]">
              The prime minister might be dreaming of <br className="hidden sm:inline" />
              gold medals in 2040, but he must first <br className="hidden sm:inline" />
              navigate the difficult years in between, <br className="hidden sm:inline" />
              writes Laura Kuenssberg.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-sans text-xs sm:text-[12.5px] text-neutral-500 font-medium mt-3">
            <span>{moreNewsBurnham.time || '2 days ago'}</span>
            <span>|</span>
            <span className="text-neutral-700 font-semibold hover:underline">{moreNewsBurnham.category || 'BBC InDepth'}</span>
          </div>
        </article>

      </div>

      {/* BOTTOM ROW: 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start pt-7">

        {/* Bottom Col 1: AI verify video story (2 lines title, 3 lines description) */}
        <article
          onClick={() => onVideoClick ? onVideoClick(storyAI) : onArticleClick?.(storyAI)}
          className="group cursor-pointer flex flex-col justify-between h-full pb-4 border-b border-neutral-200"
        >
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs mb-2.5 shadow-xs">
              <Image
                src={storyAI.imageUrl || '/morenews-ai.jpg'}
                alt={storyAI.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Play Icon */}
              <div className="absolute bottom-1.5 left-1.5 bg-black/80 text-white p-1 rounded-xs flex items-center justify-center">
                <Play className="w-3 h-3 fill-white text-white" />
              </div>
            </div>

            <h3 className="font-serif font-bold text-[16px] sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
              The rise of AI election ads in US <br className="hidden sm:inline" />
              midterms campaign
            </h3>
            <p className="font-serif text-[13.5px] sm:text-[14.5px] text-neutral-600 mt-2 leading-[1.4]">
              BBC Verify has tracked dozens of AI ads to <br className="hidden sm:inline" />
              assess how they are being used by <br className="hidden sm:inline" />
              campaigns in the midterms.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-sans text-xs sm:text-[12.5px] text-neutral-500 font-medium mt-3">
            <span>{storyAI.time || '2 days ago'}</span>
            <span>|</span>
            <span className="text-neutral-700 font-semibold hover:underline">{storyAI.category || 'BBC Verify'}</span>
          </div>
        </article>

        {/* Bottom Col 2: Bovino Story (3 lines title, 3 lines description) */}
        <article
          onClick={() => onArticleClick?.(storyBovino)}
          className="group cursor-pointer flex flex-col justify-between h-full pb-4 border-b border-neutral-200"
        >
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs mb-2.5 shadow-xs">
              <Image
                src={storyBovino.imageUrl || '/morenews-bovino.jpg'}
                alt={storyBovino.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h3 className="font-serif font-bold text-[16px] sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
              Minneapolis withdrawal was <br className="hidden sm:inline" />
              &apos;surrender&apos;, Trump&apos;s ex-border <br className="hidden sm:inline" />
              patrol chief tells BBC
            </h3>
            <p className="font-serif text-[13.5px] sm:text-[14.5px] text-neutral-600 mt-2 leading-[1.4]">
              Greg Bovino was the public face of the <br className="hidden sm:inline" />
              controversial immigration enforcement <br className="hidden sm:inline" />
              operation in the city earlier this year.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-sans text-xs sm:text-[12.5px] text-neutral-500 font-medium mt-3">
            <span>{storyBovino.time || '2 days ago'}</span>
            <span>|</span>
            <span className="text-neutral-700 font-semibold hover:underline">{storyBovino.category || 'US & Canada'}</span>
          </div>
        </article>

        {/* Bottom Col 3: Nairobi Story (2 lines title, 4 lines description) */}
        <article
          onClick={() => onArticleClick?.(storyNairobi)}
          className="group cursor-pointer flex flex-col justify-between h-full pb-4 border-b border-neutral-200"
        >
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-xs mb-2.5 shadow-xs">
              <Image
                src={storyNairobi.imageUrl || '/morenews-nairobi.jpg'}
                alt={storyNairobi.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h3 className="font-serif font-bold text-[16px] sm:text-[17px] text-neutral-900 group-hover:underline leading-snug">
              Two rescued after Nairobi building <br className="hidden sm:inline" />
              collapse with five still missing
            </h3>
            <p className="font-serif text-[13.5px] sm:text-[14.5px] text-neutral-600 mt-2 leading-[1.4]">
              Police have launched a manhunt for the <br className="hidden sm:inline" />
              building&apos;s owner and contractor after the <br className="hidden sm:inline" />
              multi-storey building collapsed while still <br className="hidden sm:inline" />
              under construction.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-sans text-xs sm:text-[12.5px] text-neutral-500 font-medium mt-3">
            <span>{storyNairobi.time || '2 days ago'}</span>
            <span>|</span>
            <span className="text-neutral-700 font-semibold hover:underline">{storyNairobi.category || 'Africa'}</span>
          </div>
        </article>

        {/* Bottom Col 4: Two Text-Only Articles */}
        <div className="flex flex-col justify-between h-full">
          {/* Article 1: British posh schools (2 lines title, 3 lines description) */}
          <article
            onClick={() => onArticleClick?.(storySchools)}
            className="group cursor-pointer flex flex-col justify-between pb-3.5 border-b border-neutral-200"
          >
            <div>
              <h3 className="font-serif font-bold text-[15.5px] sm:text-[16.5px] text-neutral-900 group-hover:underline leading-snug">
                Britain&apos;s posh schools are heading <br className="hidden sm:inline" />
                to India for students and profits
              </h3>
              <p className="font-serif text-[13.5px] sm:text-[14.5px] text-neutral-600 mt-1.5 leading-[1.4]">
                Half a dozen elite British schools are <br className="hidden sm:inline" />
                chasing growth in India amid a boom in its <br className="hidden sm:inline" />
                wealthy population.
              </p>
            </div>
            <div className="flex items-center space-x-2 font-sans text-xs sm:text-[12.5px] text-neutral-500 font-medium mt-2.5">
              <span>{storySchools.time || '2 days ago'}</span>
              <span>|</span>
              <span className="text-neutral-700 font-semibold hover:underline">{storySchools.category || 'Asia'}</span>
            </div>
          </article>

          {/* Article 2: UK to invest £100m (2 lines title, 3 lines description) */}
          <article
            onClick={() => onArticleClick?.(storyBiosecurity)}
            className="group cursor-pointer flex flex-col justify-between pt-3 pb-4 border-b border-neutral-200"
          >
            <div>
              <h3 className="font-serif font-bold text-[15.5px] sm:text-[16.5px] text-neutral-900 group-hover:underline leading-snug">
                UK to invest £100m in &apos;world first&apos; <br className="hidden sm:inline" />
                AI Biosecurity Lab
              </h3>
              <p className="font-serif text-[13.5px] sm:text-[14.5px] text-neutral-600 mt-1.5 leading-[1.4]">
                The chancellor will unveil AI spending <br className="hidden sm:inline" />
                aimed at shoring up the UK&apos;s defences in <br className="hidden sm:inline" />
                Wednesday&apos;s Budget.
              </p>
            </div>
            <div className="flex items-center space-x-2 font-sans text-xs sm:text-[12.5px] text-neutral-500 font-medium mt-2.5">
              <span>{storyBiosecurity.time || '2 days ago'}</span>
              <span>|</span>
              <span className="text-neutral-700 font-semibold hover:underline">{storyBiosecurity.category || 'Technology'}</span>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
