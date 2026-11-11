export type UserRole = 'reader' | 'writer' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  fullName?: string | null;
  full_name?: string | null;
  role: UserRole;
  writer_role?: string | null;
  is_default_admin?: boolean;
  profile_picture?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
}

export interface BookmarkItem {
  id?: number;
  slug: string;
  title?: string;
  image?: string;
  category?: string;
  date?: string;
  author?: string;
  created_at?: string;
}

export interface Article {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  cardSummary?: string;
  content?: string;
  tag?: string;
  time?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  subCategories?: string[];
  tags?: string[];
  badge?: 'LIVE' | 'VIDEO' | 'AUDIO' | 'ANALYSIS' | string;
  isVideo?: boolean;
  videoDuration?: string;
  duration?: string;
  audioDuration?: string;
  author?: string;
  authorId?: number | null;
  authorProfilePicture?: string | null;
  authorBio?: string | null;
  authorLinkedinUrl?: string | null;
  authorWriterRole?: string | null;
  readDuration?: number;
  views?: number;
  publishedAt?: string;
  sectionKey?: string;
  bulletPoints?: string[];
  link?: string;
}

export interface EditorialPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content?: string;
  mainCategory?: string;
  main_category?: string;
  category?: string;
  sub_categories?: string[] | string;
  tags?: string[] | string;
  cardSummary?: string;
  card_summary?: string;
  summary?: string;
  focusKeyword?: string;
  focus_keyword?: string;
  metaDescription?: string;
  meta_description?: string;
  readDuration?: number;
  read_duration?: number;
  imageUrl?: string;
  image_url?: string;
  status: 'draft' | 'pending' | 'published' | 'trash' | 'rejected';
  placement?: string;
  section_key?: string;
  rejection_reason?: string | null;
  rejectionReason?: string | null;
  author_id?: number | null;
  authorName?: string;
  author_name?: string;
  author_email?: string | null;
  authorProfilePicture?: string | null;
  author_profile_picture?: string | null;
  authorBio?: string | null;
  author_bio?: string | null;
  authorLinkedinUrl?: string | null;
  author_linkedin_url?: string | null;
  views?: number;
  date?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PodcastItem {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
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
