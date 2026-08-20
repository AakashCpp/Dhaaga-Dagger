import { motion } from "framer-motion";
import { ArrowDownRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { money } from "../data";
import type { StoreLine, StorePage } from "../types";

export function CartPage({ lines, update, remove, go }: { lines: StoreLine[]; update: (id: number, amount: number) => void; remove: (id: number) => void; go: (page: StorePage) => void }) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const discount = subtotal > 3000 ? 200 : 0;

  return <main className="cart-experience">
    <header><p className="eyebrow">Bag / {lines.length} selections</p><h1>Almost <em>yours.</em></h1></header>
    {!lines.length ? <section className="cart-empty-modern"><ShoppingBag /><h2>Your bag needs a pair.</h2><p>Start with the fit you will reach for most.</p><button className="primary" onClick={() => go("products")}>Explore jeans</button></section> :
      <div className="cart-modern-layout">
        <section className="cart-modern-lines">{lines.map((line, index) => <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .07 }} key={`${line.id}-${line.size}`}><img src={line.image} alt={line.name} /><div className="cart-product-copy"><span>{line.fit} silhouette</span><h2>{line.name}</h2><p>Waist {line.size} / Core wash</p><button onClick={() => remove(line.id)}><Trash2 size={13} /> Remove</button></div><div className="cart-line-end"><b>{money(line.price * line.quantity)}</b><div className="quantity"><button onClick={() => update(line.id, -1)}><Minus /></button><span>{line.quantity}</span><button onClick={() => update(line.id, 1)}><Plus /></button></div></div></motion.article>)}</section>
        <aside className="cart-checkout"><p className="eyebrow">Order overview</p><div className="cart-totals"><p><span>Subtotal</span><b>{money(subtotal)}</b></p><p><span>Delivery</span><b>Free</b></p><p><span>Member saving</span><b>-{money(discount)}</b></p><p><span>Total</span><b>{money(subtotal - discount)}</b></p></div><label>Delivery note<input placeholder="Optional note for your order" /></label><button className="primary full" onClick={() => go("otp")}>Secure checkout <ArrowDownRight size={15} /></button><div className="secure-note"><ShieldCheck /><span>Secure checkout<small>COD, UPI and cards accepted</small></span></div></aside>
      </div>}
  </main>;
}
