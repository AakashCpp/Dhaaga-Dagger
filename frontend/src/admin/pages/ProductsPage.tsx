import { useMemo, useState } from "react";
import { Edit3, Eye, PackagePlus, Search, Trash2 } from "lucide-react";
import { money } from "../../storefront/data";
import type { StoreProduct } from "../../storefront/types";
import { AdminHeader } from "../components/AdminHeader";
import type { AdminRoute } from "../types";

export function ProductsPage({ products, go, editProduct, deleteProduct }: { products: StoreProduct[]; go: AdminRoute; editProduct: (id: number | null) => void; deleteProduct: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => products.filter((product) => `${product.name} ${product.sku} ${product.category} ${product.subtype} ${product.fit}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  return <><AdminHeader eyebrow="Store inventory" title="Products"><button className="admin-primary" onClick={() => { editProduct(null); go("admin-product-detail"); }}><PackagePlus /> Add product</button></AdminHeader><section className="admin-toolbar product-toolbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, SKU, category or style" /></label><span>{visible.length} products / {products.reduce((sum, item) => sum + (item.stock || 0), 0)} units</span></section><section className="admin-product-grid">{visible.map((product) => <article key={product.id}><div className="admin-product-image"><img src={product.image} alt={product.name} /><span className={product.active === false ? "inactive" : ""}>{product.active === false ? "Hidden" : "Live"}</span></div><div className="admin-product-copy"><p>{product.sku || `DK-${product.id}`} / {product.category} / {product.subtype}</p><h2>{product.name}</h2><div><b>{money(product.price)}</b><span>{product.stock || 0} in stock</span></div></div><div className="admin-product-actions"><button title="View and edit" onClick={() => { editProduct(product.id); go("admin-product-detail"); }}><Eye /> Details</button><button title="Quick edit" onClick={() => { editProduct(product.id); go("admin-product-detail"); }}><Edit3 /></button><button className="danger" title="Delete product" onClick={() => deleteProduct(product.id)}><Trash2 /></button></div></article>)}</section></>;
}
