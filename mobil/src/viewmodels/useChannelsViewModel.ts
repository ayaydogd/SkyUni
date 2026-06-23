/** Kanallar ekrani logic'i — listele / olustur / sil. */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { channelService } from '../services/channelService';
import { qk } from './queryKeys';
import { getApiErrorMessage } from '../api/client';

export function useChannelsViewModel() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [error, setError] = useState('');

  const channelsQuery = useQuery({
    queryKey: qk.channels,
    queryFn: () => channelService.listChannels({ page: 1, limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      channelService.createChannel({
        name: newName.trim(),
        description: newDescription.trim() || undefined,
      }),
    onSuccess: () => {
      setNewName('');
      setNewDescription('');
      setError('');
      queryClient.invalidateQueries({ queryKey: qk.channels });
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (channelId: string) => channelService.deleteChannel(channelId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.channels }),
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  function createChannel() {
    if (!newName.trim()) {
      setError('Kanal adi zorunludur.');
      return;
    }
    createMutation.mutate();
  }

  return {
    channels: channelsQuery.data ?? [],
    loading: channelsQuery.isLoading,
    refreshing: channelsQuery.isRefetching,
    loadError: channelsQuery.isError
      ? getApiErrorMessage(channelsQuery.error)
      : '',
    newName,
    newDescription,
    error,
    creating: createMutation.isPending,
    setNewName,
    setNewDescription,
    createChannel,
    deleteChannel: (id: string) => deleteMutation.mutate(id),
    refetch: channelsQuery.refetch,
  };
}
