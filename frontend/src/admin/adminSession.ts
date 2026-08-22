const ADMIN_TOKEN_KEY = "dhaaga-dagger.admin-session.v1";

export function getAdminToken() {
  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string, remember: boolean) {
  clearAdminToken();
  (remember ? window.localStorage : window.sessionStorage).setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}
