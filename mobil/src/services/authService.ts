/**
 * Kimlik Dogrulama servisi (Gereksinim 1-3).
 * Endpoint kaynagi: backend/routes/auth.js
 */
import { apiClient } from '../api/client';
import { setToken, clearToken } from '../api/tokenStore';
import type { LoginResponse, MessageResponse } from '../types/models';

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** 1. POST /auth/register */
async function register(input: RegisterInput): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>('/auth/register', input);
  return data;
}

/** 2. POST /auth/login — basarili ise token'i kaydeder. */
async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', input);
  if (data?.token) {
    await setToken(data.token);
  }
  return data;
}

/** 3. POST /auth/logout — sunucuyu bilgilendirir ve yerel token'i siler. */
async function logout(): Promise<MessageResponse> {
  try {
    const { data } = await apiClient.post<MessageResponse>('/auth/logout');
    return data;
  } finally {
    await clearToken();
  }
}

export const authService = { register, login, logout };
