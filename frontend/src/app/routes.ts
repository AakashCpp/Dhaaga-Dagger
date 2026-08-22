import type { AdminPage } from "../admin/types";
import type { StorePage } from "../storefront/types";

export type AppPage = StorePage | AdminPage | "admin-login";

export const storefrontPages: StorePage[] = [
  "home",
  "products",
  "craft",
  "wishlist",
  "profile",
  "auth",
  "product-detail",
  "cart",
  "address",
  "review",
  "success",
  "tracking",
];

export const adminPages: AdminPage[] = [
  "admin",
  "orders",
  "order-detail",
  "admin-products",
  "admin-product-detail",
];

const adminPageHashes: Record<AdminPage, string> = {
  admin: "admin/dashboard",
  orders: "admin/orders",
  "order-detail": "admin/order",
  "admin-products": "admin/products",
  "admin-product-detail": "admin/product",
};

const adminHashPages = Object.fromEntries(Object.entries(adminPageHashes).map(([page, hash]) => [hash, page])) as Record<string, AdminPage>;

export function pageFromLocation(): AppPage {
  const hash = window.location.hash.slice(1) as AppPage;
  if (hash === "admin") return "admin-login";
  if (adminHashPages[hash]) return adminHashPages[hash];
  return storefrontPages.includes(hash as StorePage) ? hash : "home";
}

export function updatePageUrl(page: AppPage) {
  const adminHash = adminPageHashes[page as AdminPage];
  const hash = adminHash ? `#${adminHash}` : page === "admin-login" ? "#admin" : page === "home" ? "" : storefrontPages.includes(page as StorePage) ? `#${page}` : "";
  window.history.pushState(null, "", `${window.location.pathname}${hash}`);
}
