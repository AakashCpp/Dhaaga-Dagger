import { Boxes, LayoutDashboard, LogOut, ShoppingBag } from "lucide-react";
import type { AdminPage, AdminRoute } from "../types";
import { clearAdminToken } from "../adminSession";
import { useAdminSession } from "./AdminGate";

const links = [
  { label: "Dashboard", target: "admin", icon: LayoutDashboard },
  { label: "Orders", target: "orders", icon: ShoppingBag },
  { label: "Products", target: "admin-products", icon: Boxes },
] as const;

function isActive(page: AdminPage, target: typeof links[number]["target"]) {
  if (target === "orders") return page === "orders" || page === "order-detail";
  if (target === "admin-products") return page === "admin-products" || page === "admin-product-detail";
  return page === "admin";
}

function identityFromEmail(email: string) {
  const words = email.split("@")[0]
    .replace(/[._+-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const name = words.length
    ? words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
    : "Administrator";
  const initials = words.length > 1
    ? `${words[0][0]}${words.at(-1)![0]}`.toUpperCase()
    : name.charAt(0).toUpperCase();
  return { name, initials };
}

export function AdminSidebar({ page, go }: { page: AdminPage; go: AdminRoute }) {
  const admin = useAdminSession();
  const identity = identityFromEmail(admin.email);
  return <aside className="admin-sidebar" aria-label="Admin navigation">
    <button className="admin-brand" onClick={() => go("admin")} aria-label="Open admin dashboard">DHAAGA <span>& DAGGER</span><small>OPERATIONS</small></button>
    <nav>
      {links.map(({ label, target, icon: Icon }) => <button className={isActive(page, target) ? "active" : ""} onClick={() => go(target)} aria-current={isActive(page, target) ? "page" : undefined} aria-label={label} title={label} key={target}><Icon /><span>{label}</span></button>)}
    </nav>
    <div className="admin-profile" title={admin.email}><i aria-hidden="true">{identity.initials}</i><span><b>{identity.name}</b><small>{admin.email}</small></span></div>
    <button className="admin-logout" onClick={() => { clearAdminToken(); go("home"); }} aria-label="Log out" title="Log out"><LogOut /><span>Log out</span></button>
  </aside>;
}
