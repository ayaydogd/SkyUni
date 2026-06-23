/**
 * Test yardimcilari — gercek lokal backend'e karsi calisir.
 * Her test dosyasi benzersiz bir ogrenci hesabi olusturur ve sonunda temizler.
 */
import { authService } from '../authService';
import { userService } from '../userService';
import { decodeToken } from '../../api/jwt';
import { clearToken } from '../../api/tokenStore';

export interface TestUser {
  userId: string;
  email: string;
  username: string;
  password: string;
}

/** Backend kurallarina uyan benzersiz ogrenci e-postasi (.edu.tr + "ogr"). */
export function uniqueCredentials(prefix: string): {
  email: string;
  username: string;
  password: string;
} {
  const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    // "ogr" icerir + ".edu.tr" ile biter
    email: `ogr.${prefix}${stamp}@test.edu.tr`,
    username: `${prefix}_${stamp}`,
    password: 'Test1234!',
  };
}

/** Kayit olur, giris yapar (token kaydedilir) ve userId doner. */
export async function createAndLoginUser(prefix: string): Promise<TestUser> {
  const creds = uniqueCredentials(prefix);
  await authService.register(creds);
  const res = await authService.login({
    email: creds.email,
    password: creds.password,
  });
  const payload = decodeToken(res.token);
  if (!payload?.id) throw new Error('Token cozulemedi');
  return { userId: payload.id, ...creds };
}

/** Test kullanicisini siler ve token'i temizler. */
export async function cleanupUser(user: TestUser): Promise<void> {
  try {
    await userService.deleteAccount(user.userId);
  } catch {
    // zaten silinmis olabilir
  }
  await clearToken();
}
