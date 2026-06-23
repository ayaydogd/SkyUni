/**
 * Universite / Hoca / Ders servisi (Gereksinim 7-9, 17-20).
 * Endpoint kaynagi: backend/routes/universities.js
 */
import { apiClient } from '../api/client';
import type {
  University,
  Professor,
  Course,
  Pagination,
} from '../types/models';

function pageParams(p?: Pagination) {
  return { params: { page: p?.page, limit: p?.limit } };
}

/** 7. GET /universities */
async function listUniversities(p?: Pagination): Promise<University[]> {
  const { data } = await apiClient.get<University[]>('/universities', pageParams(p));
  return data;
}

/** 8. POST /universities */
async function addUniversity(input: {
  name: string;
  website?: string;
}): Promise<University> {
  const { data } = await apiClient.post<University>('/universities', input);
  return data;
}

/** 9. DELETE /universities/:universityId */
async function deleteUniversity(universityId: string): Promise<void> {
  await apiClient.delete(`/universities/${universityId}`);
}

/** 17. GET /universities/:universityId/professors */
async function listProfessors(
  universityId: string,
  p?: Pagination
): Promise<Professor[]> {
  const { data } = await apiClient.get<Professor[]>(
    `/universities/${universityId}/professors`,
    pageParams(p)
  );
  return data;
}

/** 18. POST /universities/:universityId/professors */
async function addProfessor(
  universityId: string,
  input: { name: string; department?: string }
): Promise<Professor> {
  const { data } = await apiClient.post<Professor>(
    `/universities/${universityId}/professors`,
    input
  );
  return data;
}

/** 19. GET /universities/:universityId/courses */
async function listCourses(
  universityId: string,
  p?: Pagination
): Promise<Course[]> {
  const { data } = await apiClient.get<Course[]>(
    `/universities/${universityId}/courses`,
    pageParams(p)
  );
  return data;
}

/** 20. POST /universities/:universityId/courses */
async function addCourse(
  universityId: string,
  input: { code: string; name: string }
): Promise<Course> {
  const { data } = await apiClient.post<Course>(
    `/universities/${universityId}/courses`,
    input
  );
  return data;
}

export const universityService = {
  listUniversities,
  addUniversity,
  deleteUniversity,
  listProfessors,
  addProfessor,
  listCourses,
  addCourse,
};
