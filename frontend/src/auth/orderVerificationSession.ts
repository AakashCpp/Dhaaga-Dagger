const ORDER_VERIFICATION_KEY = "dhaaga-dagger.order-verification.v1";

type StoredVerification = { token: string; expiresAt: string; uid: string };

function readVerification(): StoredVerification | null {
  try {
    const value = window.sessionStorage.getItem(ORDER_VERIFICATION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as StoredVerification;
    if (!parsed.token || !parsed.uid || Date.parse(parsed.expiresAt) <= Date.now()) {
      clearOrderVerification();
      return null;
    }
    return parsed;
  } catch {
    clearOrderVerification();
    return null;
  }
}

export function getOrderVerificationToken() {
  return readVerification()?.token || null;
}

export function hasOrderVerification(uid?: string) {
  const verification = readVerification();
  return Boolean(verification && (!uid || verification.uid === uid));
}

export function setOrderVerification(token: string, expiresAt: string, uid: string) {
  window.sessionStorage.setItem(ORDER_VERIFICATION_KEY, JSON.stringify({ token, expiresAt, uid }));
}

export function clearOrderVerification() {
  window.sessionStorage.removeItem(ORDER_VERIFICATION_KEY);
}
