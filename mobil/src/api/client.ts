/**
 * Merkezi axios istemcisi.
 * - Tum isteklere otomatik Authorization: Bearer <token> ekler.
 * - 401 cevabinda oturumu dusurur (triggerUnauthorized).
 * - Backend hata mesajlarini (res.data.message) okunabilir Error'a cevirir.
 */
import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config/env';
import { getToken, triggerUnauthorized } from './tokenStore';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      triggerUnauthorized();
    }
    return Promise.reject(error);
  }
);

/** Backend hata mesajini cikartir; yoksa makul bir varsayilan doner. */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Bir hata olustu. Lutfen tekrar deneyin.'
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.code === 'ECONNABORTED') return 'Istek zaman asimina ugradi.';
    if (!error.response) return 'Sunucuya ulasilamiyor. Baglantinizi kontrol edin.';
  }
  return fallback;
}
