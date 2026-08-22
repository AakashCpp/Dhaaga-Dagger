import { useState } from "react";
import { Plus, X } from "lucide-react";
import { UiSelect } from "../../components/UiSelect";

const sizeSets = {
  Jeans: ["26", "28", "30", "32", "34", "36", "38", "40", "42", "44"],
  Henley: ["XS", "S", "M", "L", "XL", "XXL"],
} as const;

export function SizeManager({ category, sizes, onChange }: { category: "Jeans" | "Henley"; sizes: string[]; onChange: (sizes: string[]) => void }) {
  const availableSizes: string[] = [...sizeSets[category]];
  const firstAvailable = availableSizes.find((size) => !sizes.includes(size)) || "";
  const [selected, setSelected] = useState(firstAvailable);
  const add = () => {
    if (!selected || !availableSizes.includes(selected) || sizes.includes(selected)) return;
    const next = [...sizes, selected].sort((a, b) => availableSizes.indexOf(a) - availableSizes.indexOf(b));
    onChange(next);
    setSelected(availableSizes.find((size) => !next.includes(size)) || "");
  };
  const options = [{ value: "", label: category === "Jeans" ? "Select waist" : "Select garment size" }, ...availableSizes.map((size) => ({ value: size, label: `${category === "Jeans" ? "Waist " : "Size "}${size}${sizes.includes(size) ? " / added" : ""}`, disabled: sizes.includes(size) }))];
  return <div className="size-manager"><div><UiSelect value={availableSizes.includes(selected) ? selected : firstAvailable} options={options} onChange={setSelected} ariaLabel={category === "Jeans" ? "Choose a waist size" : "Choose a Henley size"} /><button type="button" disabled={!selected || !availableSizes.includes(selected)} onClick={add}><Plus /> Add size</button></div>{sizes.length ? <div className="size-chips">{sizes.map((size) => <span key={size}>{category === "Jeans" ? `W${size}` : size}<button type="button" aria-label={`Remove size ${size}`} onClick={() => onChange(sizes.filter((item) => item !== size))}><X /></button></span>)}</div> : <p>Select at least one available size.</p>}</div>;
}
