import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AdminRoute } from "../types";

type AdminNavigationValue = {
  go: AdminRoute;
  openOrder: (id: string) => void;
  openProduct: (id: number) => void;
};

const AdminNavigationContext = createContext<AdminNavigationValue | null>(null);

export function AdminNavigationProvider({ value, children }: { value: AdminNavigationValue; children: ReactNode }) {
  return <AdminNavigationContext.Provider value={value}>{children}</AdminNavigationContext.Provider>;
}

export function useAdminNavigation() {
  const value = useContext(AdminNavigationContext);
  if (!value) throw new Error("useAdminNavigation must be used inside AdminNavigationProvider");
  return value;
}
