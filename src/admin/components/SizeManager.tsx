import { useState } from "react";
import { Plus, X } from "lucide-react";

const availableSizes = ["26", "28", "30", "32", "34", "36", "38", "40", "42", "44"];

export function SizeManager({ sizes, onChange }: { sizes: string[]; onChange: (sizes: string[]) => void }) {
  const firstAvailable = availableSizes.find((size) => !sizes.includes(size)) || "";
  const [selected, setSelected] = useState(firstAvailable);
  const add = () => {
    if (!selected || sizes.includes(selected)) return;
    const next = [...sizes, selected].sort((a, b) => Number(a) - Number(b));
    onChange(next);
    setSelected(availableSizes.find((size) => !next.includes(size)) || "");
  };
  return <div className="size-manager"><div><select value={selected} onChange={(event) => setSelected(event.target.value)} aria-label="Choose a waist size"><option value="">Select waist</option>{availableSizes.map((size) => <option disabled={sizes.includes(size)} value={size} key={size}>Waist {size}{sizes.includes(size) ? " / added" : ""}</option>)}</select><button type="button" disabled={!selected} onClick={add}><Plus /> Add size</button></div>{sizes.length ? <div className="size-chips">{sizes.map((size) => <span key={size}>W{size}<button type="button" aria-label={"Remove waist " + size} onClick={() => onChange(sizes.filter((item) => item !== size))}><X /></button></span>)}</div> : <p>Select at least one available size.</p>}</div>;
}
