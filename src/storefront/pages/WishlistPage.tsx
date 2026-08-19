import { Heart } from "lucide-react";
import type { StoreActions, StorePage } from "../types";
import { ProductTile } from "../components/ProductTile";

export function WishlistPage({ go, actions }: { go: (page: StorePage) => void; actions: StoreActions }) {
  const items = actions.products.filter((item) => item.active !== false && actions.liked.has(item.id));
  return <main className="wishlist-page"><header><p className="eyebrow">Your edit</p><h1>Saved pieces.</h1><p>{items.length ? `${items.length} pairs waiting for another look.` : "Pieces you save will live here."}</p></header>{items.length ? <section className="collection-grid">{items.map((item, index) => <ProductTile key={item.id} product={item} index={index} {...actions} />)}</section> : <section className="wishlist-empty"><Heart size={28} /><h2>Nothing saved yet.</h2><p>Double-click any product image or tap its heart.</p><button className="primary" onClick={() => go("products")}>Explore collection</button></section>}</main>;
}
