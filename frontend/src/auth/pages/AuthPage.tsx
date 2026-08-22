import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { authFailed, authStarted, authSucceeded, updateCustomerProfile } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAuthGateway } from "../../services/firebase/authRegistry";
import { backendApi } from "../../lib/api";
import type { StorePage } from "../../storefront/types";
import { Brand } from "../../storefront/components/Brand";

export function AuthPage({ go, notify, continueTo = "profile" }: { go: (page: StorePage) => void; notify: (message: string) => void; continueTo?: StorePage }) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const signInWithGoogle = async () => {
    dispatch(authStarted());
    try {
      const gateway = getAuthGateway();
      if (!gateway) throw new Error("Firebase is not configured for this environment");
      const user = await gateway.signInWithGoogle();
      await backendApi.customerSession();
      dispatch(authSucceeded(user));
      dispatch(updateCustomerProfile({ uid: user.uid, name: user.displayName || "Dhaaga & Dagger member", email: user.email || "" }));
      notify("Signed in with Google");
      go(continueTo);
    } catch (error) {
      dispatch(authFailed(error instanceof Error ? error.message : "Google sign-in failed"));
    }
  };

  return <main className="auth-page">
    <section className="auth-visual" aria-label="Dhaaga & Dagger member collection">
      <div className="auth-visual-label"><span>Denim / Henley</span><strong>One considered uniform.</strong><small>Designed to work together, remembered in one account.</small></div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner google-auth-panel">
        <div className="auth-brand-lockup"><Brand /><span>Member access<small>Secure account area</small></span></div>
        <p className="eyebrow">Dhaaga & Dagger account</p>
        <h2>Welcome<br />back.</h2>
        <p>{continueTo === "address" ? "Sign in with Google to secure your order and continue to delivery details." : "Use your Google account to keep saved pieces, purchases and delivery updates together."}</p>
        {auth.error && <p className="auth-error" role="alert">{auth.error}</p>}
        <button className="google-auth-button" onClick={signInWithGoogle} disabled={auth.status === "loading"}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" aria-hidden="true" />
          {auth.status === "loading" ? "Connecting to Google…" : "Continue with Google"}
          <ArrowRight aria-hidden="true" />
        </button>
        <div className="auth-benefits"><span><Check /> Save Jeans and Henleys</span><span><Check /> Track every order</span><span><ShieldCheck /> Verified account access</span></div>
        <p className="auth-privacy">Google verifies your identity. Dhaaga & Dagger never receives or stores your Google password.</p>
        <button className="auth-back-store" type="button" onClick={() => go("home")}><ArrowLeft /> Return to the collection</button>
      </div>
    </section>
  </main>;
}
