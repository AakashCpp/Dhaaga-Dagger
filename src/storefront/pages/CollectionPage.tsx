import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { StoreActions } from "../types";
import { ProductTile } from "../components/ProductTile";

export function CollectionPage({ actions }: { actions: StoreActions }) {
  const [fit, setFit] = useState("All"); const [size, setSize] = useState("All sizes"); const [sort, setSort] = useState("Featured");
  let items = actions.products.filter((item) => item.active !== false && (fit === "All" || item.fit === fit) && (size === "All sizes" || item.sizes.includes(size)));
  if (sort === "Price: low to high") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "Newest first") items = [...items].reverse();

  return <main className="collection-page"><header className="collection-hero"><p className="eyebrow">The collection / 08 pieces</p><h1>Wear your<br /><em>point of view.</em></h1><p>Everyday denim, tuned by silhouette.</p></header><section className="filter-studio refined-filters"><div className="filter-fits"><span>Fit</span>{["All", "Slim", "Regular", "Skinny", "Relaxed"].map((name) => <label key={name}><input type="checkbox" checked={fit === name} onChange={() => setFit(name)} /><i />{name}</label>)}</div><label><span>Waist</span><select value={size} onChange={(event) => setSize(event.target.value)}><option>All sizes</option>{["28", "30", "32", "34", "36", "38"].map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Newest first</option></select></label><button className="reset-filter" onClick={() => { setFit("All"); setSize("All sizes"); setSort("Featured"); }}><RotateCcw size={14} /> Reset</button></section><div className="collection-meta"><span>{items.length} styles available</span><span>Double-click an image to save it</span></div><section className="collection-grid">{items.map((item, index) => <ProductTile key={item.id} product={item} index={index} {...actions} />)}</section></main>;
}
