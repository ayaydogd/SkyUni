/**
 * Oturum durumu (logic) — uygulama genelinde tek kaynak.
 * View'ler bu context uzerinden kullanici/oturum bilgisine ve
 * giris/kayit/cikis aksiyonlarina erisir.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authService } from '../services/authService';
import {
  loadToken,
  clearToken,
  setUnauthorizedHandler,
} from '../api/tokenStore';
import { decodeToken, isTokenExpired } from '../api/jwt';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  userId: string | null;
  email: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  /** Hesap silindiginde oturumu yerel olarak kapatir. */
  endSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    userId: null,
    email: null,
  });

  const applyToken = useCallback((token: string) => {
    const payload = decodeToken(token);
    if (payload?.id) {
      setState({
        status: 'authenticated',
        userId: payload.id,
        email: payload.email ?? null,
      });
    }
  }, []);

  const endSession = useCallback(async () => {
    await clearToken();
    setState({ status: 'unauthenticated', userId: null, email: null });
  }, []);

  // Acilista kalici token'i yukle + 401 yakalayicisini bagla
  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await loadToken();
      if (!mounted) return;
      if (token && !isTokenExpired(token)) {
        applyToken(token);
      } else {
        await clearToken();
        setState({ status: 'unauthenticated', userId: null, email: null });
      }
    })();

    setUnauthorizedHandler(() => {
      // 401: API cagrisi yapmadan yerel oturumu dusur
      clearToken();
      setState({ status: 'unauthenticated', userId: null, email: null });
    });

    return () => {
      mounted = false;
      setUnauthorizedHandler(null);
    };
  }, [applyToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authService.login({ email, password });
      applyToken(res.token);
    },
    [applyToken]
  );

  const register = useCallback(
    async (email: string, password: string, username: string) => {
      await authService.register({ email, password, username });
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setState({ status: 'unauthenticated', userId: null, email: null });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout, endSession }),
    [state, login, register, logout, endSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider icinde kullanilmali.');
  return ctx;
}
