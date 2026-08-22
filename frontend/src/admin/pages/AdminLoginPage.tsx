import { useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole, Mail } from "lucide-react";
import { Brand } from "../../storefront/components/Brand";
import type { AppPage } from "../../app/routes";
import { backendApi } from "../../lib/api";
import { setAdminToken } from "../adminSession";

export function AdminLoginPage({ go }: { go: (page: AppPage) => void }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (step === "email") {
        const response = await backendApi.requestAdminCode(email);
        setDevCode(response.devCode || "");
        setStep("code");
      } else {
        const response = await backendApi.verifyAdminCode(email, code, remember);
        setAdminToken(response.data.token, remember);
        go("admin");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to verify admin access");
    } finally {
      setLoading(false);
    }
  };

  return <main className="admin-login auth-admin-login"><div className="login-photo" /><form onSubmit={submit}><Brand /><p className="eyebrow">Restricted operations</p><h1>{step === "email" ? "Admin access." : "Check your email."}</h1><p>{step === "email" ? "Enter the authorized operations email. We will send a single-use access code." : <>A six-digit code was sent to <b>{email}</b>.</>}</p>{error && <p className="admin-login-error" role="alert">{error}</p>}{step === "email" ? <label>Authorized email<div className="admin-auth-input"><Mail /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="admin@company.com" required autoFocus /></div></label> : <><label>Verification code<div className="admin-auth-input"><KeyRound /><input className="admin-code-input" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} autoComplete="one-time-code" placeholder="000000" required autoFocus /></div></label>{devCode && <p className="admin-dev-code">Local development code: <b>{devCode}</b></p>}<button className="admin-back-link" type="button" onClick={() => { setStep("email"); setCode(""); setDevCode(""); }}><ArrowLeft /> Use another email</button></>}<label className="checkbox"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Keep this device signed in</label><button className="primary full" disabled={loading || (step === "code" && code.length !== 6)}>{loading ? "Verifying…" : step === "email" ? <>Send access code <ArrowRight /></> : <>Verify and continue <ArrowRight /></>}</button><small><LockKeyhole /> Codes expire quickly and every API request validates your admin session.</small></form></main>;
}
