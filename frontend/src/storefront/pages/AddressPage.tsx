import { ArrowRight, MapPin } from "lucide-react";
import { updateCheckoutField } from "../../store";
import { UiSelect } from "../../components/UiSelect";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CheckoutShell, OrderSummary } from "../components/CheckoutShell";
import type { StoreLine, StorePage } from "../types";
import { backendApi } from "../../lib/api";
import { useState } from "react";

export function AddressPage({ lines, go }: { lines: StoreLine[]; go: (page: StorePage) => void }) {
  const dispatch = useAppDispatch();
  const checkout = useAppSelector((state) => state.checkout);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (field: keyof typeof checkout) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => dispatch(updateCheckoutField({ field, value: event.target.value }));

  return <CheckoutShell step={1} title="Where should it arrive?" copy="Add a delivery address so we can estimate the route and arrival." go={go} aside={<OrderSummary lines={lines} />}>
    <div className="checkout-form-heading"><span><MapPin /></span><div><b>Delivery details</b><p>Fields marked required help us deliver without delays.</p></div></div>
    <div className="checkout-field-grid"><label className="checkout-label wide">Full name<input value={checkout.fullName} onChange={update("fullName")} required /></label><label className="checkout-label">Phone<input value={checkout.phone} onChange={update("phone")} required /></label><label className="checkout-label">PIN code<input value={checkout.pin} onChange={update("pin")} required /></label><label className="checkout-label wide">Address<input value={checkout.address} onChange={update("address")} required /></label><label className="checkout-label wide">Apartment, landmark or company<input value={checkout.landmark} onChange={update("landmark")} placeholder="Optional" /></label><label className="checkout-label">City<input value={checkout.city} onChange={update("city")} required /></label><label className="checkout-label">State<UiSelect value={checkout.state} options={["Delhi", "Haryana", "Uttar Pradesh"]} onChange={(value) => dispatch(updateCheckoutField({ field: "state", value }))} ariaLabel="Select state" /></label></div>
    <label className="checkout-check"><input type="checkbox" defaultChecked /> Save this address for future orders</label>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="primary full" disabled={saving || !checkout.fullName.trim() || !checkout.phone.trim() || !checkout.pin.trim() || !checkout.address.trim() || !checkout.city.trim() || !checkout.state.trim()} onClick={async () => { setSaving(true); setError(""); try { await backendApi.updateCheckout(checkout); go("review"); } catch (reason) { setError(reason instanceof Error ? reason.message : "Delivery details could not be saved"); } finally { setSaving(false); } }}>{saving ? "Saving details…" : <>Review order <ArrowRight /></>}</button>
  </CheckoutShell>;
}
