import { useState } from "react";
import { Plus, X } from "lucide-react";
import { UiSelect } from "../../components/UiSelect";

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
  const options = [{ value: "", label: "Select waist" }, ...availableSizes.map((size) => ({ value: size, label: `Waist ${size}${sizes.includes(size) ? " / added" : ""}`, disabled: sizes.includes(size) }))];
  return <div className="size-manager"><div><UiSelect value={selected} options={options} onChange={setSelected} ariaLabel="Choose a waist size" /><button type="button" disabled={!selected} onClick={add}><Plus /> Add size</button></div>{sizes.length ? <div className="size-chips">{sizes.map((size) => <span key={size}>W{size}<button type="button" aria-label={"Remove waist " + size} onClick={() => onChange(sizes.filter((item) => item !== size))}><X /></button></span>)}</div> : <p>Select at least one available size.</p>}</div>;
}
