import { channelService } from '../channelService';
import { createAndLoginUser, cleanupUser, TestUser } from './helpers';

describe('channelService (Gereksinim 10-12)', () => {
  let user: TestUser;
  let channelId: string;

  beforeAll(async () => {
    user = await createAndLoginUser('chan');
  });

  afterAll(async () => {
    if (channelId) {
      try {
        await channelService.deleteChannel(channelId);
      } catch {
        /* yok say */
      }
    }
    await cleanupUser(user);
  });

  it('11. kanal olusturur', async () => {
    const ch = await channelService.createChannel({
      name: `test-kanal-${Date.now()}`,
      description: 'Test kanali',
    });
    expect(ch._id).toBeTruthy();
    expect(ch.description).toBe('Test kanali');
    channelId = ch._id;
  });

  it('11b. adsiz kanal reddedilir', async () => {
    await expect(
      channelService.createChannel({ name: '' })
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it('10. kanallari listeler', async () => {
    const list = await channelService.listChannels({ page: 1, limit: 50 });
    expect(Array.isArray(list)).toBe(true);
    expect(list.some((c) => c._id === channelId)).toBe(true);
  });

  it('12. kanali siler', async () => {
    await expect(
      channelService.deleteChannel(channelId)
    ).resolves.toBeUndefined();
    channelId = '';
  });
});
