/**
 * Backend modellerinin (MongoDB semalari) TypeScript karsiliklari.
 * Kaynak: backend/models/*.js
 */

export interface User {
  _id: string;
  email: string;
  username: string;
  adSoyad?: string;
  universite?: string;
  kisaOzgecmis?: string;
  avatarUrl?: string;
  basarimlar?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface University {
  _id: string;
  name: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Professor {
  _id: string;
  name: string;
  department?: string;
  universityId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id: string;
  code: string;
  name: string;
  universityId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Mesaj listesinde userId, username+avatarUrl ile populate edilir. */
export interface MessageAuthor {
  _id: string;
  username: string;
  avatarUrl?: string;
}

export interface Message {
  _id: string;
  text: string;
  channelId: string;
  // GET listede populate edilmis nesne, POST/PUT cevabinda ham id string olabilir.
  userId: MessageAuthor | string;
  createdAt?: string;
  updatedAt?: string;
}

/** Giris cevabi. */
export interface LoginResponse {
  message: string;
  token: string;
}

/** Standart mesaj cevabi (register/logout vb.). */
export interface MessageResponse {
  message: string;
}

/** Sayfalama parametreleri. */
export interface Pagination {
  page?: number;
  limit?: number;
}
