import { authService } from '../authService';
import { userService } from '../userService';
import { getToken, clearToken } from '../../api/tokenStore';
import { decodeToken } from '../../api/jwt';
import { uniqueCredentials } from './helpers';

describe('authService (Gereksinim 1-3)', () => {
  const creds = uniqueCredentials('auth');
  let userId: string | null = null;

  afterAll(async () => {
    // Olusturulan hesabi temizle
    if (userId) {
      try {
        await authService.login({ email: creds.email, password: creds.password });
        await userService.deleteAccount(userId);
      } catch {
        /* yok say */
      }
    }
    await clearToken();
  });

  it('1. kayit olur (.edu.tr ogrenci maili)', async () => {
    const res = await authService.register(creds);
    expect(res.message).toBeTruthy();
  });

  it('kayit: .edu disi mail reddedilir', async () => {
    await expect(
      authService.register({
        email: 'biri@gmail.com',
        password: 'Test1234!',
        username: `x_${Date.now()}`,
      })
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it('kayit: kisa sifre (<8) reddedilir', async () => {
    await expect(
      authService.register({
        email: `ogr.kisa${Date.now()}@test.edu.tr`,
        password: '123',
        username: `k_${Date.now()}`,
      })
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it('2. giris yapar ve token dondurur', async () => {
    const res = await authService.login({
      email: creds.email,
      password: creds.password,
    });
    expect(res.token).toBeTruthy();
    expect(getToken()).toBe(res.token);
    const payload = decodeToken(res.token);
    expect(payload?.email).toBe(creds.email);
    userId = payload?.id ?? null;
  });

  it('giris: hatali sifre 401 doner', async () => {
    await expect(
      authService.login({ email: creds.email, password: 'yanlissifre' })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it('3. cikis yapar ve token temizlenir', async () => {
    await authService.login({ email: creds.email, password: creds.password });
    const res = await authService.logout();
    expect(res.message).toBeTruthy();
    expect(getToken()).toBeNull();
  });
});
