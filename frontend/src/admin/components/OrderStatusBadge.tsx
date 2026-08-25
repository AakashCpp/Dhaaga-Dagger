import { Check, CircleDot, Clock3, PackageCheck, PackageOpen, Truck } from "lucide-react";
import type { AdminOrder, OrderStatus } from "../types";

const statusIcons: Record<OrderStatus, typeof CircleDot> = {
  Placed: Clock3,
  Confirmed: CircleDot,
  Packed: PackageOpen,
  Shipped: Truck,
  "Out for delivery": Truck,
  Delivered: PackageCheck,
};

export function statusClass(status: OrderStatus) {
  return `status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

export function OrderStatusBadge({ order, compact = false }: { order: AdminOrder; compact?: boolean }) {
  const Icon = order.status === "Delivered" ? Check : statusIcons[order.status];
  const updatedAt = order.history.at(-1)?.at || order.updatedAtTimestamp || order.createdAt;
  return <span className={`admin-status-badge ${statusClass(order.status)}${compact ? " compact" : ""}`} title={`Last updated ${updatedAt}`}>
    <Icon aria-hidden="true" />
    <span>{order.status}</span>
  </span>;
}
