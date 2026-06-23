/**
 * JWT token yonetimi.
 *
 * - Bellekteki `currentToken` axios interceptor tarafindan senkron okunur.
 * - Kalici saklama expo-secure-store ile yapilir (uygulama yeniden acildiginda
 *   oturum korunur). secure-store yalnizca gercek RN ortaminda calistigindan,
 *   test (Node) ortaminda guvenli sekilde atlanir.
 */

const TOKEN_KEY = 'skyuni_token';

let currentToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

/** secure-store'u yalnizca RN ortaminda yukle (test ortaminda yok say). */
function getSecureStore(): typeof import('expo-secure-store') | null {
  try {
    // require ile lazy yukleme — Node testlerinde import patlamasin diye.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-secure-store');
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return currentToken;
}

export async function setToken(token: string): Promise<void> {
  currentToken = token;
  const store = getSecureStore();
  if (store) {
    try {
      await store.setItemAsync(TOKEN_KEY, token);
    } catch {
      // saklama basarisiz olsa bile bellekteki token gecerli kalir
    }
  }
}

export async function clearToken(): Promise<void> {
  currentToken = null;
  const store = getSecureStore();
  if (store) {
    try {
      await store.deleteItemAsync(TOKEN_KEY);
    } catch {
      // yok say
    }
  }
}

/** Uygulama acilisinda kalici token'i belleye yukler. */
export async function loadToken(): Promise<string | null> {
  const store = getSecureStore();
  if (store) {
    try {
      const saved = await store.getItemAsync(TOKEN_KEY);
      currentToken = saved ?? null;
    } catch {
      currentToken = null;
    }
  }
  return currentToken;
}

/** 401 durumunda cagrilacak callback (AuthContext oturumu dusurur). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export function triggerUnauthorized(): void {
  if (onUnauthorized) onUnauthorized();
}
