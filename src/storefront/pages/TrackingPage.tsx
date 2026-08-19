import { Check, ChevronLeft } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import { money } from "../data";
import type { StorePage } from "../types";

const steps = ["Order placed", "Confirmed", "Shipped", "Out for delivery", "Delivered"];

export function TrackingPage({ go }: { go: (page: StorePage) => void }) {
  const { profile, purchases } = useAppSelector((state) => state.customer);
  const products = useAppSelector((state) => state.catalog);
  const order = purchases[0];
  const orderProducts = order?.productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) || [];
  const activeStep = order?.status === "Delivered" ? 4 : order?.status === "Shipped" ? 2 : 1;

  return <main className="tracking-page">
    <button className="back" onClick={() => go("profile")}><ChevronLeft /> Back to profile</button>
    <p className="eyebrow">Order ID: #{order?.id || "DK12345678"}</p>
    <h1>Track your order.</h1>
    <div className="timeline">{steps.map((step, index) => <div className={index <= activeStep ? "done" : ""} key={step}><span>{index <= activeStep ? <Check size={14} /> : index + 1}</span><b>{step}</b><small>{index <= activeStep ? order?.date : "Pending"}</small></div>)}</div>
    <div className="tracking-details">
      <section><h3>Delivery details</h3><p>Customer<br /><b>{profile.name}</b></p><p>Mobile<br /><b>{profile.phone}</b></p><p>Email<br /><b>{profile.email}</b></p></section>
      <section><h3>Order items</h3>{orderProducts.map((product) => product && <div className="mini-line" key={product.id}><img src={product.image} alt={product.name} loading="lazy" decoding="async" /><span><b>{product.name}</b><small>{product.fit} silhouette</small></span><b>{money(product.price)}</b></div>)}</section>
    </div>
  </main>;
}
