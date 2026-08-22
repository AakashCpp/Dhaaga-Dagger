import { ArrowRight, CreditCard, MapPin } from "lucide-react";
import { useState } from "react";
import { updateCheckoutField } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CheckoutShell, OrderSummary } from "../components/CheckoutShell";
import type { StoreLine, StorePage } from "../types";

export function OrderReviewPage({ lines, go, placeOrder }: { lines: StoreLine[]; go: (page: StorePage) => void; placeOrder: () => Promise<string | null> }) {
  const dispatch = useAppDispatch();
  const checkout = useAppSelector((state) => state.checkout);
  const [placing, setPlacing] = useState(false);
  return <CheckoutShell step={2} title="One last look." copy="Confirm your pieces, delivery details and payment preference." go={go} aside={<OrderSummary lines={lines} />}>
    <div className="review-block"><div className="review-block-title"><MapPin /><div><b>Delivery address</b><span>{checkout.fullName} / {checkout.phone}</span></div><button onClick={() => go("address")}>Change</button></div><p>{[checkout.address, checkout.landmark, checkout.city, checkout.state, checkout.pin].filter(Boolean).join(", ")}</p></div>
    <div className="review-block"><div className="review-block-title"><CreditCard /><div><b>Payment</b><span>Choose how you would like to pay</span></div></div><label className="payment-option"><input type="radio" name="payment" checked={checkout.payment === "COD"} onChange={() => dispatch(updateCheckoutField({ field: "payment", value: "COD" }))} /><span><b>Cash on delivery</b><small>Pay when your order arrives</small></span></label><label className="payment-option"><input type="radio" name="payment" checked={checkout.payment === "UPI"} onChange={() => dispatch(updateCheckoutField({ field: "payment", value: "UPI" }))} /><span><b>UPI or card</b><small>Complete payment securely after placing</small></span></label></div>
    <button className="primary full" disabled={placing} onClick={async () => { setPlacing(true); const orderId = await placeOrder(); setPlacing(false); if (orderId) go("success"); }}>{placing ? "Securing order…" : <>Place order <ArrowRight /></>}</button>
  </CheckoutShell>;
}
