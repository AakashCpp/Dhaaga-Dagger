import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { localCatalogRepository } from "../admin/catalog";
import type { AdminOrder, OrderStatus } from "../admin/types";
import type { StoreLine, StoreProduct } from "../storefront/types";

const CUSTOMER_KEY = "denimkart.customer.v1";
const CART_KEY = "denimkart.cart.v1";
const CHECKOUT_KEY = "denimkart.checkout.v1";

export type PurchaseRecord = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  total: number;
  productIds: number[];
};

export type CustomerState = {
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
  profile: { uid: "guest", name: "Guest member", email: "Sign in to sync", phone: "Not added", joinedAt: "—" },
  likedIds: [],
  purchases: [],
};

type AuthState = {
  status: "guest" | "loading" | "authenticated" | "error";
  user: { uid: string; email: string | null; displayName: string | null } | null;
  error: string | null;
};

const defaultAuth: AuthState = { status: "loading", user: null, error: null };

const defaultCheckout: CheckoutDraft = {
  phone: "",
  fullName: "",
  pin: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
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
    replaceCart: (_state, action: PayloadAction<StoreLine[]>) => action.payload,
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
    replaceCheckout: (_state, action: PayloadAction<CheckoutDraft>) => action.payload,
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
    replaceWishlist: (state, action: PayloadAction<number[]>) => {
      state.likedIds = action.payload;
    },
    resetCustomer: () => defaultCustomer,
  },
});

type OrdersState = { items: AdminOrder[]; latestOrderId: string | null };

function loadOrders(): OrdersState {
  return { items: [], latestOrderId: null };
}

const ordersSlice = createSlice({
  name: "orders",
  initialState: loadOrders(),
  reducers: {
    addOrder: (state, action: PayloadAction<AdminOrder>) => {
      if (state.items.some((order) => order.id === action.payload.id)) return;
      state.items.unshift(action.payload);
      state.latestOrderId = action.payload.id;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus; at: string }>) => {
      const order = state.items.find((item) => item.id === action.payload.id);
      if (!order || order.status === action.payload.status) return;
      order.status = action.payload.status;
      order.history.push({ status: action.payload.status, at: action.payload.at });
    },
    hydrateOrders: (state, action: PayloadAction<AdminOrder[]>) => {
      state.items = action.payload;
    },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: defaultAuth,
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
const pendingPersistence = { catalog: false, cart: false, checkout: false, customer: false };
store.subscribe(() => {
  const state = store.getState();
  const catalogChanged = state.catalog !== previousState.catalog;
  const cartChanged = state.cart !== previousState.cart;
  const checkoutChanged = state.checkout !== previousState.checkout;
  const customerChanged = state.customer !== previousState.customer;
  previousState = state;
  if (!catalogChanged && !cartChanged && !checkoutChanged && !customerChanged) return;
  pendingPersistence.catalog ||= catalogChanged;
  pendingPersistence.cart ||= cartChanged;
  pendingPersistence.checkout ||= checkoutChanged;
  pendingPersistence.customer ||= customerChanged;
  window.clearTimeout(persistenceTimer);
  persistenceTimer = window.setTimeout(() => {
    const pending = { ...pendingPersistence };
    pendingPersistence.catalog = false;
    pendingPersistence.cart = false;
    pendingPersistence.checkout = false;
    pendingPersistence.customer = false;
    if (pending.catalog) localCatalogRepository.save(store.getState().catalog);
    try {
      const latest = store.getState();
      if (pending.cart) window.localStorage.setItem(CART_KEY, JSON.stringify(latest.cart));
      if (pending.checkout) window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify(latest.checkout));
      if (pending.customer) window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(latest.customer));
    } catch {
      // Local cache is optional; authenticated API state remains authoritative.
    }
  }, 120);
});

export const { replaceCatalog } = catalogSlice.actions;
export const { addCartLine, updateCartLine, removeCartLine, clearCart, replaceCart } = cartSlice.actions;
export const { updateCheckoutField, replaceCheckout } = checkoutSlice.actions;
export const { toggleLikedProduct, hydrateCustomer, updateCustomerProfile, addPurchaseRecord, updatePurchaseStatus, replaceWishlist, resetCustomer } = customerSlice.actions;
export const { authStarted, authSucceeded, authFailed, signedOut } = authSlice.actions;
export const { addOrder, updateOrderStatus, hydrateOrders } = ordersSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
