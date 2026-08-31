import { useEffect, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Save, Trash2 } from "lucide-react";
import { UiSelect } from "../../components/UiSelect";
import type { StoreProduct } from "../../storefront/types";
import { AdminHeader } from "../components/AdminHeader";
import { ImageUploadManager } from "../components/ImageUploadManager";
import { SizeManager } from "../components/SizeManager";
import type { AdminRoute } from "../types";

function normalizedProduct(product: StoreProduct): StoreProduct {
  const gallery = (product.gallery || [product.image]).filter(Boolean);
  const ordered = product.image && gallery[0] !== product.image ? [product.image, ...gallery.filter((image) => image !== product.image)] : gallery;
  return { ...product, gallery: ordered.slice(0, 6), image: ordered[0] || "" };
}

const emptyProduct = (): StoreProduct => ({
  id: Date.now(),
  category: "Jeans",
  subtype: "Straight fit",
  name: "",
  fit: "Straight fit",
  price: 1299,
  color: "#274c77",
  image: "",
  gallery: [],
  sizes: [],
  sku: "DK-" + Date.now().toString().slice(-5),
  stock: 20,
  description: "",
  active: true,
});

export function ProductEditorPage({ product, go, saveProduct, deleteProduct }: { product: StoreProduct | null; go: AdminRoute; saveProduct: (product: StoreProduct) => Promise<void>; deleteProduct: (id: number) => Promise<void> }) {
  const [draft, setDraft] = useState<StoreProduct>(product ? normalizedProduct(product) : emptyProduct());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => setDraft(product ? normalizedProduct(product) : emptyProduct()), [product]);
  const images = (draft.gallery || []).filter(Boolean).slice(0, 6);
  const subtypeOptions = draft.category === "Jeans" ? ["Straight fit", "Wide leg", "Bootcut", "Baggy fit"] : ["Classic Slub", "Waffle Knit", "Heavyweight Rib", "Short Sleeve"];
  const updateImages = (gallery: string[]) => setDraft((current) => ({ ...current, gallery, image: gallery[0] || "" }));
  const valid = Boolean(draft.name.trim() && draft.price > 0 && draft.sizes.length && images.length);
  const save = async () => {
    if (!valid || saving) return;
    setSaving(true);
    setSaveError("");
    try {
      await saveProduct({ ...draft, gallery: images, image: images[0] });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Product could not be saved");
    } finally {
      setSaving(false);
    }
  };

  return <>
    <AdminHeader eyebrow={product ? "Editing " + product.sku : "New catalog entry"} title={product ? "Product details" : "Add product"}>
      <button className="admin-secondary" onClick={() => go("admin-products")}><ArrowLeft /> Products</button>
      <button className="admin-primary" disabled={!valid || saving} onClick={() => void save()}><Save /> {saving ? "Saving..." : "Save product"}</button>
    </AdminHeader>
    <div className="product-editor-layout">
      <section className="product-editor-form">
        <div className="editor-section-title"><span>01</span><div><h2>Core information</h2><p>What customers see across collection and detail pages.</p></div></div>
        <div className="editor-fields">
          <label className="wide">Product name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Raw Indigo Wide" /></label>
          <label>SKU<input value={draft.sku || ""} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} /></label>
          <label>Category<UiSelect value={draft.category} options={["Jeans", "Henley"]} onChange={(value) => { const category = value as StoreProduct["category"]; const subtype = category === "Jeans" ? "Straight fit" : "Classic Slub"; setDraft({ ...draft, category, subtype, fit: category === "Jeans" ? "Straight fit" : "Regular", sizes: [] }); }} ariaLabel="Select garment category" /></label>
          <label>{draft.category === "Jeans" ? "Jeans fit" : "Henley style"}<UiSelect value={draft.subtype} options={subtypeOptions} onChange={(subtype) => setDraft({ ...draft, subtype, fit: draft.category === "Jeans" ? subtype : draft.fit })} ariaLabel={`Select ${draft.category} style`} /></label>
          <label>Price (Rs.)<input type="number" min="0" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /></label>
          <label>Available stock<input type="number" min="0" value={draft.stock || 0} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} /></label>
          <label>{draft.category === "Jeans" ? "Wash color" : "Fabric color"}<input type="color" value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value })} /></label>
          <div className="editor-field-block wide"><span>Available sizes</span><SizeManager category={draft.category} sizes={draft.sizes} onChange={(sizes) => setDraft({ ...draft, sizes })} /></div>
          <label className="wide">Product description<textarea value={draft.description || ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Describe fabric, construction, fit and finish." /></label>
          <label className="editor-toggle wide"><input type="checkbox" checked={draft.active !== false} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /><i /><span><b>Visible on storefront</b><small>Turn off to hide this product without deleting it.</small></span></label>
        </div>
        <div className="editor-section-title media-title"><span>02</span><div><h2>Product imagery</h2><p>Upload one to six images. Choose any image as the storefront primary.</p></div></div>
        <ImageUploadManager images={images} onChange={updateImages} />
        {saveError && <p className="image-upload-error">{saveError}</p>}
      </section>
      <aside className="product-editor-preview">
        <p className="eyebrow">Storefront preview</p>
        <div className="preview-image">{draft.image ? <img src={draft.image} alt={draft.name} /> : <ImagePlus />}</div>
        <p>{draft.category} / {draft.subtype}</p>
        <h2>{draft.name || "Untitled product"}</h2>
        <b>Rs. {draft.price.toLocaleString("en-IN")}</b>
        <div className="preview-sizes">{draft.sizes.map((size) => <span key={size}>{size}</span>)}</div>
        <small><Check /> Saved changes update every customer-facing product surface.</small>
        {product && <button className="admin-danger-button" onClick={() => void deleteProduct(product.id)}><Trash2 /> Delete product</button>}
      </aside>
    </div>
  </>;
}
