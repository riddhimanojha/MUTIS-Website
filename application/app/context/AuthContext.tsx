/**
 * MUTIS Admin Auth
 *
 * Simple session-based auth for committee members.
 * The password is checked client-side — suitable for a student society
 * where the main goal is preventing accidental edits, not hardened security.
 *
 * TO CHANGE THE PASSWORD: update COMMITTEE_PASSWORD below.
 * For a more secure setup, replace this with a proper backend auth system.
 */

import React, { createContext, useContext, useState, useEffect } from "react";

// ⚠️ REPLACE this with a real password before deploying
const COMMITTEE_PASSWORD = "mutis2024";

type AuthContextType = {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem("mutis_admin") === "true";
    } catch {
      return false;
    }
  });

  const login = (password: string): boolean => {
    if (password === COMMITTEE_PASSWORD) {
      setIsAdmin(true);
      try { sessionStorage.setItem("mutis_admin", "true"); } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    try { sessionStorage.removeItem("mutis_admin"); } catch {}
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
