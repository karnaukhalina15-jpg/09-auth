"use client";

import { useEffect } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const verifyAuth = async () => {
      const sessionUser = await checkSession();
      if (sessionUser) {
        const fullUser = await getMe();
        if (fullUser) {
          setUser(fullUser);
        } else {
          setUser(sessionUser);
        }
      } else {
        clearIsAuthenticated();
      }
    };

    verifyAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
