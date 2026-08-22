import type { AuthGateway } from "./contracts";
import { createFirebaseAuthGateway } from "./firebaseAuthGateway";

let authGateway: AuthGateway | null = null;

export function registerAuthGateway(gateway: AuthGateway) {
  authGateway = gateway;
}

export function getAuthGateway() {
  if (!authGateway) authGateway = createFirebaseAuthGateway();
  return authGateway;
}

export async function getCustomerIdToken() {
  return getAuthGateway()?.getIdToken() || null;
}
