import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

export type Role = "citizen" | "sector" | "admin" | null;

interface AuthContextValue {
  role: Role;
  user: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    role: Exclude<Role, null>;
  } | null;
  isAuthLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<{ role: Exclude<Role, null> }>;
  register: (payload: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ role: Exclude<Role, null> }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // Axios defaults for Sanctum session auth
  // Use localhost to match Vite dev server origin and avoid cross-site cookie issues
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true; // send/receive cookies
  axios.defaults.xsrfCookieName = "XSRF-TOKEN";
  axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
  axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

  useEffect(() => {
    const saved = localStorage.getItem("civic_role");
    if (saved === "citizen" || saved === "sector" || saved === "admin") {
      setRoleState(saved);
    }
    // Try to hydrate current user from session
    (async () => {
      try {
        const res = await axios.get("/user");
        if (res.data && res.data.user) {
          const u = res.data.user as NonNullable<AuthContextValue["user"]>;
          setUser(u);
          setRoleState(u.role);
          localStorage.setItem("civic_role", u.role);
        }
      } catch (_) {
        // ignore if not logged in
      }
    })();
  }, []);

  const persistRole = (r: Exclude<Role, null>) => {
    setRoleState(r);
    localStorage.setItem("civic_role", r);
  };

  const clearAuth = () => {
    setRoleState(null);
    setUser(null);
    localStorage.removeItem("civic_role");
  };

  const getCsrf = async () => {
    await axios.get("/sanctum/csrf-cookie");
  };

  const login: AuthContextValue["login"] = async ({ email, password }) => {
    setIsAuthLoading(true);
    try {
      await getCsrf();
      const res = await axios.post("/login", { email, password });
      const u = res.data?.user as NonNullable<AuthContextValue["user"]>;
      if (u) {
        setUser(u);
        persistRole(u.role);
        return { role: u.role };
      }
      throw new Error("Invalid login response");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register: AuthContextValue["register"] = async ({ firstName, lastName, email, password }) => {
    setIsAuthLoading(true);
    try {
      await getCsrf();
      const res = await axios.post("/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      const u = res.data?.user as NonNullable<AuthContextValue["user"]>;
      if (u) {
        setUser(u);
        persistRole(u.role);
        return { role: u.role };
      }
      throw new Error("Invalid register response");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout: AuthContextValue["logout"] = async () => {
    setIsAuthLoading(true);
    try {
      await getCsrf();
      await axios.post("/logout");
    } finally {
      clearAuth();
      setIsAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({ role, user, isAuthLoading, login, register, logout }),
    [role, user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
