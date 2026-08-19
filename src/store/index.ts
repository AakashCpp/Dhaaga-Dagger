import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { localCatalogRepository } from "../admin/catalog";
import { createInitialOrders } from "../admin/data";
import type { AdminOrder, OrderStatus } from "../admin/types";
import type { StoreLine, StoreProduct } from "../storefront/types";

const CUSTOMER_KEY = "denimkart.customer.v1";
const CART_KEY = "denimkart.cart.v1";
const AUTH_KEY = "denimkart.auth.v1";
const ORDERS_KEY = "denimkart.orders.v1";
const CHECKOUT_KEY = "denimkart.checkout.v1";

export type PurchaseRecord = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  total: number;
  productIds: number[];
};

type CustomerState = {
  profile: { uid: string; name: string; email: string; phone: string; joinedAt: string };
  likedIds: number[];
  purchases: PurchaseRecord[];
};

export type CheckoutDraft = {
  phone: string;
  fullName: string;
  pin: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  payment: "COD" | "UPI" | "Card";
};

const defaultCustomer: CustomerState = {
  profile: { uid: "local-preview-user", name: "Rohan Kumar", email: "rohan@denimkart.com", phone: "+91 98765 43210", joinedAt: "August 2026" },
  likedIds: [],
  purchases: [
    { id: "DK12345678", date: "18 Aug 2026", status: "Shipped", total: 2798, productIds: [1, 6] },
    { id: "DK12345591", date: "02 Aug 2026", status: "Delivered", total: 1599, productIds: [5] },
  ],
};

type AuthState = {
  status: "guest" | "loading" | "authenticated" | "error";
  user: { uid: string; email: string | null; displayName: string | null } | null;
  error: string | null;
};

const defaultAuth: AuthState = { status: "guest", user: null, error: null };

const defaultCheckout: CheckoutDraft = {
  phone: "+91 98765 43210",
  fullName: "Rohan Kumar",
  pin: "110001",
  address: "123, MG Road, Connaught Place",
  landmark: "",
  city: "New Delhi",
  state: "Delhi",
  payment: "COD",
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

const catalogSlice = createSlice({
  name: "catalog",
  initialState: localCatalogRepository.load(),
  reducers: {
    replaceCatalog: (_state, action: PayloadAction<StoreProduct[]>) => action.payload,
  },
});

const cartSlice = createSlice({
  name: "cart",
  initialState: readJson<StoreLine[]>(CART_KEY, []),
  reducers: {
    addCartLine: (state, action: PayloadAction<{ product: StoreProduct; size: string }>) => {
      const found = state.find((line) => line.id === action.payload.product.id && line.size === action.payload.size);
      if (found) found.quantity += 1;
      else state.push({ ...action.payload.product, size: action.payload.size, quantity: 1 });
    },
    updateCartLine: (state, action: PayloadAction<{ id: number; amount: number }>) => {
      const line = state.find((item) => item.id === action.payload.id);
      if (!line) return;
      line.quantity += action.payload.amount;
      if (line.quantity < 1) state.splice(state.indexOf(line), 1);
    },
    removeCartLine: (state, action: PayloadAction<number>) => state.filter((line) => line.id !== action.payload),
    clearCart: () => [],
  },
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: readJson<CheckoutDraft>(CHECKOUT_KEY, defaultCheckout),
  reducers: {
    updateCheckoutField: (state, action: PayloadAction<{ field: keyof CheckoutDraft; value: string }>) => {
      const { field, value } = action.payload;
      Object.assign(state, { [field]: value });
    },
  },
});

const customerSlice = createSlice({
  name: "customer",
  initialState: readJson<CustomerState>(CUSTOMER_KEY, defaultCustomer),
  reducers: {
    toggleLikedProduct: (state, action: PayloadAction<number>) => {
      const index = state.likedIds.indexOf(action.payload);
      if (index >= 0) state.likedIds.splice(index, 1);
      else state.likedIds.push(action.payload);
    },
    hydrateCustomer: (_state, action: PayloadAction<CustomerState>) => action.payload,
    updateCustomerProfile: (state, action: PayloadAction<Partial<CustomerState["profile"]>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    addPurchaseRecord: (state, action: PayloadAction<PurchaseRecord>) => {
      state.purchases.unshift(action.payload);
    },
    updatePurchaseStatus: (state, action: PayloadAction<{ id: string; status: PurchaseRecord["status"] }>) => {
      const order = state.purchases.find((purchase) => purchase.id === action.payload.id);
      if (order) order.status = action.payload.status;
    },
  },
});

type OrdersState = { items: AdminOrder[]; latestOrderId: string | null };

function loadOrders(): OrdersState {
  const seeded = createInitialOrders(localCatalogRepository.load());
  const saved = readJson<AdminOrder[] | OrdersState>(ORDERS_KEY, seeded);
  return Array.isArray(saved) ? { items: saved, latestOrderId: null } : saved;
}

const ordersSlice = createSlice({
  name: "orders",
  initialState: loadOrders(),
  reducers: {
    addOrder: (state, action: PayloadAction<AdminOrder>) => {
      state.items.unshift(action.payload);
      state.latestOrderId = action.payload.id;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus; at: string }>) => {
      const order = state.items.find((item) => item.id === action.payload.id);
      if (!order || order.status === action.payload.status) return;
      order.status = action.payload.status;
      order.history.push({ status: action.payload.status, at: action.payload.at });
    },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: readJson<AuthState>(AUTH_KEY, defaultAuth),
  reducers: {
    authStarted: (state) => {
      state.status = "loading";
      state.error = null;
    },
    authSucceeded: (state, action: PayloadAction<AuthState["user"]>) => {
      state.status = "authenticated";
      state.user = action.payload;
      state.error = null;
    },
    authFailed: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
    signedOut: () => defaultAuth,
  },
});

export const store = configureStore({
  reducer: {
    catalog: catalogSlice.reducer,
    cart: cartSlice.reducer,
    checkout: checkoutSlice.reducer,
    customer: customerSlice.reducer,
    auth: authSlice.reducer,
    orders: ordersSlice.reducer,
  },
});

let previousState = store.getState();
let persistenceTimer: number | undefined;
const pendingPersistence = { catalog: false, cart: false, checkout: false, customer: false, auth: false, orders: false };
store.subscribe(() => {
  const state = store.getState();
  const catalogChanged = state.catalog !== previousState.catalog;
  const cartChanged = state.cart !== previousState.cart;
  const checkoutChanged = state.checkout !== previousState.checkout;
  const customerChanged = state.customer !== previousState.customer;
  const authChanged = state.auth !== previousState.auth;
  const ordersChanged = state.orders !== previousState.orders;
  previousState = state;
  if (!catalogChanged && !cartChanged && !checkoutChanged && !customerChanged && !authChanged && !ordersChanged) return;
  pendingPersistence.catalog ||= catalogChanged;
  pendingPersistence.cart ||= cartChanged;
  pendingPersistence.checkout ||= checkoutChanged;
  pendingPersistence.customer ||= customerChanged;
  pendingPersistence.auth ||= authChanged;
  pendingPersistence.orders ||= ordersChanged;
  window.clearTimeout(persistenceTimer);
  persistenceTimer = window.setTimeout(() => {
    const pending = { ...pendingPersistence };
    pendingPersistence.catalog = false;
    pendingPersistence.cart = false;
    pendingPersistence.checkout = false;
    pendingPersistence.customer = false;
    pendingPersistence.auth = false;
    pendingPersistence.orders = false;
    if (pending.catalog) localCatalogRepository.save(store.getState().catalog);
    try {
      const latest = store.getState();
      if (pending.cart) window.localStorage.setItem(CART_KEY, JSON.stringify(latest.cart));
      if (pending.checkout) window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify(latest.checkout));
      if (pending.customer) window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(latest.customer));
      if (pending.auth) window.localStorage.setItem(AUTH_KEY, JSON.stringify(latest.auth));
      if (pending.orders) window.localStorage.setItem(ORDERS_KEY, JSON.stringify(latest.orders));
    } catch {
      // Firebase adapters will replace local persistence in production.
    }
  }, 120);
});

export const { replaceCatalog } = catalogSlice.actions;
export const { addCartLine, updateCartLine, removeCartLine, clearCart } = cartSlice.actions;
export const { updateCheckoutField } = checkoutSlice.actions;
export const { toggleLikedProduct, hydrateCustomer, updateCustomerProfile, addPurchaseRecord, updatePurchaseStatus } = customerSlice.actions;
export const { authStarted, authSucceeded, authFailed, signedOut } = authSlice.actions;
export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
