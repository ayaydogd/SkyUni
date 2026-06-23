/**
 * Kullanici (Profil) servisi (Gereksinim 4-6).
 * Endpoint kaynagi: backend/routes/users.js
 */
import { apiClient } from '../api/client';
import type { User } from '../types/models';

export interface ProfileUpdateInput {
  kisaOzgecmis?: string;
  avatarUrl?: string;
  password?: string;
}

/** 4. GET /users/:userId */
async function getProfile(userId: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${userId}`);
  return data;
}

/** 5. PUT /users/:userId — yalniz kendi profili (backend kontrol eder). */
async function updateProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<User> {
  const { data } = await apiClient.put<User>(`/users/${userId}`, input);
  return data;
}

/** 6. DELETE /users/:userId — yalniz kendi hesabi. */
async function deleteAccount(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}

export const userService = { getProfile, updateProfile, deleteAccount };
