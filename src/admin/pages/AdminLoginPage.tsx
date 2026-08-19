import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Brand } from "../../storefront/components/Brand";
import type { AppPage } from "../../app/routes";

export function AdminLoginPage({ go }: { go: (page: AppPage) => void }) {
  const [loading, setLoading] = useState(false);
  return <main className="admin-login auth-admin-login"><div className="login-photo" /><form onSubmit={(event) => { event.preventDefault(); setLoading(true); window.setTimeout(() => go("admin"), 350); }}><Brand /><p className="eyebrow">Restricted operations</p><h1>Admin access.</h1><p>Sign in with an authorized operations account.</p><label>Admin ID<input type="text" defaultValue="admin@dhaagaanddagger.com" autoComplete="username" required /></label><label>Password<input type="password" defaultValue="password" autoComplete="current-password" required /></label><label className="checkbox"><input type="checkbox" /> Keep this device signed in</label><button className="primary full" disabled={loading}>{loading ? "Checking access…" : <>Continue <ArrowRight /></>}</button><small><LockKeyhole /> Firebase custom claims will enforce this route in production.</small></form></main>;
}
