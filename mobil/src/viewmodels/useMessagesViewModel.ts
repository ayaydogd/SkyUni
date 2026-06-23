/** Kanal mesajlari ekrani logic'i — listele / gonder / duzenle / sil. */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/messageService';
import { useAuth } from './AuthContext';
import { qk } from './queryKeys';
import { getApiErrorMessage } from '../api/client';
import type { Message, MessageAuthor } from '../types/models';

/** Bir mesajin gonderen kullanici id'sini cikartir (populate edilmis veya ham). */
export function messageAuthorId(m: Message): string | null {
  if (typeof m.userId === 'string') return m.userId;
  return (m.userId as MessageAuthor)?._id ?? null;
}

export function messageAuthorName(m: Message): string {
  if (typeof m.userId === 'string') return 'Anonim';
  return (m.userId as MessageAuthor)?.username ?? 'Anonim';
}

export function useMessagesViewModel(channelId: string) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState('');

  const messagesQuery = useQuery({
    queryKey: qk.messages(channelId),
    queryFn: () => messageService.listMessages(channelId, { page: 1, limit: 100 }),
    enabled: !!channelId,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: qk.messages(channelId) });
  }

  const sendMutation = useMutation({
    mutationFn: () => messageService.sendMessage(channelId, draft.trim()),
    onSuccess: () => {
      setDraft('');
      setError('');
      invalidate();
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const editMutation = useMutation({
    mutationFn: () =>
      messageService.editMessage(editingId as string, editingText.trim()),
    onSuccess: () => {
      setEditingId(null);
      setEditingText('');
      setError('');
      invalidate();
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => messageService.deleteMessage(messageId),
    onSuccess: () => invalidate(),
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  function send() {
    if (!draft.trim()) return;
    sendMutation.mutate();
  }

  function startEdit(m: Message) {
    setEditingId(m._id);
    setEditingText(m.text);
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText('');
  }

  function saveEdit() {
    if (!editingText.trim()) return;
    editMutation.mutate();
  }

  function isOwn(m: Message): boolean {
    return !!userId && messageAuthorId(m) === userId;
  }

  return {
    messages: messagesQuery.data ?? [],
    loading: messagesQuery.isLoading,
    refreshing: messagesQuery.isRefetching,
    loadError: messagesQuery.isError
      ? getApiErrorMessage(messagesQuery.error)
      : '',
    draft,
    editingId,
    editingText,
    error,
    sending: sendMutation.isPending,
    savingEdit: editMutation.isPending,
    setDraft,
    setEditingText,
    send,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteMessage: (id: string) => deleteMutation.mutate(id),
    isOwn,
    refetch: messagesQuery.refetch,
  };
}
