/** Giris ekrani logic'i. */
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { getApiErrorMessage } from '../api/client';
import { DEV_CREDENTIALS } from '../config/env';

export function useLoginViewModel() {
  const { login } = useAuth();
  // DEV modunda demo hesabiyla on-dolu gelir; PROD'da bos.
  const [email, setEmail] = useState(DEV_CREDENTIALS.email);
  const [password, setPassword] = useState(DEV_CREDENTIALS.password);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  async function submit(): Promise<boolean> {
    if (!canSubmit) return false;
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      return true;
    } catch (e) {
      setError(getApiErrorMessage(e, 'Giris basarisiz.'));
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    password,
    error,
    submitting,
    canSubmit,
    setEmail,
    setPassword,
    submit,
  };
}
