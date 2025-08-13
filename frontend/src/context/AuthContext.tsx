import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "citizen" | "sector" | "admin" | null;

interface AuthContextValue {
  role: Role;
  setRole: (r: Exclude<Role, null>) => void;
  clearRole: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role>(null);

  useEffect(() => {
    const saved = localStorage.getItem("civic_role");
    if (saved === "citizen" || saved === "sector" || saved === "admin") {
      setRoleState(saved);
    }
  }, []);

  const setRole = (r: Exclude<Role, null>) => {
    setRoleState(r);
    localStorage.setItem("civic_role", r);
  };

  const clearRole = () => {
    setRoleState(null);
    localStorage.removeItem("civic_role");
  };

  const value = useMemo(() => ({ role, setRole, clearRole }), [role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
