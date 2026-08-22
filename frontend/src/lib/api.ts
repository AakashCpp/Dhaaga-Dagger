import type { AdminOrder, OrderStatus } from "../admin/types";
import { getAdminToken } from "../admin/adminSession";
import { getCustomerIdToken } from "../services/firebase/authRegistry";
import type { CheckoutDraft, CustomerState, PurchaseRecord } from "../store";
import type { StoreLine, StoreProduct } from "../storefront/types";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");
export const SOCKET_ORIGIN = (import.meta.env.VITE_SOCKET_URL || "http://localhost:5000").replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_ORIGIN}${path}`, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new Error(payload?.error?.message || `API request failed with ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function customerRequest<T>(path: string, options?: RequestInit) {
  const token = await getCustomerIdToken();
  if (!token) throw new Error("Please sign in with Google to continue");
  return request<T>(path, { ...options, headers: { Authorization: `Bearer ${token}`, ...options?.headers } });
}

function adminRequest<T>(path: string, options?: RequestInit) {
  const token = getAdminToken();
  return request<T>(path, { ...options, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options?.headers } });
}

export type AdminNotification = { _id: string; type: "order" | "product" | "system"; title: string; message: string; actor: string; orderId?: string; read: boolean; createdAt: string };
export type CustomerStateResponse = { profile: CustomerState["profile"]; likedIds: number[]; cart: StoreLine[]; checkout: CheckoutDraft; purchases: PurchaseRecord[]; orders: AdminOrder[] };
const cartPayload = (lines: StoreLine[]) => ({ items: lines.map((line) => ({ productId: line.id, size: line.size, quantity: line.quantity })) });

export const backendApi = {
  products: () => request<{ data: StoreProduct[] }>("/products"),
  customerSession: () => customerRequest<{ data: { firebaseUid: string; email: string; displayName: string } }>("/auth/customer/session"),
  customerState: () => customerRequest<{ data: CustomerStateResponse }>("/customers/me"),
  replaceCart: (lines: StoreLine[]) => customerRequest<{ data: CustomerStateResponse }>("/customers/me/cart", { method: "PUT", body: JSON.stringify(cartPayload(lines)) }),
  updateWishlist: (productId: number, liked: boolean) => customerRequest<{ data: { likedIds: number[] } }>("/customers/me/wishlist", { method: "PUT", body: JSON.stringify({ productId, liked }) }),
  updateCheckout: (checkout: CheckoutDraft) => customerRequest<{ data: { checkout: CheckoutDraft } }>("/customers/me/checkout", { method: "PUT", body: JSON.stringify(checkout) }),
  updateProfile: (profile: { displayName?: string; phone?: string }) => customerRequest<{ data: CustomerStateResponse }>("/customers/me/profile", { method: "PATCH", body: JSON.stringify(profile) }),
  customerOrders: () => customerRequest<{ data: AdminOrder[] }>("/orders/mine"),
  createOrder: (order: AdminOrder) => customerRequest<{ data: AdminOrder }>("/orders", { method: "POST", body: JSON.stringify({ id: order.id, customer: order.customer, address: order.address, city: order.city, pin: order.pin, state: order.state || "Not provided", landmark: order.landmark || "", payment: order.payment, items: order.items.map((item) => ({ productId: item.productId, size: item.size, quantity: item.quantity })) }) }),
  requestAdminCode: (email: string) => request<{ message: string; devCode?: string }>("/auth/admin/request-code", { method: "POST", body: JSON.stringify({ email }) }),
  verifyAdminCode: (email: string, code: string, remember: boolean) => request<{ data: { token: string; admin: { email: string; role: "admin" } } }>("/auth/admin/verify-code", { method: "POST", body: JSON.stringify({ email, code, remember }) }),
  adminSession: () => adminRequest<{ data: { email: string; role: "admin" } }>("/auth/admin/session"),
  adminProducts: () => adminRequest<{ data: StoreProduct[] }>("/admin/products"),
  createProduct: (product: StoreProduct) => adminRequest<{ data: StoreProduct }>("/admin/products", { method: "POST", body: JSON.stringify(product) }),
  updateProduct: (product: StoreProduct) => adminRequest<{ data: StoreProduct }>(`/admin/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) }),
  deleteProduct: (id: number) => adminRequest<void>(`/admin/products/${id}`, { method: "DELETE" }),
  updateOrderStatus: (id: string, status: OrderStatus) => adminRequest<{ data: AdminOrder }>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  orders: () => adminRequest<{ data: AdminOrder[] }>("/orders"),
  notifications: (limit = 20) => adminRequest<{ data: AdminNotification[] }>(`/notifications?limit=${limit}`),
  markNotificationRead: (id: string) => adminRequest<{ data: AdminNotification }>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => adminRequest<void>("/notifications/read-all", { method: "PATCH" }),
  uploadProductImage: async (file: File) => {
    const token = getAdminToken();
    const form = new FormData();
    form.append("image", file);
    const response = await fetch(`${API_ORIGIN}/uploads/product-image`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form });
    const payload = await response.json().catch(() => null) as { data?: { url: string }; error?: { message?: string } } | null;
    if (!response.ok || !payload?.data) throw new Error(payload?.error?.message || "Image upload failed");
    return payload.data.url;
  },
};

