import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Heart, Plus } from "lucide-react";
import { money } from "../data";
import type { StoreActions, StoreProduct } from "../types";

export function ProductTile({ product, index, liked, toggleLike, openProduct, add }: { product: StoreProduct; index: number } & StoreActions) {
  const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const shift = (direction: number) => setImageIndex((current) => (current + direction + gallery.length) % gallery.length);

  return <motion.article className="collection-card interactive-card" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * .06 }}>
    <div className="product-visual" onDoubleClick={() => toggleLike(product.id)} title="Double-click to save">
      <AnimatePresence mode="wait"><motion.img key={gallery[imageIndex]} src={gallery[imageIndex]} alt={`${product.name}, view ${imageIndex + 1}`} loading="lazy" decoding="async" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} /></AnimatePresence>
      <span>0{index + 1}</span>
      <button className={liked.has(product.id) ? "liked" : ""} aria-label={`${liked.has(product.id) ? "Remove" : "Save"} ${product.name}`} onClick={() => toggleLike(product.id)}><Heart size={17} fill={liked.has(product.id) ? "currentColor" : "none"} /></button>
      {gallery.length > 1 && <>
        <button className="card-gallery-arrow previous" aria-label="Previous product image" title="Previous image" onClick={(event) => { event.stopPropagation(); shift(-1); }}><ChevronLeft size={17} /></button>
        <button className="card-gallery-arrow next" aria-label="Next product image" title="Next image" onClick={(event) => { event.stopPropagation(); shift(1); }}><ChevronRight size={17} /></button>
        <div className="card-gallery-dots" aria-hidden="true">{gallery.map((item, dot) => <i className={dot === imageIndex ? "active" : ""} key={item} />)}</div>
      </>}
      <button className="view-product" aria-label={`View ${product.name}`} onClick={() => openProduct(product)}><Eye size={15} /> View</button>
      <div className="quick-size">{product.sizes.map((value) => <button onClick={() => setSize(value)} className={size === value ? "picked" : ""} key={value}>{value}</button>)}</div>
    </div>
    <button className="product-info product-link" onClick={() => openProduct(product)}><div><p>{product.category} / {product.subtype}</p><h2>{product.name}</h2></div><b>{money(product.price)}</b></button>
    <div className="product-bottom"><span><i style={{ background: product.color }} /> {product.category === "Jeans" ? "Core wash" : "Core colour"}</span><button onClick={() => add(product, size)}>Add to bag <Plus size={14} /></button></div>
  </motion.article>;
}
