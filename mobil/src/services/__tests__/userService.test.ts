import { userService } from '../userService';
import { createAndLoginUser, cleanupUser, TestUser } from './helpers';

describe('userService (Gereksinim 4-6)', () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await createAndLoginUser('user');
  });

  afterAll(async () => {
    await cleanupUser(user);
  });

  it('4. profil bilgilerini getirir', async () => {
    const profil = await userService.getProfile(user.userId);
    expect(profil._id).toBe(user.userId);
    expect(profil.email).toBe(user.email);
    expect(profil.username).toBe(user.username);
    // sifre asla donmemeli
    expect((profil as unknown as Record<string, unknown>).password).toBeUndefined();
  });

  it('5. profili gunceller (kisaOzgecmis + avatarUrl)', async () => {
    const guncel = await userService.updateProfile(user.userId, {
      kisaOzgecmis: 'Merhaba, ben bir test kullanicisiyim.',
      avatarUrl: 'https://example.com/a.png',
    });
    expect(guncel.kisaOzgecmis).toBe('Merhaba, ben bir test kullanicisiyim.');
    expect(guncel.avatarUrl).toBe('https://example.com/a.png');
  });

  it('5b. kisa sifre ile guncelleme 400 doner', async () => {
    await expect(
      userService.updateProfile(user.userId, { password: '123' })
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it('6. hesabi siler', async () => {
    await expect(
      userService.deleteAccount(user.userId)
    ).resolves.toBeUndefined();
    // silindikten sonra profil 404
    await expect(userService.getProfile(user.userId)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});
