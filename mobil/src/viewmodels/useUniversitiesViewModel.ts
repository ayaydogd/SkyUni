/** Universiteler ekrani logic'i — listele / ekle / sil. */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { universityService } from '../services/universityService';
import { qk } from './queryKeys';
import { getApiErrorMessage } from '../api/client';

export function useUniversitiesViewModel() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [error, setError] = useState('');

  const universitiesQuery = useQuery({
    queryKey: qk.universities,
    queryFn: () => universityService.listUniversities({ page: 1, limit: 100 }),
  });

  const addMutation = useMutation({
    mutationFn: () =>
      universityService.addUniversity({
        name: newName.trim(),
        website: newWebsite.trim() || undefined,
      }),
    onSuccess: () => {
      setNewName('');
      setNewWebsite('');
      setError('');
      queryClient.invalidateQueries({ queryKey: qk.universities });
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => universityService.deleteUniversity(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.universities }),
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  function addUniversity() {
    if (newName.trim().length < 3) {
      setError('Universite adi en az 3 karakter olmalidir.');
      return;
    }
    addMutation.mutate();
  }

  return {
    universities: universitiesQuery.data ?? [],
    loading: universitiesQuery.isLoading,
    refreshing: universitiesQuery.isRefetching,
    loadError: universitiesQuery.isError
      ? getApiErrorMessage(universitiesQuery.error)
      : '',
    newName,
    newWebsite,
    error,
    adding: addMutation.isPending,
    setNewName,
    setNewWebsite,
    addUniversity,
    deleteUniversity: (id: string) => deleteMutation.mutate(id),
    refetch: universitiesQuery.refetch,
  };
}
