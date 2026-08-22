import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { backendApi } from "../../lib/api";
import { clearAdminToken, getAdminToken } from "../adminSession";

export function AdminGate({ children, onUnauthorized }: { children: ReactNode; onUnauthorized: () => void }) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      onUnauthorized();
      return;
    }
    backendApi.adminSession()
      .then(() => setAuthorized(true))
      .catch(() => {
        clearAdminToken();
        onUnauthorized();
      });
  }, [onUnauthorized]);

  if (!authorized) return <main className="admin-auth-check"><ShieldCheck /><span>Verifying secure admin session…</span></main>;
  return children;
}

