import { ArrowRight, Check, PackageCheck } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import type { StorePage } from "../types";

export function CheckoutSuccessPage({ go }: { go: (page: StorePage) => void }) {
  const { items, latestOrderId } = useAppSelector((state) => state.orders);
  const order = items.find((item) => item.id === latestOrderId) || items[0];
  return <main className="checkout-success"><div className="success-orbit"><Check /></div><p className="eyebrow">Order {order?.id || "Pending"}</p><h1>Order placed successfully.</h1><p>Your pieces are now being prepared. We will send progress updates to your account.</p><div className="success-order-card"><PackageCheck /><div><span>Estimated arrival</span><b>3 - 5 working days</b></div><div><span>Payment</span><b>{order?.payment === "COD" ? "Cash on delivery" : order?.payment || "Pending"}</b></div></div><div className="success-actions"><button className="primary" onClick={() => go("tracking")}>Track order <ArrowRight /></button><button className="secondary" onClick={() => go("products")}>Continue shopping</button></div></main>;
}
