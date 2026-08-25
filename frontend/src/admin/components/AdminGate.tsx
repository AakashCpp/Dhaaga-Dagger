import { ShieldCheck } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { backendApi } from "../../lib/api";
import { clearAdminToken, getAdminToken } from "../adminSession";

type AdminIdentity = { email: string; role: "admin" };

const AdminSessionContext = createContext<AdminIdentity | null>(null);

export function useAdminSession() {
  const session = useContext(AdminSessionContext);
  if (!session) throw new Error("useAdminSession must be used inside AdminGate");
  return session;
}

export function AdminGate({ children, onUnauthorized }: { children: ReactNode; onUnauthorized: () => void }) {
  const [session, setSession] = useState<AdminIdentity | null>(null);

  useEffect(() => {
    if (!getAdminToken()) {
      onUnauthorized();
      return;
    }
    backendApi.adminSession()
      .then((response) => setSession(response.data))
      .catch(() => {
        clearAdminToken();
        onUnauthorized();
      });
  }, [onUnauthorized]);

  if (!session) return <main className="admin-auth-check"><ShieldCheck /><span>Verifying secure admin session…</span></main>;
  return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>;
}
