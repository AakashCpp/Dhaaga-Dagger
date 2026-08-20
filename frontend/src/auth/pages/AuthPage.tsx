import { ShieldCheck } from "lucide-react";
import { authFailed, authStarted, authSucceeded, updateCustomerProfile } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAuthGateway } from "../../services/firebase/authRegistry";
import type { StorePage } from "../../storefront/types";

const previewGoogleUser = {
  uid: "google-preview-user",
  email: "rohan@gmail.com",
  displayName: "Rohan Kumar",
};

export function AuthPage({ go, notify }: { go: (page: StorePage) => void; notify: (message: string) => void }) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const signInWithGoogle = async () => {
    dispatch(authStarted());
    try {
      const gateway = getAuthGateway();
      const user = gateway ? await gateway.signInWithGoogle() : await new Promise<typeof previewGoogleUser>((resolve) => window.setTimeout(() => resolve(previewGoogleUser), 450));
      dispatch(authSucceeded(user));
      dispatch(updateCustomerProfile({ uid: user.uid, name: user.displayName || "Dhaaga & Dagger member", email: user.email || "" }));
      notify("Signed in with Google");
      go("profile");
    } catch (error) {
      dispatch(authFailed(error instanceof Error ? error.message : "Google sign-in failed"));
    }
  };

  return <main className="auth-page">
    <section className="auth-visual" aria-label="Dhaaga & Dagger relaxed denim">
      <div><p className="eyebrow">Your rotation, remembered</p><h1>Fits saved.<br /><em>Orders tracked.</em></h1><p>One secure account for your denim history, saved pieces and delivery updates.</p></div>
      <span>Dhaaga & Dagger / Member access</span>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner google-auth-panel">
        <p className="eyebrow">Member access</p>
        <h2>One tap.<br />Everything synced.</h2>
        <p>Use your Google account to keep saved fits, purchases and delivery updates together.</p>
        {auth.error && <p className="auth-error" role="alert">{auth.error}</p>}
        <button className="google-auth-button" onClick={signInWithGoogle} disabled={auth.status === "loading"}>
          <span aria-hidden="true">G</span>
          {auth.status === "loading" ? "Connecting to Google…" : "Sign in with Google"}
        </button>
        <div className="auth-trust"><ShieldCheck /><span>Secure account access<small>Firebase Google Auth adapter ready</small></span></div>
      </div>
    </section>
  </main>;
}
