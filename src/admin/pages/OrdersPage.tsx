import { useMemo, useState } from "react";
import { ArrowUpRight, Download, Search, SlidersHorizontal } from "lucide-react";
import { money } from "../../storefront/data";
import { AdminHeader } from "../components/AdminHeader";
import { orderStatuses, orderTotal } from "../data";
import type { AdminOrder, AdminRoute } from "../types";

export function OrdersPage({ orders, go, selectOrder }: { orders: AdminOrder[]; go: AdminRoute; selectOrder: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const visible = useMemo(() => orders.filter((order) => (status === "All" || order.status === status) && `${order.id} ${order.customer.name} ${order.customer.phone}`.toLowerCase().includes(query.toLowerCase())), [orders, query, status]);
  return <><AdminHeader eyebrow="Fulfilment workspace" title="Orders"><button className="admin-secondary"><Download /> Export CSV</button></AdminHeader><section className="admin-toolbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, customer or phone" /></label><label><SlidersHorizontal /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{orderStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><span>{visible.length} orders</span></section><section className="admin-data-table"><div className="admin-table-row table-head"><span>Order</span><span>Customer</span><span>Placed</span><span>Payment</span><span>Total</span><span>Status</span><span /></div>{visible.map((order) => <button className="admin-table-row" onClick={() => { selectOrder(order.id); go("order-detail"); }} key={order.id}><span><b>#{order.id}</b><small>{order.items.length} items</small></span><span><b>{order.customer.name}</b><small>{order.customer.phone}</small></span><span>{order.createdAt}</span><span>{order.payment}</span><strong>{money(orderTotal(order))}</strong><em className={`status-${order.status.toLowerCase().replaceAll(" ", "-")}`}>{order.status}</em><ArrowUpRight /></button>)}</section></>;
}
