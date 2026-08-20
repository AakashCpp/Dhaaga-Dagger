import type { AuthGateway } from "./contracts";

let authGateway: AuthGateway | null = null;

export function registerAuthGateway(gateway: AuthGateway) {
  authGateway = gateway;
}

export function getAuthGateway() {
  return authGateway;
}
