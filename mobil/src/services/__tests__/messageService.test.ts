import { messageService } from '../messageService';
import { channelService } from '../channelService';
import { createAndLoginUser, cleanupUser, TestUser } from './helpers';
import type { MessageAuthor } from '../../types/models';

describe('messageService (Gereksinim 13-16 + icerik filtresi)', () => {
  let user: TestUser;
  let channelId: string;
  let messageId: string;

  beforeAll(async () => {
    user = await createAndLoginUser('msg');
    const ch = await channelService.createChannel({
      name: `msg-kanal-${Date.now()}`,
    });
    channelId = ch._id;
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

  it('14. mesaj gonderir', async () => {
    const msg = await messageService.sendMessage(channelId, 'Merhaba dunya');
    expect(msg._id).toBeTruthy();
    expect(msg.text).toBe('Merhaba dunya');
    messageId = msg._id;
  });

  it('14b. icerik filtresi uygunsuz mesaji reddeder (400)', async () => {
    await expect(
      messageService.sendMessage(channelId, 'seni öldüreceğim')
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it('13. mesajlari listeler (gonderen populate edilmis)', async () => {
    const list = await messageService.listMessages(channelId, {
      page: 1,
      limit: 50,
    });
    expect(list.length).toBeGreaterThanOrEqual(1);
    const found = list.find((m) => m._id === messageId);
    expect(found).toBeDefined();
    // userId username ile populate edilmeli
    const author = found!.userId as MessageAuthor;
    expect(author.username).toBe(user.username);
  });

  it('15. kendi mesajini duzenler', async () => {
    const updated = await messageService.editMessage(
      messageId,
      'Guncellenmis mesaj'
    );
    expect(updated.text).toBe('Guncellenmis mesaj');
  });

  it('16. kendi mesajini siler', async () => {
    await expect(
      messageService.deleteMessage(messageId)
    ).resolves.toBeUndefined();
  });
});
