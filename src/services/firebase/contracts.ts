import type { StoreProduct } from "../../storefront/types";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export interface AuthGateway {
  currentUser: () => AuthUser | null;
  signInWithGoogle: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
  subscribe: (listener: (user: AuthUser | null) => void) => () => void;
}

export interface ProductImageStorage {
  upload: (productId: number, file: File, position: number) => Promise<string>;
  remove: (url: string) => Promise<void>;
}

export interface RemoteCatalogGateway {
  list: () => Promise<StoreProduct[]>;
  upsert: (product: StoreProduct) => Promise<StoreProduct>;
  remove: (productId: number) => Promise<void>;
  subscribe: (listener: (products: StoreProduct[]) => void) => () => void;
}

export type CustomerProfileRecord = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
};

export type CustomerPurchaseRecord = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  total: number;
  productIds: number[];
};

export interface CustomerProfileGateway {
  getProfile: (uid: string) => Promise<CustomerProfileRecord | null>;
  updateProfile: (uid: string, profile: Partial<CustomerProfileRecord>) => Promise<void>;
  listPurchases: (uid: string) => Promise<CustomerPurchaseRecord[]>;
  subscribeProfile: (uid: string, listener: (profile: CustomerProfileRecord | null) => void) => () => void;
  subscribePurchases: (uid: string, listener: (purchases: CustomerPurchaseRecord[]) => void) => () => void;
}
