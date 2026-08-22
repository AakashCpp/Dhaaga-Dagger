import { Boxes, LayoutDashboard, LogOut, ShoppingBag } from "lucide-react";
import type { AdminPage, AdminRoute } from "../types";
import { clearAdminToken } from "../adminSession";

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

export function AdminSidebar({ page, go }: { page: AdminPage; go: AdminRoute }) {
  return <aside className="admin-sidebar" aria-label="Admin navigation">
    <button className="admin-brand" onClick={() => go("admin")} aria-label="Open admin dashboard">DHAAGA <span>& DAGGER</span><small>OPERATIONS</small></button>
    <nav>
      {links.map(({ label, target, icon: Icon }) => <button className={isActive(page, target) ? "active" : ""} onClick={() => go(target)} aria-current={isActive(page, target) ? "page" : undefined} aria-label={label} title={label} key={target}><Icon /><span>{label}</span></button>)}
    </nav>
    <div className="admin-profile"><i>AK</i><span><b>Arjun Kapoor</b><small>Store administrator</small></span></div>
    <button className="admin-logout" onClick={() => { clearAdminToken(); go("home"); }} aria-label="Log out" title="Log out"><LogOut /><span>Log out</span></button>
  </aside>;
}
