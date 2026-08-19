import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { money } from "../data";
import type { StoreActions, StorePage, StoreProduct } from "../types";

export function ProductDetailPage({ product, actions, go }: { product: StoreProduct; actions: StoreActions; go: (page: StorePage) => void }) {
  const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const gallery = product.gallery?.length ? product.gallery : [product.image, "/assets/denim-anatomy.jpg", "/assets/denim-construction-macros.jpg"];
  const shift = (direction: number) => setImageIndex((current) => (current + direction + gallery.length) % gallery.length);

  return <main className="product-detail-page redesigned-detail">
    <div className="detail-topbar"><button className="detail-back" onClick={() => go("products")}><ChevronLeft size={15} /> Collection</button><p>Collection / {product.fit} / <b>{product.name}</b></p></div>
    <section className="detail-layout-v2">
      <div className="detail-media-column">
        <div className="detail-thumbnails">{gallery.map((image, index) => <button className={imageIndex === index ? "active" : ""} onClick={() => setImageIndex(index)} key={image}><img src={image} alt={`${product.name}, thumbnail ${index + 1}`} loading="lazy" decoding="async" /><span>0{index + 1}</span></button>)}</div>
        <div className="detail-main-image">
          <AnimatePresence mode="wait"><motion.img key={gallery[imageIndex]} src={gallery[imageIndex]} alt={`${product.name}, view ${imageIndex + 1}`} decoding="async" initial={{ opacity: 0, scale: .99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} /></AnimatePresence>
          <button className="detail-image-arrow previous" aria-label="Previous image" onClick={() => shift(-1)}><ChevronLeft /></button><button className="detail-image-arrow next" aria-label="Next image" onClick={() => shift(1)}><ChevronRight /></button>
          <span className="detail-image-count">0{imageIndex + 1} / 0{gallery.length}</span>
        </div>
      </div>
      <aside className="detail-buy detail-buy-v2">
        <div className="detail-heading"><p className="eyebrow">{product.fit} architecture / DK-00{product.id}</p><h1>{product.name}</h1><div className="detail-price"><b>{money(product.price)}</b><span>Taxes included</span></div></div>
        <p className="detail-description">A movement-first {product.fit.toLowerCase()} silhouette cut from 13.5 oz ring-spun denim, with reinforced seams and hardware selected for everyday wear.</p>
        <div className="detail-color"><span>Selected wash</span><b><i style={{ background: product.color }} /> Core indigo</b></div>
        <div className="detail-sizes"><div><span>Select waist</span><button>Size guide</button></div><div>{product.sizes.map((value) => <button className={size === value ? "picked" : ""} onClick={() => setSize(value)} key={value}>{value}</button>)}</div></div>
        <div className="detail-actions"><button className="primary" onClick={() => actions.add(product, size)}>Add to bag <ShoppingBag size={15} /></button><button className={actions.liked.has(product.id) ? "liked" : ""} aria-label="Save product" onClick={() => actions.toggleLike(product.id)}><Heart fill={actions.liked.has(product.id) ? "currentColor" : "none"} /></button></div>
        <div className="detail-promises"><p><Truck /> Free tracked delivery <small>Dispatched within 24 hours</small></p><p><RotateCcw /> Easy exchange <small>30 days to find your fit</small></p><p><ShieldCheck /> Built responsibly <small>Construction checked by hand</small></p></div>
      </aside>
    </section>
    <section className="detail-specification"><div><p className="eyebrow">Construction notes</p><h2>Every detail earns its place.</h2></div><article><b>13.5 oz</b><span>Ring-spun denim</span><p>Dense enough to hold its shape, soft enough to move through the day.</p></article><article><b>11.5 EPI</b><span>Balanced weave</span><p>A controlled warp and weft ratio gives the surface its clean character.</p></article><article><b>3x</b><span>Stress reinforcement</span><p>Bar tacks and lock stitching secure the points that work hardest.</p></article></section>
  </main>;
}
