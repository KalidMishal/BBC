import { Article } from '../types';
import {
  crownsAndControversies,
  earthFeature,
  editorLeadStory,
  editorSideList,
  euLeadersStory,
  fourCategoriesDigestData,
  fourColumnDigest1,
  fourColumnDigest2,
  fourColumnDigest3,
  humanRightsArticles,
  inDepthChangeCards,
  inDepthChangeLead,
  inFocusLeadStory,
  inFocusSideList,
  moreNewsBurnham,
  moreNewsSideList,
  moreNewsVanessa,
  politicsGridArticles,
  recentVideosList,
  sportPremierLeague,
  sportsSectionArticles,
  topStoriesSecondary,
  topStoriesSideList,
  topStoryLead,
  travelFeature,
  trendingNowArticles,
  watchHeroCinema,
  watchVideosDark,
  weekendReads,
} from './bbcData';

export interface ArticleEnrichment {
  imageUrl: string;
  imageAlt: string;
  caption: string;
  paragraphs: string[];
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ENRICHMENTS_BY_ID: Record<string, ArticleEnrichment> = {
  'side-2': {
    imageUrl: '/article-hebron-homes.jpg',
    imageAlt: 'Damaged limestone residential buildings and rubble along a hillside street in Hebron',
    caption:
      'Damaged homes and debris in Hebron after Israeli forces enforced overnight demolition orders',
    paragraphs: [
      'Israeli security forces moved into residential neighbourhoods across Hebron before dawn, sealing off surrounding streets as heavy equipment dismantled properties linked by authorities to Friday’s fatal shooting attack.',
      'Local officials said several extended Palestinian families were forced to evacuate with little notice, gathering essential belongings and personal documents before walls and upper storeys were brought down.',
      'The Israeli military stated that the demolitions form part of an expanded security operation across the southern West Bank following the killing of two soldiers near a military post outside the city.',
      'Residents and humanitarian groups warned that punitive demolitions leave dozens of civilians—including elderly residents and school-age children—without shelter at short notice and risk deepening unrest across nearby towns.',
      'Political analysts noted that the heightened security sweep comes at a critical point in the campaign ahead of Israel’s national election, with West Bank security policy taking centre stage in daily political debate.',
    ],
  },
  'side-1': {
    imageUrl: '/premier-league.jpg',
    imageAlt: 'International football match action under stadium floodlights',
    caption:
      'Fifa leadership faces scrutiny over global tournament ticketing policies ahead of the upcoming summit',
    paragraphs: [
      'Fifa president Gianni Infantino rejected suggestions that his leadership is under threat, insisting that member federations across six confederations remain firmly behind the governing body’s long-term reform agenda.',
      'Speaking after a contentious meeting with European delegates, Infantino maintained that commercial revenues from expanded international competitions are being reinvested directly into grassroots facilities worldwide.',
      'Critics within several national associations, however, raised renewed concerns over dynamic ticket pricing structures and limited allocations reserved for travelling supporters.',
      'Senior football administrators are expected to revisit governance oversight and tournament revenue distribution when Fifa’s council reconvenes next month.',
    ],
  },
  'side-3': {
    imageUrl: '/digest-nyc-fire.jpg',
    imageAlt: 'Emergency services vehicles responding along a residential street at dusk',
    caption:
      'Emergency crews and community members paid tribute outside the family home following the tragedy',
    paragraphs: [
      'Neighbours and local emergency responders gathered near the family’s Nottinghamshire street to leave flowers and handwritten messages honouring Leanne Gregory after Friday’s fatal house fire.',
      'Fire investigators confirmed that officers worked through thick smoke after neighbours alerted crews that family members were trapped on the upper floor of the semi-detached property.',
      'Speaking on behalf of relatives, Nathan Gregory described his wife as a devoted mother whose final instinct was to shield their children from danger inside the burning building.',
      'Police and fire specialists are continuing a joint forensic examination to determine how the blaze started, while community groups have launched an assistance fund to support the surviving family.',
    ],
  },
  'side-4': {
    imageUrl: '/editor-starlink.jpg',
    imageAlt: 'Communications array and satellite dish infrastructure against an overcast sky',
    caption:
      'Satellite connectivity terminals have played a vital role for field units and municipal services across Ukraine',
    paragraphs: [
      'Ukrainian communications officials reported that satellite internet throughput has returned to normal operational thresholds across frontline sectors following days of intermittent signal disruption.',
      'Field commanders had warned earlier in the week that slower data links hampered real-time drone reconnaissance and delayed coordination between artillery units and regional command centres.',
      'Engineers worked alongside commercial network operators to recalibrate terminal firmware and mitigate signal congestion along contested eastern corridors.',
      'Defence analysts say resilient satellite links remain indispensable as winter weather conditions strain terrestrial fibre networks and regional power substations.',
    ],
  },
  'side-5': {
    imageUrl: '/indepth-nyc-skyline.jpg',
    imageAlt: 'Commercial aviation corridor and urban skyline at sunrise',
    caption:
      'Major international carriers are reviewing summer schedules and fuel surcharges amid rising energy costs',
    paragraphs: [
      'Major airlines across Europe and North America cautioned passengers to expect steeper ticket prices heading into the busy holiday travel window as aviation fuel prices reached a multi-month high.',
      'Chief executives from several transatlantic carriers told investors that refined jet fuel costs now represent nearly a third of total operating expenses despite efficiency gains across newer aircraft fleets.',
      'Travel industry analysts said hedged fuel contracts have shielded only part of the surge, leaving budget airlines with thin margins and fewer discounted seats on popular routes.',
      'Consumer groups urged carriers to publish transparent fare breakdowns as airport charges and environmental levies add further pressure to household travel budgets.',
    ],
  },
  'lead-1': {
    imageUrl: '/hero-paris-protests.jpg',
    imageAlt: 'Police officers deployed along a Paris boulevard during evening protests',
    caption:
      'Heavy security deployments remained across central Paris avenues as union marches continued into the evening',
    paragraphs: [
      'Tens of thousands of demonstrators marched through Paris, Lyon and Marseille in largely peaceful rallies against proposed public-sector budget cuts, though isolated scuffles broke out along major intersections after dusk.',
      'Interior ministry officials said heightened police patrols prevented the widespread property damage seen during earlier demonstrations, even as small groups set bins alight near central metro stations.',
      'Trade union leaders warned that transport, education and energy workers could stage follow-up walkouts next week unless the government reopens negotiations on pension rules and cost-of-living protections.',
      'Commuters across the capital faced reduced suburban rail services throughout the afternoon as authorities kept buffer zones in place around government ministries.',
    ],
  },
  'sec-1': {
    imageUrl: '/hero-meghan.jpg',
    imageAlt: 'Portrait of Meghan, Duchess of Sussex at an official engagement',
    caption:
      'Metropolitan Police officials addressed questions regarding correspondence received from legal representatives',
    paragraphs: [
      'Scotland Yard confirmed that correspondence raised by representatives of the Duchess of Sussex concerning her father had been logged internally but was not circulated to external police forces.',
      'In a brief statement, the Metropolitan Police said established privacy and safeguarding protocols governed how the material was handled after initial assessment.',
      'Legal commentators noted that cross-agency sharing only occurs when formal investigative thresholds or active jurisdictional requests are met.',
      'Representatives for the duchess have not issued additional public comment beyond welcoming clarification of the procedural record.',
    ],
  },
  'sec-2': {
    imageUrl: '/hero-eagles-nest.jpg',
    imageAlt: 'Flames illuminating the mountain slope near the Eagle Nest site at night',
    caption:
      'Bavarian emergency crews responded to steep alpine terrain overlooking Berchtesgaden after the fire broke out',
    paragraphs: [
      'German police in Bavaria have detained a 33-year-old suspect after an evening fire damaged structures near the historic mountain road leading to the Kehlsteinhaus site.',
      'Mountain rescue crews and local firefighters navigated narrow alpine switchbacks after darkness fell to bring flames under control before they spread into surrounding forest land.',
      'Prosecutors said forensic investigators are examining how the blaze began and whether accelerants were used near the visitor access point.',
      'Regional heritage officials stressed that the summit pavilion remained structurally intact, though visitor access routes could stay restricted during safety inspections.',
    ],
  },
};

export function getArticleEnrichment(article: Article): ArticleEnrichment | null {
  if (article.id && ENRICHMENTS_BY_ID[article.id]) {
    return ENRICHMENTS_BY_ID[article.id];
  }

  const normalizedSlug = (article.slug || '').toLowerCase();
  for (const [id, data] of Object.entries(ENRICHMENTS_BY_ID)) {
    if (normalizedSlug === id || normalizedSlug.endsWith(`-${id}`)) {
      return data;
    }
  }

  const titleSlug = article.title ? slugifyTitle(article.title) : '';
  if (titleSlug.includes('hebron-homes') || titleSlug.includes('palestinian-families-displaced')) {
    return ENRICHMENTS_BY_ID['side-2'];
  }
  if (titleSlug.includes('infantino') && titleSlug.includes('vast-majority')) {
    return ENRICHMENTS_BY_ID['side-1'];
  }
  if (titleSlug.includes('saving-sons') || titleSlug.includes('mum-who-died-trying-to-save-sons')) {
    return ENRICHMENTS_BY_ID['side-3'];
  }
  if (titleSlug.includes('starlink') && titleSlug.includes('now-stable')) {
    return ENRICHMENTS_BY_ID['side-4'];
  }
  if (titleSlug.includes('global-airlines-warn')) {
    return ENRICHMENTS_BY_ID['side-5'];
  }

  return null;
}

export function buildFallbackBodyParagraphs(article: Article): string[] {
  const categoryLabel = (article.category || 'global affairs').toLowerCase();
  const points = article.bulletPoints || [];

  const paragraphs = [
    `Correspondents monitoring developments in ${categoryLabel} report that officials, industry leaders and local communities are closely assessing the wider impact following the latest updates.`,
    `Observers note that key policy decisions and shifting conditions surrounding "${article.title}" are expected to shape debate across international capitals and regional institutions in the days ahead.`,
    `Further briefings and formal statements from spokespeople involved in the response are anticipated later this week as reporters continue to track events on the ground.`,
  ];

  if (points.length > 0) {
    paragraphs.splice(1, 0, ...points);
  }

  return paragraphs;
}

export const categoryHeroFallback: {
  leftTop: Article;
  leftBottom: Article;
  lead: Article;
  rightTop: Article;
  rightBottom: Article;
} = {
  leftTop: {
    id: 'cat-hero-1',
    title:
      'How one man became the unsung hero of the internet during a cyber-security scramble',
    summary:
      'For more than 20 years, Ondřej Surý has been quietly helping to keep websites around the world running securely, largely in his spare time.',
    imageUrl: '/tech-hero-1.jpg',
    category: 'Technology',
    time: '4 hrs ago',
  },
  leftBottom: {
    id: 'cat-hero-2',
    title: 'Gabon says access to social media restored after eight month ban',
    summary:
      'The authorities had justified the ban by saying online content was fuelling conflict, while the opposition had condemned it as an abuse of power.',
    imageUrl: '/tech-hero-2.jpg',
    category: 'World News',
    time: '7 hrs ago',
  },
  lead: {
    id: 'cat-hero-lead',
    title: 'Police using AI risks making discrimination worse, researchers warn',
    summary:
      'AI tools learn from biased records and may deepen discrimination against minorities without oversight, researchers say.',
    imageUrl: '/tech-hero-lead.jpg',
    category: 'Technology',
    time: '2 hrs ago',
  },
  rightTop: {
    id: 'cat-hero-3',
    title: 'The Indian workers filming their work to train AI',
    summary:
      'Indian workers are being paid to film themselves at work and the footage is used to train AI.',
    imageUrl: '/tech-hero-3.jpg',
    category: 'Technology',
    time: '5 hrs ago',
  },
  rightBottom: {
    id: 'cat-hero-4',
    title: "'I'm 96 and have 15 million followers': The grannies taking over TikTok",
    summary:
      'Grandma Droniak, Nonna Gracie, Viv Truran and Barbara Costello have all found fame on social media in their later years.',
    imageUrl: '/tech-hero-4.jpg',
    category: 'Culture',
    time: '8 hrs ago',
  },
};

export const categoryKeepingTabsFallback: Article[] = [
  {
    id: 'kt-1',
    title:
      'Anthropic thinks its AI might be conscious. It has profound consequences for your life',
    summary:
      "Some of the most powerful people in tech are taking steps to consider AI's rights alongside humans and animals. This belief could reshape our world. Some fear it would be catastrophic.",
    imageUrl: '/tech-tabs-1.jpg',
    category: 'Technology',
    time: '3 hrs ago',
  },
  {
    id: 'kt-2',
    title: "Meta's new AI is about to make the internet more annoying",
    summary:
      "Meta's new AI Muse can shop, haggle and book appointments for you. What happens when millions of agents start doing the same?",
    imageUrl: '/tech-tabs-2.jpg',
    category: 'Technology',
    time: '6 hrs ago',
  },
];

export const categoryInCaseYouMissedItFallback: Article[] = [
  {
    id: 'ic-1',
    title:
      "Why did an OpenAI agent hack Australia's health system and can it be stopped in the future?",
    summary:
      'News that an automated AI agent hacked a government IT system raises big questions about regulating the tech.',
    imageUrl: '/tech-missed-1.jpg',
    category: 'Technology',
    time: '4 hrs ago',
  },
  {
    id: 'ic-2',
    title: "Huge data centres rise at 'China speed' to power its AI ambitions",
    summary:
      "The BBC visits Inner Mongolia, an unlikely frontier in Beijing's AI race with Washington.",
    imageUrl: '/tech-missed-2.jpg',
    category: 'Technology',
    time: '5 hrs ago',
  },
  {
    id: 'ic-3',
    title:
      "They were labelled 'pervert glasses'. Will a camera-free version transform their image?",
    summary:
      'Meta has unveiled audio-only smart glasses, with some questioning whether it is a response to the backlash over privacy.',
    imageUrl: '/tech-missed-3.jpg',
    category: 'Technology',
    time: '6 hrs ago',
  },
  {
    id: 'ic-4',
    title: 'Why are there concerns AI could threaten humanity, and how real are they?',
    summary:
      "Existential fears about AI have once again reared their head - here's what you need to know.",
    imageUrl: '/tech-missed-4.jpg',
    category: 'Technology',
    time: '7 hrs ago',
  },
];

export const categoryMoreArticlesFallback: Array<Article & { date: string }> = [
  {
    id: 'mt-1',
    date: '2 hrs ago',
    time: '2 hrs ago',
    category: 'Technology',
    title:
      'Global connectivity surge: High-speed satellite networks challenge undersea cable dominance',
    summary:
      'Engineers deploy new mesh satellite constellations as international carriers reassess deep-sea internet infrastructure vulnerabilities.',
    imageUrl: '/more-tech-1.jpg',
  },
  {
    id: 'mt-2',
    date: '4 hrs ago',
    time: '4 hrs ago',
    category: 'Health',
    title: 'Robotic companions prove unexpected breakthrough in elder cognitive care therapy',
    summary:
      'Clinical trials across European nursing homes suggest tactile robotic pets reduce stress and enhance daily cognitive engagement.',
    imageUrl: '/more-tech-2.jpg',
  },
  {
    id: 'mt-3',
    date: '6 hrs ago',
    time: '6 hrs ago',
    category: 'Technology',
    title: 'Inside the open-source community fixing legacy internet security protocols for free',
    summary:
      'A distributed collective of voluntary developers continues to patch foundational web standards that commercial tech relies upon.',
    imageUrl: '/more-tech-3.jpg',
  },
  {
    id: 'mt-4',
    date: '8 hrs ago',
    time: '8 hrs ago',
    category: 'Science & Research',
    title:
      'Neural synthesis models simulate authentic speech for patients with severe voice impairment',
    summary:
      'Breakthrough machine learning systems restore vocal identity using only minutes of archived audio recordings.',
    imageUrl: '/more-tech-4.jpg',
  },
  {
    id: 'mt-5',
    date: '10 hrs ago',
    time: '10 hrs ago',
    category: 'Business',
    title: 'Algorithmic hiring filters face strict scrutiny under new corporate accountability rules',
    summary:
      'Regulators require tech companies to provide independent auditing logs for candidate resume screening tools.',
    imageUrl: '/more-tech-5.jpg',
  },
  {
    id: 'mt-6',
    date: '12 hrs ago',
    time: '12 hrs ago',
    category: 'Business',
    title:
      'The microchip fabrication race: How sovereign semiconductor factories are redefining geopolitical leverage',
    summary:
      'Billions in state subsidies accelerate domestic foundry manufacturing across Europe and the United States.',
    imageUrl: '/more-tech-6.jpg',
  },
  {
    id: 'mt-7',
    date: '14 hrs ago',
    time: '14 hrs ago',
    category: 'Energy & Infrastructure',
    title:
      'Next-generation liquid cooling architectures save energy in hyperscale AI computing clusters',
    summary:
      'Data centers replace traditional chillers with submerged immersion tanks to curb surging electricity demands.',
    imageUrl: '/more-tech-7.jpg',
  },
  {
    id: 'mt-8',
    date: '16 hrs ago',
    time: '16 hrs ago',
    category: 'Health',
    title:
      'Autonomous drone networks deliver critical emergency medical supplies to remote islands',
    summary:
      'Automated flight corridors bypass inclement coastal weather to deliver anti-venom and emergency blood packs within minutes.',
    imageUrl: '/more-tech-8.jpg',
  },
  {
    id: 'mt-9',
    date: '18 hrs ago',
    time: '18 hrs ago',
    category: 'Technology',
    title: 'Tech CEOs clash over safety thresholds for multi-modal frontier models in closed-door summit',
    summary:
      'Industry leaders debate voluntary model weight release moratoriums and government red-teaming mandates.',
    imageUrl: '/more-tech-9.jpg',
  },
  {
    id: 'mt-10',
    date: '20 hrs ago',
    time: '20 hrs ago',
    category: 'Energy & Infrastructure',
    title: 'Smart grid controllers deploy machine learning to balance renewable power grid surges',
    summary:
      'Software predicts sudden wind and solar generation spikes, diverting excess electricity into regional storage banks.',
    imageUrl: '/more-tech-10.jpg',
  },
  {
    id: 'mt-11',
    date: '1 day ago',
    time: '1 day ago',
    category: 'Science & Research',
    title:
      'Wearable brain-computer interfaces demonstrate real-time keyboard typing without surgery',
    summary:
      'Non-invasive optical sensors detect pre-motor cortex signals with ninety-four percent character accuracy.',
    imageUrl: '/more-tech-11.jpg',
  },
  {
    id: 'mt-12',
    date: '1 day ago',
    time: '1 day ago',
    category: 'Law & Justice',
    title:
      'European privacy regulators order compliance audits on mobile advertising device tracking IDs',
    summary:
      'Cross-app tracking identifiers face renewed legal challenges under updated consumer privacy protection laws.',
    imageUrl: '/more-tech-12.jpg',
  },
  {
    id: 'mt-13',
    date: '2 days ago',
    time: '2 days ago',
    category: 'Business',
    title: 'Quantum key distribution link secures inter-bank currency transaction network',
    summary:
      'Commercial financial institutions test quantum cryptographic protocols immune to quantum computing decryption.',
    imageUrl: '/more-tech-13.jpg',
  },
  {
    id: 'mt-14',
    date: '2 days ago',
    time: '2 days ago',
    category: 'Health',
    title: 'Biometric sensor rings predict onset of viral infections before visible symptoms emerge',
    summary:
      'Continuous temperature and pulse wave micro-fluctuations alert wearers hours before fevers materialize.',
    imageUrl: '/more-tech-14.jpg',
  },
  {
    id: 'mt-15',
    date: '3 days ago',
    time: '3 days ago',
    category: 'Law & Justice',
    title:
      'Synthetic voice generation scams trigger urgent calls for digital watermarking legislation',
    summary:
      'Telecommunications providers test automated cryptographic audio signatures to verify caller legitimacy.',
    imageUrl: '/more-tech-15.jpg',
  },
  {
    id: 'mt-16',
    date: '3 days ago',
    time: '3 days ago',
    category: 'Science & Research',
    title: 'Space telescope constellation maps orbital space debris with millimeter precision',
    summary:
      'Low Earth orbit tracking network alerts satellite operators to collision risks with unprecedented advance warning.',
    imageUrl: '/more-tech-1.jpg',
  },
  {
    id: 'mt-17',
    date: '4 days ago',
    time: '4 days ago',
    category: 'Energy & Infrastructure',
    title:
      'Solid-state battery cells enter pilot automotive fleet trials with ten-minute recharge times',
    summary:
      'Automakers test prototype ceramic electrolyte packs promising five hundred miles of range on a single charge.',
    imageUrl: '/more-tech-2.jpg',
  },
  {
    id: 'mt-18',
    date: '4 days ago',
    time: '4 days ago',
    category: 'Law & Justice',
    title:
      'Digital rights organizations demand open protocols for cross-platform messaging services',
    summary:
      'Interoperability regulations compel tech giants to open end-to-end encrypted messaging bridge APIs.',
    imageUrl: '/more-tech-3.jpg',
  },
  {
    id: 'mt-19',
    date: '5 days ago',
    time: '5 days ago',
    category: 'Science & Research',
    title:
      'Deep-sea underwater research drones uncover new hydrothermal vents using edge AI navigation',
    summary:
      'Autonomous oceanographic submarines navigate extreme trench depths without tethered human pilot commands.',
    imageUrl: '/more-tech-4.jpg',
  },
  {
    id: 'mt-20',
    date: '5 days ago',
    time: '5 days ago',
    category: 'Science & Research',
    title: 'The evolving ethical framework for synthetic biological data storage in DNA molecules',
    summary:
      'Scientists archive petabytes of cultural knowledge inside synthetic DNA strands capable of lasting millennia.',
    imageUrl: '/more-tech-5.jpg',
  },
];

const TRENDING_FALLBACK_IMAGES = [
  '/digest-gas-pump.jpg',
  '/digest-test-tubes.jpg',
  '/premier-league.jpg',
];

function collectAllStaticArticles(): Article[] {
  const trendingMapped: Article[] = trendingNowArticles.map((item, idx) => ({
    id: `trend-${item.number}`,
    title: item.title,
    time: item.time,
    category: 'Trending',
    imageUrl: TRENDING_FALLBACK_IMAGES[idx] || '/hero-lead.jpg',
  }));

  const list: Article[] = [
    topStoryLead,
    ...topStoriesSecondary,
    ...topStoriesSideList,
    ...politicsGridArticles,
    euLeadersStory,
    ...trendingMapped,
    ...weekendReads,
    sportPremierLeague,
    moreNewsVanessa,
    moreNewsBurnham,
    ...moreNewsSideList,
    ...humanRightsArticles,
    editorLeadStory,
    ...editorSideList,
    ...watchVideosDark,
    travelFeature,
    ...crownsAndControversies,
    earthFeature,
    ...recentVideosList,
    inFocusLeadStory,
    ...inFocusSideList,
    ...sportsSectionArticles,
    inDepthChangeLead,
    ...inDepthChangeCards,
    watchHeroCinema,
    categoryHeroFallback.lead,
    categoryHeroFallback.leftTop,
    categoryHeroFallback.leftBottom,
    categoryHeroFallback.rightTop,
    categoryHeroFallback.rightBottom,
    ...categoryKeepingTabsFallback,
    ...categoryInCaseYouMissedItFallback,
    ...categoryMoreArticlesFallback,
  ];

  for (const col of [
    ...fourColumnDigest1,
    ...fourColumnDigest2,
    ...fourColumnDigest3,
    ...fourCategoriesDigestData,
  ]) {
    if (col.leadArticle) list.push(col.leadArticle);
    list.push(...col.articles);
  }

  return list;
}

export function findStaticArticleFallback(idOrSlug: string): Article | null {
  const clean = decodeURIComponent(idOrSlug || '').trim();
  if (!clean) return null;

  const lower = clean.toLowerCase();
  const normalizedClean = slugifyTitle(clean);
  const cleanWithoutNumericId = slugifyTitle(clean.replace(/-\d+$/, ''));
  const all = collectAllStaticArticles();

  for (const item of all) {
    if (item.id && item.id.toLowerCase() === lower) {
      return item;
    }
    if (item.slug && item.slug.toLowerCase() === lower) {
      return item;
    }
    const generatedSlug =
      item.title && item.id ? `${slugifyTitle(item.title)}-${item.id}`.toLowerCase() : '';
    if (generatedSlug && generatedSlug === lower) {
      return item;
    }
    if (item.title) {
      const itemTitleSlug = slugifyTitle(item.title);
      if (
        itemTitleSlug === normalizedClean ||
        (cleanWithoutNumericId && itemTitleSlug === cleanWithoutNumericId)
      ) {
        return item;
      }
    }
  }

  return null;
}
