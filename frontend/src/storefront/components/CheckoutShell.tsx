import type { ReactNode } from "react";
import { Check, ChevronLeft, LockKeyhole } from "lucide-react";
import { money } from "../data";
import type { StoreLine, StorePage } from "../types";

const steps = ["Google account", "Address", "Review"];

export function CheckoutShell({ step, title, copy, children, aside, go }: { step: number; title: string; copy: string; children: ReactNode; aside?: ReactNode; go: (page: StorePage) => void }) {
  return <main className="checkout-flow">
    <div className="checkout-topbar"><button onClick={() => go(step <= 1 ? "cart" : "address")}><ChevronLeft /> Back</button><span><LockKeyhole /> Secure checkout</span></div>
    <div className="checkout-progress">{steps.map((label, index) => <div className={index < step ? "complete" : index === step ? "active" : ""} key={label}><i>{index < step ? <Check /> : index + 1}</i><span>{label}</span></div>)}</div>
    <header><p className="eyebrow">Step 0{step + 1} / 03</p><h1>{title}</h1><p>{copy}</p></header>
    <div className={aside ? "checkout-layout" : "checkout-layout single"}><section className="checkout-form-panel">{children}</section>{aside}</div>
  </main>;
}

export function OrderSummary({ lines }: { lines: StoreLine[] }) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const discount = subtotal > 3000 ? 200 : 0;
  return <aside className="checkout-summary"><p className="eyebrow">Your order</p><div className="checkout-summary-items">{lines.map((line) => <article key={`${line.id}-${line.size}`}><img src={line.image} alt={line.name} /><div><b>{line.name}</b><span>Size {line.size} / Qty {line.quantity}</span></div><strong>{money(line.price * line.quantity)}</strong></article>)}</div><div className="checkout-summary-totals"><p><span>Subtotal</span><b>{money(subtotal)}</b></p><p><span>Delivery</span><b>Free</b></p><p><span>Saving</span><b>-{money(discount)}</b></p><p><span>Total</span><b>{money(subtotal - discount)}</b></p></div><small><LockKeyhole /> Payment details are encrypted and secure.</small></aside>;
}
