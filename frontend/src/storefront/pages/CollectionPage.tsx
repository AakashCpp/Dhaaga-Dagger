import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { UiSelect } from "../../components/UiSelect";
import type { StoreActions, StoreProduct } from "../types";
import { ProductTile } from "../components/ProductTile";

const subtypeOptions = {
  All: ["All styles", "Slim", "Regular", "Skinny", "Relaxed", "Classic Slub", "Waffle Knit", "Heavyweight Rib", "Short Sleeve"],
  Jeans: ["All styles", "Slim", "Regular", "Skinny", "Relaxed"],
  Henley: ["All styles", "Classic Slub", "Waffle Knit", "Heavyweight Rib", "Short Sleeve"],
};

const sizeOptions = {
  All: ["All sizes", "XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"],
  Jeans: ["All sizes", "28", "30", "32", "34", "36", "38"],
  Henley: ["All sizes", "XS", "S", "M", "L", "XL", "XXL"],
};

export function CollectionPage({ actions, initialCategory = "All" }: { actions: StoreActions; initialCategory?: "All" | StoreProduct["category"] }) {
  const [category, setCategory] = useState<"All" | StoreProduct["category"]>(initialCategory);
  const [subtype, setSubtype] = useState("All styles");
  const [size, setSize] = useState("All sizes");
  const [sort, setSort] = useState("Featured");
  const activeProducts = useMemo(() => actions.products.filter((item) => item.active !== false), [actions.products]);
  const items = useMemo(() => {
    let visible = activeProducts.filter((item) =>
      (category === "All" || item.category === category)
      && (subtype === "All styles" || item.subtype === subtype)
      && (size === "All sizes" || item.sizes.includes(size))
    );
    if (sort === "Price: low to high") visible = [...visible].sort((a, b) => a.price - b.price);
    if (sort === "Newest first") visible = [...visible].sort((a, b) => b.id - a.id);
    return visible;
  }, [activeProducts, category, size, sort, subtype]);
  const categoryOptions = useMemo(() => ([
    { value: "All", label: `All garments · ${activeProducts.length}` },
    { value: "Jeans", label: `Jeans · ${activeProducts.filter((item) => item.category === "Jeans").length}` },
    { value: "Henley", label: `Henleys · ${activeProducts.filter((item) => item.category === "Henley").length}` },
  ]), [activeProducts]);
  const chooseCategory = (value: string) => {
    setCategory(value as "All" | StoreProduct["category"]);
    setSubtype("All styles");
    setSize("All sizes");
  };
  const reset = () => {
    setCategory("All");
    setSubtype("All styles");
    setSize("All sizes");
    setSort("Featured");
  };

  return <main className="collection-page">
    <header className="collection-hero"><p className="eyebrow">The collection / {activeProducts.length} pieces</p><h1>Built as one<br /><em>daily uniform.</em></h1><p>Denim structure meets the tactile ease of the Henley.</p></header>
    <section className="filter-studio refined-filters garment-filters collection-all-filters" aria-label="Filter the collection">
      <label><span>Category</span><UiSelect value={category} options={categoryOptions} onChange={chooseCategory} ariaLabel="Filter products by category" /></label>
      <label><span>Style</span><UiSelect value={subtype} options={subtypeOptions[category]} onChange={setSubtype} ariaLabel="Filter by garment style" /></label>
      <label><span>{category === "Jeans" ? "Waist" : "Size"}</span><UiSelect value={size} options={sizeOptions[category]} onChange={setSize} ariaLabel="Filter by size" /></label>
      <label><span>Sort by</span><UiSelect value={sort} options={["Featured", "Price: low to high", "Newest first"]} onChange={setSort} ariaLabel="Sort products" /></label>
      <button className="reset-filter" onClick={reset}><RotateCcw size={14} /> Reset</button>
    </section>
    <div className="collection-meta"><span>{items.length} styles available</span><span>Jeans and Henleys / designed to work together</span></div>
    {items.length ? <section className="collection-grid">{items.map((item, index) => <ProductTile key={item.id} product={item} index={index} {...actions} />)}</section> : <section className="collection-empty"><p className="eyebrow">No exact match</p><h2>Try another style or size.</h2><button onClick={reset}>Reset filters</button></section>}
  </main>;
}
