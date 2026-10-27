export interface Article {
  id: string;
  title: string;
  summary?: string;
  tag?: string;
  time?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  badge?: 'LIVE' | 'VIDEO' | 'AUDIO' | 'ANALYSIS' | string;
  isVideo?: boolean;
  videoDuration?: string;
  audioDuration?: string;
  author?: string;
  bulletPoints?: string[];
  link?: string;
}

export interface PodcastItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  episodeDuration?: string;
  category?: string;
  badge?: string;
}

export interface ColumnSection {
  title: string;
  link: string;
  leadArticle: Article;
  articles: Article[];
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
}
