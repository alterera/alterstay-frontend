"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  fetchCurrentUser,
  loginWithPassword,
  logoutSession,
  refreshSession,
  requestOtp,
  restoreSession,
  verifyOtp,
} from "@/lib/auth-api";
import { consumePostLoginRedirect } from "@/lib/booking-url";
import { clearTokens, getRefreshToken } from "@/lib/auth-storage";
import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  setLoginOpen: (open: boolean) => void;
  requestPhoneOtp: (input: {
    phone: string;
    countryCode?: string;
  }) => Promise<{ debugOtp?: string }>;
  verifyPhoneOtp: (input: {
    phone: string;
    countryCode?: string;
    otp: string;
  }) => Promise<void>;
  loginPassword: (input: {
    phone: string;
    countryCode?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const bootstrap = useCallback(async () => {
    if (!getRefreshToken()) {
      setIsLoading(false);
      return;
    }

    try {
      const sessionUser = await restoreSession();
      setUser(sessionUser);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  /** Keep long-lived admin sessions alive by refreshing before the access token expires. */
  useEffect(() => {
    if (!user) return;

    const interval = window.setInterval(() => {
      void refreshSession()
        .then((session) => setUser(session.user))
        .catch(() => {
          clearTokens();
          setUser(null);
        });
    }, 13 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [user]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const requestPhoneOtp = useCallback<
    AuthContextValue["requestPhoneOtp"]
  >(async (input) => {
    const result = await requestOtp(input);
    return { debugOtp: result.debugOtp };
  }, []);

  const verifyPhoneOtp = useCallback<
    AuthContextValue["verifyPhoneOtp"]
  >(async (input) => {
    const result = await verifyOtp(input);
    setUser(result.user);
    setLoginOpen(false);
    const redirect = consumePostLoginRedirect();
    if (redirect) router.push(redirect);
  }, [router]);

  const loginPassword = useCallback<
    AuthContextValue["loginPassword"]
  >(async (input) => {
    const result = await loginWithPassword(input);
    setUser(result.user);
    setLoginOpen(false);
    const redirect = consumePostLoginRedirect();
    if (redirect) router.push(redirect);
  }, [router]);

  const logout = useCallback(async () => {
    await logoutSession();
    clearTokens();
    setUser(null);
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isLoginOpen,
      openLogin,
      closeLogin,
      setLoginOpen,
      requestPhoneOtp,
      verifyPhoneOtp,
      loginPassword,
      logout,
    }),
    [
      user,
      isLoading,
      isLoginOpen,
      openLogin,
      closeLogin,
      requestPhoneOtp,
      verifyPhoneOtp,
      loginPassword,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/** Load the current user profile (requires an active access token). */
export async function loadAuthUser() {
  return fetchCurrentUser();
}
