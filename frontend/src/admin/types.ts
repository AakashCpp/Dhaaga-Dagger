import type { StoreProduct } from "../storefront/types";

export type AdminPage = "admin" | "orders" | "order-detail" | "admin-products" | "admin-product-detail";
export type OrderStatus = "Placed" | "Confirmed" | "Packed" | "Shipped" | "Out for delivery" | "Delivered";

export type AdminOrder = {
  id: string;
  customer: { name: string; phone: string; email: string };
  address: string;
  city: string;
  pin: string;
  state?: string;
  landmark?: string;
  createdAt: string;
  createdAtTimestamp?: string;
  updatedAtTimestamp?: string;
  status: OrderStatus;
  payment: "COD" | "UPI" | "Card";
  discount?: number;
  subtotal?: number;
  total?: number;
  paymentStatus?: "Pending" | "Paid" | "Failed" | "Refunded";
  items: Array<{ productId: number; name: string; image: string; size: string; quantity: number; price: number }>;
  history: Array<{ status: OrderStatus; at: string }>;
};

export type AdminRoute = (page: AdminPage | "home") => void;
export type CatalogSetter = (updater: StoreProduct[] | ((current: StoreProduct[]) => StoreProduct[])) => void;
