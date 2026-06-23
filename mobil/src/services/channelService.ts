/**
 * Kanal servisi (Gereksinim 10-12).
 * Endpoint kaynagi: backend/routes/channels.js
 */
import { apiClient } from '../api/client';
import type { Channel, Pagination } from '../types/models';

/** 10. GET /channels */
async function listChannels(p?: Pagination): Promise<Channel[]> {
  const { data } = await apiClient.get<Channel[]>('/channels', {
    params: { page: p?.page, limit: p?.limit },
  });
  return data;
}

/** 11. POST /channels */
async function createChannel(input: {
  name: string;
  description?: string;
}): Promise<Channel> {
  const { data } = await apiClient.post<Channel>('/channels', input);
  return data;
}

/** 12. DELETE /channels/:channelId */
async function deleteChannel(channelId: string): Promise<void> {
  await apiClient.delete(`/channels/${channelId}`);
}

export const channelService = { listChannels, createChannel, deleteChannel };
