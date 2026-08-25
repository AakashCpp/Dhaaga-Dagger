import { useMemo, useState } from "react";
import { ArrowUpRight, IndianRupee, PackageCheck, Radio, ShoppingBag, TriangleAlert, WifiOff } from "lucide-react";
import { money } from "../../storefront/data";
import { AdminHeader } from "../components/AdminHeader";
import { useAdminNotifications } from "../components/AdminNotifications";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import type { AdminOrder, AdminRoute, OrderStatus } from "../types";
import type { StoreProduct } from "../../storefront/types";

const statusOrder: OrderStatus[] = ["Placed", "Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

function dateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function DashboardPage({ orders, products, go, selectOrder }: { orders: AdminOrder[]; products: StoreProduct[]; go: AdminRoute; selectOrder: (id: string) => void }) {
  const { analytics, connected, loading, lastSyncedAt, syncError } = useAdminNotifications();
  const [chartMetric, setChartMetric] = useState<"sales" | "orders">("sales");
  const series = useMemo(() => {
    const values = new Map((analytics?.daily || []).map((day) => [day.date, day]));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = dateKey(date);
      const value = values.get(key);
      return { key, label: new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric" }).format(date), orders: value?.orders || 0, sales: value?.sales || 0 };
    });
  }, [analytics]);
  const values = series.map((day) => day[chartMetric]);
  const maximum = Math.max(...values, 1);
  const points = values.map((value, index) => ({ x: 36 + index * 94, y: 194 - (value / maximum) * 154, value }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `M ${points[0].x} 194 L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points.at(-1)!.x} 194 Z`;
  const summary = analytics?.summary || { totalOrders: orders.length, grossSales: orders.reduce((sum, order) => sum + (order.total || 0), 0), inFulfilment: orders.filter((order) => order.status !== "Delivered").length, averageOrderValue: 0 };
  const lowStock = products.filter((product) => (product.stock || 0) < 12).length;
  const soldOut = products.filter((product) => (product.stock || 0) === 0).length;
  const today = series.at(-1)!;
  const stats = [
    { label: "Total orders", value: summary.totalOrders.toLocaleString("en-IN"), note: `${today.orders} placed today`, Icon: ShoppingBag },
    { label: "Gross order value", value: money(summary.grossSales), note: `${money(summary.averageOrderValue || 0)} average order`, Icon: IndianRupee },
    { label: "In fulfilment", value: summary.inFulfilment.toLocaleString("en-IN"), note: `${(analytics?.statuses.Packed || 0) + (analytics?.statuses.Confirmed || 0)} ready to progress`, Icon: PackageCheck },
    { label: "Low stock", value: lowStock.toLocaleString("en-IN"), note: soldOut ? `${soldOut} sold out` : "No sold-out products", Icon: TriangleAlert },
  ];

  return <>
    <AdminHeader eyebrow="Live store overview" title="Dashboard"><button className="admin-primary" onClick={() => go("admin-products")}>Manage catalog <ArrowUpRight /></button></AdminHeader>
    <div className="admin-data-freshness"><span className={connected ? "live" : syncError ? "error" : "syncing"}>{connected ? <Radio /> : <WifiOff />}{connected ? "Live updates connected" : syncError ? "Store data unavailable" : loading ? "Loading store data" : "Polling every 30 seconds"}</span><small>{syncError || (lastSyncedAt ? `Last synced ${lastSyncedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Waiting for first sync")}</small></div>
    <section className="admin-stat-grid">{stats.map(({ label, value, note, Icon }) => <article key={label}><div><span>{label}</span><Icon /></div><b>{loading && !analytics ? "—" : value}</b><small>{loading && !analytics ? "Syncing actual store data…" : note}</small></article>)}</section>
    <div className="admin-dashboard-grid">
      <section className="revenue-panel admin-performance-panel">
        <div className="admin-panel-title"><div><p className="eyebrow">Database activity · 7 days</p><h2>{chartMetric === "sales" ? "Sales movement" : "Order volume"}</h2></div><div className="admin-chart-switch"><button className={chartMetric === "sales" ? "active" : ""} onClick={() => setChartMetric("sales")}>Sales</button><button className={chartMetric === "orders" ? "active" : ""} onClick={() => setChartMetric("orders")}>Orders</button></div></div>
        <div className="admin-chart-total"><b>{chartMetric === "sales" ? money(values.reduce((sum, value) => sum + value, 0)) : values.reduce((sum, value) => sum + value, 0).toLocaleString("en-IN")}</b><span>{chartMetric === "sales" ? "gross value in this period" : "orders in this period"}</span></div>
        <div className="admin-line-chart" role="img" aria-label={`Actual ${chartMetric} for the last seven days`}>
          <svg viewBox="0 0 636 220" preserveAspectRatio="none" aria-hidden="true">
            {[40, 91, 143, 194].map((y) => <line x1="36" x2="600" y1={y} y2={y} key={y} />)}
            <path className="chart-area" d={area} />
            <polyline className="chart-line" points={line} />
            {points.map((point, index) => <g key={series[index].key}><circle cx={point.x} cy={point.y} r="4" /><title>{series[index].label}: {chartMetric === "sales" ? money(point.value) : `${point.value} orders`}</title></g>)}
          </svg>
          <div className="admin-chart-labels">{series.map((day) => <span key={day.key}>{day.label}</span>)}</div>
          {!loading && values.every((value) => value === 0) && <p className="admin-chart-empty">No orders recorded in this seven-day window.</p>}
        </div>
        <div className="admin-status-mix">{statusOrder.map((status) => <span key={status}><i className={`status-dot status-${status.toLowerCase().replaceAll(" ", "-")}`} /><small>{status}</small><b>{analytics?.statuses[status] || 0}</b></span>)}</div>
      </section>
      <section className="recent-orders-panel"><div className="admin-panel-title"><div><p className="eyebrow">Latest from the database</p><h2>Recent orders</h2></div><button onClick={() => go("orders")}>View all <ArrowUpRight /></button></div>{orders.slice(0, 5).map((order) => <button className="admin-order-snapshot" onClick={() => { selectOrder(order.id); go("order-detail"); }} key={order.id}><span><b>#{order.id}</b><small>{order.customer.name} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</small></span><strong>{money(order.total ?? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - (order.discount || 0))}</strong><OrderStatusBadge order={order} compact /></button>)}{!loading && orders.length === 0 && <div className="admin-list-empty"><ShoppingBag /><b>No orders yet</b><span>New customer orders will appear here automatically.</span></div>}</section>
    </div>
  </>;
}
