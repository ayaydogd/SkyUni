/** Profil ekrani logic'i — goruntule / guncelle / hesabi sil. */
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';
import { qk } from './queryKeys';
import { getApiErrorMessage } from '../api/client';

export function useProfileViewModel() {
  const { userId, endSession } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: qk.profile(userId ?? ''),
    queryFn: () => userService.getProfile(userId as string),
    enabled: !!userId,
  });

  // Duzenlenebilir alanlar
  const [kisaOzgecmis, setKisaOzgecmis] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{ ok?: string; err?: string }>({});

  // Profil yuklendiginde formu doldur
  useEffect(() => {
    if (profileQuery.data) {
      setKisaOzgecmis(profileQuery.data.kisaOzgecmis ?? '');
      setAvatarUrl(profileQuery.data.avatarUrl ?? '');
    }
  }, [profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      userService.updateProfile(userId as string, {
        kisaOzgecmis,
        avatarUrl,
        ...(password ? { password } : {}),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.profile(userId as string), updated);
      setPassword('');
      setFeedback({ ok: 'Profil guncellendi!' });
    },
    onError: (e) => setFeedback({ err: getApiErrorMessage(e) }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => userService.deleteAccount(userId as string),
    onSuccess: async () => {
      await endSession();
    },
    onError: (e) => setFeedback({ err: getApiErrorMessage(e) }),
  });

  function save() {
    setFeedback({});
    if (password && password.length < 8) {
      setFeedback({ err: 'Sifre en az 8 karakter olmalidir.' });
      return;
    }
    updateMutation.mutate();
  }

  return {
    profile: profileQuery.data,
    loading: profileQuery.isLoading,
    loadError: profileQuery.isError
      ? getApiErrorMessage(profileQuery.error)
      : '',
    kisaOzgecmis,
    avatarUrl,
    password,
    feedback,
    saving: updateMutation.isPending,
    deleting: deleteMutation.isPending,
    setKisaOzgecmis,
    setAvatarUrl,
    setPassword,
    save,
    deleteAccount: () => deleteMutation.mutate(),
    refetch: profileQuery.refetch,
  };
}
