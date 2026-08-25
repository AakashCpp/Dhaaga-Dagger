import { useMemo, useState } from "react";
import { ArrowUpRight, Download, Search, SlidersHorizontal } from "lucide-react";
import { money } from "../../storefront/data";
import { UiSelect } from "../../components/UiSelect";
import { AdminHeader } from "../components/AdminHeader";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { orderStatuses, orderTotal } from "../data";
import type { AdminOrder, AdminRoute } from "../types";

export function OrdersPage({ orders, go, selectOrder }: { orders: AdminOrder[]; go: AdminRoute; selectOrder: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const visible = useMemo(() => orders.filter((order) => (status === "All" || order.status === status) && `${order.id} ${order.customer.name} ${order.customer.phone}`.toLowerCase().includes(query.toLowerCase())), [orders, query, status]);
  const exportOrders = () => {
    const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = visible.map((order) => [order.id, order.customer.name, order.customer.phone, order.customer.email, order.createdAt, order.payment, order.paymentStatus || "Pending", orderTotal(order), order.status].map(escape).join(","));
    const csv = [["Order", "Customer", "Phone", "Email", "Placed", "Payment", "Payment status", "Total", "Order status"].map(escape).join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `dhaaga-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return <><AdminHeader eyebrow="Fulfilment workspace" title="Orders"><button className="admin-secondary" onClick={exportOrders} disabled={!visible.length}><Download /> Export {visible.length ? `${visible.length} orders` : "CSV"}</button></AdminHeader><section className="admin-toolbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, customer or phone" /></label><label><SlidersHorizontal /><UiSelect value={status} options={["All", ...orderStatuses]} onChange={setStatus} ariaLabel="Filter orders by status" /></label><span><b>{visible.length}</b> of {orders.length} orders</span></section><section className="admin-data-table"><div className="admin-table-row table-head"><span>Order</span><span>Customer</span><span>Placed</span><span>Payment</span><span>Total</span><span>Status</span><span /></div>{visible.map((order) => <button className="admin-table-row" onClick={() => { selectOrder(order.id); go("order-detail"); }} key={order.id}><span><b>#{order.id}</b><small>{order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</small></span><span><b>{order.customer.name}</b><small>{order.customer.phone}</small></span><span>{order.createdAt}</span><span><b>{order.payment}</b><small>{order.paymentStatus || "Pending"}</small></span><strong>{money(orderTotal(order))}</strong><OrderStatusBadge order={order} /><ArrowUpRight /></button>)}{!visible.length && <div className="admin-orders-empty"><Search /><b>{orders.length ? "No matching orders" : "No orders yet"}</b><span>{orders.length ? "Try another customer, order number or status filter." : "Actual customer orders will appear here as soon as they are placed."}</span></div>}</section></>;
}
