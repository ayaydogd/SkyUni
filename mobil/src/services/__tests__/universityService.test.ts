import { universityService } from '../universityService';
import { createAndLoginUser, cleanupUser, TestUser } from './helpers';

describe('universityService (Gereksinim 7-9, 17-20)', () => {
  let user: TestUser;
  let universityId: string;

  beforeAll(async () => {
    user = await createAndLoginUser('uni');
  });

  afterAll(async () => {
    if (universityId) {
      try {
        await universityService.deleteUniversity(universityId);
      } catch {
        /* yok say */
      }
    }
    await cleanupUser(user);
  });

  it('8. universite ekler', async () => {
    const uni = await universityService.addUniversity({
      name: `Test Universitesi ${Date.now()}`,
      website: 'https://test.edu.tr',
    });
    expect(uni._id).toBeTruthy();
    expect(uni.name).toContain('Test Universitesi');
    universityId = uni._id;
  });

  it('8b. cok kisa ad (<3) reddedilir', async () => {
    await expect(
      universityService.addUniversity({ name: 'ab' })
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it('7. universiteleri listeler', async () => {
    const list = await universityService.listUniversities({ page: 1, limit: 50 });
    expect(Array.isArray(list)).toBe(true);
    expect(list.some((u) => u._id === universityId)).toBe(true);
  });

  it('18. hoca ekler', async () => {
    const hoca = await universityService.addProfessor(universityId, {
      name: 'Prof. Dr. Test Hoca',
      department: 'Bilgisayar Muhendisligi',
    });
    expect(hoca._id).toBeTruthy();
    expect(hoca.universityId).toBe(universityId);
  });

  it('17. hocalari listeler', async () => {
    const list = await universityService.listProfessors(universityId);
    expect(list.length).toBeGreaterThanOrEqual(1);
  });

  it('20. ders ekler', async () => {
    const ders = await universityService.addCourse(universityId, {
      code: 'BLM101',
      name: 'Programlamaya Giris',
    });
    expect(ders._id).toBeTruthy();
    expect(ders.code).toBe('BLM101');
  });

  it('19. dersleri listeler', async () => {
    const list = await universityService.listCourses(universityId);
    expect(list.length).toBeGreaterThanOrEqual(1);
  });

  it('9. universiteyi siler', async () => {
    await expect(
      universityService.deleteUniversity(universityId)
    ).resolves.toBeUndefined();
    universityId = '';
  });
});
