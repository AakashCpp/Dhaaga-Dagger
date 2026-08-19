import { ArrowRight, MapPin } from "lucide-react";
import { updateCheckoutField } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CheckoutShell, OrderSummary } from "../components/CheckoutShell";
import type { StoreLine, StorePage } from "../types";

export function AddressPage({ lines, go }: { lines: StoreLine[]; go: (page: StorePage) => void }) {
  const dispatch = useAppDispatch();
  const checkout = useAppSelector((state) => state.checkout);
  const update = (field: keyof typeof checkout) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => dispatch(updateCheckoutField({ field, value: event.target.value }));

  return <CheckoutShell step={1} title="Where should it arrive?" copy="Add a delivery address so we can estimate the route and arrival." go={go} aside={<OrderSummary lines={lines} />}>
    <div className="checkout-form-heading"><span><MapPin /></span><div><b>Delivery details</b><p>Fields marked required help us deliver without delays.</p></div></div>
    <div className="checkout-field-grid"><label className="checkout-label wide">Full name<input value={checkout.fullName} onChange={update("fullName")} /></label><label className="checkout-label">Phone<input value={checkout.phone} onChange={update("phone")} /></label><label className="checkout-label">PIN code<input value={checkout.pin} onChange={update("pin")} /></label><label className="checkout-label wide">Address<input value={checkout.address} onChange={update("address")} /></label><label className="checkout-label wide">Apartment, landmark or company<input value={checkout.landmark} onChange={update("landmark")} placeholder="Optional" /></label><label className="checkout-label">City<input value={checkout.city} onChange={update("city")} /></label><label className="checkout-label">State<select value={checkout.state} onChange={update("state")}><option>Delhi</option><option>Haryana</option><option>Uttar Pradesh</option></select></label></div>
    <label className="checkout-check"><input type="checkbox" defaultChecked /> Save this address for future orders</label>
    <button className="primary full" onClick={() => go("review")}>Review order <ArrowRight /></button>
  </CheckoutShell>;
}
