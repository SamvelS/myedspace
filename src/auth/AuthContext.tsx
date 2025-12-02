import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextValue {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const STORAGE_KEY = "user-isLoggedIn";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialIsLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return false;
    return stored === "true";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialIsLoggedIn);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(isLoggedIn));
    } catch {
      // Fail silently; app still works, just not persisted
    }
  }, [isLoggedIn]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
