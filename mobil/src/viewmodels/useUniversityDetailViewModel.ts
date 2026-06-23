/** Universite detayi logic'i — hocalar (listele/ekle) + dersler (listele/ekle). */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { universityService } from '../services/universityService';
import { qk } from './queryKeys';
import { getApiErrorMessage } from '../api/client';

export function useUniversityDetailViewModel(universityId: string) {
  const queryClient = useQueryClient();

  const [profName, setProfName] = useState('');
  const [profDept, setProfDept] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [error, setError] = useState('');

  const professorsQuery = useQuery({
    queryKey: qk.professors(universityId),
    queryFn: () =>
      universityService.listProfessors(universityId, { page: 1, limit: 100 }),
    enabled: !!universityId,
  });

  const coursesQuery = useQuery({
    queryKey: qk.courses(universityId),
    queryFn: () =>
      universityService.listCourses(universityId, { page: 1, limit: 100 }),
    enabled: !!universityId,
  });

  const addProfMutation = useMutation({
    mutationFn: () =>
      universityService.addProfessor(universityId, {
        name: profName.trim(),
        department: profDept.trim() || undefined,
      }),
    onSuccess: () => {
      setProfName('');
      setProfDept('');
      setError('');
      queryClient.invalidateQueries({ queryKey: qk.professors(universityId) });
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const addCourseMutation = useMutation({
    mutationFn: () =>
      universityService.addCourse(universityId, {
        code: courseCode.trim(),
        name: courseName.trim(),
      }),
    onSuccess: () => {
      setCourseCode('');
      setCourseName('');
      setError('');
      queryClient.invalidateQueries({ queryKey: qk.courses(universityId) });
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  function addProfessor() {
    if (!profName.trim()) {
      setError('Hoca adi zorunludur.');
      return;
    }
    addProfMutation.mutate();
  }

  function addCourse() {
    if (!courseCode.trim() || !courseName.trim()) {
      setError('Ders kodu ve adi zorunludur.');
      return;
    }
    addCourseMutation.mutate();
  }

  return {
    professors: professorsQuery.data ?? [],
    courses: coursesQuery.data ?? [],
    loadingProfessors: professorsQuery.isLoading,
    loadingCourses: coursesQuery.isLoading,
    loadError:
      professorsQuery.isError || coursesQuery.isError
        ? getApiErrorMessage(professorsQuery.error ?? coursesQuery.error)
        : '',
    profName,
    profDept,
    courseCode,
    courseName,
    error,
    addingProfessor: addProfMutation.isPending,
    addingCourse: addCourseMutation.isPending,
    setProfName,
    setProfDept,
    setCourseCode,
    setCourseName,
    addProfessor,
    addCourse,
    refetch: () => {
      professorsQuery.refetch();
      coursesQuery.refetch();
    },
  };
}
