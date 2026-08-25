import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { authFailed, authSucceeded, updateCustomerProfile } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAuthGateway } from "../../services/firebase/authRegistry";
import { backendApi } from "../../lib/api";
import type { StorePage } from "../../storefront/types";
import { Brand } from "../../storefront/components/Brand";
import { setOrderVerification } from "../orderVerificationSession";

function GoogleMark() {
  return <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.39 13.92A6 6 0 0 1 6.07 12c0-.67.11-1.32.32-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.53l3.35-2.61Z" />
    <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z" />
  </svg>;
}

export function AuthPage({ go, notify, continueTo = "profile" }: { go: (page: StorePage) => void; notify: (message: string) => void; continueTo?: StorePage }) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const needsOrderVerification = continueTo === "address" || continueTo === "review";
  const [step, setStep] = useState<"google" | "code">("google");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [devCode, setDevCode] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const requestedForUid = useRef<string | null>(null);

  const requestCode = async () => {
    setRequesting(true);
    setVerificationError("");
    try {
      const response = await backendApi.requestCustomerCode();
      setEmail(response.email);
      setDevCode(response.devCode || "");
      setStep("code");
      notify("Verification code sent to your email");
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : "Could not send verification code");
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    if (!needsOrderVerification || auth.status !== "authenticated" || !auth.user || requestedForUid.current === auth.user.uid) return;
    requestedForUid.current = auth.user.uid;
    void requestCode();
    // Request exactly once when a signed-in customer reaches the checkout gate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.status, auth.user?.uid, needsOrderVerification]);

  const signInWithGoogle = async () => {
    setRequesting(true);
    setVerificationError("");
    try {
      const gateway = getAuthGateway();
      if (!gateway) throw new Error("Firebase is not configured for this environment");
      const user = await gateway.signInWithGoogle();
      await backendApi.customerSession();
      dispatch(authSucceeded(user));
      dispatch(updateCustomerProfile({ uid: user.uid, name: user.displayName || "Dhaaga & Dagger member", email: user.email || "" }));
      if (needsOrderVerification) {
        setEmail(user.email || "your Google email");
        setStep("code");
        notify("Google sign-in complete. Sending your order code.");
      } else {
        notify("Signed in with Google");
        go(continueTo);
      }
    } catch (error) {
      dispatch(authFailed(error instanceof Error ? error.message : "Google sign-in failed"));
    } finally {
      setRequesting(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth.user) return dispatch(authFailed("Please sign in with Google again"));
    setRequesting(true);
    setVerificationError("");
    try {
      const response = await backendApi.verifyCustomerCode(code);
      setOrderVerification(response.data.token, response.data.expiresAt, auth.user.uid);
      dispatch(authSucceeded(auth.user));
      notify("Email verified. Your order can continue.");
      go(continueTo);
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setRequesting(false);
    }
  };

  return <main className="auth-page">
    <section className="auth-visual" aria-label="Dhaaga & Dagger member collection">
      <div className="auth-visual-topline"><span>Member edition</span><span>Est. 2026</span></div>
      <div className="auth-visual-label">
        <span>Denim / Henley</span>
        <strong>Your wardrobe,<br />remembered.</strong>
        <small>Save considered pieces, return to your perfect fit and follow every order from one private account.</small>
        <div className="auth-visual-proof"><span><Check /> Saved fits</span><span><Check /> Order history</span></div>
      </div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner google-auth-panel">
        <div className="auth-brand-lockup"><Brand /><span><ShieldCheck /> Member access<small>Private &amp; secure</small></span></div>
        {needsOrderVerification && <div className="auth-progress" aria-label={`Step ${step === "google" ? "1" : "2"} of 2`}>
          <span className="active"><i>{step === "code" ? <Check /> : "1"}</i><small>Google account</small></span>
          <b className={step === "code" ? "complete" : ""} />
          <span className={step === "code" ? "active" : ""}><i>2</i><small>Verify email</small></span>
        </div>}
        <div className="auth-heading">
          <p className="eyebrow">{step === "code" ? "One last secure step" : "Dhaaga & Dagger account"}</p>
          <h2>{step === "code" ? <>Enter your<br />access code.</> : <>Welcome<br />back.</>}</h2>
          <p>{step === "code" ? <>A six-digit code was sent to <strong>{email}</strong>. It expires shortly for your security.</> : needsOrderVerification ? "Sign in once to keep checkout secure and continue with your saved details." : "Keep saved pieces, purchases and delivery updates together in one considered space."}</p>
        </div>
        {(auth.error || verificationError) && <div className="auth-error" role="alert"><ShieldCheck /><span>{verificationError || auth.error}</span></div>}
        {step === "google" ? <button className="google-auth-button" onClick={signInWithGoogle} disabled={requesting} aria-busy={requesting}>
          <GoogleMark />
          {requesting ? "Connecting to Google…" : "Continue with Google"}
          <ArrowRight aria-hidden="true" />
        </button> : <form className="customer-otp-form" onSubmit={verifyCode}>
          <div className="otp-field-heading"><label htmlFor="customer-order-code"><Mail /> Verification code</label><span>{code.length}/6</span></div>
          <label className="customer-otp-input" htmlFor="customer-order-code">
            <input id="customer-order-code" aria-label="Six digit verification code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required autoFocus />
            {Array.from({ length: 6 }, (_, index) => <span key={index} className={code.length === index ? "current" : code[index] ? "filled" : ""}>{code[index] || ""}</span>)}
          </label>
          {devCode && <p className="customer-dev-code">Local development code <b>{devCode}</b></p>}
          <button className="google-auth-button customer-verify-button" disabled={requesting || code.length !== 6}>{requesting ? "Verifying…" : "Verify and continue"}<ArrowRight /></button>
          <div className="otp-resend"><span>Didn't receive it?</span><button type="button" disabled={requesting} onClick={() => void requestCode()}><RefreshCw /> Send a new code</button></div>
        </form>}
        <div className="auth-assurance"><LockKeyhole /><p><strong>Your account stays yours.</strong><span>Google verifies your identity. We never receive or store your Google password.</span></p></div>
        <div className="auth-footer-row"><button className="auth-back-store" type="button" onClick={() => go("home")}><ArrowLeft /> Return to collection</button><span>Protected member area</span></div>
      </div>
    </section>
  </main>;
}
