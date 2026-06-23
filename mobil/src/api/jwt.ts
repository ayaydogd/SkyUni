/**
 * Minimal JWT payload cozucu (imza dogrulamaz — sadece payload okur).
 * Backend token payload'i: { id, email, iat, exp }
 * Web tarafindaki `atob(token.split('.')[1])` mantiginin RN/Node karsiligi.
 */

export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

function base64UrlDecode(input: string): string {
  let b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';

  // atob hem Node 18+ hem de RN (Hermes) ortaminda global olarak mevcuttur.
  // UTF-8 karakterleri dogru cozmek icin percent-encoding araciligiyla decode.
  return decodeURIComponent(
    atob(b64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

/** Token suresi dolmus mu? */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
