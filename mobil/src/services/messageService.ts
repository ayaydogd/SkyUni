/**
 * Mesaj servisi (Gereksinim 13-16).
 * Endpoint kaynagi: backend/routes/channels.js (liste/gonder) + messages.js (duzenle/sil)
 * Not: Mesaj gonderme/duzenleme backend'de icerik filtresine tabidir (400 doner).
 */
import { apiClient } from '../api/client';
import type { Message, Pagination } from '../types/models';

/** 13. GET /channels/:channelId/messages */
async function listMessages(
  channelId: string,
  p?: Pagination
): Promise<Message[]> {
  const { data } = await apiClient.get<Message[]>(
    `/channels/${channelId}/messages`,
    { params: { page: p?.page, limit: p?.limit } }
  );
  return data;
}

/** 14. POST /channels/:channelId/messages */
async function sendMessage(channelId: string, text: string): Promise<Message> {
  const { data } = await apiClient.post<Message>(
    `/channels/${channelId}/messages`,
    { text }
  );
  return data;
}

/** 15. PUT /messages/:messageId — yalniz kendi mesaji. */
async function editMessage(messageId: string, text: string): Promise<Message> {
  const { data } = await apiClient.put<Message>(`/messages/${messageId}`, {
    text,
  });
  return data;
}

/** 16. DELETE /messages/:messageId — yalniz kendi mesaji. */
async function deleteMessage(messageId: string): Promise<void> {
  await apiClient.delete(`/messages/${messageId}`);
}

export const messageService = {
  listMessages,
  sendMessage,
  editMessage,
  deleteMessage,
};
