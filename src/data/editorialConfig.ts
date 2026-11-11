import { mainCategories, findCategoryBySlug } from './categoriesData';

export interface PlacementOption {
  key: string;
  label: string;
  shortLabel: string;
}

export const BBC_MAIN_CATEGORIES: string[] = mainCategories.map((c) => c.name);

export const BBC_SUBCATEGORIES_BY_MAIN: Array<{
  mainName: string;
  mainSlug: string;
  subcategories: string[];
}> = mainCategories.map((c) => ({
  mainName: c.name,
  mainSlug: c.slug,
  subcategories: c.subcategories.map((s) => s.name),
}));

export const ALL_BBC_SUBCATEGORIES: string[] = mainCategories.flatMap((c) =>
  c.subcategories.map((s) => s.name)
);

export function getSubcategoriesForMain(mainName: string): string[] {
  const matched = mainCategories.find(
    (c) => c.name.toLowerCase() === (mainName || '').trim().toLowerCase()
  );
  return matched ? matched.subcategories.map((s) => s.name) : [];
}

export function getCategorySlugByName(name: string): string {
  const found = findCategoryBySlug(name);
  if (found) {
    return found.isMain ? found.main.slug : found.sub?.slug || found.main.slug;
  }
  return encodeURIComponent(name.trim().replace(/\s+/g, '-'));
}

export const BBC_PLACEMENTS: PlacementOption[] = [
  { key: 'archive', label: 'None (Category & Search Only)', shortLabel: 'Category & Search' },
  { key: 'hero_lead', label: 'Hero Lead Story (Center)', shortLabel: 'Hero Lead' },
  { key: 'hero_secondary', label: 'Hero Secondary (Left Cards)', shortLabel: 'Hero Left' },
  { key: 'hero_side', label: 'Hero Latest Updates (Right List)', shortLabel: 'Latest Updates' },
  { key: 'politics_grid', label: 'Politics & Government Grid', shortLabel: 'Politics Grid' },
  { key: 'eu_leaders', label: 'EU Leaders Feature', shortLabel: 'EU Leaders' },
  { key: 'more_news_vanessa', label: 'More News (Featured Left)', shortLabel: 'More News Left' },
  { key: 'more_news_burnham', label: 'More News (Center Feature)', shortLabel: 'More News Center' },
  { key: 'more_news_side', label: 'More News (Side List)', shortLabel: 'More News Side' },
  { key: 'human_rights', label: 'Human Rights & Civil Liberties', shortLabel: 'Human Rights' },
  { key: 'watch_hero', label: 'Watch Hero Video', shortLabel: 'Watch Hero' },
  { key: 'recent_videos', label: 'Recent Videos Grid', shortLabel: 'Recent Videos' },
  { key: 'editor_lead', label: "Editor's Pick (Lead)", shortLabel: "Editor's Lead" },
  { key: 'editor_side', label: "Editor's Pick (Side List)", shortLabel: "Editor's Side" },
  { key: 'indepth_lead', label: 'In-Depth (Lead Story)', shortLabel: 'In-Depth Lead' },
  { key: 'indepth_cards', label: 'In-Depth (4-Card Grid)', shortLabel: 'In-Depth Cards' },
  { key: 'infocus_lead', label: 'In Focus This Week (Lead)', shortLabel: 'In Focus Lead' },
  { key: 'infocus_side', label: 'In Focus This Week (Side List)', shortLabel: 'In Focus Side' },
  { key: 'sports_cards', label: 'Sports Section Grid', shortLabel: 'Sports Section' },
  { key: 'digest_lead', label: '4-Column Digest (Lead)', shortLabel: 'Digest Lead' },
  { key: 'digest_item', label: '4-Column Digest (List)', shortLabel: 'Digest Item' },
];

export function getPlacementLabel(key?: string | null): string {
  if (!key || key === 'archive') return 'None (Category & Search Only)';
  const found = BBC_PLACEMENTS.find((p) => p.key === key);
  return found ? found.label : key;
}

export function getPlacementShortLabel(key?: string | null): string {
  if (!key || key === 'archive') return 'Category & Search';
  const found = BBC_PLACEMENTS.find((p) => p.key === key);
  return found ? found.shortLabel : key;
}
