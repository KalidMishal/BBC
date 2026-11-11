import { AuthUser, UserRole } from '../types';

export const TOKEN_STORAGE_KEY = 'authToken';
export const USER_STORAGE_KEY = 'user';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || !parsed.email) return null;
    return {
      ...parsed,
      name: parsed.name || parsed.fullName || parsed.full_name || '',
      fullName: parsed.fullName ?? parsed.name ?? parsed.full_name ?? null,
    };
  } catch {
    return null;
  }
}

export function saveAuthSession(token: string | undefined, user: AuthUser | undefined): void {
  if (typeof window === 'undefined') return;
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
  if (user) {
    const normalized: AuthUser = {
      ...user,
      name: user.name || user.fullName || user.full_name || '',
      fullName: user.fullName ?? user.name ?? user.full_name ?? null,
    };
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
  }
  window.dispatchEvent(new Event('authUpdated'));
  window.dispatchEvent(new Event('userProfileUpdated'));
}

export function updateStoredUser(partial: Partial<AuthUser>): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const existing = getStoredUser();
  if (!existing) return null;
  const merged: AuthUser = {
    ...existing,
    ...partial,
  };
  merged.name = merged.name || merged.fullName || merged.full_name || existing.name || '';
  merged.fullName = merged.fullName ?? merged.name ?? null;
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event('authUpdated'));
  window.dispatchEvent(new Event('userProfileUpdated'));
  return merged;
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event('authUpdated'));
  window.dispatchEvent(new Event('userProfileUpdated'));
}

export function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  };
}

export function getRoleDashboardPath(role?: UserRole | string | null): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'writer') return '/writer/dashboard';
  if (role === 'reader') return '/reader/dashboard';
  return '/';
}

export function getDisplayName(user?: Partial<AuthUser> | null): string {
  if (!user) return 'BBC Member';
  return user.name || user.fullName || user.full_name || user.email?.split('@')[0] || 'BBC Member';
}
