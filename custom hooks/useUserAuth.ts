"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  companyName?: string | null;
  avatarUrl?: string | null;
}

export function useUserAuth() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Check current session
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return true;
        } else {
          setError(data.error || "فشل تسجيل الدخول");
          return false;
        }
      } catch {
        setError("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Register
  const register = useCallback(
    async (formData: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      companyName?: string;
    }): Promise<boolean> => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return true;
        } else {
          setError(data.error || "فشل إنشاء الحساب");
          return false;
        }
      } catch {
        setError("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    router.refresh();
  }, [router]);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    setError,
    login,
    register,
    logout,
    refreshUser,
  };
}
