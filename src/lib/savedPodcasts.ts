import { API_BASE_URL } from './api';
import { authHeaders, getAuthToken, getStoredUser } from './auth';
import { PodcastItem } from '../types';

function getStorageKey(): string {
  const user = getStoredUser();
  return user?.email
    ? `bbc_saved_podcasts_${user.email.toLowerCase()}`
    : 'bbc_saved_podcasts_guest';
}

export function getLocalSavedPodcasts(): PodcastItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setLocalSavedPodcasts(items: PodcastItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
    window.dispatchEvent(new Event('savedPodcastsUpdated'));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchSavedPodcasts(): Promise<PodcastItem[]> {
  const localItems = getLocalSavedPodcasts();
  const token = getAuthToken();
  if (!token) return localItems;

  try {
    const res = await fetch(`${API_BASE_URL}/saved-podcasts`, {
      headers: authHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return localItems;
    const data = await res.json();
    if (data?.success && Array.isArray(data.podcasts)) {
      const normalized: PodcastItem[] = data.podcasts.map((p: PodcastItem) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle || '',
        summary: p.summary || '',
        imageUrl: p.imageUrl || '/listen-global-briefing.jpg',
        episodeDuration: p.episodeDuration || '25 mins',
        category: p.category || 'PODCAST',
        badge: p.badge || '',
      }));
      if (typeof window !== 'undefined') {
        localStorage.setItem(getStorageKey(), JSON.stringify(normalized));
      }
      return normalized;
    }
    return localItems;
  } catch {
    return localItems;
  }
}

export async function toggleSavedPodcast(
  podcast: PodcastItem
): Promise<{ saved: boolean; podcasts: PodcastItem[] }> {
  const current = getLocalSavedPodcasts();
  const exists = current.some((p) => p.id === podcast.id);
  const optimistic = exists
    ? current.filter((p) => p.id !== podcast.id)
    : [podcast, ...current];

  setLocalSavedPodcasts(optimistic);

  const token = getAuthToken();
  if (!token) {
    return { saved: !exists, podcasts: optimistic };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/saved-podcasts`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        podcast_id: podcast.id,
        title: podcast.title,
        subtitle: podcast.subtitle || '',
        summary: podcast.summary || '',
        image_url: podcast.imageUrl || '/listen-global-briefing.jpg',
        episode_duration: podcast.episodeDuration || '',
        category: podcast.category || '',
        badge: podcast.badge || '',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        const refreshed = await fetchSavedPodcasts();
        window.dispatchEvent(new Event('savedPodcastsUpdated'));
        return { saved: Boolean(data.saved), podcasts: refreshed };
      }
    }
  } catch {
    // Keep optimistic localStorage state if network/endpoint is unavailable
  }

  return { saved: !exists, podcasts: optimistic };
}
