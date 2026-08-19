import { ArrowUpRight, IndianRupee, PackageCheck, ShoppingBag, TriangleAlert } from "lucide-react";
import { money } from "../../storefront/data";
import { AdminHeader } from "../components/AdminHeader";
import { orderTotal } from "../data";
import type { AdminOrder, AdminRoute } from "../types";
import type { StoreProduct } from "../../storefront/types";

export function DashboardPage({ orders, products, go, selectOrder }: { orders: AdminOrder[]; products: StoreProduct[]; go: AdminRoute; selectOrder: (id: string) => void }) {
  const revenue = orders.reduce((total, order) => total + orderTotal(order), 0);
  const stats = [
    ["Total orders", orders.length.toString(), "+12.5%", ShoppingBag],
    ["Revenue", money(revenue), "+8.2%", IndianRupee],
    ["In fulfilment", orders.filter((order) => order.status !== "Delivered").length.toString(), "Live", PackageCheck],
    ["Low stock", products.filter((product) => (product.stock || 0) < 12).length.toString(), "Needs review", TriangleAlert],
  ] as const;
  return <><AdminHeader eyebrow="Live store overview" title="Dashboard"><button className="admin-primary" onClick={() => go("admin-products")}>Manage catalog <ArrowUpRight /></button></AdminHeader><section className="admin-stat-grid">{stats.map(([label, value, note, Icon]) => <article key={label}><div><span>{label}</span><Icon /></div><b>{value}</b><small>{note}</small></article>)}</section><div className="admin-dashboard-grid"><section className="revenue-panel"><div className="admin-panel-title"><div><p className="eyebrow">Last 7 days</p><h2>Order velocity</h2></div><b>{money(revenue)}</b></div><div className="admin-bars">{[42, 68, 51, 84, 61, 92, 74].map((height, index) => <i style={{ height: `${height}%` }} key={index}><span>{["M", "T", "W", "T", "F", "S", "S"][index]}</span></i>)}</div></section><section className="recent-orders-panel"><div className="admin-panel-title"><div><p className="eyebrow">Incoming</p><h2>Recent orders</h2></div><button onClick={() => go("orders")}>View all <ArrowUpRight /></button></div>{orders.slice(0, 5).map((order) => <button className="admin-order-snapshot" onClick={() => { selectOrder(order.id); go("order-detail"); }} key={order.id}><span><b>#{order.id}</b><small>{order.customer.name}</small></span><strong>{money(orderTotal(order))}</strong><em className={`status-${order.status.toLowerCase().replaceAll(" ", "-")}`}>{order.status}</em></button>)}</section></div></>;
}
