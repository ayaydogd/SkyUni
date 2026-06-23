/** React Query anahtarlari — tek noktadan yonetilir. */
export const qk = {
  profile: (userId: string) => ['profile', userId] as const,
  universities: ['universities'] as const,
  professors: (universityId: string) =>
    ['universities', universityId, 'professors'] as const,
  courses: (universityId: string) =>
    ['universities', universityId, 'courses'] as const,
  channels: ['channels'] as const,
  messages: (channelId: string) => ['channels', channelId, 'messages'] as const,
};
