import { useState } from "react";
import { ArrowRight, Check, Smartphone } from "lucide-react";
import { updateCheckoutField } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CheckoutShell } from "../components/CheckoutShell";
import type { StorePage } from "../types";

export function OtpPage({ go }: { go: (page: StorePage) => void }) {
  const [sent, setSent] = useState(false);
  const dispatch = useAppDispatch();
  const phone = useAppSelector((state) => state.checkout.phone);
  return <CheckoutShell step={0} title="Verify your mobile." copy="Your order updates and receipt will be sent to this number." go={go}>
    <div className="checkout-form-heading"><span><Smartphone /></span><div><b>{sent ? "Enter verification code" : "Mobile number"}</b><p>{sent ? `We sent a 4-digit code to ${phone}.` : "No account needed. We only use this for order updates."}</p></div></div>
    {!sent ? <><label className="checkout-label">Mobile number<div className="phone-field"><span>+91</span><input inputMode="numeric" value={phone.replace(/^\+91\s*/, "")} onChange={(event) => dispatch(updateCheckoutField({ field: "phone", value: `+91 ${event.target.value}` }))} aria-label="Mobile number" /></div></label><button className="primary full" onClick={() => setSent(true)}>Send secure code <ArrowRight /></button></> :
      <><div className="otp-fields">{[1, 2, 3, 4].map((field) => <input key={field} maxLength={1} inputMode="numeric" aria-label={`OTP digit ${field}`} />)}</div><button className="primary full" onClick={() => go("address")}>Verify and continue <Check /></button><button className="checkout-text-button" onClick={() => setSent(false)}>Change mobile number</button></>}
  </CheckoutShell>;
}
