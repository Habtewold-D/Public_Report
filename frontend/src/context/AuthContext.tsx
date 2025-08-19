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
  quota: {
    weekly_limit: number;
    used: number;
    remaining: number;
  } | null;
  isAuthLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<{ role: Exclude<Role, null> }>;
  register: (payload: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ role: Exclude<Role, null> }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [quota, setQuota] = useState<AuthContextValue["quota"]>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // Axios defaults for token-based API auth
  const API_BASE = "http://127.0.0.1:8000/api";
  axios.defaults.baseURL = API_BASE;

  const hydrateUser = async () => {
    try {
      const res = await axios.get("/user");
      if (res.data && res.data.user) {
        const u = res.data.user as NonNullable<AuthContextValue["user"]>;
        setUser(u);
        setRoleState(u.role);
        localStorage.setItem("civic_role", u.role);
      }
      if (res.data && res.data.quota) {
        setQuota(res.data.quota as NonNullable<AuthContextValue["quota"]>);
      }
    } catch (_) {
      // token invalid; clear
      localStorage.removeItem("civic_token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const savedRole = localStorage.getItem("civic_role");
    if (savedRole === "citizen" || savedRole === "sector" || savedRole === "admin") {
      setRoleState(savedRole);
    }
    const savedToken = localStorage.getItem("civic_token");
    if (savedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      // Hydrate current user using token
      void hydrateUser();
    }
  }, []);

  // Global 401 handler: if token is invalid/expired, redirect to Sign In
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (resp) => resp,
      (error) => {
        if (error?.response?.status === 401) {
          clearAuth();
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
            window.location.href = "/auth/signin";
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(id);
    };
  }, []);

  const persistRole = (r: Exclude<Role, null>) => {
    setRoleState(r);
    localStorage.setItem("civic_role", r);
  };

  const clearAuth = () => {
    setRoleState(null);
    setUser(null);
    setQuota(null);
    localStorage.removeItem("civic_role");
    localStorage.removeItem("civic_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const login: AuthContextValue["login"] = async ({ email, password }) => {
    setIsAuthLoading(true);
    try {
      const res = await axios.post("/login", { email, password });
      const u = res.data?.user as NonNullable<AuthContextValue["user"]>;
      const token = res.data?.token as string | undefined;
      if (u && token) {
        setUser(u);
        persistRole(u.role);
        localStorage.setItem("civic_token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // fetch quota
        await hydrateUser();
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
      const res = await axios.post("/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      const u = res.data?.user as NonNullable<AuthContextValue["user"]>;
      const token = res.data?.token as string | undefined;
      if (u && token) {
        setUser(u);
        persistRole(u.role);
        localStorage.setItem("civic_token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // fetch quota
        await hydrateUser();
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
      await axios.post("/logout");
    } finally {
      clearAuth();
      setIsAuthLoading(false);
    }
  };

  const refreshUser = async () => {
    await hydrateUser();
  };

  const value = useMemo(
    () => ({ role, user, quota, isAuthLoading, login, register, logout, refreshUser }),
    [role, user, quota, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
