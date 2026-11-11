import { Article, AuthUser, PodcastItem } from '../types';
import {
  DigestColumnData,
  MarketMetric,
  TrendingItem,
  VideoCardItem,
} from '../data/bbcData';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function resolveMediaUrl(url?: string | null, fallback = ''): string {
  const clean = (url || '').trim();
  if (!clean) return fallback;
  if (clean.startsWith('/uploads/')) return `${BACKEND_ORIGIN}${clean}`;
  return clean;
}

export interface HomeDataPayload {
  source: string;
  topStoryLead: Article | null;
  topStoriesSecondary: Article[];
  topStoriesSideList: Article[];
  politicsGridArticles: Article[];
  euLeadersStory: Article | null;
  trendingNowArticles: TrendingItem[];
  moreNewsVanessa: Article | null;
  moreNewsBurnham: Article | null;
  moreNewsSideList: Article[];
  humanRightsArticles: Article[];
  watchHeroCinema: Article | null;
  recentVideosList: VideoCardItem[];
  editorLeadStory: Article | null;
  editorSideList: Article[];
  inDepthChangeLead: Article | null;
  inDepthChangeCards: Article[];
  inFocusLeadStory: Article | null;
  inFocusSideList: Article[];
  marketUpdateMetrics: MarketMetric[];
  sportsSectionArticles: Article[];
  listenNowFeaturedPodcast: PodcastItem | null;
  listenNowEpisodes: PodcastItem[];
  fourCategoriesDigestData: DigestColumnData[];
}

export interface CategoryArticlesPayload {
  success: boolean;
  categoryName: string;
  isMain: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  articles: Article[];
}

export interface ArticleDetailPayload {
  article: Article;
  related: Article[];
  more: Article[];
}

export async function fetchHomeData(signal?: AbortSignal): Promise<HomeDataPayload | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/home`, {
      cache: 'no-store',
      signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as HomeDataPayload;
  } catch {
    return null;
  }
}

export async function fetchCategoryArticlesApi(
  slug: string,
  page = 1,
  limit = 24,
  signal?: AbortSignal
): Promise<CategoryArticlesPayload | null> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const res = await fetch(
      `${API_BASE_URL}/categories/${encodeURIComponent(slug)}/articles?${params.toString()}`,
      { cache: 'no-store', signal }
    );
    if (!res.ok) return null;
    return (await res.json()) as CategoryArticlesPayload;
  } catch {
    return null;
  }
}

export async function fetchArticleDetailApi(
  idOrSlug: string,
  signal?: AbortSignal
): Promise<ArticleDetailPayload | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/articles/${encodeURIComponent(idOrSlug)}`,
      { cache: 'no-store', signal }
    );
    if (!res.ok) return null;
    return (await res.json()) as ArticleDetailPayload;
  } catch {
    return null;
  }
}

export async function searchArticlesApi(
  query: string,
  signal?: AbortSignal
): Promise<Article[] | null> {
  try {
    const params = new URLSearchParams({ q: query, limit: '8' });
    const res = await fetch(`${API_BASE_URL}/articles?${params.toString()}`, {
      cache: 'no-store',
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { articles?: Article[] };
    return Array.isArray(data.articles) ? data.articles : null;
  } catch {
    return null;
  }
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  error?: string;
  token?: string;
  user?: AuthUser;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json()) as AuthResponse;
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Sign in failed');
  }
  return data;
}

export async function registerApi(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });
  const data = (await res.json()) as AuthResponse;
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Registration failed');
  }
  return data;
}
