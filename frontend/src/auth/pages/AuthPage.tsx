import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { authFailed, authSucceeded, updateCustomerProfile } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAuthGateway } from "../../services/firebase/authRegistry";
import { backendApi } from "../../lib/api";
import type { StorePage } from "../../storefront/types";
import { Brand } from "../../storefront/components/Brand";
import { setOrderVerification } from "../orderVerificationSession";

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
      <div className="auth-visual-label"><span>Denim / Henley</span><strong>One considered uniform.</strong><small>Designed to work together, remembered in one account.</small></div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner google-auth-panel">
        <div className="auth-brand-lockup"><Brand /><span>Member access<small>Secure account area</small></span></div>
        <p className="eyebrow">{step === "code" ? "Order email verification" : "Dhaaga & Dagger account"}</p>
        <h2>{step === "code" ? <>Check your<br />email.</> : <>Welcome<br />back.</>}</h2>
        <p>{step === "code" ? <>We sent a six-digit order code to <b>{email}</b>. Enter it below to continue.</> : continueTo === "address" || continueTo === "review" ? "Sign in with Google, then verify the code sent to that same email before continuing your order." : "Use your Google account to keep saved pieces, purchases and delivery updates together."}</p>
        {(auth.error || verificationError) && <p className="auth-error" role="alert">{verificationError || auth.error}</p>}
        {step === "google" ? <button className="google-auth-button" onClick={signInWithGoogle} disabled={auth.status === "loading" || requesting}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" aria-hidden="true" />
          {auth.status === "loading" ? "Connecting to Google…" : "Continue with Google"}
          <ArrowRight aria-hidden="true" />
        </button> : <form className="customer-otp-form" onSubmit={verifyCode}>
          <label htmlFor="customer-order-code"><Mail /> Code sent to {email}</label>
          <div className="customer-otp-input"><KeyRound /><input id="customer-order-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" required autoFocus /></div>
          {devCode && <p className="customer-dev-code">Local development code: <b>{devCode}</b></p>}
          <button className="google-auth-button customer-verify-button" disabled={requesting || code.length !== 6}>{requesting ? "Verifying…" : "Verify and continue"}<ArrowRight /></button>
          <button className="auth-back-store" type="button" disabled={requesting} onClick={() => void requestCode()}>Send a new code</button>
        </form>}
        <div className="auth-benefits"><span><Check /> Save Jeans and Henleys</span><span><Check /> Track every order</span><span><ShieldCheck /> Verified account access</span></div>
        <p className="auth-privacy">Google verifies your identity. Dhaaga & Dagger never receives or stores your Google password.</p>
        <button className="auth-back-store" type="button" onClick={() => go("home")}><ArrowLeft /> Return to the collection</button>
      </div>
    </section>
  </main>;
}
