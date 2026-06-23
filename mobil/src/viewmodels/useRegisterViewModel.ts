/** Kayit ekrani logic'i. */
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { getApiErrorMessage } from '../api/client';

export function useRegisterViewModel() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    !submitting;

  async function submit(): Promise<boolean> {
    if (!canSubmit) return false;
    setError('');
    setSuccess('');

    // Istemci tarafi on-dogrulama (backend kurallariyla ayni)
    if (password.length < 8) {
      setError('Sifre en az 8 karakter olmalidir.');
      return false;
    }

    setSubmitting(true);
    try {
      await register(email.trim(), password, username.trim());
      setSuccess('Kayit basarili! Giris yapabilirsiniz.');
      return true;
    } catch (e) {
      setError(getApiErrorMessage(e, 'Kayit basarisiz.'));
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    username,
    email,
    password,
    error,
    success,
    submitting,
    canSubmit,
    setUsername,
    setEmail,
    setPassword,
    submit,
  };
}
